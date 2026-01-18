// admin/_admin-nav.js
(async function () {

  console.log("ADMIN NAV INIT");

  if (!window.APP_CONFIG) {
    alert("APP_CONFIG липсва");
    return;
  }

  if (!window.supabase) {
    alert("Supabase SDK не е зареден");
    return;
  }

  const {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    ADMIN_EMAIL,
    BASE_PATH
  } = window.APP_CONFIG;

  const sb = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  // ================= AUTH GUARD =================

  const { data, error } = await sb.auth.getSession();

  if (error || !data?.session) {
    location.href = (BASE_PATH || "/") + "login.html";
    return;
  }

  const email = (data.session.user.email || "").toLowerCase();

  if (email !== ADMIN_EMAIL.toLowerCase()) {
    location.href = (BASE_PATH || "/") + "login.html";
    return;
  }

  // ================= EXPORT CLIENT =================

  window.__sb_admin = sb;

  // ================= PATH HELPER =================

  const base =
    (BASE_PATH || "/").endsWith("/")
      ? (BASE_PATH || "/")
      : BASE_PATH + "/";

  const p = name => base + "admin/" + name;

  // ================= RENDER NAV =================

  const header = document.createElement("header");

  header.className =
    "sticky top-0 z-50 bg-white border-b shadow-sm";

  header.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

      <div class="flex items-center gap-3">
        <div class="font-extrabold">ADMIN</div>
        <div class="hidden sm:block text-xs text-slate-500">${email}</div>
      </div>

      <nav class="flex flex-wrap items-center gap-2 text-sm">

        <a href="${p("index.html")}" class="px-3 py-2 rounded hover:bg-slate-100">Табло</a>
        <a href="${p("modules.html")}" class="px-3 py-2 rounded hover:bg-slate-100">Модули</a>
        <a href="${p("lessons.html")}" class="px-3 py-2 rounded hover:bg-slate-100">Теми</a>
        <a href="${p("exams.html")}" class="px-3 py-2 rounded hover:bg-slate-100">Изпити</a>
        <a href="${p("stats.html")}" class="px-3 py-2 rounded hover:bg-slate-100">Статистика</a>

        <button id="adminLogout"
          class="ml-2 px-3 py-2 rounded bg-slate-900 text-white hover:bg-slate-800">
          Изход
        </button>

      </nav>
    </div>
  `;

  document.body.prepend(header);

  // ================= LOGOUT =================

  document.getElementById("adminLogout").onclick = async () => {
    await sb.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    location.href = (BASE_PATH || "/") + "login.html";
  };

  console.log("ADMIN NAV READY");

})();
