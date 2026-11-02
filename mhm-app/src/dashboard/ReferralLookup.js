import { useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import {
  STATUSES,
  appointmentSummary,
  contactSummary,
  focusLabel,
  formatDate,
  matchesFocus,
  referralCategory,
  statusClass,
} from "./referrals";

// Table columns. `value` is what the column sorts by.
const COLUMNS = [
  { key: "clientId", label: "Client ID", value: (r) => r.clientId },
  { key: "patient", label: "Patient", value: (r) => r.patient },
  { key: "language", label: "Language", value: (r) => r.language },
  { key: "type", label: "Type", value: (r) => r.type },
  { key: "provider", label: "Provider", value: referralCategory },
  { key: "organization", label: "Organization", value: (r) => r.organization },
  { key: "reason", label: "Reason", value: (r) => r.reason },
  {
    key: "date",
    label: "Referred",
    value: (r) => r.date,
    render: (r) => formatDate(r.date),
  },
  { key: "contact", label: "Follow-up contact", value: contactSummary },
  {
    key: "appointment",
    label: "Appointment",
    value: (r) =>
      r.appointmentMade === "Yes" ? "1" + (r.appointmentDate || "") : "0",
    render: appointmentSummary,
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

export default function ReferralLookup({ referrals, initialFocus, onBack, onOpen }) {
  const [focus, setFocus] = useState(initialFocus);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "date", dir: "desc" });

  const total = referrals.length;

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const column = COLUMNS.find((c) => c.key === sort.key);
    return referrals
      .filter((r) => matchesFocus(r, focus))
      .filter((r) => statusFilter === "All" || r.status === statusFilter)
      .filter(
        (r) =>
          !q ||
          r.patient.toLowerCase().includes(q) ||
          (r.clientId || "").toLowerCase().includes(q) ||
          (r.organization || "").toLowerCase().includes(q) ||
          referralCategory(r).toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const order = String(column.value(a)).localeCompare(
          String(column.value(b))
        );
        return sort.dir === "asc" ? order : -order;
      });
  }, [referrals, focus, statusFilter, search, sort]);

  function toggleSort(key) {
    setSort((current) =>
      current.key === key
        ? { key, dir: current.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  }

  function clearFilters() {
    setSearch("");
    setFocus(null);
    setStatusFilter("All");
  }

  return (
    <div>
      <PageHeader title="Referral Lookup" onBack={onBack} />

      <section className="sheet" aria-label="Referral list">
        <div className="sheet-toolbar">
          <input
            className="search"
            type="search"
            placeholder="Search patient, client ID, organization"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by follow-up status"
          >
            <option value="All">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {focus && (
            <button className="chip" onClick={() => setFocus(null)}>
              {focusLabel(focus)} ×
            </button>
          )}
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
                        {c.key === "patient" ? (
                          <button
                            className="cell-link"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpen(r);
                            }}
                          >
                            {r.patient}
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
