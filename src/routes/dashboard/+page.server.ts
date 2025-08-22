import { supabase } from "$lib/supabase";

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
