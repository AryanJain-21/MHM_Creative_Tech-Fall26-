import { google } from "googleapis";

/**
 * Initializes the Google sheets authentication object.
 * @returns the authentication object
 */
async function initSheetsAuth() {
  //Function for authentication object
  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  //Create client instance for auth
  const authClient = await auth.getClient();

  //Instance of the Sheets API
  const sheets = google.sheets({ version: "v4", auth: authClient });

  return {
    auth,
    authClient,
    sheets,
  };
}

export default async function SheetsDao() {
  const sheetId = process.env.SHEET_ID;
  const { auth, authClient, sheets } = await initSheetsAuth();

  async function readAllForms() {
    const rows = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Form Responses",
    });
    return rows.data.values
      .toSpliced(0, 1) // splices the header array
      .filter((arr) => arr.length != 0) // filters empty rows (if any)
      .map((arr) => {
        return {
          formId: arr[0],
          timestamp: arr[1],
          clientId: arr[2],
          referralDate: arr[3],
          patientName: arr[4],
          preferredLanguage: arr[5],
          referralType: arr[6],
          referralOtherMessage: arr[7],
          healthcareProviderType: arr[8],
          healthCareProviderOther: arr[9],
          socialServiceProviderType: arr[10],
          socialServiceProviderOther: arr[11],
          organizationName: arr[12],
          referralReason: arr[13],
          referralOutcomeConsent: arr[14],
          contactMethod: arr[15],
          phoneNumber: arr[16],
          phoneNumberPreferredContactMethod: arr[17],
          followupEmail: arr[18],
          otherContactInfo: arr[19],
          appointmentMade: arr[20],
          appointmentDate: arr[21],
        };
      });
  }

  async function getFormById(formId) {
    const formsObjs = await readAllForms();
    const form = formsObjs.filter((obj) => obj.formId == formId);
    return form.length === 0 ? null : form[0];
  }

  async function insertForm(form) {
    // note: form already be in the correct order if coming from frontend
    const responseValuesArray = Object.values(form);
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Form Responses",
      valueInputOption: "USER_ENTERED",
      includeValuesInResponse: true,
      requestBody: {
        values: [["", new Date(), "", ...responseValuesArray]], // leads with FormID Timestamp, and Email field population in the sheet
      },
    });
    return res.status;
  }

  return { readAllForms, getFormById, insertForm };
}
