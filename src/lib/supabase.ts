import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bhrxieqrtfudpkupdtsx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJocnhpZXFydGZ1ZHBrdXBkdHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MDc0MzYsImV4cCI6MjA2OTA4MzQzNn0.B_Nb7BcDqk9Vt-z4AwDcjDaTRkpCb3-NqGePSbhyCmU";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database schema
export interface User {
  id: string;
  email: string;
  role: "member" | "admin" | "super_admin";
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  github_url?: string;
  live_url?: string;
  status: "in_progress" | "completed";
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  user_id: string;
  title: string;
  content: string;
  status: "draft" | "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  created_by: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  created_at: string;
  updated_at: string;
}
