// admin/_admin-nav.js

(async function () {

  console.log("ADMIN NAV INIT");

  /* ================= WAIT DOM ================= */

  if (document.readyState === "loading") {
    await new Promise(r => {
      document.addEventListener("DOMContentLoaded", r, { once: true });
    });
  }

  /* ================= CONFIG CHECK ================= */

  if (!window.APP_CONFIG) {
    console.error("APP_CONFIG missing");
    alert("CONFIG не е зареден");
    return;
  }

  if (!window.supabase) {
    console.error("Supabase SDK missing");
    alert("Supabase SDK липсва");
    return;
  }

  const {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    ADMIN_EMAIL,
    BASE_PATH
  } = window.APP_CONFIG;

  /* ================= CLIENT ================= */

  const sb = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  /* ================= AUTH GUARD ================= */

  const { data, error } = await sb.auth.getSession();

  if (error || !data?.session) {
    console.warn("No admin session");
    location.href = (BASE_PATH || "/") + "login.html";
    return;
  }

  const email = (data.session.user.email || "").toLowerCase();

  if (email !== ADMIN_EMAIL.toLowerCase()) {
    console.warn("Not admin:", email);
    location.href = (BASE_PATH || "/") + "login.html";
    return;
  }

  /* ================= EXPORT ADMIN CLIENT ================= */

  window.__sb_admin = sb;

  /* ================= PATH NORMALIZER ================= */

  function normalizeBase() {
    if (!BASE_PATH) return "/";
    if (!BASE_PATH.endsWith("/")) return BASE_PATH + "/";
    return BASE_PATH;
  }

  const BASE = normalizeBase();

  const adminPath = file => BASE + "admin/" + file;

  /* ================= NAV RENDER ================= */

  const header = document.createElement("header");

  header.className =
    "sticky top-0 z-50 bg-white border-b shadow-sm";

  header.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

      <div class="flex items-center gap-3">
        <div class="font-extrabold text-slate-900">ADMIN</div>
        <div class="hidden sm:block text-xs text-slate-500">${email}</div>
      </div>

      <nav class="flex flex-wrap items-center gap-2 text-sm">

        <a data-link href="${adminPath("index.html")}">Табло</a>
        <a data-link href="${adminPath("modules.html")}">Модули</a>
        <a data-link href="${adminPath("lessons.html")}">Теми</a>
        <a data-link href="${adminPath("exams.html")}">Изпити</a>
        <a data-link href="${adminPath("stats.html")}">Статистика</a>

        <button id="adminLogout"
          class="ml-2 px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800">
          Изход
        </button>

      </nav>
    </div>
  `;

  document.body.prepend(header);

  /* ================= STYLE LINKS ================= */

  document.querySelectorAll("[data-link]").forEach(a => {
    a.className =
      "px-3 py-2 rounded-lg hover:bg-slate-100 transition";
  });

  /* ================= ACTIVE PAGE ================= */

  const current = location.pathname.split("/").pop();

  document.querySelectorAll("[data-link]").forEach(a => {
    if (a.getAttribute("href").endsWith(current)) {
      a.classList.add("bg-slate-100", "font-semibold");
    }
  });

  /* ================= LOGOUT ================= */

  document.getElementById("adminLogout").onclick = async () => {

    try {
      await sb.auth.signOut();
    } catch (e) {
      console.warn("Logout error", e);
    }

    localStorage.clear();
    sessionStorage.clear();

    location.href = BASE + "login.html";
  };

  console.log("ADMIN NAV READY");

})();
