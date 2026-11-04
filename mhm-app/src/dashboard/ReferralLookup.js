import { useEffect, useMemo, useRef, useState } from "react";
import PageHeader from "./PageHeader";
import {
  REFERRAL_TYPES,
  STATUSES,
  YES_NO,
  daysAgoISO,
  formatMonth,
  referralCategory,
  statusClass,
} from "./referrals";

const ANY = "All";

// Date windows shared with the Metrics time range.
export const DATE_WINDOWS = { "Last 30 days": 30, "Last 90 days": 90 };

const NO_FILTERS = {
  referred: ANY,
  type: ANY,
  provider: ANY,
  followUp: ANY,
  appointment: ANY,
  status: ANY,
};

// Toolbar filters. Each active one also shows as a removable chip.
const FILTERS = [
  {
    key: "referred",
    label: "Referred",
    options: () => Object.keys(DATE_WINDOWS),
    match: (r, v) => r.date > daysAgoISO(DATE_WINDOWS[v]),
  },
  {
    key: "type",
    label: "Type",
    options: () => REFERRAL_TYPES,
    match: (r, v) => r.type === v,
  },
  {
    key: "provider",
    label: "Provider",
    // Only providers that appear in the data, narrowed by the chosen type.
    options: (referrals, filters) =>
      [
        ...new Set(
          referrals
            .filter((r) => filters.type === ANY || r.type === filters.type)
            .map(referralCategory),
        ),
      ].sort(),
    match: (r, v) => referralCategory(r) === v,
  },
  {
    key: "followUp",
    label: "Okay to follow up",
    options: () => YES_NO,
    match: (r, v) => r.okToContact === v,
  },
  {
    key: "appointment",
    label: "Appointment",
    options: () => YES_NO,
    match: (r, v) => r.appointmentMade === v,
  },
  {
    key: "status",
    label: "Status",
    options: () => STATUSES,
    match: (r, v) => r.status === v,
  },
];

// Metrics drill-downs arrive as { key, range }: a funnel step or referral
// type, plus the Metrics time range label. Turn that into filter values.
function filtersFromFocus(focus) {
  const { key, range } = focus || {};
  const filters = { ...NO_FILTERS, referred: range || ANY };
  if (key === "contact") return { ...filters, followUp: "Yes" };
  if (key === "appointment") return { ...filters, appointment: "Yes" };
  if (REFERRAL_TYPES.includes(key)) return { ...filters, type: key };
  return filters;
}

// Table columns. `value` is what the column sorts by. Kept de-identified on
// purpose: no name, reason (health details), or contact info. Those only
// show when a referral is opened.
export const COLUMNS = [
  { key: "clientId", label: "Client ID", value: (r) => r.clientId },
  { key: "language", label: "Language", value: (r) => r.language },
  { key: "type", label: "Type", value: (r) => r.type },
  { key: "provider", label: "Provider", value: referralCategory },
  { key: "organization", label: "Organization", value: (r) => r.organization },
  {
    key: "date",
    label: "Referred",
    value: (r) => r.date,
    render: (r) => formatMonth(r.date),
  },
  {
    key: "followUp",
    label: "Okay to follow up",
    value: (r) => r.okToContact,
  },
  {
    key: "appointment",
    label: "Appointment",
    value: (r) => r.appointmentMade,
  },
  {
    key: "status",
    label: "Status",
    value: (r) => String(STATUSES.indexOf(r.status)),
    render: (r) => (
      <span className={"badge " + statusClass(r.status)}>{r.status}</span>
    ),
  },
];

export default function ReferralLookup({
  referrals,
  initialFocus,
  onBack,
  onOpen,
}) {
  const [filters, setFilters] = useState(() => filtersFromFocus(initialFocus));
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "date", dir: "desc" });

  const total = referrals.length;
  const activeFilters = FILTERS.filter((f) => filters[f.key] !== ANY);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const column = COLUMNS.find((c) => c.key === sort.key);
    return referrals
      .filter((r) =>
        FILTERS.every(
          (f) => filters[f.key] === ANY || f.match(r, filters[f.key]),
        ),
      )
      .filter(
        (r) =>
          !q ||
          (r.clientId || "").toLowerCase().includes(q) ||
          (r.organization || "").toLowerCase().includes(q) ||
          referralCategory(r).toLowerCase().includes(q),
      )
      .sort((a, b) => {
        const order = String(column.value(a)).localeCompare(
          String(column.value(b)),
        );
        return sort.dir === "asc" ? order : -order;
      });
  }, [referrals, filters, search, sort]);

  function setFilter(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      // A provider picked under one type may not exist under another.
      ...(key === "type" && { provider: ANY }),
    }));
  }

  function toggleSort(key) {
    setSort((current) =>
      current.key === key
        ? { key, dir: current.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  }

  function clearFilters() {
    setSearch("");
    setFilters(NO_FILTERS);
  }

  return (
    <div>
      <PageHeader title="Referral Lookup" onBack={onBack} />

      <section className="sheet" aria-label="Referral list">
        <div className="sheet-toolbar">
          <input
            className="search"
            type="search"
            placeholder="Search client ID, organization, provider"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {activeFilters.map((f) => (
            <button
              key={f.key}
              className="chip"
              onClick={() => setFilter(f.key, ANY)}
              aria-label={"Remove filter " + f.label + ": " + filters[f.key]}
            >
              {f.label}: {filters[f.key]} ×
            </button>
          ))}
          <FilterMenu
            referrals={referrals}
            filters={filters}
            onChange={setFilter}
            onClear={() => setFilters(NO_FILTERS)}
          />
          <span className="sheet-count">
            {visible.length} of {total} rows
          </span>
        </div>

        {visible.length === 0 ? (
          <div className="empty">
            <p>No referrals match that search.</p>
            <button className="btn btn-secondary" onClick={clearFilters}>
              Clear search and filters
            </button>
          </div>
        ) : (
          <div className="sheet-scroll">
            <table className="sheet-table">
              <thead>
                <tr>
                  {COLUMNS.map((c) => {
                    const sorted = sort.key === c.key;
                    return (
                      <th
                        key={c.key}
                        scope="col"
                        aria-sort={
                          sorted
                            ? sort.dir === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                      >
                        <button
                          className="sort-btn"
                          onClick={() => toggleSort(c.key)}
                        >
                          {c.label}
                          <span className="sort-arrow" aria-hidden="true">
                            {sorted ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                          </span>
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.id} onClick={() => onOpen(r)}>
                    {COLUMNS.map((c) => (
                      <td key={c.key} className={"col-" + c.key}>
                        {c.key === "clientId" ? (
                          <button
                            className="cell-link"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpen(r);
                            }}
                          >
                            {r.clientId}
                          </button>
                        ) : c.render ? (
                          c.render(r)
                        ) : (
                          c.value(r)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

// "+ Filter" button with a small menu holding every filter.
function FilterMenu({ referrals, filters, onChange, onClear }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hasFilters = FILTERS.some((f) => filters[f.key] !== ANY);

  // Close on a click outside the menu or on Escape.
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="filter-menu" ref={ref}>
      <button
        className="filter-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        + Filter
      </button>
      {open && (
        <div className="filter-popover" role="group" aria-label="Filters">
          {FILTERS.map((f) => (
            <label key={f.key} className="filter-row">
              <span>{f.label}</span>
              <select
                value={filters[f.key]}
                onChange={(e) => onChange(f.key, e.target.value)}
              >
                <option value={ANY}>All</option>
                {f.options(referrals, filters).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
          {hasFilters && (
            <button className="filter-clear" onClick={onClear}>
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
