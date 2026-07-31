# Permanent visit & download counter (Google Apps Script)

The site can show **one global count** for visits and downloads that never resets. Counts are stored in Google’s Script Properties (permanent; not daily/hourly).

You need a **separate** Apps Script project used only for the counter (same idea as the feedback script).

---

## 1. Create the counter script

1. Go to [script.google.com](https://script.google.com).
2. Click **New project**.
3. Delete any sample code and paste this:

```javascript
// Permanent counter: visits and downloads stored in Script Properties (no reset).
function doGet(e) {
  e = e || {};
  var params = e.parameter || {};
  var action = (params.action || '').toLowerCase();
  var callback = params.callback || ''; // For JSONP (works from any domain)
  var props = PropertiesService.getScriptProperties();

  function getCounts() {
    var v = parseInt(props.getProperty('cp_visits') || '0', 10);
    var d = parseInt(props.getProperty('cp_downloads') || '0', 10);
    return { visits: v, downloads: d };
  }

  function saveCounts(visits, downloads) {
    props.setProperty('cp_visits', String(visits));
    props.setProperty('cp_downloads', String(downloads));
  }

  var counts = getCounts();

  if (action === 'visit') {
    counts.visits += 1;
    saveCounts(counts.visits, counts.downloads);
  } else if (action === 'download') {
    counts.downloads += 1;
    saveCounts(counts.visits, counts.downloads);
  }

  var body = JSON.stringify(counts);
  if (callback) {
    body = callback + '(' + body + ')';
    return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}
```

4. Click **Save**. Name the project (e.g. "Curious Paisley counter").

---

## 2. Deploy as web app

1. Click **Deploy** → **New deployment**.
2. Click the gear → **Web app**.
3. Set:
   - **Execute as:** Me  
   - **Who has access:** Anyone  
4. Click **Deploy**, authorize if asked, then copy the **Web app URL** (e.g. `https://script.google.com/macros/s/xxxxx/exec`).

---

## 3. Add the URL to your site

1. Open **js/protestsigns.js**.
2. Set `COUNTER_SCRIPT_URL` to the URL you copied (same block as `FEEDBACK_SCRIPT_URL`):

```javascript
var COUNTER_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_COUNTER_SCRIPT_ID/exec';
```

3. Save and re-upload the site.

The footer will then show the **permanent** visit and download totals from this script. If `COUNTER_SCRIPT_URL` is empty, the site falls back to local-only counts (per browser).

**Cross-origin:** The site uses `fetch()` to call the counter. Google Apps Script does not send CORS headers, so if your site is on another domain (e.g. GitHub Pages, Netlify), the browser may block the request and the footer will show local counts instead. The site will not crash.

---

## Check the numbers (Logger)

Add this function to the **same** Apps Script project (paste it below `doGet`). Then run it to see the current counts in the log:

```javascript
// Run this in the editor to log current visits & downloads. View: View → Logs (or Executions).
function logCounts() {
  var props = PropertiesService.getScriptProperties();
  var v = parseInt(props.getProperty('cp_visits') || '0', 10);
  var d = parseInt(props.getProperty('cp_downloads') || '0', 10);
  Logger.log('Visits: %s, Downloads: %s', v, d);
}
```

**How to run:** In the Apps Script editor, select the function **logCounts** in the dropdown at the top, click **Run** (▶). Then open **View** → **Logs** (or **Executions**) to see the output. You don’t need to redeploy the web app for this; it only reads Script Properties.

---

## Notes

- **Script Properties** do not expire; counts are permanent until you clear them in the script.
- Redeploy: **Deploy** → **Manage deployments** → Edit → **New version** → **Deploy** after any script change (URL stays the same).
