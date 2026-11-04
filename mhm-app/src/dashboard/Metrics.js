import { useEffect, useMemo, useRef, useState } from "react";
import PageHeader from "./PageHeader";
import { COLUMNS, DATE_WINDOWS } from "./ReferralLookup";
import {
  FUNNEL,
  REFERRAL_TYPES,
  daysAgoISO,
  focusLabel,
  isSmall,
  matchesFocus,
  percent,
  referralCategory,
  suppressGroup,
} from "./referrals";

const ALL_TIME = "All time";
const RANGES = [...Object.keys(DATE_WINDOWS), ALL_TIME];

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

function inWindow(r, days) {
  return days === null || r.date > daysAgoISO(days);
}

function inPriorWindow(r, days) {
  return r.date > daysAgoISO(days * 2) && r.date <= daysAgoISO(days);
}

export default function Metrics({ referrals, onBack, onDrillDown }) {
  const [range, setRange] = useState("Last 90 days");
  const [selected, setSelected] = useState(null);

  const days = range === ALL_TIME ? null : DATE_WINDOWS[range];
  const current = useMemo(
    () => referrals.filter((r) => inWindow(r, days)),
    [referrals, days],
  );
  // The previous period of the same length, for the change indicators. Only
  // used when the data reaches back over all of it; a partly empty period
  // would make every number look like a huge jump.
  const prior = useMemo(() => {
    if (days === null) return [];
    const earliest = referrals.reduce(
      (min, r) => (r.date < min ? r.date : min),
      "9999-12-31",
    );
    if (earliest > daysAgoISO(days * 2)) return [];
    return referrals.filter((r) => inPriorWindow(r, days));
  }, [referrals, days]);
  const total = current.length;

  function toggle(key) {
    setSelected((s) => (s === key ? null : key));
  }

  const detail = selected && (
    <MetricDetail
      key={selected + range}
      focus={selected}
      referrals={current}
      total={total}
      onClose={() => setSelected(null)}
      onOpenLookup={() =>
        onDrillDown({
          key: selected === "all" ? null : selected,
          range: days === null ? null : range,
        })
      }
    />
  );

  return (
    <div>
      <PageHeader title="Metrics" onBack={onBack} />

      <div className="range-bar" role="group" aria-label="Time range">
        {RANGES.map((r) => (
          <button
            key={r}
            className={"range-option" + (range === r ? " is-selected" : "")}
            onClick={() => {
              setRange(r);
              setSelected(null);
            }}
            aria-pressed={range === r}
          >
            {r}
          </button>
        ))}
      </div>

      {isSmall(total) ? (
        <p className="privacy-note">
          Fewer than 5 referrals in this time range. Numbers are hidden to
          protect client privacy. Try a longer range.
        </p>
      ) : (
        <>
          <section className="summary" aria-label="Connecting clients to care">
            <h2 className="summary-heading">Connecting clients to care</h2>
            <FunnelCards
              current={current}
              prior={prior}
              days={days}
              selected={selected}
              onSelect={toggle}
            />
            {FUNNEL.some((s) => s.key === selected) && detail}
          </section>

          <section className="summary" aria-label="Type of referral">
            <h2 className="summary-heading">Type of referral</h2>
            <TypeBreakdown
              referrals={current}
              selected={selected}
              onSelect={toggle}
            />
            {REFERRAL_TYPES.includes(selected) && detail}
          </section>

          <p className="field-help">
            Counts under 5 show as "&lt;5" so small groups of clients can't be
            identified.
          </p>
        </>
      )}
    </div>
  );
}

// One card per funnel step; each is a share of all referrals in the range.
function FunnelCards({ current, prior, days, selected, onSelect }) {
  const total = current.length;
  const priorTotal = prior.length;

  return (
    <div className="summary-cells">
      {FUNNEL.map((step) => {
        const n = current.filter(step.match).length;
        const isTotal = step.key === "all";
        // Hide a step if it or its drop-off is small: either one gives
        // the other away when subtracted from the total.
        const hidden = !isTotal && (isSmall(n) || isSmall(total - n));
        const pct = percent(n, total);

        let delta = null;
        if (
          days !== null &&
          !isSmall(priorTotal) &&
          priorTotal > 0 &&
          !hidden
        ) {
          const priorN = prior.filter(step.match).length;
          const priorHidden =
            !isTotal && (isSmall(priorN) || isSmall(priorTotal - priorN));
          // Referrals made: change in count. Rates: the difference between
          // the two rates, e.g. 30% -> 36% shows as up 6%.
          if (isTotal) delta = percent(n - priorTotal, priorTotal);
          else if (!priorHidden) delta = pct - percent(priorN, priorTotal);
        }

        return (
          <button
            key={step.key}
            className={
              "summary-cell" + (selected === step.key ? " is-active" : "")
            }
            onClick={() => onSelect(step.key)}
            aria-expanded={selected === step.key}
          >
            <span className="summary-label">{step.label}</span>
            <span className="summary-value">
              {isTotal ? n : hidden ? "<5" : pct + "%"}
            </span>
            <Delta delta={delta} days={days} />
            <span className="summary-sub">
              {isTotal
                ? "total referrals"
                : hidden
                  ? "Fewer than 5 referrals"
                  : n + " of " + total + " referrals"}
            </span>
            {!isTotal && (
              <span className="summary-bar" aria-hidden="true">
                {/* No length for a hidden step: it would give the count away */}
                <span
                  className={"summary-bar-fill" + (hidden ? " is-hidden" : "")}
                  style={{ width: (hidden ? 100 : pct) + "%" }}
                />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Percent change vs the previous period, with an up/down arrow.
function Delta({ delta, days }) {
  if (delta === null) return <span className="delta" />;
  const up = delta > 0;
  const flat = delta === 0;
  return (
    <span className={"delta" + (flat ? "" : up ? " is-up" : " is-down")}>
      {!flat && (
        <svg className="delta-arrow" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d={
              up
                ? "M8 13V3M3.5 7.5 8 3l4.5 4.5"
                : "M8 3v10M3.5 8.5 8 13l4.5-4.5"
            }
          />
        </svg>
      )}
      <span className="sr-only">
        {flat ? "No change" : up ? "Up" : "Down"}{" "}
      </span>
      {Math.abs(delta)}%<span className="delta-vs"> vs prior {days} days</span>
    </span>
  );
}

// Slice colors follow the type, never its size (checked with the dataviz
// palette validator for colorblind separation).
const TYPE_COLORS = {
  "Health care": "#2a7fae",
  "Social service": "#eb6834",
  Other: "#1baf7a",
};
const HIDDEN_COLOR = "#c4c4c4";

// Donut of the referral type split. Hidden ("<5") types merge into one gray
// "Other" slice, whose size is already known from total minus the visible
// slices. Colored slices open their drill-down; "Other" is hover-only.
function TypeDonut({ types, total, selected, onSelect }) {
  const [hover, setHover] = useState(null);

  const visible = types.filter((t) => !t.hidden && t.count > 0);
  const hiddenCount = total - visible.reduce((sum, t) => sum + t.count, 0);
  const slices = [
    ...visible.map((t) => ({
      key: t.type,
      label: t.type,
      count: t.count,
      color: TYPE_COLORS[t.type],
    })),
    ...(hiddenCount > 0
      ? [
          {
            key: "hidden",
            // Avoid two "Other" slices when the Other type shows on its own.
            label: visible.some((t) => t.type === "Other")
              ? "Other types"
              : "Other",
            count: hiddenCount,
            color: HIDDEN_COLOR,
          },
        ]
      : []),
  ];

  const size = 180;
  const r = 80;
  const inner = 52;
  const c = size / 2;
  let angle = -Math.PI / 2;

  function arc(start, end) {
    const large = end - start > Math.PI ? 1 : 0;
    const p = (rad, ang) => [c + rad * Math.cos(ang), c + rad * Math.sin(ang)];
    const [x1, y1] = p(r, start);
    const [x2, y2] = p(r, end);
    const [x3, y3] = p(inner, end);
    const [x4, y4] = p(inner, start);
    return `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${inner},${inner} 0 ${large} 0 ${x4},${y4} Z`;
  }

  const active = slices.find((s) => s.key === hover);

  return (
    <div className="type-chart">
      <svg
        className="donut"
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={
          "Referral types: " +
          slices
            .map((s) => s.label + " " + percent(s.count, total) + "%")
            .join(", ")
        }
      >
        {slices.map((s) => {
          const sweep = (s.count / total) * Math.PI * 2;
          // A full circle can't be drawn as one arc, so stop just short.
          const d = arc(angle, angle + Math.min(sweep, Math.PI * 2 - 0.0001));
          angle += sweep;
          // The merged "Other" slice has no drill-down, so it's hover-only.
          if (s.key === "hidden") {
            return (
              <path
                key={s.key}
                d={d}
                fill={s.color}
                className={
                  "donut-slice is-static" + (hover === s.key ? " is-hover" : "")
                }
                onMouseEnter={() => setHover(s.key)}
                onMouseLeave={() => setHover(null)}
              />
            );
          }
          return (
            <path
              key={s.key}
              d={d}
              fill={s.color}
              className={
                "donut-slice" +
                (hover === s.key || selected === s.key ? " is-hover" : "")
              }
              tabIndex={0}
              role="button"
              aria-label={s.label + ", " + percent(s.count, total) + "%"}
              onMouseEnter={() => setHover(s.key)}
              onMouseLeave={() => setHover(null)}
              // Keyboard focus only: a mouse click shouldn't leave it stuck on.
              onFocus={(e) =>
                e.target.matches(":focus-visible") && setHover(s.key)
              }
              onBlur={() => setHover(null)}
              onClick={() => onSelect(s.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(s.key);
                }
              }}
            />
          );
        })}
        <text className="donut-value" x={c} y={c + 2} textAnchor="middle">
          {active ? percent(active.count, total) + "%" : total}
        </text>
        <text className="donut-label" x={c} y={c + 20} textAnchor="middle">
          {active ? active.label : "referrals"}
        </text>
      </svg>

      <ul className="donut-legend">
        {slices.map((s) => (
          <li key={s.key}>
            <span className="donut-swatch" style={{ background: s.color }} />
            <span className="donut-legend-name">{s.label}</span>
            <span className="donut-legend-pct">{percent(s.count, total)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TypeBreakdown({ referrals, selected, onSelect }) {
  const total = referrals.length;

  const types = useMemo(() => {
    const counts = REFERRAL_TYPES.map(
      (t) => referrals.filter((r) => r.type === t).length,
    );
    const hidden = suppressGroup(counts);
    return REFERRAL_TYPES.map((type, i) => {
      const ofType = referrals.filter((r) => r.type === type);
      const c = {};
      ofType.forEach((r) => {
        const name = referralCategory(r);
        c[name] = (c[name] || 0) + 1;
      });
      const providers = Object.entries(c).sort((a, b) => b[1] - a[1]);
      const providerHidden = suppressGroup(providers.map(([, n]) => n));
      return {
        type,
        count: counts[i],
        hidden: hidden[i],
        providers: providers.map(([name, n], j) => ({
          name,
          n,
          hidden: hidden[i] || providerHidden[j],
        })),
      };
    });
  }, [referrals]);

  return (
    <>
      <TypeDonut
        types={types}
        total={total}
        selected={selected}
        onSelect={onSelect}
      />
      <div className="summary-cells">
        {types.map(({ type, count, hidden, providers }) => (
          <button
            key={type}
            className={"summary-cell" + (selected === type ? " is-active" : "")}
            onClick={() => onSelect(type)}
            aria-expanded={selected === type}
          >
            <span className="summary-label">{type}</span>
            <span className="summary-value">
              {hidden ? "<5" : percent(count, total) + "%"}
            </span>
            <span className="summary-sub">
              {hidden
                ? "Fewer than 5 referrals"
                : count + " of " + total + " referrals"}
            </span>
            {/* Spans, not a list: buttons only allow inline content */}
            <span className="summary-providers">
              {providers.map((p) => (
                <span key={p.name} className="summary-provider">
                  <span className="summary-provider-name">{p.name}</span>
                  <span className="summary-provider-pct">
                    {p.hidden ? "<5" : percent(p.n, count) + "%"}
                  </span>
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

// Expands under the clicked metric with a preview of the matching referrals.
function MetricDetail({ focus, referrals, total, onClose, onOpenLookup }) {
  const ref = useRef(null);
  const rows = referrals
    .filter((r) => matchesFocus(r, focus))
    .sort((a, b) => b.date.localeCompare(a.date));
  const shown = rows.slice(0, PREVIEW_ROWS);
  // Hide the rows whenever the Metrics cell for this group is hidden, using
  // the same rules, so the preview never gives away a "<5" count.
  let hidden;
  if (REFERRAL_TYPES.includes(focus)) {
    const counts = REFERRAL_TYPES.map(
      (t) => referrals.filter((r) => r.type === t).length,
    );
    hidden = suppressGroup(counts)[REFERRAL_TYPES.indexOf(focus)];
  } else {
    hidden =
      focus !== "all" && (isSmall(rows.length) || isSmall(total - rows.length));
  }

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  return (
    <div className="metric-detail" ref={ref}>
      <div className="metric-detail-head">
        <h3>
          {focusLabel(focus)}
          {!hidden && (
            <span className="metric-detail-count">
              {rows.length} referrals · {percent(rows.length, total)}% of all
            </span>
          )}
        </h3>
        <button
          className="icon-btn"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>
      </div>

      {hidden ? (
        <p className="privacy-note">
          This group has fewer than 5 referrals, so its details are hidden to
          protect client privacy.
        </p>
      ) : (
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
      )}

      <div className="metric-detail-foot">
        {!hidden && rows.length > shown.length && (
          <span className="field-help">
            Showing {shown.length} of {rows.length}
          </span>
        )}
        <button className="btn btn-secondary" onClick={onOpenLookup}>
          View in Referral Lookup →
        </button>
      </div>
    </div>
  );
}
