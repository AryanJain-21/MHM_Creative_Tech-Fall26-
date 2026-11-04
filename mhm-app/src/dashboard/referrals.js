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
const HANDWRITTEN_REFERRALS = [
  sample({
    id: 1,
    clientId: "FV-10231",
    date: daysAgoISO(4),
    patient: "Maria Lopez",
    language: "Spanish",
    type: "Health care",
    healthProvider: "Primary care",
    organization: "Whittier Street Health Center",
    reason: "High blood pressure reading at screening",
    okToContact: "Yes",
    contactMethod: "Phone",
    phone: "617-555-0142",
    phonePreference: ["Call", "Text"],
    appointmentMade: "No",
    status: "New",
  }),
  sample({
    id: 2,
    clientId: "FV-10198",
    date: daysAgoISO(9),
    patient: "James Carter",
    language: "English",
    type: "Health care",
    healthProvider: "Specialist",
    organization: "Codman Square Health Center Dental",
    reason: "Tooth pain, no current dentist",
    okToContact: "Yes",
    contactMethod: "Phone",
    phone: "617-555-0177",
    phonePreference: ["Call"],
    appointmentMade: "No",
    status: "Contacted",
    notes: "Left voicemail, called back the next day",
  }),
  sample({
    id: 3,
    clientId: "FV-10044",
    date: daysAgoISO(17),
    patient: "Linh Nguyen",
    language: "Vietnamese",
    type: "Health care",
    healthProvider: "Specialist",
    organization: "New England Eye Commonwealth",
    reason: "Blurry vision, needs eye exam",
    okToContact: "Yes",
    contactMethod: "Phone",
    phone: "617-555-0109",
    phonePreference: ["Text"],
    appointmentMade: "Yes",
    appointmentDate: daysAgoISO(-3),
    status: "Scheduled",
  }),
  sample({
    id: 4,
    clientId: "FV-10307",
    date: daysAgoISO(26),
    patient: "Andre Baptiste",
    language: "Haitian Creole",
    type: "Health care",
    healthProvider: "Other",
    otherType: "Behavioral health counseling",
    organization: "Mattapan Community Health Center",
    reason: "Asked for help with stress and sleep",
    okToContact: "Yes",
    contactMethod: "Email",
    email: "andre.b@example.com",
    appointmentMade: "No",
    status: "New",
  }),
  sample({
    id: 5,
    clientId: "FV-09982",
    date: daysAgoISO(38),
    patient: "Fatima Hassan",
    language: "Somali",
    type: "Social service",
    socialProvider: "Food",
    organization: "Greater Boston Food Bank",
    reason: "Food assistance enrollment",
    okToContact: "Yes",
    contactMethod: "Phone",
    phone: "617-555-0163",
    phonePreference: ["Call"],
    appointmentMade: "No",
    status: "Completed",
    notes: "Enrolled in SNAP",
  }),
  sample({
    id: 6,
    clientId: "FV-10012",
    date: daysAgoISO(51),
    patient: "Robert Kim",
    language: "Korean",
    type: "Health care",
    healthProvider: "Primary care",
    organization: "South Cove Community Health Center",
    reason: "Elevated blood sugar",
    okToContact: "Yes",
    contactMethod: "Phone",
    phone: "617-555-0128",
    phonePreference: ["Call"],
    appointmentMade: "Yes",
    appointmentDate: daysAgoISO(-2),
    status: "Scheduled",
  }),
  sample({
    id: 7,
    clientId: "FV-10255",
    date: daysAgoISO(63),
    patient: "Keisha Brown",
    language: "English",
    type: "Social service",
    socialProvider: "Housing",
    organization: "Metropolitan Boston Housing Partnership",
    reason: "Behind on rent, needs housing support",
    okToContact: "Yes",
    contactMethod: "Other",
    otherContact: "Through sister, Tanya: 617-555-0190",
    appointmentMade: "No",
    status: "Contacted",
  }),
  sample({
    id: 8,
    clientId: "FV-09875",
    date: daysAgoISO(77),
    patient: "Carlos Rivera",
    language: "Spanish",
    type: "Health care",
    healthProvider: "Primary care",
    organization: "Dorchester House",
    reason: "Annual checkup",
    okToContact: "No",
    appointmentMade: "Yes",
    appointmentDate: daysAgoISO(67),
    status: "Completed",
    notes: "Seen at appointment",
  }),
  sample({
    id: 9,
    clientId: "FV-09901",
    date: daysAgoISO(92),
    patient: "Grace Okafor",
    language: "English",
    type: "Social service",
    socialProvider: "Employment",
    organization: "JVS Boston",
    reason: "Looking for job training program",
    okToContact: "Yes",
    contactMethod: "Email",
    email: "grace.okafor@example.com",
    appointmentMade: "No",
    status: "Completed",
  }),
  sample({
    id: 10,
    clientId: "FV-10340",
    date: daysAgoISO(108),
    patient: "Tom Walsh",
    language: "English",
    type: "Other",
    otherType: "Free eyeglasses program",
    organization: "Boston Lions Club",
    reason: "Needs new glasses",
    okToContact: "Yes",
    contactMethod: "Phone",
    phone: "617-555-0115",
    phonePreference: ["Call"],
    appointmentMade: "No",
    status: "New",
  }),
];

// ---- Generated sample data -------------------------------------------
// Fills out ~4 months of fake referrals (50 total with the handwritten
// ones) so Metrics has trends to show.
// Seeded, so every page load produces the same referrals. Dates are
// relative to today, so "Last 30 days" never comes up empty in a demo.

const GENERATED_COUNT = 40;
const GENERATED_DAYS = 120;

// Small seeded random number generator (mulberry32).
function seededRandom(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pick from [[value, weight], ...] using a random number in [0, 1).
function weighted(rand, options) {
  const total = options.reduce((sum, [, w]) => sum + w, 0);
  let roll = rand() * total;
  for (const [value, w] of options) {
    roll -= w;
    if (roll < 0) return value;
  }
  return options[options.length - 1][0];
}

function pick(rand, list) {
  return list[Math.floor(rand() * list.length)];
}

const LANGUAGES = [
  ["English", 40],
  ["Spanish", 22],
  ["Haitian Creole", 10],
  ["Cape Verdean Creole", 7],
  ["Vietnamese", 7],
  ["Portuguese", 6],
  ["Somali", 4],
  ["Mandarin", 4],
];

const FIRST_NAMES = [
  "Ana",
  "Luis",
  "Marie",
  "Jean",
  "Thu",
  "Minh",
  "Amina",
  "Joao",
  "Rosa",
  "David",
  "Wei",
  "Nadia",
  "Samuel",
  "Lucia",
  "Kevin",
  "Fatou",
  "Elena",
  "Omar",
  "Grace",
  "Paulo",
];
const LAST_NAMES = [
  "Garcia",
  "Pierre",
  "Tran",
  "Mohamed",
  "Silva",
  "Johnson",
  "Chen",
  "Fernandes",
  "Rodriguez",
  "Joseph",
  "Nguyen",
  "Ali",
  "Santos",
  "Williams",
  "Li",
  "Barros",
];

// Provider -> organizations and reasons it would be picked for.
const HEALTH_DETAILS = {
  "Primary care": {
    weight: 34,
    orgs: [
      "Whittier Street Health Center",
      "Dorchester House",
      "South Cove Community Health Center",
      "Codman Square Health Center",
      "Bowdoin Street Health Center",
    ],
    reasons: [
      "High blood pressure reading at screening",
      "Elevated blood sugar",
      "No primary care provider",
      "Annual checkup overdue",
      "High cholesterol follow-up",
    ],
  },
  "Urgent care": {
    weight: 8,
    orgs: ["Boston Medical Center Urgent Care", "CareWell Urgent Care"],
    reasons: [
      "Possible infection, needs same-week visit",
      "Minor injury needing evaluation",
    ],
  },
  "Emergency room": {
    weight: 3,
    orgs: ["Boston Medical Center Emergency Department"],
    reasons: ["Chest pain at screening", "Very high blood pressure reading"],
  },
  Ambulance: {
    weight: 1,
    orgs: ["Boston Emergency Medical Services"],
    reasons: ["Medical emergency on the van"],
  },
  Specialist: {
    weight: 18,
    orgs: [
      "New England Eye Commonwealth",
      "Tufts Dental School Clinic",
      "Boston Medical Center Cardiology",
    ],
    reasons: [
      "Needs eye exam",
      "Tooth pain, no current dentist",
      "Abnormal heart rhythm at screening",
    ],
  },
  Other: {
    weight: 6,
    otherType: "Behavioral health counseling",
    orgs: ["Bay Cove Human Services", "Mattapan Community Health Center"],
    reasons: [
      "Asked for help with stress and sleep",
      "Asked about counseling services",
    ],
  },
};

const SOCIAL_DETAILS = {
  Food: {
    weight: 12,
    orgs: ["Greater Boston Food Bank", "Project Bread FoodSource Hotline"],
    reasons: [
      "Food assistance enrollment",
      "Running out of food before month end",
    ],
  },
  Housing: {
    weight: 9,
    orgs: [
      "Metropolitan Boston Housing Partnership",
      "Boston Housing Authority",
    ],
    reasons: ["Behind on rent", "Needs housing search support"],
  },
  Employment: {
    weight: 5,
    orgs: ["JVS Boston", "MassHire Boston Career Center"],
    reasons: ["Looking for job training program", "Recently lost job"],
  },
  Education: {
    weight: 3,
    orgs: ["ABCD Adult Education"],
    reasons: ["Wants English classes"],
  },
  Violence: {
    weight: 1,
    orgs: ["Casa Myrna"],
    reasons: ["Asked for domestic violence support"],
  },
  Other: {
    weight: 2,
    otherType: "Benefits enrollment",
    orgs: ["ABCD Fuel Assistance"],
    reasons: ["Needs help with heating costs"],
  },
};

const OTHER_DETAILS = [
  {
    otherType: "Free eyeglasses program",
    org: "Boston Lions Club",
    reason: "Needs new glasses",
  },
  {
    otherType: "Free phone program",
    org: "SafeLink Wireless",
    reason: "No working phone for follow-up",
  },
];

function pickDetails(rand, table) {
  const provider = weighted(
    rand,
    Object.entries(table).map(([name, d]) => [name, d.weight]),
  );
  const d = table[provider];
  return {
    provider,
    otherType: d.otherType || "",
    organization: pick(rand, d.orgs),
    reason: pick(rand, d.reasons),
  };
}

// Status follows the referral's age, the way follow-up plays out over time.
function pickStatus(rand, ageDays, appointmentMade, okToContact) {
  if (appointmentMade === "Yes") {
    return ageDays > 14 && rand() < 0.8 ? "Completed" : "Scheduled";
  }
  if (okToContact === "No") return ageDays > 30 ? "Completed" : "New";
  if (ageDays < 7) {
    return weighted(rand, [
      ["New", 7],
      ["Contacted", 3],
    ]);
  }
  if (ageDays < 30) {
    return weighted(rand, [
      ["New", 3],
      ["Contacted", 5],
      ["Scheduled", 2],
    ]);
  }
  return weighted(rand, [
    ["New", 1],
    ["Contacted", 2],
    ["Scheduled", 2],
    ["Completed", 5],
  ]);
}

function generateReferrals(count, days) {
  const rand = seededRandom(1076);
  const list = [];
  for (let i = 0; i < count; i++) {
    // Spread evenly, so period-over-period changes stay realistic.
    const ageDays = Math.floor(days * rand());
    const type = weighted(rand, [
      ["Health care", 62],
      ["Social service", 30],
      ["Other", 8],
    ]);

    let details;
    if (type === "Health care") details = pickDetails(rand, HEALTH_DETAILS);
    else if (type === "Social service")
      details = pickDetails(rand, SOCIAL_DETAILS);
    else {
      const d = pick(rand, OTHER_DETAILS);
      details = {
        provider: "",
        otherType: d.otherType,
        organization: d.org,
        reason: d.reason,
      };
    }

    const okToContact = rand() < 0.86 ? "Yes" : "No";
    const contactMethod =
      okToContact === "Yes"
        ? weighted(rand, [
            ["Phone", 75],
            ["Email", 18],
            ["Other", 7],
          ])
        : "";
    // Booking on the van gets more common over the quarter (the trend story).
    const bookRate = 0.22 + 0.2 * (1 - ageDays / days);
    const appointmentMade = rand() < bookRate ? "Yes" : "No";

    list.push(
      sample({
        id: 1000 + i,
        clientId: "FV-" + (10400 + i),
        date: daysAgoISO(ageDays),
        patient: pick(rand, FIRST_NAMES) + " " + pick(rand, LAST_NAMES),
        language: weighted(rand, LANGUAGES),
        type,
        healthProvider: type === "Health care" ? details.provider : "",
        socialProvider: type === "Social service" ? details.provider : "",
        otherType: details.otherType,
        organization: details.organization,
        reason: details.reason,
        okToContact,
        contactMethod,
        phone:
          contactMethod === "Phone"
            ? "617-555-01" + String(10 + i).slice(-2)
            : "",
        phonePreference:
          contactMethod === "Phone"
            ? weighted(rand, [
                [["Call"], 5],
                [["Text"], 3],
                [["Call", "Text"], 2],
              ])
            : [],
        email:
          contactMethod === "Email"
            ? "client" + (10400 + i) + "@example.com"
            : "",
        otherContact:
          contactMethod === "Other" ? "Through a family member" : "",
        appointmentMade,
        appointmentDate:
          appointmentMade === "Yes"
            ? daysAgoISO(ageDays - 7 - Math.floor(rand() * 14))
            : "",
        status: pickStatus(rand, ageDays, appointmentMade, okToContact),
      }),
    );
  }
  return list;
}

export const SAMPLE_REFERRALS = [
  ...HANDWRITTEN_REFERRALS,
  ...generateReferrals(GENERATED_COUNT, GENERATED_DAYS),
];

// ISO date `n` days before today (negative n is in the future).
export function daysAgoISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d - offset).toISOString().slice(0, 10);
}

// ---- Small-cell suppression ------------------------------------------
// Counts under 5 can identify people when paired with other details
// (e.g. "Haitian Creole + behavioral health: 1"), so Metrics shows "<5"
// instead, and hides any percentage derived from them.
export const MIN_CELL = 5;

export function isSmall(n) {
  return n > 0 && n < MIN_CELL;
}

// For counts that add up to a shown total, returns which ones to hide. If
// only one is hidden, it could be worked out by subtracting the others from
// the total, so the next smallest is hidden too.
export function suppressGroup(counts) {
  const hidden = counts.map(isSmall);
  if (hidden.filter(Boolean).length === 1) {
    let next = -1;
    counts.forEach((n, i) => {
      if (!hidden[i] && n > 0 && (next === -1 || n < counts[next])) next = i;
    });
    if (next !== -1) hidden[next] = true;
  }
  return hidden;
}

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

// Month-level date for list views, e.g. Oct 2026. Exact dates are
// identifiers under HIPAA, so lists only show the month.
export function formatMonth(iso) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

// Masks for contact details shown before staff choose to reveal them.
// This is display-only: real protection has to happen on the server.
export function maskName(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0] + "•••")
    .join(" ");
}

export function maskPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits ? "•••-•••-" + digits.slice(-4) : "";
}

export function maskEmail(email) {
  const [user, domain] = email.split("@");
  return user ? user[0] + "•••" + (domain ? "@" + domain : "") : "";
}

export function maskText(text) {
  return text ? "••••••••" : "";
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
