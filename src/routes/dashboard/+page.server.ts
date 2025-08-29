import { fail, json } from "@sveltejs/kit";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "$lib/supabase";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";

import { PRIVATE_SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = PRIVATE_SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export const actions = {
  addMember: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;

    // Invite user via Supabase Admin API
    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { name, role },
    });

    if (error) {
      return fail(400, { error: error.message });
    }

    return { success: true };
  },
};

export async function load() {
  let connectionError = "";
  let supabaseConnected = false;

  let loadingMembers = true;
  let loadingProjects = true;
  let loadingBlogs = true;
  let loadingEvents = true;

  let members = [];
  let projects = [];
  let blogs = [];
  let events = [];
  let errorMembers = "";
  let errorProjects = "";
  let errorBlogs = "";
  let errorEvents = "";

  try {
    const { error } = await supabase.from("members").select("count").limit(1);
    if (error) {
      connectionError = error.message;
      supabaseConnected = false;
    } else {
      supabaseConnected = true;
    }
  } catch (error) {
    connectionError = "Failed to connect to database";
    supabaseConnected = false;
  }

  if (supabaseConnected) {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) errorMembers = error.message;
      else members = data ?? [];
    } catch (error) {
      errorMembers = "Error loading members";
    }
    loadingMembers = false;

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) errorProjects = error.message;
      else projects = data ?? [];
    } catch (error) {
      errorProjects = "Error loading projects";
    }
    loadingProjects = false;

    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) errorBlogs = error.message;
      else blogs = data ?? [];
    } catch (error) {
      errorBlogs = "Error loading blogs";
    }
    loadingBlogs = false;

    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });
      if (error) errorEvents = error.message;
      else events = data ?? [];
    } catch (error) {
      errorEvents = "Error loading events";
    }
    loadingEvents = false;
  } else {
    loadingMembers = false;
    loadingProjects = false;
    loadingBlogs = false;
    loadingEvents = false;
  }

  return {
    members,
    projects,
    blogs,
    events,
    errorMembers,
    errorProjects,
    errorBlogs,
    errorEvents,
    connectionError,
    loadingMembers,
    loadingProjects,
    loadingBlogs,
    loadingEvents,
  };
}
