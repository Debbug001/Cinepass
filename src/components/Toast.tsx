import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'warning';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-surface-container-high/95 backdrop-blur-xl border border-primary/30 shadow-[0_8px_30px_rgba(0,0,0,0.8)] text-on-surface animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          {type === 'success' ? 'check_circle' : type === 'warning' ? 'warning' : 'info'}
        </span>
        <span className="text-sm font-medium text-on-surface">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-on-surface-variant hover:text-on-surface p-1 transition-colors"
        aria-label="Dismiss toast"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
};
