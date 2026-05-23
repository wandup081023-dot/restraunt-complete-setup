# Restaurant QR Code Ordering System

A **free**, mobile-first web app for table-side ordering via QR codes. Customers scan a QR code, browse the menu, and place orders. Orders are saved to **Google Sheets** — no backend database, email, or WhatsApp required.

## Features

- **Customer menu** (`/menu?table=5`) — category tabs, cart, order confirmation
- **Admin panel** (`/admin`) — settings, menu manager, QR code generator
- **Google Sheets** — order logging via Apps Script
- **15 preloaded Indian menu items** with Unsplash images

## Tech Stack (All Free)

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + Tailwind CSS |
| Hosting | Vercel (free tier) |
| Menu storage | Browser localStorage |
| Orders | Google Sheets + Apps Script |
| QR codes | qrcode.react + JSZip |

---

## Quick Start (Local)

```bash
npm install
npm run dev
```

- Customer menu: http://localhost:5173/menu?table=1
- Admin panel: http://localhost:5173/admin (password: `admin123`)

---

## Order Flow

When a customer taps **Place Order**:

1. Order data is sent to your **Google Apps Script** Web App URL (saved in admin settings)
2. A confirmation screen appears with order summary and **New Order** button

Nothing else happens — no email, no WhatsApp.

---

## 1. Deploy to Vercel

1. Push this project to a **GitHub** repository.
2. Go to [vercel.com](https://vercel.com) and import the repo.
3. Framework preset: **Vite** (auto-detected).
4. Deploy and copy your live URL.
5. In **Admin → Settings**, set **Website Base URL** for QR generation.

---

## 2. Google Sheets + Apps Script Setup

### Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name it e.g. **Restaurant Orders**.

### Step 2: Open Apps Script

1. In the sheet: **Extensions → Apps Script**.
2. Delete any default code.
3. Copy the entire contents of `google-apps-script/Code.gs` from this repo and paste it.
4. Click **Save**.

### Step 3: Deploy as Web App

1. Click **Deploy → New deployment** (or **Manage deployments → Edit → New version** if updating).
2. Type: **Web app**.
3. **Execute as:** Me.
4. **Who has access:** Anyone.
5. Click **Deploy** and authorize when prompted.
6. Copy the **Web App URL** (ends with `/exec`).

### Step 4: Add URL to Admin Settings

The app ships with a default script URL. To change it:

1. Open `/admin` → **Settings**.
2. Paste your Web App URL into **Google Apps Script Web App URL**.
3. Click **Save Settings**.

### Fix: "Script function not found: doGet"

This means the deployed script is missing `doGet`. Open Apps Script, paste the full `google-apps-script/Code.gs` from this repo (it includes `doGet` and `doPost`), save, then **Deploy → Manage deployments → Edit → New version → Deploy**.

Test by opening your `/exec` URL in a browser — you should see JSON like `{"status":"ok",...}`.

### Order payload

```json
{
  "timestamp": "23 May 2026, 7:45 PM",
  "table": "Table 5",
  "customerName": "Rahul",
  "items": "2x Butter Chicken (₹320), 1x Garlic Naan (₹60)",
  "total": "₹460",
  "specialInstructions": "Less spicy please",
  "status": "New"
}
```

### Update order status

In the Google Sheet, change the **Status** column (e.g. `New` → `Preparing` → `Served`).

---

## 3. Generate & Print QR Codes

1. Go to **Admin → QR Generator**.
2. Enter number of tables and your deployed **Base URL**.
3. Click **Generate QR Codes** and download PNGs or ZIP.
4. Print and place one QR per table.

Each QR links to: `https://yoursite.com/menu?table=N`

---

## Admin Panel

| Section | Description |
|---------|-------------|
| Settings | Restaurant info, Google Script URL |
| Menu Manager | Add/edit/delete menu items |
| QR Generator | Bulk QR code creation |

**Default password:** `admin123`

---

## License

MIT — use freely for your restaurant.
