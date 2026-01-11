// nav.js
async function loadNav() {
  if (!window.APP_CONFIG || !window.supabase) return;

  const { SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL } = window.APP_CONFIG;
  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const nav = document.getElementById("appNav");
  if (!nav) return;

  const { data: { session } } = await sb.auth.getSession();

  // === НЕВЛЯЗЪЛ ===
  if (!session) {
    nav.innerHTML = `
      <a href="./login.html"
         class="px-4 py-2 rounded bg-slate-900 text-white font-semibold">
        Вход
      </a>
    `;
    return;
  }

  const email = session.user.email || "";
  const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // === ВЛЯЗЪЛ ===
  nav.innerHTML = `
    <a href="${isAdmin ? "./admin/index.html" : "./dashboard.html"}"
       class="px-4 py-2 rounded border font-semibold hover:bg-white">
       Табло
    </a>

    ${isAdmin ? `
      <a href="./admin/modules.html" class="px-4 py-2 rounded border">Модули</a>
      <a href="./admin/lessons.html" class="px-4 py-2 rounded border">Теми</a>
      <a href="./admin/exams.html" class="px-4 py-2 rounded border">Изпити</a>
      <a href="./admin/questions.html" class="px-4 py-2 rounded border">Въпроси</a>
      <a href="./admin/stats.html" class="px-4 py-2 rounded border">Статистика</a>
    ` : `
      <a href="./results.html" class="px-4 py-2 rounded border">
        Моите резултати
      </a>
    `}

    <span class="ml-auto text-sm text-slate-600">${email}</span>

    <button id="logoutBtn"
      class="ml-2 px-4 py-2 rounded bg-red-600 text-white">
      Изход
    </button>
  `;

  document.getElementById("logoutBtn").onclick = async () => {
    await sb.auth.signOut();
    location.href = "./login.html";
  };
}

document.addEventListener("DOMContentLoaded", loadNav);
