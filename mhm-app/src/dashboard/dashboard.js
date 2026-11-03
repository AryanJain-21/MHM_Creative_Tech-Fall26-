import { useState } from "react";
import "./dashboard.css";
import {
  EMPTY_REFERRAL,
  SAMPLE_REFERRALS,
  formatMonth,
  nextClientId,
  referralCategory,
  statusClass,
  todayISO,
} from "./referrals";
import {
  LogoMark,
  PlusIcon,
  SearchIcon,
  ShareIcon,
  UserIcon,
} from "./icons";
import ReferralForm from "./ReferralForm";
import ReferralLookup from "./ReferralLookup";
import Metrics from "./Metrics";

// Placeholder until sign-in exists.
const CURRENT_USER = "Jane Doe";

const RECENT_COUNT = 8;

export default function Dashboard() {
  const [referrals, setReferrals] = useState(SAMPLE_REFERRALS);
  // { page: "home" | "form" | "lookup" | "metrics", ...page options }
  const [view, setView] = useState({ page: "home" });

  function goHome() {
    setView({ page: "home" });
  }

  function openNew() {
    setView({
      page: "form",
      from: view,
      referral: {
        ...EMPTY_REFERRAL,
        clientId: nextClientId(referrals),
        date: todayISO(),
      },
    });
  }

  function openReferral(referral) {
    setView({ page: "form", from: view, referral });
  }

  function saveReferral(updated) {
    if (updated.id === null) {
      setReferrals((list) => [...list, { ...updated, id: Date.now() }]);
    } else {
      setReferrals((list) =>
        list.map((r) => (r.id === updated.id ? updated : r))
      );
    }
    setView(view.from || { page: "home" });
  }

  return (
    <div className="mhm">
      <header className="mhm-header">
        <button className="mhm-brand" onClick={goHome}>
          <LogoMark className="mhm-mark" />
          <span className="mhm-brand-name">
            Mobile
            <br />
            Health Map
          </span>
          <span className="mhm-brand-divider" aria-hidden="true" />
          <span className="mhm-product">
            Referral
            <br />
            Dashboard
          </span>
        </button>
        <button className="mhm-account" aria-label={"Account: " + CURRENT_USER}>
          <UserIcon className="mhm-account-icon" />
        </button>
      </header>

      <main className="mhm-main">
        {view.page === "home" && (
          <Home
            referrals={referrals}
            onNew={openNew}
            onLookup={() => setView({ page: "lookup" })}
            onMetrics={() => setView({ page: "metrics" })}
            onOpen={openReferral}
          />
        )}

        {view.page === "form" && (
          <ReferralForm
            key={view.referral.id ?? "new"}
            referral={view.referral}
            onBack={() => setView(view.from || { page: "home" })}
            onSave={saveReferral}
          />
        )}

        {view.page === "lookup" && (
          <ReferralLookup
            referrals={referrals}
            initialFocus={view.focus || null}
            onBack={goHome}
            onOpen={openReferral}
          />
        )}

        {view.page === "metrics" && (
          <Metrics
            referrals={referrals}
            onBack={goHome}
            onDrillDown={(focus) => setView({ page: "lookup", focus })}
          />
        )}
      </main>
    </div>
  );
}

function Home({ referrals, onNew, onLookup, onMetrics, onOpen }) {
  const recent = [...referrals]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, RECENT_COUNT);

  return (
    <div className="home">
      <h1 className="page-title">Hello, {CURRENT_USER}</h1>

      <div className="home-grid">
        <nav className="tiles" aria-label="Dashboard actions">
          <button className="tile tile-crimson" onClick={onNew}>
            <span className="tile-label">New Referral</span>
            <PlusIcon className="tile-icon" />
          </button>
          <button className="tile tile-teal" onClick={onLookup}>
            <span className="tile-label">Referral Lookup</span>
            <SearchIcon className="tile-icon" />
          </button>
          <button className="tile tile-black" onClick={onMetrics}>
            <span className="tile-label">Metrics</span>
            <ShareIcon className="tile-icon" />
          </button>
        </nav>

        <section className="activity" aria-labelledby="activity-title">
          <h2 id="activity-title" className="activity-title">
            Recent Activity
          </h2>
          <ul className="activity-list">
            {recent.map((r) => (
              <li key={r.id}>
                <button className="activity-item" onClick={() => onOpen(r)}>
                  <UserIcon className="activity-avatar" />
                  <span className="activity-text">
                    <span className="activity-name">
                      {r.clientId}
                      <span className={"badge " + statusClass(r.status)}>
                        {r.status}
                      </span>
                    </span>
                    <span className="activity-preview">
                      {referralCategory(r)} · {r.organization} ·{" "}
                      {formatMonth(r.date)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
