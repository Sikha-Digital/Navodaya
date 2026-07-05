/**
 * Google Apps Script Backend for Registration Form
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.google.com).
 * 2. Create a new Spreadsheet and name it (e.g. "User Registrations").
 * 3. Go to "Extensions" > "Apps Script".
 * 4. Delete any code in the editor, and paste this entire code block.
 * 5. Save the project (click the disk icon).
 * 6. Click "Deploy" > "New deployment" (top right).
 * 7. Click the gear icon (Select type) and choose "Web app".
 * 8. Set the settings:
 *    - Description: "Registration Form Backend"
 *    - Execute as: "Me (your-email@gmail.com)"
 *    - Who has access: "Anyone"
 * 9. Click "Deploy". Authorize permissions if prompted (Go to Advanced > Go to Untitled Project (unsafe) > Allow).
 * 10. Copy the "Web app URL" provided in the deployment confirmation modal.
 * 11. Paste this URL into the `SCRIPT_URL` variable at the top of your `app.js` file.
 */

function doPost(e) {
  // Setup CORS-compatible JSON output helper
  function jsonResponse(status, message, extraData = {}) {
    const response = {
      status: status,
      message: message,
      ...extraData
    };
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // 1. Check if postData is received
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse('error', 'No post data received in request.');
    }

    // 2. Parse the JSON payload sent from the form
    // Note: We sent it as 'text/plain' to bypass CORS preflight checks, which makes e.postData.contents a raw JSON string.
    const data = JSON.parse(e.postData.contents);
    
    const name = data.name ? String(data.name).trim() : '';
    const phone = data.phone ? String(data.phone).trim() : '';
    const area = data.area ? String(data.area).trim() : '';
    const unit = data.unit ? String(data.unit).trim() : '';

    // 3. Validation
    if (!name || !phone || !area || !unit) {
      return jsonResponse('error', 'Validation failed. All fields (name, phone, area, unit) are required.');
    }

    // 4. Open the active spreadsheet and the sheet named "Registrations" (or create it if it doesn't exist)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Registrations");
    
    if (!sheet) {
      sheet = ss.insertSheet("Registrations");
    }

    // 5. If sheet is new/empty, write header columns
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Full Name", "Phone Number", "Area / Region", "Unit / Block"]);
      // Style the header row (Bold text, medium-grey background)
      const headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#e5e7eb");
      sheet.setFrozenRows(1);
    }

    // 6. Generate timezone-adjusted Timestamp
    const timestamp = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM-dd HH:mm:ss");

    // 7. Append registration data as a new row
    sheet.appendRow([timestamp, name, phone, area, unit]);

    // 8. Auto-adjust columns to fit content widths
    sheet.autoResizeColumns(1, 5);

    // 9. Return success status
    return jsonResponse('success', 'Registration saved successfully.', {
      timestamp: timestamp,
      insertedRow: sheet.getLastRow()
    });

  } catch (error) {
    // Return error status if anything breaks
    return jsonResponse('error', 'Internal server error: ' + error.toString());
  }
}

/**
 * Handle GET requests (optional, useful for testing the endpoint in the browser)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Registration API endpoint is active. Use HTTP POST to send registrations.'
  })).setMimeType(ContentService.MimeType.JSON);
}
