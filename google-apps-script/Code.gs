/**
 * Restaurant QR Ordering System — Google Apps Script
 *
 * Paste this into Apps Script (Extensions → Apps Script) for your Google Sheet.
 * Deploy as Web App: Execute as Me, Who has access: Anyone.
 */

const HEADERS = [
  'Timestamp',
  'Table',
  'Customer Name',
  'Items',
  'Total',
  'Special Instructions',
  'Status',
];

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', message: 'Restaurant ordering endpoint is running' }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.table || '',
      data.customerName || 'Guest',
      data.items || '',
      data.total || '',
      data.specialInstructions || '',
      data.status || 'New',
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Order recorded' }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.toString() }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions() {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
}
