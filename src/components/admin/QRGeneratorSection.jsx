import React, { useState, useRef } from 'react';
import { useSettings } from '../../utils/SettingsContext';
import { useToast } from '../Toast';

// Simple QR generation via external API (works with Google Apps Script too)
function QRCode({ tableNumber, url, size = 160 }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=111111&margin=2`;
  return (
    <img
      src={qrUrl}
      alt={`QR Code Table ${tableNumber}`}
      width={size}
      height={size}
      className="rounded-lg"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

function QRCard({ tableNumber, url, restaurantName }) {
  const cardRef = useRef(null);

  const handleDownload = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=111111&margin=2`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `table-${tableNumber}-qr.png`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=111111&margin=2`;
    printWindow.document.write(`
      <html><head><title>Table ${tableNumber} QR</title>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0a0a0a; font-family: Jost, sans-serif; color: #f5f0e8; }
        .card { text-align: center; padding: 32px; border: 1px solid rgba(201,168,76,0.22); border-radius: 24px; background: #111111; width: 320px; box-shadow: 0 24px 60px rgba(0,0,0,0.4); }
        h1 { font-family: 'Cormorant Garamond', serif; font-size: 30px; margin: 0 0 4px; color: #f5f0e8; }
        .sub { color: rgba(245,240,232,0.58); font-size: 12px; letter-spacing: .24em; text-transform: uppercase; margin: 0 0 20px; }
        img { width: 220px; height: 220px; border-radius: 16px; background: #fff; }
        .table { display: inline-block; background: rgba(201,168,76,0.16); color: #e8d5a3; border: 1px solid rgba(201,168,76,0.28); padding: 8px 24px; border-radius: 100px; font-weight: 600; font-size: 15px; margin-top: 20px; letter-spacing: .2em; text-transform: uppercase; }
        .scan { color: rgba(245,240,232,0.62); font-size: 12px; margin-top: 12px; }
      </style></head><body>
      <div class="card">
        <h1>${restaurantName}</h1>
        <p class="sub">Scan to Order</p>
        <img src="${qrUrl}" />
        <div class="table">Table ${tableNumber}</div>
        <p class="scan">Scan the QR code to view our menu and place your order</p>
      </div>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 600);
  };

  return (
    <div className="qr-grid-card flex flex-col items-center rounded-[24px] p-5 text-center">
      <div className="relative mb-4">
        <div className="rounded-[20px] border border-[rgba(201,168,76,0.14)] bg-white p-3 shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
          <QRCode tableNumber={tableNumber} url={url} size={140} />
        </div>
        <div className="absolute -top-1 -left-1 h-4 w-4 rounded-tl-sm border-l-2 border-t-2 border-[var(--gold)]" />
        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-tr-sm border-r-2 border-t-2 border-[var(--gold)]" />
        <div className="absolute -bottom-1 -left-1 h-4 w-4 rounded-bl-sm border-b-2 border-l-2 border-[var(--gold)]" />
        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-br-sm border-b-2 border-r-2 border-[var(--gold)]" />
      </div>

      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.08)] px-4 py-1.5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="4" width="10" height="6" rx="1" stroke="var(--gold-light)" strokeWidth="1.2" />
          <rect x="3.5" y="2" width="5" height="2.5" rx="0.5" stroke="var(--gold-light)" strokeWidth="1.2" />
        </svg>
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold-light)]">Table {tableNumber}</span>
      </div>

      <p className="mb-4 px-2 text-xs leading-relaxed text-[rgba(245,240,232,0.58)]">
        Scan to view menu &amp; order
      </p>

      <div className="flex gap-2 w-full">
        <button
          onClick={handleDownload}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[rgba(201,168,76,0.18)] py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--gold-light)] bg-[rgba(201,168,76,0.06)] transition-colors hover:bg-[rgba(201,168,76,0.12)]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v7M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Download
        </button>
        <button
          onClick={handlePrint}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[rgba(201,168,76,0.14)] py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-[rgba(245,240,232,0.72)] bg-[rgba(255,255,255,0.02)] transition-colors hover:bg-[rgba(201,168,76,0.06)]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 5V2h6v3M4 10H2V6h10v4h-2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <rect x="4" y="8" width="6" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          Print
        </button>
      </div>
    </div>
  );
}

export default function QRGeneratorSection() {
  const { settings } = useSettings();
  const addToast = useToast();
  const [tableCount, setTableCount] = useState(settings?.tableCount || 10);
  const [inputCount, setInputCount] = useState(settings?.tableCount || 10);

  const baseUrl = settings?.menuBaseUrl || `${window.location.origin}/menu`;
  const restaurantName = settings?.restaurantName || 'Spice Garden';

  const handleApply = () => {
    const n = Math.max(1, Math.min(50, parseInt(inputCount) || 10));
    setTableCount(n);
    addToast({ type: 'success', message: `Showing QR codes for ${n} tables` });
  };

  const handlePrintAll = () => {
    addToast({ type: 'info', message: 'Opening print dialog for all QR codes...', duration: 2000 });
    setTimeout(() => window.print(), 500);
  };

  return (
    <div>
      <div className="card mb-6 flex flex-wrap items-center gap-4 rounded-[28px] p-5">
        <div className="flex items-center gap-3 flex-1" style={{ minWidth: 200 }}>
          <div className="flex-1">
            <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[rgba(245,240,232,0.58)]">Number of Tables</label>
            <input
              type="number"
              min={1}
              max={50}
              value={inputCount}
              onChange={(e) => setInputCount(e.target.value)}
              className="input-field"
              style={{ maxWidth: 120 }}
            />
          </div>
          <button onClick={handleApply} className="btn-primary" style={{ paddingTop: 12, paddingBottom: 12, marginTop: 20 }}>
            Generate
          </button>
        </div>

        <div className="flex-1" style={{ minWidth: 200 }}>
          <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[rgba(245,240,232,0.58)]">Menu Base URL</label>
          <input
            type="text"
            value={baseUrl}
            readOnly
            className="input-field cursor-default text-xs text-[rgba(245,240,232,0.62)]"
            onClick={(e) => { e.target.select(); navigator.clipboard?.writeText(baseUrl); addToast({ type: 'info', message: 'URL copied!' }); }}
          />
        </div>

        <button
          onClick={handlePrintAll}
          className="btn-secondary flex items-center gap-2"
          style={{ paddingTop: 12, paddingBottom: 12 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6V2h8v4M4 12H2V7h12v5h-2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <rect x="4" y="10" width="8" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          Print All
        </button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Total Tables', value: tableCount },
          { label: 'Active QRs', value: tableCount },
          { label: 'Base URL', value: '✓ Set' },
        ].map((s, i) => (
          <div key={i} className="admin-stat-card rounded-[22px] p-5 text-center">
            <p className="font-display text-3xl font-semibold text-[var(--gold-light)]">{s.value}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[rgba(245,240,232,0.54)]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: tableCount }, (_, i) => i + 1).map((n) => (
          <div key={n} style={{ animation: `fadeUp 0.3s ease ${Math.min(n - 1, 8) * 40}ms both` }}>
            <QRCard
              tableNumber={n}
              url={`${baseUrl}?table=${n}`}
              restaurantName={restaurantName}
            />
          </div>
        ))}
      </div>
    </div>
  );
}