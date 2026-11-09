import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";

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

  /**
   * Helper function to get all rows from the spreadsheet (including headers and deleted records).
   * Used for row indexing/filtering purposes
   */
  async function getAllRows() {
    const rows = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "UI Responses",
    });
    return rows.data.values;
  }

  /**
   * Helper function used to find the row which holds the provided form. Matches with formId
   */
  async function findFormRow(formId) {
    // array index n --> row index n + 1 (to shift to sheets' 1-start)
    const rows = await getAllRows();
    const index = rows.findIndex((arr) => arr[0] === formId);
    // defensive check for valid index
    return index == -1 ? -1 : index + 1;
  }

  async function readAllForms() {
    const rows = await getAllRows();
    return rows
      .toSpliced(0, 1) // splices the header array
      .filter((arr) => arr.length != 0 && arr[0] !== "deleted") // filters empty/deleted rows (if any)
      .map((arr) => {
        return {
          // mapping necessary to convert from array to object
          formId: arr[0],
          timestamp: arr[1],
          email: arr[2],
          clientId: arr[3],
          referralDate: arr[4],
          patientName: arr[5],
          preferredLanguage: arr[6],
          referralType: arr[7],
          healthcareProviderType: arr[8],
          socialServiceProviderType: arr[9],
          organizationName: arr[10],
          referralReason: arr[11],
          referralOutcomeConsent: arr[12],
          contactMethod: arr[13],
          phoneNumber: arr[14],
          phoneNumberPreferredContactMethod: arr[15],
          followupEmail: arr[16],
          otherContactInfo: arr[17],
          appointmentMade: arr[18],
          appointmentDate: arr[19],
          referralStatus: arr[20],
          createdDate: arr[21],
          updatedDate: arr[22],
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
    const newId = uuidv4();
    const formInsertObj = formatFormObject({
      ...form,
      formId: newId,
      createdDate: new Date(),
    });
    const responseValuesArray = Object.values(formInsertObj);
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "UI Responses",
      valueInputOption: "USER_ENTERED",
      includeValuesInResponse: true,
      requestBody: {
        values: [responseValuesArray], // leads with FormID Timestamp, and Email field population in the sheet
      },
    });
    if (!res.ok) {
      return { error: 500, message: "Form insert unsuccessful" };
    }
    return newId;
  }

  async function deleteForm(formId) {
    const row = await findFormRow(formId);

    if (row == -1) {
      return { error: 400, message: `Form with ID ${formId} not found.` };
    }

    const res = await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: `UI Responses!${row}:${row}`,
    });

    if (res.status !== 200) {
      return {
        error: 500,
        message: `Deleting form with ID ${formId} unsuccessful`,
      };
    }

    // The deleted row has to contain a placeholder 'deleted value' since spreadsheet.values.get() skips empty rows
    // and would therefore break row-counting
    const deleteMsgRes = await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `UI Responses!${row}:${row}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["deleted"]],
      },
    });
    if (!deleteMsgRes.ok) {
      return {
        error: 500,
        message: `Populating row ${row} with 'deleted' message failed.`,
        rowNumber: row,
      };
    }
    return {
      status: 200,
      message: `Successfully deleted form with ID ${formId}`,
    };
  }

  /**
   * Formats an object with the fields in proper order for insertion to the spreadsheet.
   * @param {object} form the form to be formatted.
   */
  function formatFormObject(form) {
    return {
      formId: form.formId,
      timestamp: form.timestamp,
      email: form.email,
      clientId: form.clientId,
      referralDate: form.referralDate,
      patientName: form.patientName,
      preferredLanguage: form.preferredLanguage,
      referralType: form.referralType,
      healthcareProviderType: form.healthcareProviderType,
      socialServiceProviderType: form.socialServiceProviderType,
      organizationName: form.organizationName,
      referralReason: form.referralReason,
      referralOutcomeConsent: form.referralOutcomeConsent,
      contactMethod: form.contactMethod,
      phoneNumber: form.phoneNumber,
      phoneNumberPreferredContactMethod: form.phoneNumberPreferredContactMethod,
      followupEmail: form.followupEmail,
      otherContactInfo: form.otherContactInfo,
      appointmentMade: form.appointmentMade,
      appointmentDate: form.appointmentDate,
      referralStatus: form.referralStatus,
      createdDate: form.createdDate,
      updatedDate: form.updatedDate,
    };
  }

  async function updateForm(formUpdates) {
    const form = await getFormById(formUpdates.formId);
    if (!form) {
      return {
        error: 400,
        message: `Form with ID ${formUpdates.formId} not found.`,
      };
    }
    const row = await findFormRow(formUpdates.formId);
    // updatedForm does not follow the same field order.
    const updatedForm = formatFormObject({
      ...form,
      ...formUpdates,
      updatedDate: new Date(),
    });
    const res = await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      valueInputOption: "RAW",
      range: `UI Responses!${row}:${row}`,
      requestBody: {
        values: [Object.values(updatedForm)],
      },
    });
    if (!res.ok) {
      return {
        error: 500,
        message: `Updating form with ID ${formUpdates.formId} unsuccessful.`,
      };
    }
    return res;
  }

  return { readAllForms, getFormById, insertForm, deleteForm, updateForm };
}
