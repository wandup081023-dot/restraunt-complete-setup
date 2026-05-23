/**
 * Restaurant QR Ordering — Google Apps Script
 * Deploy as Web App: Execute as Me, Who has access: Anyone
 *
 * GET  ?action=getMenu     → returns saved menu JSON
 * POST { action: 'updateMenu', items: [...] }
 * POST { timestamp, table, customerName, items, total, ... } → new order row
 */

const ORDER_HEADERS = [
  'Timestamp',
  'Table',
  'Customer Name',
  'Items',
  'Total',
  'Special Instructions',
  'Status',
];

const MENU_KEY = 'MENU_JSON';

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : '';

  if (action === 'getMenu') {
    return jsonResponse({ success: true, items: getStoredMenu() });
  }

  return jsonResponse({
    status: 'ok',
    message: 'Restaurant ordering endpoint is running',
  });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'updateMenu' && data.items) {
      saveStoredMenu(data.items);
      return jsonResponse({ success: true, message: 'Menu updated' });
    }

    appendOrderRow(data);
    return jsonResponse({ success: true, message: 'Order recorded' });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function doOptions() {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
}

function getOrdersSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Orders');
  if (!sheet) {
    sheet = ss.insertSheet('Orders');
    sheet.appendRow(ORDER_HEADERS);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(ORDER_HEADERS);
  }
  return sheet;
}

function appendOrderRow(data) {
  const sheet = getOrdersSheet();
  sheet.appendRow([
    data.timestamp || new Date().toLocaleString('en-IN'),
    data.table || '',
    data.customerName || 'Guest',
    data.items || '',
    data.total || '',
    data.specialInstructions || '',
    data.status || 'New',
  ]);
}

function getStoredMenu() {
  const json = PropertiesService.getScriptProperties().getProperty(MENU_KEY);
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch (err) {
    return [];
  }
}

function saveStoredMenu(items) {
  PropertiesService.getScriptProperties().setProperty(MENU_KEY, JSON.stringify(items));
}
