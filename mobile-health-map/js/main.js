/* ---------- Date fields: look blank like the mockup, but open a date picker on click ---------- */
document.querySelectorAll(".date-input").forEach((el) => {
  el.addEventListener("focus", () => {
    el.type = "date";
    if (el.showPicker) { try { el.showPicker(); } catch (e) {} }
  });
  el.addEventListener("blur", () => {
    if (!el.value) el.type = "text";
  });
});

/* ---------- Create Referral: save + return to dashboard ---------- */
const form = document.getElementById("referral-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const saved = JSON.parse(localStorage.getItem("referrals") || "[]");
      saved.unshift({
        name: data.clientName || "Unnamed client",
        info: "New referral" + (data.orgName ? " to " + data.orgName : "") + " created",
      });
      localStorage.setItem("referrals", JSON.stringify(saved));
    } catch (err) {
      console.warn("Could not save referral:", err);
    }

    window.location.href = "index.html";
  });
}

/* ---------- Dashboard: show newly created referrals at the top of Recent Activity ---------- */
const list = document.getElementById("activity-list");
if (list) {
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem("referrals") || "[]"); } catch (e) {}

  const avatarSVG =
    '<svg class="avatar" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#000"/><circle cx="12" cy="12" r="9.2" fill="#fff"/><circle cx="12" cy="9.6" r="3.6" fill="#000"/><path d="M4.9 18.4c1.3-3 4-4.4 7.1-4.4s5.8 1.4 7.1 4.4A9.2 9.2 0 0 1 12 21.2a9.2 9.2 0 0 1-7.1-2.8z" fill="#000"/></svg>';

  saved.reverse().forEach((r) => {
    const card = document.createElement("div");
    card.className = "activity-card";
    card.innerHTML = avatarSVG + '<div><div class="activity-name"></div><div class="activity-info"></div></div>';
    card.querySelector(".activity-name").textContent = r.name;
    card.querySelector(".activity-info").textContent = r.info;
    list.prepend(card);
  });
}