const SUPABASE_URL = "https://cmiylzpmpwqbacjoqtkx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtaXlsenBtcHdxYmFjam9xdGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODcwMDUsImV4cCI6MjA2OTU2MzAwNX0.FY2d1NSGTmw6SydxT_V0cKF7Kp2USbp91VdfO_eqZz8";

const sb = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
