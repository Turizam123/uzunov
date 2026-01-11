<!-- Запази като: config.js -->
<script>
  // Supabase (ползвам данните от твоя проект, които вече ми даде)
  window.APP_CONFIG = {
    SUPABASE_URL: "https://cmiylzpmpwqbacjoqtkx.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtaXlsenBtcHdxYmFjam9xdGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODcwMDUsImV4cCI6MjA2OTU2MzAwNX0.FY2d1NSGTmw6SydxT_V0cKF7Kp2USbp91VdfO_eqZz8",
    ADMIN_EMAIL: "uzunov.ange@gmail.com",
    // GitHub Pages callback: <repo>/login.html
    // Ако репото ти е https://username.github.io/repo/
    // то redirectTo трябва да е: https://username.github.io/repo/login.html
    REDIRECT_URL: (location.origin + location.pathname.replace(/\/[^\/]*$/, "/login.html"))
  };
</script>
