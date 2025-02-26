
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const SUPABASE_URL = "https://etlpdeflabteercggcdv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0bHBkZWZsYWJ0ZWVyY2dnY2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1Mzk5NzgsImV4cCI6MjA1NjExNTk3OH0.sVft8l-4YQav_w5Mq-MjG9-9gvkf0hUp2Dvr5XAQS8Q";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
