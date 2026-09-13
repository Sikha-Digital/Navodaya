# Navodaya Open 2026 - International Badminton Tournament Registration

A mobile-first entry & invitation portal with a glassmorphic dark-theme user interface designed for the **Navodaya Open 2026 International Badminton Tournament**. Submits registration details directly into Google Sheets via serverless Google Apps Script.

## Features
- **Badminton Tournament Branding:** Animated shuttlecock badge header, energetic dark neon violet theme, and Outfit typography.
- **Dynamic Event Categories & Doubles Partner Details:** Automatically reveals Partner Name & Contact fields when Doubles categories (Men's, Women's, Mixed, Veterans) are selected.
- **Comprehensive Entry Fields:** Collects Full Name, Phone / WhatsApp, Email, Country/Club, Event Category, Flight/Grade Level, Partner Details, Navodaya Area/Unit (or Guest/International player), and Jersey / T-Shirt Size.
- **Client & Server Validation:** Ensures phone number formats, valid emails, and required tournament fields are validated before submission.
- **Serverless Google Sheets Backend:** Appends tournament entries into a structured 12-column spreadsheet row with auto-timestamping.

---

## File Architecture
- [index.html](file:///f:/Navo/index.html) - Registration layout with tournament headers, categories, partner section, comboboxes, and confirmation screen.
- [style.css](file:///f:/Navo/style.css) - Contains responsive rules, glassmorphism, partner drawer animation, floating labels, and badge styling.
- [app.js](file:///f:/Navo/app.js) - Handles input validation, combobox events, dynamic doubles partner toggling, and API submissions.
- [backend.js](file:///f:/Navo/backend.js) - Google Apps Script backend code for receiving POST submissions and mapping rows in Google Sheets.

