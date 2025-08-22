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

// Types for our database schema based on actual database structure
export type UserRole = "member" | "admin" | "super_admin";

export interface Member {
  id: number; // bigint PK
  created_at: string; // timestamp with time zone
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string | null;
  auth_id: string; // uuid, references auth.users.id
  phone_num: string | null;
  batch: number | null;
  profile_status: boolean | null;
}

export interface Project {
  id: number; // bigint PK
  title: string | null;
  status: string | null;
  created_at: string; // timestamp with time zone
  user_id: number | null; // bigint, references users_21.id
}

export interface Blog {
  id: number; // bigint PK
  title: string | null;
  status: string | null;
  created_at: string; // timestamp with time zone
  user_id: number | null; // bigint, references users_21.id
}

export interface Invitation {
  id: number; // bigint PK
  email: string | null;
  role: string | null;
  accepted: boolean | null;
  created_at: string; // timestamp with time zone
  invited_by: number | null; // bigint, references users_21.id
}
