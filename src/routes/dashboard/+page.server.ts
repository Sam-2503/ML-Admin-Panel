import { supabase } from "$lib/supabase";

export async function load() {
  // Connection check
  let connectionError = "";
  let supabaseConnected = false;

  try {
    const { error } = await supabase.from("members").select("count").limit(1);
    if (error) {
      if (error.message.includes("JWT")) {
        connectionError =
          "Authentication error - please check your Supabase credentials";
      } else if (
        error.message.includes("relation") ||
        error.message.includes("does not exist")
      ) {
        connectionError =
          "Database tables not found - please run the database schema first";
      } else {
        connectionError = `Database connection failed: ${error.message}`;
      }
      supabaseConnected = false;
    } else {
      supabaseConnected = true;
      connectionError = "";
    }
  } catch (error) {
    connectionError =
      "Failed to connect to database - check your environment variables";
    supabaseConnected = false;
  }

  let members = [];
  let projects = [];
  let blogs = [];
  let events = [];
  let errorMembers = "";
  let errorProjects = "";
  let errorBlogs = "";
  let errorEvents = "";

  if (supabaseConnected) {
    // Members
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        errorMembers = error.message;
      } else {
        members = data ?? [];
      }
    } catch (error) {
      errorMembers = "Error loading members";
    }

    // Projects
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        errorProjects = error.message;
      } else {
        projects = data ?? [];
      }
    } catch (error) {
      errorProjects = "Error loading projects";
    }

    // Blogs
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        errorBlogs = error.message;
      } else {
        blogs = data ?? [];
      }
    } catch (error) {
      errorBlogs = "Error loading blogs";
    }

    // Events (if you have an events table, fetch from DB; else, use dummy data)
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });
      if (error) {
        errorEvents = error.message;
        events = [
          {
            id: 1,
            title: "Introduction to Machine Learning Workshop",
            description:
              "A hands-on workshop covering the basics of ML algorithms",
            date: "2024-02-15",
            time: "14:00",
            duration: "3 hours",
            location: "Room 301, Engineering Building",
            capacity: 50,
            registeredCount: 35,
            status: "upcoming",
            category: "Workshop",
            organizer: "Dr. Sarah Chen",
          },
          {
            id: 2,
            title: "AI Ethics Panel Discussion",
            description: "Join industry experts for a discussion on AI ethics",
            date: "2024-02-20",
            time: "18:00",
            duration: "2 hours",
            location: "Auditorium A",
            capacity: 200,
            registeredCount: 180,
            status: "upcoming",
            category: "Panel Discussion",
            organizer: "Prof. Michael Rodriguez",
          },
        ];
      } else {
        events = data ?? [];
      }
    } catch (error) {
      errorEvents = "Error loading events";
    }
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
  };
}
