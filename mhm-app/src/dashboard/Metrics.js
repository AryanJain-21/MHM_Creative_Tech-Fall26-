import { useEffect, useMemo, useRef, useState } from "react";
import PageHeader from "./PageHeader";
import { COLUMNS } from "./ReferralLookup";
import {
  FUNNEL,
  REFERRAL_TYPES,
  focusLabel,
  matchesFocus,
  percent,
  referralCategory,
} from "./referrals";

const PREVIEW_COLUMNS = COLUMNS.filter((c) =>
  [
    "clientId",
    "provider",
    "organization",
    "date",
    "appointment",
    "status",
  ].includes(c.key),
);

const PREVIEW_ROWS = 6;

export default function Metrics({ referrals, onBack, onDrillDown }) {
  const [selected, setSelected] = useState(null);
  const total = referrals.length;

  const funnel = useMemo(
    () =>
      FUNNEL.map((step) => ({
        ...step,
        count: referrals.filter(step.match).length,
      })),
    [referrals],
  );

  // Count per referral type, plus the provider breakdown inside each.
  const types = useMemo(
    () =>
      REFERRAL_TYPES.map((type) => {
        const ofType = referrals.filter((r) => r.type === type);
        const c = {};
        ofType.forEach((r) => {
          const name = referralCategory(r);
          c[name] = (c[name] || 0) + 1;
        });
        return {
          type,
          count: ofType.length,
          providers: Object.entries(c).sort((a, b) => b[1] - a[1]),
        };
      }),
    [referrals],
  );

  function toggle(key) {
    setSelected((current) => (current === key ? null : key));
  }

  const detail = selected && (
    <MetricDetail
      key={selected}
      focus={selected}
      referrals={referrals}
      total={total}
      onClose={() => setSelected(null)}
      onOpenLookup={() => onDrillDown(selected === "all" ? null : selected)}
    />
  );

  return (
    <div>
      <PageHeader title="Metrics" onBack={onBack} />

      <section className="summary" aria-label="Closing the loop">
        <h2 className="summary-heading">Closing the loop</h2>
        <div className="summary-cells">
          {funnel.map((step) => (
            <MetricCell
              key={step.key}
              label={step.label}
              value={
                step.key === "all"
                  ? step.count
                  : percent(step.count, total) + "%"
              }
              sub={
                step.key === "all"
                  ? "total referrals"
                  : step.count + " of " + total + " referrals"
              }
              barPct={step.key === "all" ? null : percent(step.count, total)}
              active={selected === step.key}
              onClick={() => toggle(step.key)}
            />
          ))}
        </div>
        {FUNNEL.some((s) => s.key === selected) && detail}
      </section>

      <section className="summary" aria-label="Type of referral">
        <h2 className="summary-heading">Type of referral</h2>
        <div className="summary-cells">
          {types.map(({ type, count, providers }) => (
            <MetricCell
              key={type}
              label={type}
              value={percent(count, total) + "%"}
              sub={count + " of " + total + " referrals"}
              barPct={percent(count, total)}
              active={selected === type}
              onClick={() => toggle(type)}
            >
              {/* Spans, not a list: buttons only allow inline content */}
              <span className="summary-providers">
                {providers.map(([name, n]) => (
                  <span key={name} className="summary-provider">
                    <span>{name}</span>
                    <span className="summary-provider-pct">
                      {percent(n, count)}%
                    </span>
                  </span>
                ))}
              </span>
            </MetricCell>
          ))}
        </div>
        {REFERRAL_TYPES.includes(selected) && detail}
      </section>
    </div>
  );
}

function MetricCell({ label, value, sub, barPct, active, onClick, children }) {
  return (
    <button
      className={"summary-cell" + (active ? " is-active" : "")}
      onClick={onClick}
      aria-expanded={active}
    >
      <span className="summary-label">{label}</span>
      <span className="summary-value">{value}</span>
      <span className="summary-sub">{sub}</span>
      {barPct !== null && (
        <span className="summary-bar" aria-hidden="true">
          <span className="summary-bar-fill" style={{ width: barPct + "%" }} />
        </span>
      )}
      {children}
    </button>
  );
}

// Expands under the clicked metric with a preview of the matching referrals.
function MetricDetail({ focus, referrals, total, onClose, onOpenLookup }) {
  const ref = useRef(null);
  const rows = referrals
    .filter((r) => matchesFocus(r, focus))
    .sort((a, b) => b.date.localeCompare(a.date));
  const shown = rows.slice(0, PREVIEW_ROWS);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  return (
    <div className="metric-detail" ref={ref}>
      <div className="metric-detail-head">
        <h3>
          {focusLabel(focus)}
          <span className="metric-detail-count">
            {rows.length} referrals · {percent(rows.length, total)}% of all
          </span>
        </h3>
        <button
          className="icon-btn"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>
      </div>

      <div className="sheet-scroll">
        <table className="sheet-table metric-preview">
          <thead>
            <tr>
              {PREVIEW_COLUMNS.map((c) => (
                <th key={c.key} scope="col">
                  <span className="preview-th">{c.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                {PREVIEW_COLUMNS.map((c) => (
                  <td key={c.key} className={"col-" + c.key}>
                    {c.render ? c.render(r) : c.value(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="metric-detail-foot">
        {rows.length > shown.length && (
          <span className="field-help">
            Showing {shown.length} of {rows.length}
          </span>
        )}
        <button className="btn btn-secondary" onClick={onOpenLookup}>
          View all in Referral Lookup →
        </button>
      </div>
    </div>
  );
}
