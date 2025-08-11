
/* T-MAP • Support Widget (hide URL in UI)
   - Floating button + pop-up for questions to admin
   - Google sign-in via Supabase (redirectTo = location.href)
   - Modal show/hide fix (display: 'block')
   - UI: URL line hidden (still sent as page_url)
*/
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CONFIG = {
  SUPABASE_URL: "https://cmiylzpmpwqbacjoqtkx.supabase.co",
  SUPABASE_ANON: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtaXlsenBtcHdxYmFjam9xdGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODcwMDUsImV4cCI6MjA2OTU2MzAwNX0.FY2d1NSGTmw6SydxT_V0cKF7Kp2USbp91VdfO_eqZz8",
  ADMIN_EMAIL: "uzunov.ange@gmail.com",
};

const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON, {
  auth: { persistSession: true, detectSessionInUrl: true },
});

const host = document.createElement("div");
host.style.position = "fixed";
host.style.right = "18px";
host.style.bottom = "18px";
host.style.zIndex = "2147483000";
host.attachShadow({ mode: "open" });
document.addEventListener("DOMContentLoaded", () => document.body.appendChild(host));

const css = `
  .fab{display:inline-flex;align-items:center;gap:.5rem;background:#0f9a6a;color:#fff;border:none;border-radius:999px;padding:.75rem 1rem;
       box-shadow:0 10px 20px rgba(0,0,0,.15);cursor:pointer;font-weight:700}
  .fab svg{width:18px;height:18px}
  .backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none}
  .modal{position:fixed;right:16px;bottom:88px;width:min(420px,calc(100vw - 32px));background:#fff;border-radius:16px;border:1px solid #e5e7eb;
         box-shadow:0 24px 48px rgba(2,6,23,.18);display:none;overflow:hidden}
  .hd{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid #e5e7eb;font-weight:700;color:#064e3b}
  .bd{padding:14px;display:grid;gap:10px}
  .row{display:grid;gap:6px}
  label{font-size:.9rem;color:#334155;font-weight:600}
  input,select,textarea{width:100%;padding:10px 12px;border:1px solid #e5e7eb;border-radius:10px;font-size:.95rem}
  textarea{min-height:110px;resize:vertical}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border:none;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}
  .btn-primary{background:#0f9a6a;color:#fff}
  .btn-ghost{background:#f8fafc;border:1px solid #e2e8f0}
  .muted{font-size:.8rem;color:#64748b}
  .tabs{display:flex;gap:6px}.tab{padding:8px 10px;border-radius:10px;cursor:pointer;font-weight:600;color:#334155}
  .tab.active{background:#ecfdf5;color:#065f46}
  .ticket{border:1px solid #e5e7eb;border-radius:12px;padding:10px}
  .status{font-size:.75rem;font-weight:700;padding:2px 6px;border-radius:999px}
  .st-open{background:#eef2ff;color:#3730a3}.st-answered{background:#ecfeff;color:#155e75}.st-closed{background:#fee2e2;color:#991b1b}
`;
const svgChat = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v9H8l-4 4V5z"/></svg>';

const root = host.shadowRoot;
root.innerHTML = `
  <style>${css}</style>
  <button class="fab" id="fab" title="Въпрос към админа">${svgChat}Въпрос към админа</button>
  <div class="backdrop" id="backdrop"></div>
  <section class="modal" id="modal" role="dialog" aria-modal="true">
    <div class="hd">Поддръжка • T-MAP <button id="x" class="btn btn-ghost" aria-label="Затвори">✕</button></div>
    <div class="bd">
      <div class="tabs"><div id="t-new" class="tab active">Ново запитване</div><div id="t-my" class="tab">Моите запитвания</div></div>
      <div id="v-new">
        <div class="row"><label>Тема</label>
          <select id="subject">
            <option>Одобрение / защо не е публикуван обект?</option>
            <option>Корекция на местоположение</option>
            <option>Технически проблем</option>
            <option>Друго</option>
          </select>
        </div>
        <div class="row"><label>Въпрос</label>
          <textarea id="message" placeholder="Опиши накратко въпроса си…"></textarea>
        </div>
        <div id="auth" class="row"></div>
        <button id="send" class="btn btn-primary">Изпрати</button>
        <div id="hint" class="muted"></div>
      </div>
      <div id="v-my" style="display:none">
        <div id="list" style="display:grid;gap:8px"></div>
      </div>
    </div>
  </section>
`;

const $ = s => root.querySelector(s);
const show = el => { el.style.display = "block"; };
const hide = el => { el.style.display = "none"; };

$("#fab").onclick = ()=>{ show($("#modal")); show($("#backdrop")); };
$("#x").onclick = $("#backdrop").onclick = ()=>{ hide($("#modal")); hide($("#backdrop")); };

$("#t-new").onclick = ()=>{ $("#t-new").classList.add("active"); $("#t-my").classList.remove("active"); show($("#v-new")); hide($("#v-my")); };
$("#t-my").onclick = ()=>{ $("#t-my").classList.add("active"); $("#t-new").classList.remove("active"); hide($("#v-new")); show($("#v-my")); refresh(); };

async function renderAuth(){
  const { data } = await supabase.auth.getSession();
  const box = $("#auth");
  if(data?.session){
    box.innerHTML = `<div class="muted">Влязъл като <b>${data.session.user.email}</b>
      <button id="logout" class="btn btn-ghost" style="margin-left:8px">Изход</button></div>`;
    $("#logout").onclick = async()=>{ await supabase.auth.signOut(); renderAuth(); };
  }else{
    box.innerHTML = `<button id="login" class="btn btn-ghost">Влез с Google</button>`;
    $("#login").onclick = signInGoogle;
  }
}
renderAuth();

async function signInGoogle(){
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { skipBrowserRedirect: true, redirectTo: location.href }
  });
  if(error) { $("#hint").textContent = "Грешка при вход: "+error.message; return; }
  const w=520,h=600,l=(screen.width-w)/2,t=(screen.height-h)/2;
  const popup = window.open(data.url,"tmap_google_auth",`width=${w},height=${h},left=${l},top=${t}`);
  const iv=setInterval(async()=>{ const { data }=await supabase.auth.getSession();
    if(data?.session){ clearInterval(iv); try{popup.close()}catch{} renderAuth(); }
  }, 800);
}

$("#send").onclick = async()=>{
  $("#hint").textContent = "";
  const { data: sess } = await supabase.auth.getSession();
  if(!sess?.session){ $("#hint").textContent = "Моля, влез с Google първо."; return; }
  const subject = $("#subject").value.trim();
  const message = $("#message").value.trim();
  if(message.length < 8){ $("#hint").textContent="Опиши малко по-подробно (мин. 8 символа)."; return; }
  const payload = {
    user_id: sess.session.user.id,
    email:   sess.session.user.email,
    subject, message,
    page_url: location.href, status: "open"
  };
  const { error } = await supabase.from("support_tickets").insert(payload);
  if(error){ $("#hint").textContent = "Грешка: "+error.message; return; }
  $("#message").value = ""; $("#hint").textContent = "Изпратено! Ще получиш отговор тук.";
  $("#t-my").click();
};

async function refresh(){
  const { data: sess } = await supabase.auth.getSession();
  const box = $("#list");
  if(!sess?.session){ box.innerHTML = '<div class="muted">Влез с Google, за да видиш своите запитвания.</div>'; return; }
  const { data, error } = await supabase.from("support_tickets").select("*").order("created_at",{ascending:false}).limit(50);
  if(error){ box.textContent="Грешка при зареждане."; return; }
  if(!data?.length){ box.innerHTML = '<div class="muted">Все още нямаш запитвания.</div>'; return; }
  box.innerHTML = data.map(t=>{
    const st = t.status; const stc = st==="open"?"st-open":(st==="answered"?"st-answered":"st-closed");
    return `<div class="ticket">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <div style="font-weight:700">${escape(t.subject)}</div>
        <span class="status ${stc}">${st}</span>
      </div>
      <div class="muted" style="margin-top:4px">${new Date(t.created_at).toLocaleString()}</div>
      <div style="margin-top:6px;white-space:pre-wrap">${escape(t.message)}</div>
      ${t.admin_reply?`<div style="height:1px;background:#e5e7eb;margin:6px 0"></div>
        <div><b>Отговор:</b><br><div style="white-space:pre-wrap">${escape(t.admin_reply)}</div>
        <div class="muted" style="margin-top:4px">${t.replied_at?new Date(t.replied_at).toLocaleString():""}</div></div>`:""}
    </div>`;
  }).join("");
}
function escape(s){return s?.replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))||""}
