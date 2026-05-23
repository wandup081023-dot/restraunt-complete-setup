import React from 'react'

export default function LoadingSpinner({ fullScreen = true, message = 'Loading...' }) {
  if (!fullScreen) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border border-[rgba(201,168,76,0.18)]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--accent)] animate-spin" />
          <div
            className="absolute inset-1 rounded-full border-2 border-transparent border-t-[rgba(232,213,163,0.72)] animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '0.9s' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.16),transparent_35%),linear-gradient(180deg,#0a0a0a_0%,#101010_100%)]">
      <div className="absolute h-64 w-64 rounded-full border border-[rgba(201,168,76,0.1)]" />
      <div className="absolute h-44 w-44 rounded-full border border-[rgba(201,168,76,0.12)]" />

      <div className="relative mb-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-[22px] border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.02)] shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
            <path d="M21 6C13.268 6 7 12.268 7 20s6.268 14 14 14 14-6.268 14-14S28.732 6 21 6z" fill="rgba(201,168,76,0.08)" />
            <path d="M15 16c0-1.1.9-2 2-2s2 .9 2 2v8c0 1.1-.9 2-2 2s-2-.9-2-2v-8zM21 12c0-1.1.9-2 2-2s2 .9 2 2v12c0 1.1-.9 2-2 2s-2-.9-2-2V12zM27 18c0-1.1.9-2 2-2s2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2v-4z" fill="var(--accent)" />
          </svg>
        </div>
        <div className="absolute -inset-3 animate-spin rounded-full border-2 border-transparent border-t-[rgba(201,168,76,0.9)] border-r-[rgba(232,213,163,0.7)]" style={{ animationDuration: '1.2s' }} />
      </div>

      <h2 className="mb-2 font-display text-3xl font-semibold text-[var(--text-primary)]">Spice Garden</h2>
      <p className="text-sm uppercase tracking-[0.22em] text-[rgba(245,240,232,0.56)]">{message}</p>

      <div className="mt-6 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-[var(--accent)]"
            style={{
              animation: 'pulse-soft 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}