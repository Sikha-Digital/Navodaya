# Navodaya Workshop - Participant Registration

A highly responsive, mobile-first registration web portal with a sleek, glassmorphic dark-theme user interface. This registration system submits details directly into a Google Spreadsheet using a serverless Google Apps Script backend.

## Features
- **Aesthetic Glassmorphic UI:** Built with animated background blur-blobs,Outfit Google typography, and custom SVG input icons.
- **Micro-Animations:** Interactive floating labels, smooth card transitions, a submit loading spinner, and an animated checkmark success pulse.
- **Robust Client-Side Validation:** Validates required fields and enforces standard phone number formats before sending API requests.
- **Serverless Backend:** Utilizes a Google Apps Script endpoint to securely append user data as structured rows with automatic timestamping.
- **Preflight CORS Bypass:** Configured with simple POST headers to prevent browser-side preflight (OPTIONS) network delays or blockages.

---

## Getting Started

### Step 1: Set up Google Sheets & Apps Script
1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet. Name it something descriptive, like `User Registrations`.
2. In the top menu bar, navigate to **Extensions** > **Apps Script**.
3. Clear any boilerplate code inside the editor.
4. Open the [backend.js](file:///f:/Navo/backend.js) file from this project, copy its entire contents, and paste it into the Apps Script editor.
5. Click the **Save** (disk) icon or press `Ctrl + S`.
6. Click **Deploy** (top right) > **New deployment**.
7. Click the gear icon next to "Select type" and choose **Web app**.
8. Fill out the configuration fields:
   - **Description:** `User Registration API`
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone` *(Note: Setting this to "Anyone" is required so the frontend form can submit data to it without logging in to Google)*.
9. Click **Deploy**.
10. If prompted, click **Authorize Access** and select your Google account. Click **Advanced** > **Go to Untitled project (unsafe)** > **Allow** to grant permission to modify your spreadsheet.
11. Once deployed, copy the **Web app URL** from the success screen. It will look like this:
    `https://script.google.com/macros/s/AKfycb.../exec`

### Step 2: Configure the Frontend URL
1. Open [app.js](file:///f:/Navo/app.js) in your text editor.
2. Locate the `SCRIPT_URL` constant on line 6:
   ```javascript
   const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'` with the **Web app URL** you copied in Step 1.
4. Save the file.

### Step 3: Run the Registration Portal
To run the project locally:
1. Double-click the [index.html](file:///f:/Navo/index.html) file to open it in any web browser, or use a local development server (like VS Code Live Server).
2. Enter mock data into the fields:
   - **Full Name:** `John Doe`
   - **Phone Number:** `+1 555-0199`
   - **Select Area:** `Dammam Town`
   - **Select Unit:** `Adama`
3. Click **Submit Registration**.
4. The button will state "Submitting..." and show a loading spinner.
5. Upon a successful response, the form will fade out and animate a green success checkmark card.
6. Open your Google Sheet to see the row `[Timestamp, John Doe, +1 555-0199, North District, Suite 201]` populated!

---

## File Architecture
- [index.html](file:///f:/Navo/index.html) - Structural framework containing the form elements, error displays, and success confirmation layout.
- [style.css](file:///f:/Navo/style.css) - Contains all layout styling, responsive rules, colors, floating label logic, and animated keyframes.
- [app.js](file:///f:/Navo/app.js) - Handles input validation, UI transitions, response handlers, and the fetch request to the Web App API.
- [backend.js](file:///f:/Navo/backend.js) - The Apps Script code containing Google Sheet mapping logic (Copy-paste to Google Apps Script).
