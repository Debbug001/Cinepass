import React from 'react';

interface ProfileViewProps {
  onOpenPerks: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenPerks }) => {
  return (
    <div className="space-y-4 px-4 pt-2 pb-24">
      {/* Profile Card */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500/40 to-orange-400/40 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full bg-surface-container flex items-center justify-center text-primary font-bold text-lg font-headline">
              NP
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold font-headline text-on-surface">New Patron</h3>
            <p className="text-xs text-on-surface-variant">patron@cinepass.club</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-semibold border border-white/5">
                Standard Member
              </span>
              <span className="text-[11px] text-on-surface-variant">• 0 CinePoints</span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenPerks}
          className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary border border-primary/20 active:scale-95 transition-all"
          title="Elite Benefits"
        >
          <span className="material-symbols-outlined text-[20px]">stars</span>
        </button>
      </div>

      {/* CinePass Elite Pass Bento Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container to-surface-container-low p-4 border border-outline-variant/30 flex items-center justify-between">
        <div className="space-y-1 z-10 max-w-[70%]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              stars
            </span>
            CinePass Elite Pass
          </span>
          <h4 className="text-base font-bold font-headline text-on-surface">Unlimited IMAX Screenings</h4>
          <p className="text-xs text-on-surface-variant">Get 20% off concessions and priority lounge entry.</p>
        </div>
        <button
          onClick={onOpenPerks}
          className="z-10 bg-primary-container text-on-primary-container px-3 py-2 rounded-xl text-xs font-bold glow-amber active:scale-95 transition-transform flex-shrink-0"
        >
          Upgrade
        </button>
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
      </div>

      {/* Account Settings Menu */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Preferences & Security</h4>
        
        <div className="rounded-xl bg-surface-container-low border border-white/5 divide-y divide-white/5 text-xs">
          <button className="w-full p-3.5 flex items-center justify-between hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[18px]">credit_card</span>
              <span className="font-semibold text-on-surface">Saved Payment Methods (Apple Pay, Visa •• 4242)</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">chevron_right</span>
          </button>
          
          <button className="w-full p-3.5 flex items-center justify-between hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[18px]">airplane_ticket</span>
              <span className="font-semibold text-on-surface">Apple Wallet / Google Wallet Auto-Sync</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400">ACTIVE</span>
          </button>

          <button className="w-full p-3.5 flex items-center justify-between hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[18px]">notifications</span>
              <span className="font-semibold text-on-surface">Ticket Alerts & Reminders</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">chevron_right</span>
          </button>

          <button className="w-full p-3.5 flex items-center justify-between hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[18px]">help</span>
              <span className="font-semibold text-on-surface">Cinema Patrons Help & Support</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="text-center text-[11px] text-on-surface-variant/60 pt-3">
        CinePass Mobile v2.4 • Metropolis Unified Cinema Network
      </div>
    </div>
  );
};
