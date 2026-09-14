/**
 * Google Apps Script Backend for Navodaya Open 2026 Badminton Tournament
 * 
 * Spreadsheet Schema (17 Columns):
 *  1. Timestamp                 2. Full Name              3. Phone Number
 *  4. Email Address             5. Iqama / ID Number      6. Gender
 *  7. Date of Birth             8. Nationality            9. City / Club Name
 * 10. Event Category           11. Level / Flight        12. Partner Name
 * 13. Partner Contact          14. Partner Iqama / ID    15. Partner Gender
 * 16. Partner Date of Birth    17. Partner Nationality
 * 
 * Core Rules & Validations Enforced:
 * 1. Required Field Validation: Validates all mandatory inputs for Main Player and Partner.
 * 2. Iqama / ID Duplicate Check: Prevents identical Iqama/ID from registering twice in the same category.
 * 3. Max 3 Entries Limit: Enforces max 3 category participations per individual player (by Iqama/ID).
 * 4. Nearest Level Rule: Restricts multi-category entries to adjacent/nearest levels (within 1 flight step).
 * 
 * Deployment Instructions:
 * 1. Open Google Sheets (https://sheets.google.com).
 * 2. Create a new Spreadsheet and name it (e.g. "Navodaya Open 2026 Registrations").
 * 3. Go to "Extensions" > "Apps Script".
 * 4. Delete any existing code in the editor, and paste this entire file content.
 * 5. Save the project (click the disk icon).
 * 6. Click "Deploy" > "New deployment" (top right).
 * 7. Click the gear icon (Select type) and choose "Web app".
 * 8. Set deployment settings:
 *    - Description: "Navodaya Open 2026 Registration Backend v2"
 *    - Execute as: "Me (your-email@gmail.com)"
 *    - Who has access: "Anyone"
 * 9. Click "Deploy". Authorize permissions if prompted (Advanced > Go to Untitled project > Allow).
 * 10. Copy the "Web app URL" provided and set `SCRIPT_URL` at the top of `app.js`.
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
    const nationality = data.nationality ? String(data.nationality).trim() : '';
    const club = data.club ? String(data.club).trim() : '';
    const category = data.category ? String(data.category).trim() : '';
    const flight = data.flight ? String(data.flight).trim() : '';
    const partnerName = data.partnerName ? String(data.partnerName).trim() : '';
    const partnerPhone = data.partnerPhone ? String(data.partnerPhone).trim() : '';
    const partnerIqama = data.partnerIqama ? String(data.partnerIqama).trim() : '';
    const partnerGender = data.partnerGender ? String(data.partnerGender).trim() : '';
    const partnerDob = data.partnerDob ? String(data.partnerDob).trim() : '';
    const partnerNationality = data.partnerNationality ? String(data.partnerNationality).trim() : '';

    // 3. Validation
    if (!name || !phone || !email || !iqama || !gender || !dob || !nationality || !category || !flight) {
      return jsonResponse('error', 'Validation failed. Please ensure all required fields are filled.');
    }

    const isDoubles = category.toLowerCase().includes('doubles') || category.length > 0;
    if (isDoubles) {
      if (!partnerName || !partnerPhone || !partnerIqama || !partnerGender || !partnerDob || !partnerNationality) {
        return jsonResponse('error', 'Validation failed. Partner details (Name, Contact, Iqama, Gender, DOB, Nationality) are required for doubles entries.');
      }
    }

    // 4. Open the active spreadsheet and the sheet named "Registrations" (or create it if it doesn't exist)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Registrations");
    
    if (!sheet) {
      sheet = ss.insertSheet("Registrations");
    }

    // 5. Always ensure Row 1 has all 17 column headers styled properly
    const headers = [
      "Timestamp",
      "Full Name",
      "Phone Number",
      "Email Address",
      "Iqama / ID Number",
      "Gender",
      "Date of Birth",
      "Nationality",
      "City / Club Name",
      "Event Category",
      "Level / Flight",
      "Partner Name",
      "Partner Contact",
      "Partner Iqama / ID Number",
      "Partner Gender",
      "Partner Date of Birth",
      "Partner Nationality"
    ];

    sheet.getRange(1, 1, 1, 17).setValues([headers]);
    const headerRange = sheet.getRange(1, 1, 1, 17);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#e5e7eb");
    sheet.setFrozenRows(1);

    // 6. Iqama / ID Validation & Max Category / Level Checks
    if (sheet.getLastRow() > 1) {
      const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 17).getValues();

      if (isDoubles && partnerIqama && iqama === partnerIqama) {
        return jsonResponse('error', 'Main player and Partner cannot have the same Iqama / ID number.');
      }

      const openFlightRanks = {
        "International": 0,
        "Premiere": 1,
        "Championship": 2,
        "F1": 3,
        "F2": 4,
        "F3": 5,
        "F4": 6,
        "F5": 7,
        "F6": 8
      };

      const juniorFlightRanks = {
        "Under 9": 0,
        "Under 11": 1,
        "Under 13": 2,
        "Under 15": 3,
        "Under 17": 4
      };

      function validatePlayerEntry(playerId, playerNameLabel) {
        if (!playerId) return null;

        let categoryCount = 0;
        let existingFlights = [];

        for (let i = 0; i < rows.length; i++) {
          const rowMainIqama = String(rows[i][4]).trim();
          const rowPartnerIqama = String(rows[i][13]).trim();
          const rowCategory = String(rows[i][9]).trim();
          const rowFlight = String(rows[i][10]).trim();

          const isMain = rowMainIqama === playerId;
          const isPartner = rowPartnerIqama === playerId;

          if (isMain || isPartner) {
            categoryCount++;
            existingFlights.push(rowFlight);

            // A) Check duplicate category
            if (rowCategory === category) {
              return `${playerNameLabel} (Iqama/ID: ${playerId}) is already registered in the event category "${category}".`;
            }
          }
        }

        // B) Check max 3 categories
        if (categoryCount >= 3) {
          return `${playerNameLabel} (Iqama/ID: ${playerId}) has already reached the maximum limit of 3 event category entries.`;
        }

        // C) Check nearest level requirement (within 1 flight step up or down of nearest existing entry)
        const currentOpenRank = openFlightRanks[flight];
        const currentJuniorRank = juniorFlightRanks[flight];

        if (existingFlights.length > 0) {
          let minOpenDiff = Infinity;
          let minJuniorDiff = Infinity;
          let hasOpenCompare = false;
          let hasJuniorCompare = false;

          for (let j = 0; j < existingFlights.length; j++) {
            const prevFlight = existingFlights[j];

            if (currentOpenRank !== undefined && openFlightRanks[prevFlight] !== undefined) {
              hasOpenCompare = true;
              const diff = Math.abs(currentOpenRank - openFlightRanks[prevFlight]);
              if (diff < minOpenDiff) minOpenDiff = diff;
            }

            if (currentJuniorRank !== undefined && juniorFlightRanks[prevFlight] !== undefined) {
              hasJuniorCompare = true;
              const diff = Math.abs(currentJuniorRank - juniorFlightRanks[prevFlight]);
              if (diff < minJuniorDiff) minJuniorDiff = diff;
            }
          }

          if (hasOpenCompare && minOpenDiff > 1) {
            return `Level selection mismatch for ${playerNameLabel}. Your chosen level (${flight}) is not at the nearest/adjacent level of your existing entry level (${existingFlights.join(', ')}). Level selection must be at the same or adjacent level (within 1 flight step).`;
          }

          if (hasJuniorCompare && minJuniorDiff > 1) {
            return `Level selection mismatch for ${playerNameLabel}. Your chosen level (${flight}) is not at the nearest/adjacent level of your existing junior entry (${existingFlights.join(', ')}).`;
          }
        }

        return null;
      }

      // Validate Main Player
      const mainError = validatePlayerEntry(iqama, 'Main Player');
      if (mainError) {
        return jsonResponse('error', mainError);
      }

      // Validate Partner (if doubles)
      if (isDoubles && partnerIqama) {
        const partnerError = validatePlayerEntry(partnerIqama, 'Partner');
        if (partnerError) {
          return jsonResponse('error', partnerError);
        }
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
      nationality,
      club,
      category,
      flight,
      partnerName,
      partnerPhone,
      partnerIqama,
      partnerGender,
      partnerDob,
      partnerNationality
    ]);

    // 9. Auto-adjust columns to fit content widths
    sheet.autoResizeColumns(1, 17);

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


