import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { randomInt } from "node:crypto";

dotenv.config();

const app = express();

// Set FRONTEND_URL or CORS_ORIGINS in Railway to the exact Vercel origin(s).
// Local development origins are allowed only outside production.
const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.APP_URL,
  ...(process.env.CORS_ORIGINS || "").split(","),
]
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);
const developmentOrigins = process.env.NODE_ENV === "production"
  ? []
  : [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ];
const allowedOrigins = new Set([...configuredOrigins, ...developmentOrigins]);

app.use(
  cors({
    origin(origin, callback) {
      // Requests from curl/health checks may not send an Origin header.
      if (!origin || allowedOrigins.has(origin.replace(/\/+$/, ""))) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "100kb" }));

// Railway's MySQL plugin exposes MYSQLHOST / MYSQLPORT / MYSQLUSER /
// MYSQLPASSWORD / MYSQLDATABASE. The DB_* names remain supported for local use.
// DATABASE_URL (or MYSQL_URL) can also be set to a mysql:// connection URI.
function getDatabaseConfig() {
  const connectionUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (connectionUrl) {
    const parsed = new URL(connectionUrl);
    if (parsed.protocol !== "mysql:" && parsed.protocol !== "mysql2:") {
      throw new Error("DATABASE_URL must use the mysql:// scheme");
    }
    const database = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
    return {
      host: parsed.hostname,
      port: Number(parsed.port || 3306),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database,
    };
  }

  return {
    host: process.env.DB_HOST || process.env.MYSQLHOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD ?? process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || "MOVIE_BOOKING_SYSTEM",
  };
}

const dbConfig = getDatabaseConfig();
if (!dbConfig.user || dbConfig.password === undefined || !dbConfig.database) {
  console.warn(
    "MySQL configuration is incomplete. Set DB_USER/DB_PASSWORD/DB_NAME, " +
      "the corresponding MYSQL* variables, or DATABASE_URL before using database routes.",
  );
}

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

const SEAT_PRICES = { REGULAR: 220, PREMIUM: 380, VIP: 550 };
const BOOKING_FEE = 75;
const TAXES = 130;
const PAYMENT_MODES = new Set(["UPI", "Card", "Cash"]);

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function generateUnusedId(connection, table, column) {
  // All table/column names passed here are internal constants, never request values.
  const allowed = {
    Booking: "Booking_Id",
    PAYMENT: "PAYMENT_ID",
    Ticket: "Ticket_Id",
  };
  if (allowed[table] !== column) throw new Error("Invalid ID generator configuration");

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const id = randomInt(100000, 1000000);
    const [rows] = await connection.query(
      `SELECT 1 FROM ${table} WHERE ${column} = ? LIMIT 1`,
      [id],
    );
    if (rows.length === 0) return id;
  }
  throw new Error(`Unable to generate a unique ID for ${table}`);
}

app.get("/", (_req, res) => {
  res.send("CinePass backend is running");
});

// Lightweight platform health check (does not depend on the database).
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "cinepass-api" });
});

// Application health check: confirms both the API process and MySQL connection.
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1 AS database_connected");
    res.json({ success: true, database: "connected" });
  } catch (error) {
    console.error("Database health check failed:", error.message);
    res.status(503).json({ success: false, database: "disconnected" });
  }
});

// Main list of movies. The frontend uses these database records, not the mock list.
app.get("/api/movies", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT MOVIE_ID AS id, TITLE AS title, LANG AS language,
             GENRE AS genre, DURATION AS duration, RELEASE_DATE AS releaseDate
      FROM MOVIE
      ORDER BY TITLE
    `);
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch movies:", error.message);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// JOIN example: movie -> show -> screen -> theatre.
app.get("/api/movies/:movieId/shows", async (req, res) => {
  const movieId = Number(req.params.movieId);
  if (!Number.isInteger(movieId) || movieId < 1) {
    return res.status(400).json({ error: "movieId must be a positive integer" });
  }

  try {
    const [rows] = await pool.query(`
      SELECT S.SHOW_ID AS showId, S.SHOW_DATE AS showDate,
             S.SHOW_TIME AS showTime, S.MOVIE_ID AS movieId,
             SC.SCREEN_ID AS screenId, SC.SCREEN_NAME AS screenName,
             SC.CAPACITY AS screenCapacity,
             T.THEATRE_ID AS theatreId, T.THEATRE_NAME AS theatreName,
             T.LOCATION AS location
      FROM SHOWS S
      JOIN SCREEN SC ON S.SCREEN_ID = SC.SCREEN_ID
      JOIN THEATRE T ON SC.THEATRE_ID = T.THEATRE_ID
      WHERE S.MOVIE_ID = ?
      ORDER BY S.SHOW_DATE, S.SHOW_TIME, T.THEATRE_NAME
    `, [movieId]);
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch showtimes:", error.message);
    res.status(500).json({ error: "Failed to fetch showtimes" });
  }
});

// Seat status is calculated for this show, not globally for the seat.
app.get("/api/shows/:showId/seats", async (req, res) => {
  const showId = Number(req.params.showId);
  if (!Number.isInteger(showId) || showId < 1) {
    return res.status(400).json({ error: "showId must be a positive integer" });
  }

  try {
    const [rows] = await pool.query(`
      SELECT ST.SEAT_ID AS seatId, ST.SEAT_NUMBER AS seatNumber,
             ST.SEAT_TYPE AS seatType, ST.SCREEN_ID AS screenId,
             CASE WHEN EXISTS (
               SELECT 1
               FROM Ticket TK
               JOIN Booking B ON TK.BOOKING_ID = B.BOOKING_ID
               WHERE TK.SEAT_ID = ST.SEAT_ID AND B.SHOW_ID = S.SHOW_ID
             ) THEN 'reserved' ELSE 'available' END AS status
      FROM SHOWS S
      JOIN SEAT ST ON ST.SCREEN_ID = S.SCREEN_ID
      WHERE S.SHOW_ID = ?
      ORDER BY ST.SEAT_NUMBER
    `, [showId]);
    if (rows.length === 0) {
      const [showRows] = await pool.query("SELECT SHOW_ID FROM SHOWS WHERE SHOW_ID = ?", [showId]);
      if (showRows.length === 0) return res.status(404).json({ error: "Show not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch seats:", error.message);
    res.status(500).json({ error: "Failed to fetch seats" });
  }
});

// INSERT/JOIN report: each ticket with seat and booking information.
app.get("/api/reports/tickets", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT TK.TICKET_ID AS ticketId, TK.BOOKING_ID AS bookingId,
             ST.SEAT_NUMBER AS seatNumber, ST.SEAT_TYPE AS seatType,
             B.BOOKING_DATE AS bookingDate, B.TOTAL_AMOUNT AS totalAmount,
             B.SHOW_ID AS showId
      FROM Ticket TK
      JOIN SEAT ST ON TK.SEAT_ID = ST.SEAT_ID
      JOIN Booking B ON TK.BOOKING_ID = B.BOOKING_ID
      ORDER BY B.BOOKING_DATE DESC, TK.TICKET_ID
    `);
    res.json(rows);
  } catch (error) {
    console.error("Ticket report failed:", error.message);
    res.status(500).json({ error: "Failed to fetch ticket report" });
  }
});

app.get("/api/reports/movie-showtimes", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT M.TITLE AS title, S.SHOW_DATE AS showDate,
             S.SHOW_TIME AS showTime, SC.SCREEN_NAME AS screenName
      FROM MOVIE M
      JOIN SHOWS S ON M.MOVIE_ID = S.MOVIE_ID
      JOIN SCREEN SC ON S.SCREEN_ID = SC.SCREEN_ID
      ORDER BY S.SHOW_DATE, S.SHOW_TIME
    `);
    res.json(rows);
  } catch (error) {
    console.error("Movie-showtime report failed:", error.message);
    res.status(500).json({ error: "Failed to fetch movie-showtime report" });
  }
});

app.get("/api/reports/movie-theatres", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT M.TITLE AS title, T.THEATRE_NAME AS theatreName,
             T.LOCATION AS location, SC.SCREEN_NAME AS screenName
      FROM MOVIE M
      JOIN SHOWS S ON M.MOVIE_ID = S.MOVIE_ID
      JOIN SCREEN SC ON S.SCREEN_ID = SC.SCREEN_ID
      JOIN THEATRE T ON SC.THEATRE_ID = T.THEATRE_ID
      ORDER BY M.TITLE, T.THEATRE_NAME, SC.SCREEN_NAME
    `);
    res.json(rows);
  } catch (error) {
    console.error("Movie-theatre report failed:", error.message);
    res.status(500).json({ error: "Failed to fetch movie-theatre report" });
  }
});

app.get("/api/reports/summary", async (_req, res) => {
  try {
    const [[movieStats]] = await pool.query(`
      SELECT COUNT(*) AS totalMovies, AVG(DURATION) AS averageMovieDuration
      FROM MOVIE
    `);
    const [[bookingStats]] = await pool.query(`
      SELECT COUNT(*) AS totalBookings, AVG(TOTAL_AMOUNT) AS averageBookingAmount,
             COALESCE(SUM(TOTAL_AMOUNT), 0) AS totalBookingValue
      FROM Booking
    `);
    res.json({ ...movieStats, ...bookingStats });
  } catch (error) {
    console.error("Summary report failed:", error.message);
    res.status(500).json({ error: "Failed to fetch summary report" });
  }
});

app.get("/api/reports/revenue-by-theatre", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT T.THEATRE_ID AS theatreId, T.THEATRE_NAME AS theatreName,
             SUM(B.TOTAL_AMOUNT) AS totalRevenue
      FROM Booking B
      JOIN SHOWS S ON B.SHOW_ID = S.SHOW_ID
      JOIN SCREEN SC ON S.SCREEN_ID = SC.SCREEN_ID
      JOIN THEATRE T ON SC.THEATRE_ID = T.THEATRE_ID
      GROUP BY T.THEATRE_ID, T.THEATRE_NAME
      ORDER BY totalRevenue DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Revenue report failed:", error.message);
    res.status(500).json({ error: "Failed to fetch revenue report" });
  }
});

app.get("/api/reports/movies/above-average-duration", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT TITLE AS title, DURATION AS duration
      FROM MOVIE
      WHERE DURATION > (SELECT AVG(DURATION) FROM MOVIE)
      ORDER BY DURATION DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Above-average duration report failed:", error.message);
    res.status(500).json({ error: "Failed to fetch movie duration report" });
  }
});

app.get("/api/reports/bookings/above-average", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT BOOKING_ID AS bookingId, BOOKING_DATE AS bookingDate,
             TOTAL_AMOUNT AS totalAmount
      FROM Booking
      WHERE TOTAL_AMOUNT > (SELECT AVG(TOTAL_AMOUNT) FROM Booking)
      ORDER BY TOTAL_AMOUNT DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Above-average booking report failed:", error.message);
    res.status(500).json({ error: "Failed to fetch booking amount report" });
  }
});

app.get("/api/reports/longest-movie", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT TITLE AS title, DURATION AS duration
      FROM MOVIE
      WHERE DURATION = (SELECT MAX(DURATION) FROM MOVIE)
    `);
    res.json(rows);
  } catch (error) {
    console.error("Longest movie report failed:", error.message);
    res.status(500).json({ error: "Failed to fetch longest movie report" });
  }
});

// Booking is one database transaction: Booking + Payment + Ticket rows either all succeed or all roll back.
// This demo simulates payment completion; it does not charge a real payment provider.
app.post("/api/bookings", async (req, res) => {
  const showId = Number(req.body?.showId);
  const rawSeatIds = req.body?.seatIds;
  const paymentMode = String(req.body?.paymentMode || "UPI").trim();

  if (!Number.isInteger(showId) || showId < 1) {
    return res.status(400).json({ error: "A valid showId is required" });
  }
  if (!Array.isArray(rawSeatIds) || rawSeatIds.length === 0 || rawSeatIds.length > 10) {
    return res.status(400).json({ error: "Select between 1 and 10 seats" });
  }
  const seatIds = rawSeatIds.map(Number);
  if (seatIds.some((id) => !Number.isInteger(id) || id < 1) || new Set(seatIds).size !== seatIds.length) {
    return res.status(400).json({ error: "Seat IDs must be unique positive integers" });
  }
  if (!PAYMENT_MODES.has(paymentMode)) {
    return res.status(400).json({ error: "paymentMode must be UPI, Card, or Cash" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Serializes booking attempts for the same show before we check availability.
    const [showRows] = await connection.query(
      "SELECT SHOW_ID AS showId, SCREEN_ID AS screenId FROM SHOWS WHERE SHOW_ID = ? FOR UPDATE",
      [showId],
    );
    if (showRows.length === 0) throw httpError(404, "Show not found");
    const show = showRows[0];

    const placeholders = seatIds.map(() => "?").join(", ");
    const [seatRows] = await connection.query(
      `SELECT SEAT_ID AS seatId, SEAT_NUMBER AS seatNumber, SEAT_TYPE AS seatType
       FROM SEAT
       WHERE SCREEN_ID = ? AND SEAT_ID IN (${placeholders})
       FOR UPDATE`,
      [show.screenId, ...seatIds],
    );
    if (seatRows.length !== seatIds.length) {
      throw httpError(400, "One or more selected seats do not belong to this show's screen");
    }

    const [reservedRows] = await connection.query(
      `SELECT TK.SEAT_ID AS seatId
       FROM Ticket TK
       JOIN Booking B ON B.BOOKING_ID = TK.BOOKING_ID
       WHERE B.SHOW_ID = ? AND TK.SEAT_ID IN (${placeholders})`,
      [showId, ...seatIds],
    );
    if (reservedRows.length > 0) {
      throw httpError(409, "One or more seats have just been reserved. Refresh the seat map and choose again.");
    }

    const subtotal = seatRows.reduce((sum, seat) => {
      const key = String(seat.seatType || "").toUpperCase();
      const price = SEAT_PRICES[key];
      if (!price) throw httpError(400, `Unsupported seat type: ${seat.seatType}`);
      return sum + price;
    }, 0);
    const totalAmount = Number((subtotal + BOOKING_FEE + TAXES).toFixed(2));

    const bookingId = await generateUnusedId(connection, "Booking", "Booking_Id");
    const paymentId = await generateUnusedId(connection, "PAYMENT", "PAYMENT_ID");
    await connection.query(`
      INSERT INTO Booking (Booking_Id, Booking_Date, Total_Amount, Show_ID, Payment_ID)
      VALUES (?, NOW(), ?, ?, NULL)
    `, [bookingId, totalAmount, showId]);

    await connection.query(`
      INSERT INTO PAYMENT (PAYMENT_ID, AMOUNT, PAYMENT_MODE, PAYMENT_STATUS, BOOKING_ID)
      VALUES (?, ?, ?, 'Completed', ?)
    `, [paymentId, totalAmount, paymentMode, bookingId]);

    await connection.query(
      "UPDATE Booking SET Payment_ID = ? WHERE Booking_Id = ?",
      [paymentId, bookingId],
    );

    const ticketIds = [];
    for (const seatId of seatIds) {
      const ticketId = await generateUnusedId(connection, "Ticket", "Ticket_Id");
      await connection.query(
        "INSERT INTO Ticket (Ticket_Id, Seat_ID, Booking_ID) VALUES (?, ?, ?)",
        [ticketId, seatId, bookingId],
      );
      ticketIds.push(ticketId);
    }

    await connection.commit();
    res.status(201).json({
      success: true,
      bookingId,
      paymentId,
      ticketIds,
      showId,
      seatIds,
      subtotal,
      bookingFee: BOOKING_FEE,
      taxes: TAXES,
      totalAmount,
      paymentMode,
      paymentStatus: "Completed",
      message: "Booking saved to MySQL successfully",
    });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    console.error("Booking failed:", error.message);
    res.status(error.status || 500).json({ error: error.status ? error.message : "Booking failed" });
  } finally {
    if (connection) connection.release();
  }
});

// Cancellation is reflected in MySQL too. Delete dependents first to respect the supplied FK cycle.
app.delete("/api/bookings/:bookingId", async (req, res) => {
  const bookingId = Number(req.params.bookingId);
  if (!Number.isInteger(bookingId) || bookingId < 1) {
    return res.status(400).json({ error: "bookingId must be a positive integer" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const [bookingRows] = await connection.query(
      "SELECT Booking_Id AS bookingId FROM Booking WHERE Booking_Id = ? FOR UPDATE",
      [bookingId],
    );
    if (bookingRows.length === 0) throw httpError(404, "Booking not found");

    await connection.query("DELETE FROM Ticket WHERE Booking_ID = ?", [bookingId]);
    await connection.query("UPDATE Booking SET Payment_ID = NULL WHERE Booking_Id = ?", [bookingId]);
    await connection.query("DELETE FROM PAYMENT WHERE BOOKING_ID = ?", [bookingId]);
    await connection.query("DELETE FROM Booking WHERE Booking_Id = ?", [bookingId]);
    await connection.commit();
    res.json({ success: true, bookingId, message: "Booking and related tickets removed from MySQL" });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    console.error("Cancellation failed:", error.message);
    res.status(error.status || 500).json({ error: error.status ? error.message : "Cancellation failed" });
  } finally {
    if (connection) connection.release();
  }
});

app.use((error, _req, res, _next) => {
  console.error("Unhandled API error:", error.message);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT || process.env.API_PORT || 5000);
app.listen(port, "0.0.0.0", () => {
  console.log(`CinePass backend listening on port ${port}`);
});
