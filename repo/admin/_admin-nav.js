/* admin/_admin-nav.js */

(function () {

  console.log("ADMIN NAV LOADED");

  if (!window.APP_CONFIG) {
    alert("APP_CONFIG липсва. Провери дали config.js е зареден.");
    return;
  }

  const {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    ADMIN_EMAIL,
    BASE_PATH
  } = window.APP_CONFIG;

  if (!window.supabase) {
    alert("Supabase SDK не е зареден.");
    return;
  }

  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const BASE = (BASE_PATH || "/").endsWith("/")
    ? (BASE_PATH || "/")
    : (BASE_PATH + "/");

  function adminPath(p) {
    return BASE + "admin/" + p.replace(/^\//, "");
  }

  /* ================= ADMIN GUARD ================= */

  async function guardAdmin() {

    const { data: { session }, error } = await sb.auth.getSession();

    if (error || !session?.user?.email) {
      location.href = BASE + "login.html";
      return null;
    }

    const email = session.user.email.toLowerCase();

    if (email !== ADMIN_EMAIL.toLowerCase()) {
      location.href = BASE + "dashboard.html";
      return null;
    }

    return session;
  }

  /* ================= RENDER NAV ================= */

  function renderNav(session) {

    const nav = document.getElementById("appNav");

    if (!nav) {
      console.error("NAV container #appNav NOT FOUND");
      return;
    }

    nav.innerHTML = `
      <div class="mx-auto max-w-7xl flex flex-wrap items-center gap-3">

        <div class="font-extrabold text-slate-900">
          ADMIN PANEL
        </div>

        <span class="text-xs text-slate-500 hidden md:block">
          ${session.user.email}
        </span>

        <a class="px-3 py-2 rounded-xl hover:bg-slate-100" href="${adminPath("index.html")}">Табло</a>
        <a class="px-3 py-2 rounded-xl hover:bg-slate-100" href="${adminPath("modules.html")}">Модули</a>
        <a class="px-3 py-2 rounded-xl hover:bg-slate-100" href="${adminPath("lessons.html")}">Теми</a>
        <a class="px-3 py-2 rounded-xl hover:bg-slate-100" href="${adminPath("exams.html")}">Изпити</a>
        <a class="px-3 py-2 rounded-xl hover:bg-slate-100" href="${adminPath("results.html")}">Резултати</a>
        <a class="px-3 py-2 rounded-xl hover:bg-slate-100" href="${adminPath("statistics.html")}">Статистика</a>

        <button id="adminLogoutBtn"
          class="ml-auto px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800">
          Изход
        </button>

      </div>
    `;

    document.getElementById("adminLogoutBtn").onclick = async () => {
      await sb.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      location.href = BASE + "login.html";
    };

    /* ACTIVE PAGE HIGHLIGHT */

    const current = location.pathname.split("/").pop();

    nav.querySelectorAll("a").forEach(a => {
      if (a.getAttribute("href").endsWith(current)) {
        a.classList.add("bg-slate-200", "font-semibold");
      }
    });
  }

  /* ================= BOOT ================= */

  (async () => {

    const session = await guardAdmin();
    if (!session) return;

    renderNav(session);

    window.__sb_admin = sb;

  })();

})();
