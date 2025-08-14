import { createClient } from "@supabase/supabase-js";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

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
