# Save feedback to a Google Doc (no new tab)

Submissions from the "requests and feedback" modal are appended to a Google Doc via a small Google Apps Script. Everything stays in your site; no new tab opens.

**Use a standalone script** (you do **not** open Apps Script from inside the Doc—that avoids the "Bad Request 400" issue).

---

## 1. Create a Google Doc and get its ID

1. Go to [docs.google.com](https://docs.google.com) and create a new document (e.g. "Curious Paisley – Feedback").
2. Open the doc. Look at the URL in your browser:
   ```
   https://docs.google.com/document/d/1ABC123xyz.../edit
   ```
   The **Doc ID** is the long string between `/d/` and `/edit`. Copy it (e.g. `1ABC123xyz...`).

---

## 2. Create a standalone Apps Script project

1. Go to [script.google.com](https://script.google.com).
2. Click **New project**.
3. Delete any sample code in the editor and paste this (then replace `YOUR_DOC_ID` with the ID you copied):

```javascript
var FEEDBACK_DOC_ID = 'YOUR_DOC_ID';  // Replace with your Doc ID from step 1

function getFeedbackFromRequest(e) {
  if (!e) return '';
  if (e.parameter && e.parameter.feedback) return e.parameter.feedback;
  if (e.postData && e.postData.contents) {
    var params = {};
    e.postData.contents.split('&').forEach(function (pair) {
      var kv = pair.split('=');
      if (kv.length === 2) {
        var key = decodeURIComponent(kv[0].replace(/\+/g, ' '));
        var val = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
        params[key] = val;
      }
    });
    return params.feedback || '';
  }
  return '';
}

function doPost(e) {
  return appendFeedback(e);
}

function doGet(e) {
  return appendFeedback(e);
}

function appendFeedback(e) {
  try {
    e = e || {};
    var feedback = getFeedbackFromRequest(e);
    var doc = DocumentApp.openById(FEEDBACK_DOC_ID);
    var body = doc.getBody();
    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
    // Insert at top (index 0) so newest feedback appears first
    body.insertParagraph(0, feedback || '(no text)');
    body.insertParagraph(0, '--- ' + timestamp + ' ---');
    body.insertHorizontalRule(0);
    return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput('Error: ' + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}
```

4. **Replace `YOUR_DOC_ID`** with your actual Doc ID (keep the quotes).
5. Click **Save** (disk icon). Name the project if asked (e.g. "Feedback receiver").

---

## 3. Deploy as a web app

1. Click **Deploy** → **New deployment**.
2. Click the gear icon next to "Select type" → **Web app**.
3. Set:
   - **Description:** e.g. "Feedback form"
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**. Authorize the app when Google asks (allow access to your docs).
5. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/xxxxx/exec`).

---

## 4. Paste the URL into your site

The site sends feedback in the **URL query string** (e.g. `?feedback=...`) so the script receives it in `e.parameter.feedback`. This avoids POST-body issues with cross-origin requests.

1. Open **js/protestsigns.js** in your project.
2. Set `FEEDBACK_SCRIPT_URL` to the Web app URL you copied:

```javascript
var FEEDBACK_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

3. Save and upload your site.

---

Each submission will be appended to your Doc with a horizontal line, timestamp, and the feedback text. You never need to use "Extensions → Apps Script" inside the Doc.

---

## If the Doc doesn’t update

1. **Redeploy after changing the script**  
   After you paste the script or change `FEEDBACK_DOC_ID`, click **Deploy** → **Manage deployments** → pencil (Edit) → **Version** → **New version** → **Deploy**. The Web app URL stays the same.

2. **Confirm the Doc ID**  
   Open your Doc; the URL is `https://docs.google.com/document/d/DOC_ID/edit`. The `DOC_ID` must match exactly what’s in the script (no spaces, full length).

3. **Check Executions**  
   In the Apps Script editor: **Executions** (left sidebar). Submit feedback again and see if a run appears. If it shows an error, the message will point to the problem (e.g. wrong Doc ID or permission).

4. **Doc must be in your Drive**  
   The script runs as “Me”, so the Doc must be in the same Google account that owns the script (or shared with that account with edit access).
