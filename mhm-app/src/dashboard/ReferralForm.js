import { useState } from "react";
import PageHeader from "./PageHeader";
import {
  CONTACT_METHODS,
  EMPTY_REFERRAL,
  HEALTH_PROVIDERS,
  PHONE_PREFERENCES,
  REFERRAL_TYPES,
  SOCIAL_PROVIDERS,
  STATUSES,
  STATUS_HELP,
  YES_NO,
  clearSkippedFields,
  needsOtherDescription,
} from "./referrals";

function RadioGroup({ legend, name, options, value, onChange, columns = 1, disabled }) {
  return (
    <fieldset className="field" disabled={disabled}>
      <legend>{legend}</legend>
      <div className={"radio-list cols-" + columns}>
        {options.map((option) => (
          <label key={option} className="radio">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CheckboxGroup({ legend, options, value, onChange, disabled }) {
  function toggle(option) {
    onChange(
      value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option]
    );
  }

  return (
    <fieldset className="field" disabled={disabled}>
      <legend>{legend}</legend>
      <div className="radio-list cols-2">
        {options.map((option) => (
          <label key={option} className="radio">
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => toggle(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function ReferralForm({ referral, onBack, onSave }) {
  // Fill in any fields missing from older or partial records.
  const [form, setForm] = useState({ ...EMPTY_REFERRAL, ...referral });
  const isNew = referral.id === null;
  const canSave = form.patient.trim() && form.reason.trim();
  const wantsFollowUp = form.okToContact === "Yes";

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSave) return;
    onSave(clearSkippedFields(form));
  }

  return (
    <form className="referral-form" onSubmit={handleSubmit}>
      <PageHeader
        title={isNew ? "Create a New Referral" : form.patient || "Referral"}
        onBack={onBack}
      />

      {!isNew && (
        <div className="form-box">
          <RadioGroup
            legend="Follow-up Status"
            name="status"
            options={STATUSES}
            value={form.status}
            onChange={(v) => update("status", v)}
            columns={4}
          />
          <p className="field-help">{STATUS_HELP[form.status]}</p>
          <label className="field">
            <span>Follow-up Notes</span>
            <textarea
              rows="3"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Calls made, appointment details, next steps"
            />
          </label>
        </div>
      )}

      <div className="form-grid">
        <label className="field">
          <span>Client ID</span>
          <input className="is-readonly" value={form.clientId} readOnly />
        </label>
        <label className="field">
          <span>Date Referral Made</span>
          <input
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </label>
        <label className="field">
          <span>Client/Patient Name</span>
          <input
            value={form.patient}
            onChange={(e) => update("patient", e.target.value)}
            autoFocus={isNew}
          />
        </label>
        <label className="field">
          <span>Client's Preferred Language</span>
          <input
            value={form.language}
            onChange={(e) => update("language", e.target.value)}
            placeholder="Copy from basic information section"
          />
        </label>
      </div>

      <div className="form-box">
        <RadioGroup
          legend="Type of Referral"
          name="type"
          options={REFERRAL_TYPES}
          value={form.type}
          onChange={(v) => update("type", v)}
        />
        <div className="form-grid">
          <RadioGroup
            legend="Healthcare Provider Type"
            name="healthProvider"
            options={HEALTH_PROVIDERS}
            value={form.healthProvider}
            onChange={(v) => update("healthProvider", v)}
            columns={2}
            disabled={form.type !== "Health care"}
          />
          <RadioGroup
            legend="Social Service Provider Type"
            name="socialProvider"
            options={SOCIAL_PROVIDERS}
            value={form.socialProvider}
            onChange={(v) => update("socialProvider", v)}
            columns={2}
            disabled={form.type !== "Social service"}
          />
        </div>
        {needsOtherDescription(form) && (
          <label className="field">
            <span>Describe Type of Other Referral</span>
            <input
              value={form.otherType}
              onChange={(e) => update("otherType", e.target.value)}
            />
          </label>
        )}
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Name of Organization</span>
          <input
            value={form.organization}
            onChange={(e) => update("organization", e.target.value)}
            placeholder="Spell out, no abbreviations"
          />
        </label>
        <label className="field">
          <span>Reason for Referral</span>
          <input
            value={form.reason}
            onChange={(e) => update("reason", e.target.value)}
          />
        </label>
      </div>

      <div className="form-box">
        <div className="form-grid">
          <RadioGroup
            legend="Client contactable?"
            name="okToContact"
            options={YES_NO}
            value={form.okToContact}
            onChange={(v) => update("okToContact", v)}
          />
          <RadioGroup
            legend="Preferred Contact Method"
            name="contactMethod"
            options={CONTACT_METHODS}
            value={form.contactMethod}
            onChange={(v) => update("contactMethod", v)}
            disabled={!wantsFollowUp}
          />
          <fieldset
            className="field-stack"
            disabled={!wantsFollowUp || form.contactMethod !== "Phone"}
          >
            <label className="field">
              <span>Client Phone Number</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </label>
            <CheckboxGroup
              legend="Reach them by (select all that apply)"
              options={PHONE_PREFERENCES}
              value={form.phonePreference}
              onChange={(v) => update("phonePreference", v)}
            />
          </fieldset>
          <div className="field-stack">
            <label className="field">
              <span>Client Email Address</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                disabled={!wantsFollowUp || form.contactMethod !== "Email"}
              />
            </label>
            <label className="field">
              <span>Other Contact Form/Information</span>
              <input
                value={form.otherContact}
                onChange={(e) => update("otherContact", e.target.value)}
                disabled={!wantsFollowUp || form.contactMethod !== "Other"}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="form-grid">
        <RadioGroup
          legend="Appointment for referral via MHM Van?"
          name="appointmentMade"
          options={YES_NO}
          value={form.appointmentMade}
          onChange={(v) => update("appointmentMade", v)}
        />
        <label className="field">
          <span>Date of Appointment</span>
          <input
            type="date"
            value={form.appointmentDate}
            onChange={(e) => update("appointmentDate", e.target.value)}
            disabled={form.appointmentMade !== "Yes"}
          />
        </label>
      </div>

      <div className="form-actions">
        {!canSave && (
          <p className="field-help">Patient name and reason are required.</p>
        )}
        <button type="submit" className="btn-cta" disabled={!canSave}>
          {isNew ? "Create Referral" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
