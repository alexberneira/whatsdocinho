import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iiqgywuempsxsvsmebjj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcWd5d3VlbXBzeHN2c21lYmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NTUwMTMsImV4cCI6MjA2NjEzMTAxM30.tEOczSnVXAXeLkh3b3OoSLIFFOpVXULCb_llR8YxTMA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 