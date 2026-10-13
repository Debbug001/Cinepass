CREATE DATABASE IF NOT EXISTS MOVIE_BOOKING_SYSTEM;
USE MOVIE_BOOKING_SYSTEM;

-- Disable checks while dropping tables because Booking and PAYMENT reference each other.
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Ticket;
DROP TABLE IF EXISTS PAYMENT;
DROP TABLE IF EXISTS Booking;
DROP TABLE IF EXISTS SEAT;
DROP TABLE IF EXISTS SHOWS;
DROP TABLE IF EXISTS SCREEN;
DROP TABLE IF EXISTS MOVIE;
DROP TABLE IF EXISTS THEATRE;
DROP TABLE IF EXISTS Users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE Users (
    User_Id VARCHAR(50) PRIMARY KEY,
    User_Name VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Phone VARCHAR(15) UNIQUE
);

CREATE TABLE THEATRE (
    Theatre_ID INT PRIMARY KEY,
    Theatre_Name VARCHAR(50),
    Location VARCHAR(50)
);

CREATE TABLE SCREEN (
    Screen_ID INT PRIMARY KEY,
    Screen_Name VARCHAR(20),
    Capacity INT,
    Seat_Type INT,
    Theatre_ID INT,
    FOREIGN KEY (Theatre_ID) REFERENCES THEATRE(Theatre_ID)
);

CREATE TABLE SEAT (
    Seat_ID INT PRIMARY KEY,
    Seat_Number INT,
    Seat_Type VARCHAR(20),
    Screen_ID INT,
    FOREIGN KEY (Screen_ID) REFERENCES SCREEN(Screen_ID)
);

CREATE TABLE MOVIE (
    MOVIE_ID INT PRIMARY KEY,
    TITLE VARCHAR(30),
    LANG VARCHAR(20),
    GENRE VARCHAR(20),
    DURATION INT,
    RELEASE_DATE DATE
);

CREATE TABLE SHOWS (
    SHOW_ID INT PRIMARY KEY,
    SHOW_DATE DATE,
    SHOW_TIME TIME,
    MOVIE_ID INT,
    SCREEN_ID INT,
    FOREIGN KEY (MOVIE_ID) REFERENCES MOVIE(MOVIE_ID),
    FOREIGN KEY (SCREEN_ID) REFERENCES SCREEN(SCREEN_ID)
);

CREATE TABLE Booking (
    Booking_Id INT PRIMARY KEY,
    Booking_Date DATETIME NOT NULL,
    Total_Amount DECIMAL(10,2) CHECK (Total_Amount >= 0),
    Show_ID INT,
    Payment_ID INT
);

CREATE TABLE PAYMENT (
    PAYMENT_ID INT PRIMARY KEY,
    AMOUNT DECIMAL(15,2),
    PAYMENT_MODE VARCHAR(20),
    PAYMENT_STATUS VARCHAR(20),
    BOOKING_ID INT,
    FOREIGN KEY (BOOKING_ID) REFERENCES Booking(Booking_Id)
);

CREATE TABLE Ticket (
    Ticket_Id INT PRIMARY KEY,
    Seat_ID INT,
    Booking_ID INT,
    FOREIGN KEY (Seat_ID) REFERENCES SEAT(Seat_ID),
    FOREIGN KEY (Booking_ID) REFERENCES Booking(Booking_Id)
);

ALTER TABLE Booking
ADD CONSTRAINT fk_booking_payment
FOREIGN KEY (Payment_ID) REFERENCES PAYMENT(PAYMENT_ID);

ALTER TABLE Booking
ADD CONSTRAINT fk_booking_show
FOREIGN KEY (Show_ID) REFERENCES SHOWS(SHOW_ID);

INSERT INTO Users VALUES
('U001', 'Rahul Sharma', 'rahul@gmail.com', '9876543210'),
('U002', 'Priya Mehta', 'priya@gmail.com', '9876543211'),
('U003', 'Aman Verma', 'aman@gmail.com', '9876543212'),
('U004', 'Sneha Patil', 'sneha@gmail.com', '9876543213'),
('U005', 'Arjun Singh', 'arjun@gmail.com', '9876543214');

INSERT INTO THEATRE VALUES
(1, 'PVR Cinemas', 'Andheri'),
(2, 'INOX Cinema', 'Bandra');

INSERT INTO SCREEN VALUES
(101, 'Screen 1', 100, 1, 1),
(102, 'Screen 2', 80, 1, 1),
(201, 'Screen 1', 120, 2, 2),
(202, 'Screen 2', 90, 2, 2);

INSERT INTO SEAT VALUES
(1, 1, 'Regular', 101),
(2, 2, 'Regular', 101),
(3, 3, 'Premium', 101),
(4, 4, 'Premium', 101),
(5, 5, 'VIP', 101),
(6, 6, 'VIP', 101),
(7, 1, 'Regular', 102),
(8, 2, 'Regular', 102),
(9, 3, 'Premium', 102),
(10, 4, 'Premium', 102),
(11, 5, 'VIP', 102),
(12, 6, 'VIP', 102),
(13, 1, 'Regular', 201),
(14, 2, 'Regular', 201),
(15, 3, 'Premium', 201),
(16, 4, 'Premium', 201),
(17, 5, 'VIP', 201),
(18, 6, 'VIP', 201),
(19, 1, 'Regular', 202),
(20, 2, 'Regular', 202),
(21, 3, 'Premium', 202),
(22, 4, 'Premium', 202),
(23, 5, 'VIP', 202),
(24, 6, 'VIP', 202);

INSERT INTO MOVIE VALUES
(1, 'Inception', 'English', 'Sci-Fi', 148, '2010-07-16'),
(2, 'Interstellar', 'English', 'Sci-Fi', 169, '2014-11-07'),
(3, 'Oppenheimer', 'English', 'Drama', 180, '2023-07-21'),
(4, 'Dune Part Two', 'English', 'Action', 166, '2024-03-01'),
(5, 'Avengers Endgame', 'English', 'Action', 181, '2019-04-26');

INSERT INTO SHOWS VALUES
(1001, DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), '10:00:00', 1, 101),
(1002, DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), '14:00:00', 2, 102),
(1003, DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), '18:00:00', 3, 101),
(1004, DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), '21:30:00', 4, 201),
(1005, DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), '11:00:00', 5, 202),
(1006, DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), '15:00:00', 2, 102),
(1007, DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), '19:00:00', 1, 201),
(1008, DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), '22:00:00', 5, 202);

INSERT INTO Booking (Booking_Id, Booking_Date, Total_Amount, Show_ID, Payment_ID) VALUES
(5001, '2026-09-29 09:30:00', 300.00, 1001, NULL),
(5002, '2026-09-29 10:00:00', 600.00, 1002, NULL),
(5003, '2026-09-29 11:00:00', 450.00, 1003, NULL),
(5004, '2026-09-29 12:00:00', 500.00, 1004, NULL),
(5005, '2026-09-29 13:00:00', 400.00, 1005, NULL),
(5006, '2026-09-29 14:00:00', 650.00, 1006, NULL),
(5007, '2026-09-29 15:00:00', 700.00, 1007, NULL),
(5008, '2026-09-29 16:00:00', 550.00, 1008, NULL);

INSERT INTO PAYMENT VALUES
(9001, 300.00, 'UPI', 'Completed', 5001),
(9002, 600.00, 'Card', 'Completed', 5002),
(9003, 450.00, 'UPI', 'Completed', 5003),
(9004, 500.00, 'Cash', 'Completed', 5004),
(9005, 400.00, 'Card', 'Completed', 5005),
(9006, 650.00, 'UPI', 'Completed', 5006),
(9007, 700.00, 'Card', 'Completed', 5007),
(9008, 550.00, 'UPI', 'Completed', 5008);

UPDATE Booking SET Payment_ID = 9001 WHERE Booking_Id = 5001;
UPDATE Booking SET Payment_ID = 9002 WHERE Booking_Id = 5002;
UPDATE Booking SET Payment_ID = 9003 WHERE Booking_Id = 5003;
UPDATE Booking SET Payment_ID = 9004 WHERE Booking_Id = 5004;
UPDATE Booking SET Payment_ID = 9005 WHERE Booking_Id = 5005;
UPDATE Booking SET Payment_ID = 9006 WHERE Booking_Id = 5006;
UPDATE Booking SET Payment_ID = 9007 WHERE Booking_Id = 5007;
UPDATE Booking SET Payment_ID = 9008 WHERE Booking_Id = 5008;

INSERT INTO Ticket VALUES
(7001, 1, 5001),
(7002, 2, 5001),
(7003, 7, 5002),
(7004, 8, 5002),
(7005, 9, 5002),
(7006, 3, 5003),
(7007, 4, 5003),
(7008, 13, 5004),
(7009, 14, 5004),
(7010, 19, 5005),
(7011, 20, 5005),
(7012, 9, 5006),
(7013, 10, 5006),
(7014, 15, 5007),
(7015, 16, 5007),
(7016, 21, 5008);
