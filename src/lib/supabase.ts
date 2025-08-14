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
export type UserRole = "member" | "admin" | "super_admin";

export interface User {
  id: number; // int8 PK
  auth_id: string; // uuid, references auth.users.id
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Project {
  id: number; // int8 PK
  user_id: number; // int8, references users.id
  title: string;
  description: string;
  status: "in_progress" | "completed";
  created_at: string;
}

export interface Blog {
  id: number; // int8 PK
  user_id: number; // int8, references users.id
  title: string;
  content: string;
  status: "draft" | "pending" | "approved" | "rejected";
  created_at: string;
}

export interface Invitation {
  id: number; // int8 PK
  email: string;
  role: "member" | "admin";
  invited_by: number; // int8, references users.id
  accepted: boolean;
  created_at: string;
}
