// Paste this into Extensions > Apps Script on the "Speech — Pitch Responses" sheet.
// It must be a container-bound script (created from within the Sheet), so
// SpreadsheetApp.getActiveSpreadsheet() resolves to the right file.
//
// On each submission this:
//   1. Appends the row to SHEET_NAME (source of truth / CSV export).
//   2. Generates a Google Doc with the team's pitch written out as a script,
//      speaker by speaker, saved into the SCRIPTS_FOLDER_NAME Drive folder.
// Step 2 failing never fails the submission — the row is already saved by then.

var SHEET_NAME = 'Sheet1';
var SHARED_SECRET = 'REPLACE_WITH_A_LONG_RANDOM_STRING';
var SCRIPTS_FOLDER_NAME = 'Speech — Pitch Scripts';

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

    var docUrl = null;
    try {
      docUrl = createPitchScriptDoc(data.row);
    } catch (docErr) {
      // Don't fail the whole submission just because script-doc generation
      // broke — the row is already saved at this point.
      Logger.log('Failed to generate pitch script doc: ' + docErr);
    }

    return respond({ ok: true, docUrl: docUrl });
  } catch (err) {
    return respond({ ok: false, error: String(err) });
  }
}

// row indices match the sheet header order exactly (see lib/pitch.ts buildSheetRow).
function createPitchScriptDoc(row) {
  var pitch = {
    teamName: row[1],
    projectName: row[2],
    hook: row[3],
    problem: row[4],
    proofCount: row[5],
    proofQuote: row[6],
    speaker1: row[7],
    solution: row[8],
    mvp: row[9],
    whatWeShow: row[10],
    speaker2: row[11],
    whoPays: row[12],
    moneyModel: row[13],
    costToBuild: row[14],
    priceCharged: row[15],
    numCustomers: row[16],
    revenueEstimate: row[17],
    speaker3: row[18],
    howWeGrow: row[19],
    theAsk: row[20],
    speaker4: row[21],
  };

  var docName = pitch.teamName + ' — ' + pitch.projectName + ' — Pitch Script';
  var doc = DocumentApp.create(docName);
  var body = doc.getBody();
  body.clear();

  body.appendParagraph(pitch.teamName + ' — ' + pitch.projectName)
    .setHeading(DocumentApp.ParagraphHeading.TITLE);
  body.appendParagraph('Shark Tank Finale Pitch Script')
    .setHeading(DocumentApp.ParagraphHeading.SUBTITLE);

  addSlide(body, 'Slide 1 — Hook + Problem', pitch.speaker1, [
    pitch.hook,
    pitch.problem,
    proofLine(pitch.proofCount, pitch.proofQuote),
  ]);

  addSlide(body, 'Slide 2 — Solution + MVP', pitch.speaker2, [
    pitch.solution,
    pitch.mvp,
    "What we'll show: " + pitch.whatWeShow,
  ]);

  addSlide(body, 'Slide 3 — Who Pays + Numbers', pitch.speaker3, [
    pitch.whoPays + ' pays us ' + pitch.moneyModel + '.',
    'Cost to build: $' + pitch.costToBuild + '   Price charged: $' + pitch.priceCharged,
    'Customers: ' + pitch.numCustomers + '   Revenue estimate: $' + pitch.revenueEstimate,
  ]);

  addSlide(body, 'Slide 4 — How We Grow + The Ask', pitch.speaker4, [
    pitch.howWeGrow,
    pitch.theAsk,
  ]);

  doc.saveAndClose();

  var file = DriveApp.getFileById(doc.getId());
  getOrCreateScriptsFolder().addFile(file);
  DriveApp.getRootFolder().removeFile(file);

  return file.getUrl();
}

function addSlide(body, title, speaker, lines) {
  body.appendParagraph(title).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Speaker: ' + speaker).setItalic(true);

  lines.forEach(function (line) {
    if (line) body.appendParagraph(line);
  });

  body.appendParagraph('');
}

function proofLine(count, quote) {
  var line = 'Proof: ' + count + ' out of 5 people said this problem is real.';
  if (quote) line += ' "' + quote + '"';
  return line;
}

function getOrCreateScriptsFolder() {
  var folders = DriveApp.getFoldersByName(SCRIPTS_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(SCRIPTS_FOLDER_NAME);
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
