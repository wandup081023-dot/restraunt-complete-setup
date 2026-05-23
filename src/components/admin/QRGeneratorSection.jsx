import React, { useState, useRef } from 'react';
import { useSettings } from '../../utils/SettingsContext';
import { useToast } from '../Toast';

// Simple QR generation via external API (works with Google Apps Script too)
function QRCode({ tableNumber, url, size = 160 }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=fff8f0&color=1a1a1a&margin=2`;
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
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&bgcolor=fff8f0&color=1a1a1a&margin=2`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `table-${tableNumber}-qr.png`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&bgcolor=fff8f0&color=1a1a1a&margin=2`;
    printWindow.document.write(`
      <html><head><title>Table ${tableNumber} QR</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;600&display=swap" rel="stylesheet">
      <style>
        body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #FFF8F0; font-family: Poppins, sans-serif; }
        .card { text-align: center; padding: 32px; border: 2px solid rgba(230,92,0,0.2); border-radius: 20px; background: white; width: 320px; }
        h1 { font-family: 'Playfair Display', serif; font-size: 28px; margin: 0 0 4px; color: #1A1A1A; }
        .sub { color: #8B7355; font-size: 13px; margin: 0 0 20px; }
        img { width: 220px; height: 220px; border-radius: 12px; }
        .table { display: inline-block; background: linear-gradient(135deg, #E65C00, #F7B731); color: white; padding: 8px 24px; border-radius: 100px; font-weight: 600; font-size: 15px; margin-top: 20px; }
        .scan { color: #5A4A3A; font-size: 12px; margin-top: 12px; }
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
    <div className="qr-grid-card flex flex-col items-center">
      {/* QR code */}
      <div className="relative mb-4">
        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,248,240,0.8)', border: '1px solid rgba(230,92,0,0.1)' }}>
          <QRCode tableNumber={tableNumber} url={url} size={140} />
        </div>
        {/* Corner marks */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-[#E65C00] rounded-tl-sm" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-[#E65C00] rounded-tr-sm" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-[#E65C00] rounded-bl-sm" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-[#E65C00] rounded-br-sm" />
      </div>

      {/* Table badge */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-2" style={{ background: 'linear-gradient(135deg, rgba(230,92,0,0.12), rgba(247,183,49,0.1))', border: '1px solid rgba(230,92,0,0.2)' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="4" width="10" height="6" rx="1" stroke="#E65C00" strokeWidth="1.2" />
          <rect x="3.5" y="2" width="5" height="2.5" rx="0.5" stroke="#E65C00" strokeWidth="1.2" />
        </svg>
        <span className="text-[#E65C00] font-bold text-sm">Table {tableNumber}</span>
      </div>

      <p className="text-xs text-[#8B7355] mb-4 leading-relaxed px-2">
        Scan to view menu &amp; order
      </p>

      {/* Actions */}
      <div className="flex gap-2 w-full">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-[#E65C00] bg-[rgba(230,92,0,0.08)] hover:bg-[rgba(230,92,0,0.14)] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v7M4 6l3 3 3-3M2 11h10" stroke="#E65C00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Download
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-[#5A4A3A] bg-[rgba(26,26,26,0.05)] hover:bg-[rgba(26,26,26,0.08)] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 5V2h6v3M4 10H2V6h10v4h-2" stroke="#5A4A3A" strokeWidth="1.4" strokeLinejoin="round" />
            <rect x="4" y="8" width="6" height="4" rx="0.5" stroke="#5A4A3A" strokeWidth="1.4" />
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
      {/* Controls */}
      <div className="card p-5 mb-6 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1" style={{ minWidth: 200 }}>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">Number of Tables</label>
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
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">Menu Base URL</label>
          <input
            type="text"
            value={baseUrl}
            readOnly
            className="input-field text-xs text-[#8B7355] cursor-default"
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Tables', value: tableCount },
          { label: 'Active QRs', value: tableCount },
          { label: 'Base URL', value: '✓ Set' },
        ].map((s, i) => (
          <div key={i} className="admin-stat-card text-center">
            <p className="font-display font-bold text-2xl text-[#E65C00]">{s.value}</p>
            <p className="text-xs text-[#8B7355] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* QR Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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