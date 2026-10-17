# Contact Us Form → Google Sheets

A responsive HTML contact form that saves every submission directly into a Google Sheet using Google Apps Script. No backend server or database is needed.

---

## 1. Project Description

This project is a "Contact Us" web form built with plain HTML, CSS, and JavaScript. When a visitor fills in the form and clicks **GET IN TOUCH**, the details are validated in the browser and then sent to a Google Apps Script Web App, which adds them as a new row in a Google Sheet.

### Features

- Fields: First Name, Last Name, Email, Phone Number, Preferred Method of Contact, Your Inquiry
- Client-side validation (required fields, email format, phone format)
- Phone number becomes required when "Phone" is chosen as the contact method
- Success and error messages shown on the page
- Responsive layout for desktop and mobile
- Automatic timestamp for every submission

### Technologies Used

- HTML5, CSS3, JavaScript (no frameworks)
- Google Apps Script
- Google Sheets
- Google Fonts (Nunito Sans)

### Project Structure

```
project-folder/
├── index.html    # Form layout
├── style.css     # Styling and responsive design
├── script.js     # Validation and sending data to Google Sheets
└── README.md     # Project documentation
```

---

## 2. Creator Details

| | |
|---|---|
| **Name** | Your Full Name |
| **Role** | Developer / Student |
| **Email** | your.email@example.com |
| **Phone** | +94 XX XXX XXXX |
| **Location** | Colombo, Sri Lanka |
| **GitHub** | https://github.com/your-username |
| **LinkedIn** | https://linkedin.com/in/your-profile |

> Replace the values above with your own details.

---

## 3. Google Sheet Table Format

Create a new Google Sheet and add these headers in **Row 1**, in this exact order. The script writes data column by column, so the order matters.

| Column | Header | Description | Example |
|--------|--------|-------------|---------|
| A | Timestamp | Date and time of submission (added automatically) | 18/10/2026 10:30:00 |
| B | First Name | Visitor's first name | Nimal |
| C | Last Name | Visitor's last name | Perera |
| D | Email | Visitor's email address | nimal@example.com |
| E | Phone | Phone number (optional) | +94 77 123 4567 |
| F | Contact Method | Email or Phone | Email |
| G | Inquiry | Message from the visitor | I would like more details... |

Each form submission adds one new row below the last filled row.

---

## 4. How to Complete the Project (Step by Step)

### Step 1: Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a blank spreadsheet.
2. Name it, for example, `Contact Form Data`.
3. Add the headers from the table in Section 3 into Row 1.

### Step 2: Create the Apps Script

1. In the Sheet, click **Extensions → Apps Script**.
2. A new tab opens with a file named `Code.gs`. Delete all the existing code.
3. Paste this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const p = e.parameter;

    sheet.appendRow([
      new Date(),
      p.firstName || '',
      p.lastName || '',
      p.email || '',
      p.phone || '',
      p.contactMethod || '',
      p.inquiry || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you test the URL in a browser
function doGet() {
  return ContentService.createTextOutput('Script is working');
}
```

4. Click the **Save** icon.

### Step 3: Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set these options:
   - **Execute as:** Me
   - **Who has access:** **Anyone**
4. Click **Deploy**.
5. Click **Authorize access**, choose your Google account, and allow the permissions.
   - If you see "Google hasn't verified this app", click **Advanced → Go to project (unsafe)**.
6. Copy the **Web app URL**. It must end with `/exec`.

### Step 4: Test the deployment

Paste the Web app URL into your browser. If you see:

```
Script is working
```

the deployment is correct. If you see a Google login page or an error, go back to Step 3 and make sure access is set to **Anyone**.

### Step 5: Connect the form

Open `script.js` and put your URL on the first line:

```javascript
const SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE/exec';
```

### Step 6: Run the project

Do not double-click `index.html`. Use a local server:

- **VS Code:** install the **Live Server** extension, right-click `index.html`, and choose **Open with Live Server**.
- **Or Python:** run `python -m http.server 8000` in the project folder and open `http://localhost:8000`.

### Step 7: Submit a test entry

1. Fill in the form and click **GET IN TOUCH**.
2. You should see: *"Thank you! We will get in touch soon."*
3. Open your Google Sheet. A new row should appear.

---

## Updating the Apps Script Later

If you change the Apps Script code, saving is not enough. You must publish a new version:

1. **Deploy → Manage deployments**
2. Click the pencil icon (Edit)
3. Set **Version** to **New version**
4. Click **Deploy**

The URL stays the same.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Network or CORS error | Set access to **Anyone** and use the `/exec` URL, not `/dev` |
| Script changes have no effect | Deploy a **New version** (see above) |
| `Unexpected token <` error | The script returned an HTML error page. Recheck the deployment and make sure `doPost` exists |
| Nothing appears in the sheet | Open Apps Script from the correct Sheet using **Extensions → Apps Script** |
| Data saves but the page shows an error | Use the `no-cors` fallback below |

### `no-cors` fallback

If data reaches the sheet but the browser still shows a CORS error, replace the `try` block in `script.js` with:

```javascript
try {
    await fetch(SCRIPT_URL, { method: 'POST', body: data, mode: 'no-cors' });
    showStatus('Thank you! We will get in touch soon.', 'ok');
    form.reset();
} catch (err) {
    console.error(err);
    showStatus('Network error. Please try again.', 'fail');
} finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'GET IN TOUCH';
}
```

With `no-cors` the response cannot be read, but the data is still saved.

To see the exact error, press **F12 → Console**, submit the form, and read the red message.

---

## License

This project is free to use for learning and personal projects.