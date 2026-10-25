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
  const { auth, authClient, sheets } = await initSheetsAuth();

  async function readAllRows() {
    const rows = await sheets.spreadsheets.values.get({
      spreadsheetId:`12DrdHMKU-QtPDR4x81sCk2WWyFv1hWn4iU1JzQU7pLM`,
      range: "Responses!A:F",
    });
    console.log(rows.data.values);
    return rows.data.values;
  }

  return { readAllRows };
}
