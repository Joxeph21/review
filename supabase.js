import { createClient } from "https://esm.sh/@supabase/supabase-js";

const url = "https://ftxzkolsexefileehfct.supabase.co"
const anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0eHprb2xzZXhlZmlsZWVoZmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODg4NjgsImV4cCI6MjA3NzU2NDg2OH0.2QQkujmBezsMjNLExFqkEWUcX3zedfFxNuKGnSnWrAU"

export const supabase = createClient(url, anon_key)