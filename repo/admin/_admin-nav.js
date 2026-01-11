/* admin/_admin-nav.js
   Вмъква админ навигация + admin guard за всички admin страници.
   Изисква:
   - да е зареден supabase-js
   - да е зареден config.js (window.APP_CONFIG)
*/

(function () {
  if (!window.APP_CONFIG) {
    alert("APP_CONFIG липсва. Провери дали config.js е зареден.");
    return;
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL, BASE_PATH } = window.APP_CONFIG;

  if (!window.supabase) {
    alert("Supabase SDK не е зареден.");
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  function path(p) {
    // BASE_PATH трябва да завършва с "/" (напр. "/repo/") или да е "/"
    const base = (BASE_PATH || "/").endsWith("/") ? (BASE_PATH || "/") : (BASE_PATH + "/");
    // admin страниците са в /admin/
    return base + "admin/" + p.replace(/^\//, "");
  }

  async function guardAdmin() {
    const { data: { session }, error } = await sb.auth.getSession();

    if (error) {
      console.error(error);
      location.href = (BASE_PATH || "/") + "login.html";
      return null;
    }

    if (!session?.user?.email) {
      location.href = (BASE_PATH || "/") + "login.html";
      return null;
    }

    const email = (session.user.email || "").toLowerCase();
    if (email !== (ADMIN_EMAIL || "").toLowerCase()) {
      // не е админ → връщаме го към student dashboard (или login)
      location.href = (BASE_PATH || "/") + "student/dashboard.html";
      return null;
    }

    return session;
  }

  function renderNav(session) {
    const container = document.createElement("div");
    container.innerHTML = `
      <header class="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div class="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="font-extrabold text-slate-900">Админ</div>
            <div class="hidden sm:block text-xs text-slate-500">${session.user.email}</div>
          </divdiv>
          <nav class="flex flex-wrap items-center gap-2 text-sm">
            <a class="px-3 py-2 rounded-xl hover:bg-slate-100" href="${path("index.html")}">Табло</a>
            <a class="px-3 py-2 rounded-xl hover:bg-slate-100" href="${path("modules.html")}">Модули</a>
            <a class="px-3 py-2 rounded-xl hover:bg-slate-100" href="${path("lessons.html")}">Теми</a>
            <a class="px-3 py-2 rounded-xl hover:bg-slate-100" href="${path("exams.html")}">Изпити</a>
            <a class="px-3 py-2 rounded-xl hover:bg-slate-100" href="${path("results.html")}">Резултати</a>
            <a class="px-3 py-2 rounded-xl hover:bg-slate-100" href="${path("grades.html")}">Оценки</a>
            <a class="px-3 py-2 rounded-xl hover:bg-slate-100" href="${path("access-codes.html")}">Кодове</a>
            <a class="px-3 py-2 rounded-xl hover:bg-slate-100" href="${path("statistics.html")}">Статистика</a>
            <button id="adminLogoutBtn" class="px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800">Изход</button>
          </nav>
        </div>
      </header>
    `;

    document.body.prepend(container.firstElementChild);

    const btn = document.getElementById("adminLogoutBtn");
    btn?.addEventListener("click", async () => {
      try {
        await sb.auth.signOut();
      } finally {
        localStorage.clear();
        sessionStorage.clear();
        location.href = (BASE_PATH || "/") + "login.html";
      }
    });

    // Активна страница (подчертаване)
    const current = location.pathname.split("/").pop();
    document.querySelectorAll("header nav a").forEach(a => {
      const href = a.getAttribute("href") || "";
      if (href.endsWith("/" + current) || href.endsWith(current)) {
        a.classList.add("bg-slate-100", "font-semibold");
      }
    });
  }

  // Boot
  (async () => {
    const session = await guardAdmin();
    if (!session) return;
    renderNav(session);
    // експортираме sb за да се използва от страниците
    window.__sb_admin = sb;
  })();
})();
