// nav.js

let NAV_LOADED = false;

async function loadNav() {

  if (NAV_LOADED) return;
  NAV_LOADED = true;

  if (!window.APP_CONFIG || !window.supabase) return;

  const { SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL } = window.APP_CONFIG;
  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const nav = document.getElementById("appNav");
  if (!nav) return;

  const { data: { session } } = await sb.auth.getSession();

  const path = location.pathname.toLowerCase();
  const inAdminFolder = path.includes("/admin/");

  // helper за active link
  const isActive = (p) => path.includes(p) ? "bg-slate-900 text-white" : "border hover:bg-slate-100";

  // ================= НЕВЛЯЗЪЛ =================
  if (!session) {

    nav.innerHTML = `
      <a href="${inAdminFolder ? "../login.html" : "./login.html"}"
         class="px-4 py-2 rounded bg-slate-900 text-white font-semibold">
        Вход
      </a>
    `;

    return;
  }

  const email = session.user.email || "";
  const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const rootPath = inAdminFolder ? "../" : "./";
  const adminPath = inAdminFolder ? "./" : "./admin/";

  // ================= ВЛЯЗЪЛ =================
  nav.innerHTML = `

    <a href="${isAdmin ? adminPath + "index.html" : rootPath + "dashboard.html"}"
       class="px-4 py-2 rounded font-semibold ${isActive("dashboard") || isActive("index")}">
       Табло
    </a>

    ${isAdmin ? `

      <a href="${adminPath}modules.html"
         class="px-4 py-2 rounded ${isActive("modules")}">
         Модули
      </a>

      <a href="${adminPath}lessons.html"
         class="px-4 py-2 rounded ${isActive("lessons")}">
         Теми
      </a>

      <a href="${adminPath}exams.html"
         class="px-4 py-2 rounded ${isActive("exams")}">
         Изпити
      </a>

      <a href="${adminPath}questions.html"
         class="px-4 py-2 rounded ${isActive("questions")}">
         Въпроси
      </a>

      <a href="${adminPath}stats.html"
         class="px-4 py-2 rounded ${isActive("stats")}">
         Статистика
      </a>

    ` : `

      <a href="${rootPath}results.html"
         class="px-4 py-2 rounded ${isActive("results")}">
         Моите резултати
      </a>

    `}

    <div class="ml-auto flex items-center gap-3">

      <span class="text-sm text-slate-600 hidden md:block">
        ${email}
      </span>

      <button id="logoutBtn"
        class="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold">
        Изход
      </button>

    </div>
  `;

  // ================= LOGOUT =================
  document.getElementById("logoutBtn").onclick = async () => {
    await sb.auth.signOut();
    location.href = rootPath + "login.html";
  };

}

document.addEventListener("DOMContentLoaded", loadNav);
