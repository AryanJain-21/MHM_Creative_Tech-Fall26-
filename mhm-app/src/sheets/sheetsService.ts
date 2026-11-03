import * as z from "zod";
import axios from "axios";

enum ReferralType {
  HEALTH_CARE = "Health Care",
  SOCIAL_SERVICE = "Social Service",
  OTHER = "Other",
}

enum HealthCareProvider {
  PRIMARY_CARE = "Primary Care",
  URGENT_CARE = "Urgent Care",
  EMERGENCY_ROOM = "Emergency room",
  AMBULANCE = "Ambulance",
  SPECIALIST = "Specialist",
  OTHER = "Other",
}

enum SocialServiceProviderType {
  EDUCATION = "Education",
  EMPLOYMENT = "Employment",
  FOOD = "Food",
  HOUSING = "Housing",
  VIOLENCE = "Violence",
  OTHER = "Other",
}

enum ContactMethod {
  PHONE = "Phone",
  EMAIL = "Email",
  OTHER = "Other",
}

enum PhoneNumberContactMethod {
  CALL = "Call",
  TEXT = "Text",
}


const FormResponse = z
  .object({
    formId: z.string(),
    timestamp: z.string(),
    clientId: z.string().default(""),
    referralDate: z.date(),
    patientName: z.string(),
    preferredLanguage: z.string(),
    referralType: z.enum(ReferralType),
    referralOtherMessage: z.string().default(""),
    healthcareProviderType: z.enum(HealthCareProvider),
    healthCareProviderOther: z.string().default(""),
    socialServiceProviderType: z.enum(SocialServiceProviderType),
    socialServiceProviderOther: z.string().default(""),
    organizationName: z.string(),
    referralReason: z.string(),
    referralOutcomeConsent: z.boolean(),
    contactMethod: z.enum(ContactMethod),
    phoneNumber: z.number(),
    phoneNumberPreferredContactMethod: z.enum(PhoneNumberContactMethod),
    followupEmail: z.email(),
    otherContactInfo: z.string().default(""),
    appointmentMade: z.boolean(),
    appointmentDate: z.date(),
  })
  .superRefine((data, ctx) => {
    if (data.referralType == ReferralType.OTHER && data.referralOtherMessage === "") {
      ctx.addIssue(
        "Forms with an 'Other' referral type must include text in referralOtherMessage.",
      );
    }
    if (
      data.healthcareProviderType == HealthCareProvider.OTHER &&
      data.healthCareProviderOther === ""
    ) {
      ctx.addIssue(
        "Forms with an 'Other' healthcare provider type must include text in healthCareProviderOther",
      );
    }
    if (
      data.socialServiceProviderType == SocialServiceProviderType.OTHER &&
      data.socialServiceProviderOther === ""
    ) {
      ctx.addIssue(
        "Forms with an 'Other' social service provider type must include text in socialServiceProviderOther",
      );
    }
    if (data.appointmentDate && !data.appointmentDate) {
      ctx.addIssue(
        "Forms with an appointment mademust include appointmentDate.",
      );
    }
    if (!data.appointmentMade && data.appointmentDate) {
      ctx.addIssue(
        "Forms with no appointment made must not include text in appointmentDate.",
      );
    }
  });

  const NewFormResponse = FormResponse.omit({
    "formId": true,
    "timestamp": true
  });

export default function SheetsService() {
  const url = process.env.SHEET_API_URL as string;

  const getAllForms = async () => {
    const forms: any[] = await axios.get(`${url}/api/sheet`);
  };

  const getFormById = async(formId: string) => {
    const form = await axios.get(`${url}/api/sheet/${formId}`);
    return form;
  }

  const sendForm = async (form: object) => {
    const formParseObj = NewFormResponse.safeParse(form);
    if (!formParseObj.success) {
      return { error: "Form validation failed", zodError: formParseObj.error };
    }
    const res = await axios.post(`${url}/api/sheet`, formParseObj.data);
    return res;
  };

  return {getAllForms, getFormById, sendForm, FormResponse, NewFormResponse};
}
