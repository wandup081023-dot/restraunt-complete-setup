import React from 'react';

export default function LoadingSpinner({ fullScreen = true, message = 'Loading...' }) {
  if (!fullScreen) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E65C00] animate-spin" />
          <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-[#F7B731] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FDECD8 100%)' }}>
      {/* Decorative rings */}
      <div className="absolute w-64 h-64 rounded-full border border-[rgba(230,92,0,0.08)]" />
      <div className="absolute w-48 h-48 rounded-full border border-[rgba(230,92,0,0.12)]" />

      {/* Logo container */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #E65C00, #F7B731)' }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 6C12.268 6 6 12.268 6 20s6.268 14 14 14 14-6.268 14-14S27.732 6 20 6z" fill="rgba(255,255,255,0.2)" />
            <path d="M14 16c0-1.1.9-2 2-2s2 .9 2 2v8c0 1.1-.9 2-2 2s-2-.9-2-2v-8zM20 12c0-1.1.9-2 2-2s2 .9 2 2v12c0 1.1-.9 2-2 2s-2-.9-2-2V12zM26 18c0-1.1.9-2 2-2s2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4z" fill="white" />
          </svg>
        </div>
        {/* Spinner ring */}
        <div className="absolute -inset-3 rounded-full border-2 border-transparent border-t-[#E65C00] border-r-[#F7B731] animate-spin" style={{ animationDuration: '1.2s' }} />
      </div>

      <h2 className="font-display text-2xl font-bold text-[#1A1A1A] mb-2">Spice Garden</h2>
      <p className="text-sm font-medium text-[#8B7355]">{message}</p>

      {/* Loading dots */}
      <div className="flex items-center gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#E65C00]"
            style={{
              animation: 'pulse-soft 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}