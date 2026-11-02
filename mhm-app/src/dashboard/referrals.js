// Referral data model and helpers. Field options mirror the
// "FINISH HERE Referrals" REDCap form.

export const STATUSES = ["New", "Contacted", "Scheduled", "Completed"];

export const STATUS_HELP = {
  New: "Not reached out yet",
  Contacted: "Patient has been reached",
  Scheduled: "Appointment is booked",
  Completed: "Patient was seen",
};

export const REFERRAL_TYPES = ["Health care", "Social service", "Other"];

export const HEALTH_PROVIDERS = [
  "Primary care",
  "Urgent care",
  "Emergency room",
  "Ambulance",
  "Specialist",
  "Other",
];

export const SOCIAL_PROVIDERS = [
  "Education",
  "Employment",
  "Food",
  "Housing",
  "Violence",
  "Other",
];

export const CONTACT_METHODS = ["Phone", "Email", "Other"];
export const PHONE_PREFERENCES = ["Call", "Text"];
export const YES_NO = ["Yes", "No"];

// Headline funnel, built only from questions the referral sheet asks.
export const FUNNEL = [
  { key: "all", label: "Referrals made", match: () => true },
  {
    key: "contact",
    label: "Okay to follow up",
    match: (r) => r.okToContact === "Yes",
  },
  {
    key: "appointment",
    label: "Appointment booked",
    match: (r) => r.appointmentMade === "Yes",
  },
];

export const EMPTY_REFERRAL = {
  id: null,
  clientId: "",
  date: "",
  patient: "",
  language: "",
  type: "Health care",
  healthProvider: "",
  socialProvider: "",
  otherType: "",
  organization: "",
  reason: "",
  okToContact: "",
  contactMethod: "",
  phone: "",
  phonePreference: [],
  email: "",
  otherContact: "",
  appointmentMade: "",
  appointmentDate: "",
  status: "New",
  notes: "",
};

function sample(fields) {
  return { ...EMPTY_REFERRAL, ...fields };
}

// Dummy data for now. Swap this for a fetch to express-api later.
export const SAMPLE_REFERRALS = [
  sample({ id: 1, clientId: "FV-10231", date: "2026-10-30", patient: "Maria Lopez", language: "Spanish", type: "Health care", healthProvider: "Primary care", organization: "Whittier Street Health Center", reason: "High blood pressure reading at screening", okToContact: "Yes", contactMethod: "Phone", phone: "617-555-0142", phonePreference: ["Call", "Text"], appointmentMade: "No", status: "New" }),
  sample({ id: 2, clientId: "FV-10198", date: "2026-10-29", patient: "James Carter", language: "English", type: "Health care", healthProvider: "Specialist", organization: "Codman Square Health Center Dental", reason: "Tooth pain, no current dentist", okToContact: "Yes", contactMethod: "Phone", phone: "617-555-0177", phonePreference: ["Call"], appointmentMade: "No", status: "Contacted", notes: "Left voicemail 10/30, called back 10/31" }),
  sample({ id: 3, clientId: "FV-10044", date: "2026-10-27", patient: "Linh Nguyen", language: "Vietnamese", type: "Health care", healthProvider: "Specialist", organization: "New England Eye Commonwealth", reason: "Blurry vision, needs eye exam", okToContact: "Yes", contactMethod: "Phone", phone: "617-555-0109", phonePreference: ["Text"], appointmentMade: "Yes", appointmentDate: "2026-11-06", status: "Scheduled" }),
  sample({ id: 4, clientId: "FV-10307", date: "2026-10-26", patient: "Andre Baptiste", language: "Haitian Creole", type: "Health care", healthProvider: "Other", otherType: "Behavioral health counseling", organization: "Mattapan Community Health Center", reason: "Asked for help with stress and sleep", okToContact: "Yes", contactMethod: "Email", email: "andre.b@example.com", appointmentMade: "No", status: "New" }),
  sample({ id: 5, clientId: "FV-09982", date: "2026-10-24", patient: "Fatima Hassan", language: "Somali", type: "Social service", socialProvider: "Food", organization: "Greater Boston Food Bank", reason: "Food assistance enrollment", okToContact: "Yes", contactMethod: "Phone", phone: "617-555-0163", phonePreference: ["Call"], appointmentMade: "No", status: "Completed", notes: "Enrolled in SNAP" }),
  sample({ id: 6, clientId: "FV-10012", date: "2026-10-22", patient: "Robert Kim", language: "Korean", type: "Health care", healthProvider: "Primary care", organization: "South Cove Community Health Center", reason: "Elevated blood sugar", okToContact: "Yes", contactMethod: "Phone", phone: "617-555-0128", phonePreference: ["Call"], appointmentMade: "Yes", appointmentDate: "2026-11-04", status: "Scheduled" }),
  sample({ id: 7, clientId: "FV-10255", date: "2026-10-21", patient: "Keisha Brown", language: "English", type: "Social service", socialProvider: "Housing", organization: "Metropolitan Boston Housing Partnership", reason: "Behind on rent, needs housing support", okToContact: "Yes", contactMethod: "Other", otherContact: "Through sister, Tanya: 617-555-0190", appointmentMade: "No", status: "Contacted" }),
  sample({ id: 8, clientId: "FV-09875", date: "2026-10-18", patient: "Carlos Rivera", language: "Spanish", type: "Health care", healthProvider: "Primary care", organization: "Dorchester House", reason: "Annual checkup", okToContact: "No", appointmentMade: "Yes", appointmentDate: "2026-10-28", status: "Completed", notes: "Seen 10/28" }),
  sample({ id: 9, clientId: "FV-09901", date: "2026-10-15", patient: "Grace Okafor", language: "English", type: "Social service", socialProvider: "Employment", organization: "JVS Boston", reason: "Looking for job training program", okToContact: "Yes", contactMethod: "Email", email: "grace.okafor@example.com", appointmentMade: "No", status: "Completed" }),
  sample({ id: 10, clientId: "FV-10340", date: "2026-10-12", patient: "Tom Walsh", language: "English", type: "Other", otherType: "Free eyeglasses program", organization: "Boston Lions Club", reason: "Needs new glasses", okToContact: "Yes", contactMethod: "Phone", phone: "617-555-0115", phonePreference: ["Call"], appointmentMade: "No", status: "New" }),
];

// Next ID in the FV-##### sequence, one past the highest in use.
export function nextClientId(referrals) {
  const highest = referrals.reduce((max, r) => {
    const n = parseInt((r.clientId || "").replace(/\D/g, ""), 10);
    return Number.isNaN(n) ? max : Math.max(max, n);
  }, 10000);
  return "FV-" + String(highest + 1).padStart(5, "0");
}

export function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d - offset).toISOString().slice(0, 10);
}

// Spreadsheet-style date, e.g. 10/30/2026.
export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export function statusClass(status) {
  return "status-" + status.toLowerCase();
}

export function percent(n, total) {
  return total ? Math.round((n / total) * 100) : 0;
}

// Short label for the list, e.g. "Specialist" or "Housing".
export function referralCategory(r) {
  const provider =
    r.type === "Health care"
      ? r.healthProvider
      : r.type === "Social service"
      ? r.socialProvider
      : "Other";
  if (provider === "Other") return r.otherType || "Other";
  return provider || r.type;
}

export function contactSummary(r) {
  if (r.okToContact === "No") return "Do not contact";
  if (r.okToContact !== "Yes" || !r.contactMethod) return "";
  if (r.contactMethod === "Phone" && r.phonePreference.length > 0) {
    return "Phone (" + r.phonePreference.join(", ").toLowerCase() + ")";
  }
  return r.contactMethod;
}

export function appointmentSummary(r) {
  if (r.appointmentMade === "Yes") {
    return r.appointmentDate ? formatDate(r.appointmentDate) : "Yes";
  }
  return r.appointmentMade;
}

// `focus` is a funnel step key or a referral type picked on the Metrics page.
export function matchesFocus(r, focus) {
  if (!focus) return true;
  const step = FUNNEL.find((s) => s.key === focus);
  return step ? step.match(r) : r.type === focus;
}

export function focusLabel(focus) {
  const step = FUNNEL.find((s) => s.key === focus);
  return step ? step.label : focus;
}

export function needsOtherDescription(r) {
  return (
    r.type === "Other" ||
    (r.type === "Health care" && r.healthProvider === "Other") ||
    (r.type === "Social service" && r.socialProvider === "Other")
  );
}

// Blank out answers to questions the form would have skipped.
export function clearSkippedFields(r) {
  const out = { ...r };
  if (out.type !== "Health care") out.healthProvider = "";
  if (out.type !== "Social service") out.socialProvider = "";
  if (!needsOtherDescription(out)) out.otherType = "";
  if (out.okToContact !== "Yes") out.contactMethod = "";
  if (out.contactMethod !== "Phone") {
    out.phone = "";
    out.phonePreference = [];
  }
  if (out.contactMethod !== "Email") out.email = "";
  if (out.contactMethod !== "Other") out.otherContact = "";
  if (out.appointmentMade !== "Yes") out.appointmentDate = "";
  return out;
}
