/**
 * Note: These types should match the enums in mhm-app/src/sheets/sheetsService.ts
 */

const ReferralType = Object.freeze({
  HEALTH_CARE: "Health Care",
  SOCIAL_SERVICE: "Social Service",
  OTHER: "Other",
});

const HealthCareProvider = Object.freeze({
  PRIMARY_CARE: "Primary Care",
  URGENT_CARE: "Urgent Care",
  EMERGENCY_ROOM: "Emergency room",
  AMBULANCE: "Ambulance",
  SPECIALIST: "Specialist",
  OTHER: "Other",
});

const SocialServiceProviderType = Object.freeze({
  EDUCATION: "Education",
  EMPLOYMENT: "Employment",
  FOOD: "Food",
  HOUSING: "Housing",
  VIOLENCE: "Violence",
  OTHER: "Other",
});

const ContactMethod = Object.freeze({
  PHONE: "Phone",
  EMAIL: "Email",
  OTHER: "Other",
});

const PhoneNumberContactMethod = Object.freeze({
  CALL: "Call",
  TEXT: "Text",
});

const ReferralStatus = Object.freeze({
    CREATED: 'Created',
    CANCELLED: 'Cancelled',
    COMPLETED: 'Completed'
})

export * as FormEnums from "."