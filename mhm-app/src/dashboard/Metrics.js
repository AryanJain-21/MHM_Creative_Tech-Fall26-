import { useMemo } from "react";
import PageHeader from "./PageHeader";
import { FUNNEL, REFERRAL_TYPES, percent, referralCategory } from "./referrals";

export default function Metrics({ referrals, onBack, onDrillDown }) {
  const total = referrals.length;

  const funnelCounts = useMemo(
    () =>
      Object.fromEntries(
        FUNNEL.map((s) => [s.key, referrals.filter(s.match).length])
      ),
    [referrals]
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
    [referrals]
  );

  return (
    <div>
      <PageHeader title="Metrics" onBack={onBack} />

      <section className="summary" aria-label="Closing the loop">
        <h2 className="summary-heading">Closing the loop</h2>
        <div className="summary-cells">
          {FUNNEL.map((step) => {
            const n = funnelCounts[step.key];
            return (
              <button
                key={step.key}
                className="summary-cell"
                onClick={() => onDrillDown(step.key === "all" ? null : step.key)}
              >
                <span className="summary-label">{step.label}</span>
                <span className="summary-value">
                  {n}
                  {step.key !== "all" && (
                    <span className="summary-pct">{percent(n, total)}%</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="summary" aria-label="Type of referral">
        <h2 className="summary-heading">Type of referral</h2>
        <div className="summary-cells">
          {types.map(({ type, count, providers }) => (
            <button
              key={type}
              className="summary-cell"
              onClick={() => onDrillDown(type)}
            >
              <span className="summary-label">{type}</span>
              <span className="summary-value">
                {count}
                <span className="summary-pct">{percent(count, total)}%</span>
              </span>
              {/* Spans, not a list: buttons only allow inline content */}
              <span className="summary-providers">
                {providers.map(([name, n]) => (
                  <span key={name} className="summary-provider">
                    <span>{name}</span>
                    <span>{n}</span>
                  </span>
                ))}
              </span>
            </button>
          ))}
        </div>
      </section>

      <p className="field-help">Select any number to see those referrals.</p>
    </div>
  );
}
