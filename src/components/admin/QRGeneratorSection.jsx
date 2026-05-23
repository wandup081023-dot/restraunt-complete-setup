import { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { getSettings } from '../../utils/storage'
import Toast from '../Toast'

function QRCard({ url, label, onDownload }) {
  const canvasRef = useRef(null)

  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${label.replace(/\s/g, '_')}.png`)
        onDownload?.()
      }
    })
  }

  return (
    <div className="flex flex-col items-center rounded-2xl border bg-white p-4 shadow-sm">
      <div ref={canvasRef}>
        <QRCodeCanvas value={url} size={160} level="H" includeMargin />
      </div>
      <p className="mt-3 font-semibold text-charcoal">{label}</p>
      <p className="mt-1 max-w-full truncate text-xs text-charcoal/50">{url}</p>
      <button
        type="button"
        onClick={handleDownload}
        className="mt-3 min-h-10 w-full rounded-lg bg-cream text-sm font-medium text-saffron"
      >
        Download PNG
      </button>
    </div>
  )
}

export default function QRGeneratorSection() {
  const settings = getSettings()
  const [tableCount, setTableCount] = useState(10)
  const [baseUrl, setBaseUrl] = useState(
    settings.baseUrl || (typeof window !== 'undefined' ? window.location.origin : ''),
  )
  const [qrCodes, setQrCodes] = useState([])
  const [toast, setToast] = useState(null)
  const [downloadingZip, setDownloadingZip] = useState(false)
  const gridRef = useRef(null)

  const generate = () => {
    const base = baseUrl.replace(/\/$/, '')
    const count = Math.max(1, Math.min(100, Number(tableCount) || 1))
    const codes = Array.from({ length: count }, (_, i) => {
      const num = i + 1
      return {
        label: `Table ${num}`,
        url: `${base}/menu?table=${num}`,
      }
    })
    setQrCodes(codes)
    setToast({ message: `Generated ${count} QR codes`, type: 'success' })
  }

  const downloadAllZip = async () => {
    if (!gridRef.current || qrCodes.length === 0) return
    setDownloadingZip(true)
    try {
      const zip = new JSZip()
      const canvases = gridRef.current.querySelectorAll('canvas')

      canvases.forEach((canvas, i) => {
        const dataUrl = canvas.toDataURL('image/png')
        const base64 = dataUrl.split(',')[1]
        const name = `${qrCodes[i]?.label.replace(/\s/g, '_') || `table_${i + 1}`}.png`
        zip.file(name, base64, { base64: true })
      })

      const blob = await zip.generateAsync({ type: 'blob' })
      saveAs(blob, 'restaurant-table-qr-codes.zip')
      setToast({ message: 'ZIP downloaded!', type: 'success' })
    } catch {
      setToast({ message: 'Failed to create ZIP', type: 'error' })
    } finally {
      setDownloadingZip(false)
    }
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-charcoal">QR Code Generator</h2>
      <p className="mt-1 text-sm text-charcoal/60">
        Generate printable QR codes for each table.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm font-medium">Number of Tables</span>
          <input
            type="number"
            min="1"
            max="100"
            value={tableCount}
            onChange={(e) => setTableCount(e.target.value)}
            className="mt-1 min-h-12 w-full rounded-xl border bg-white px-4"
          />
        </label>
        <label>
          <span className="text-sm font-medium">Base URL</span>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://myrestaurant.vercel.app"
            className="mt-1 min-h-12 w-full rounded-xl border bg-white px-4"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={generate}
        className="mt-4 min-h-12 rounded-xl bg-saffron px-8 font-semibold text-white"
      >
        Generate QR Codes
      </button>

      {qrCodes.length > 0 && (
        <>
          <button
            type="button"
            onClick={downloadAllZip}
            disabled={downloadingZip}
            className="mt-6 min-h-12 rounded-xl border-2 border-saffron bg-white px-6 font-semibold text-saffron disabled:opacity-50"
          >
            {downloadingZip ? 'Creating ZIP...' : 'Download All as ZIP'}
          </button>

          <div
            ref={gridRef}
            className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {qrCodes.map((qr) => (
              <QRCard key={qr.label} url={qr.url} label={qr.label} />
            ))}
          </div>
        </>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
