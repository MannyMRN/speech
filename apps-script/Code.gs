// Paste this into Extensions > Apps Script on the "Speech — Pitch Responses" sheet.
// It must be a container-bound script (created from within the Sheet), so
// SpreadsheetApp.getActiveSpreadsheet() resolves to the right file.

var SHEET_NAME = 'Sheet1';
var SHARED_SECRET = 'REPLACE_WITH_A_LONG_RANDOM_STRING';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.secret !== SHARED_SECRET) {
      return respond({ ok: false, error: 'Unauthorized' });
    }
    if (!Array.isArray(data.row)) {
      return respond({ ok: false, error: 'Missing row array' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    sheet.appendRow(data.row);

    return respond({ ok: true });
  } catch (err) {
    return respond({ ok: false, error: String(err) });
  }
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
