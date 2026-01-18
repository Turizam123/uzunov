/* admin/_admin-nav.js */

document.addEventListener("DOMContentLoaded", async () => {

  console.log("ADMIN NAV START");

  if (!window.APP_CONFIG) {
    alert("APP_CONFIG missing");
    return;
  }

  const {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    ADMIN_EMAIL,
    BASE_PATH
  } = window.APP_CONFIG;

  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const BASE = (BASE_PATH || "/").endsWith("/")
    ? (BASE_PATH || "/")
    : (BASE_PATH + "/");

  function adminPath(p) {
    return BASE + "admin/" + p;
  }

  /* ================= ADMIN GUARD ================= */

  const { data: { session } } = await sb.auth.getSession();

  if (!session?.user?.email) {
    location.href = BASE + "login.html";
    return;
  }

  const email = session.user.email.toLowerCase();

  if (email !== ADMIN_EMAIL.toLowerCase()) {
    location.href = BASE + "dashboard.html";
    return;
  }

  /* ================= EXPORT CLIENT ================= */

  window.__sb_admin = sb;

  /* ================= RENDER NAV ================= */

  const nav = document.getElementById("appNav");

  if (!nav) {
    console.error("NAV CONTAINER NOT FOUND");
    return;
  }

  nav.innerHTML = `
    <div class="mx-auto max-w-7xl flex flex-wrap items-center gap-3">

      <div class="font-extrabold text-slate-900">
        ADMIN PANEL
      </div>

      <span class="hidden md:block text-xs text-slate-500">
        ${session.user.email}
      </span>

      <a href="${adminPath("index.html")}" class="px-3 py-2 rounded hover:bg-slate-100">Табло</a>
      <a href="${adminPath("modules.html")}" class="px-3 py-2 rounded hover:bg-slate-100">Модули</a>
      <a href="${adminPath("lessons.html")}" class="px-3 py-2 rounded hover:bg-slate-100">Теми</a>
      <a href="${adminPath("exams.html")}" class="px-3 py-2 rounded hover:bg-slate-100">Изпити</a>
      <a href="${adminPath("results.html")}" class="px-3 py-2 rounded hover:bg-slate-100">Резултати</a>
      <a href="${adminPath("statistics.html")}" class="px-3 py-2 rounded hover:bg-slate-100">Статистика</a>

      <button id="adminLogoutBtn"
        class="ml-auto bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800">
        Изход
      </button>

    </div>
  `;

  document.getElementById("adminLogoutBtn").onclick = async () => {
    await sb.auth.signOut();
    location.href = BASE + "login.html";
  };

  // Active page highlight
  const current = location.pathname.split("/").pop();

  nav.querySelectorAll("a").forEach(a => {
    if (a.href.endsWith(current)) {
      a.classList.add("bg-slate-200", "font-semibold");
    }
  });

  console.log("ADMIN NAV READY");

});
