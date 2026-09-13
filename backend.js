/**
 * Google Apps Script Backend for Navodaya Open 2026 Badminton Tournament
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.google.com).
 * 2. Create a new Spreadsheet and name it (e.g. "Navodaya Open 2026 Registrations").
 * 3. Go to "Extensions" > "Apps Script".
 * 4. Delete any code in the editor, and paste this entire code block.
 * 5. Save the project (click the disk icon).
 * 6. Click "Deploy" > "New deployment" (top right).
 * 7. Click the gear icon (Select type) and choose "Web app".
 * 8. Set the settings:
 *    - Description: "Navodaya Open 2026 Registration Backend"
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
    const data = JSON.parse(e.postData.contents);
    
    const name = data.name ? String(data.name).trim() : '';
    const phone = data.phone ? String(data.phone).trim() : '';
    const email = data.email ? String(data.email).trim() : '';
    const iqama = data.iqama ? String(data.iqama).trim() : '';
    const gender = data.gender ? String(data.gender).trim() : '';
    const dob = data.dob ? String(data.dob).trim() : '';
    const club = data.club ? String(data.club).trim() : '';
    const category = data.category ? String(data.category).trim() : '';
    const flight = data.flight ? String(data.flight).trim() : '';
    const partnerName = data.partnerName ? String(data.partnerName).trim() : '';
    const partnerPhone = data.partnerPhone ? String(data.partnerPhone).trim() : '';
    const partnerIqama = data.partnerIqama ? String(data.partnerIqama).trim() : '';
    const partnerGender = data.partnerGender ? String(data.partnerGender).trim() : '';
    const partnerDob = data.partnerDob ? String(data.partnerDob).trim() : '';

    // 3. Validation
    if (!name || !phone || !email || !iqama || !gender || !dob || !category || !flight) {
      return jsonResponse('error', 'Validation failed. Please ensure all required fields are filled.');
    }

    // 4. Open the active spreadsheet and the sheet named "Registrations" (or create it if it doesn't exist)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Registrations");
    
    if (!sheet) {
      sheet = ss.insertSheet("Registrations");
    }

    // 5. Always ensure Row 1 has all 15 column headers styled properly
    const headers = [
      "Timestamp",
      "Full Name",
      "Phone Number",
      "Email Address",
      "Iqama / ID Number",
      "Gender",
      "Date of Birth",
      "Country / Club",
      "Event Category",
      "Level / Flight",
      "Partner Name",
      "Partner Contact",
      "Partner Iqama / ID Number",
      "Partner Gender",
      "Partner Date of Birth"
    ];

    sheet.getRange(1, 1, 1, 15).setValues([headers]);
    const headerRange = sheet.getRange(1, 1, 1, 15);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#e5e7eb");
    sheet.setFrozenRows(1);

    // 6. Check for duplicate phone number in current category
    if (sheet.getLastRow() > 1) {
      const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).getValues();
      const duplicateExists = rows.some(row => {
        const rowPhone = String(row[2]).trim();
        const rowCategory = String(row[8]).trim();
        return rowPhone === phone && rowCategory === category;
      });
      if (duplicateExists) {
        return jsonResponse('error', 'This mobile number is already registered for this event category.');
      }
    }

    // 7. Generate timezone-adjusted Timestamp
    const timestamp = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM-dd HH:mm:ss");

    // 8. Append registration data as a new row
    sheet.appendRow([
      timestamp,
      name,
      phone,
      email,
      iqama,
      gender,
      dob,
      club,
      category,
      flight,
      partnerName,
      partnerPhone,
      partnerIqama,
      partnerGender,
      partnerDob
    ]);

    // 9. Auto-adjust columns to fit content widths
    sheet.autoResizeColumns(1, 15);

    // 10. Return success status
    return jsonResponse('success', 'Tournament entry saved successfully.', {
      timestamp: timestamp,
      insertedRow: sheet.getLastRow()
    });

  } catch (error) {
    return jsonResponse('error', 'Internal server error: ' + error.toString());
  }
}

/**
 * Handle GET requests (optional, useful for testing the endpoint in the browser)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Navodaya Open 2026 Registration API endpoint is active. Use HTTP POST to send registrations.'
  })).setMimeType(ContentService.MimeType.JSON);
}


