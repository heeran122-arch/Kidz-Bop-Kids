/* ============================================
   KIDZ BOP KIDS - SUPABASE CONFIGURATION
   ============================================
   1. Go to your Supabase project -> Project Settings -> API
   2. Copy the "Project URL" and "anon public" key
   3. Paste them below
   4. Run the SQL in the setup guide to create the tables
   ============================================ */

const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; // e.g. https://abcdefgh.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Creates the shared client used by script.js and admin.js.
// Requires the Supabase JS library to be loaded first (see setup guide).
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
