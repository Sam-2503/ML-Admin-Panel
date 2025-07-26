import { supabase, type Project } from "./supabase";

// Create new project (Members can create their own projects)
export async function createProject(
  projectData: Omit<Project, "id" | "created_at" | "updated_at">
) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        ...projectData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, project: data };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error };
  }
}

// Get all projects (Admins and Super Admins can see all, Members see their own)
export async function getAllProjects(userId?: string, userRole?: string) {
  try {
    let query = supabase
      .from("projects")
      .select(
        `
        *,
        user:users!projects_user_id_fkey(email),
        profile:profiles!projects_user_id_fkey(first_name, last_name)
      `
      )
      .order("created_at", { ascending: false });

    // If user is not admin/super_admin, only show their own projects
    if (
      userRole &&
      userRole !== "admin" &&
      userRole !== "super_admin" &&
      userId
    ) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, projects: data };
  } catch (error) {
    console.error("Error getting projects:", error);
    return { success: false, error };
  }
}

// Get project by ID
export async function getProjectById(projectId: string) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        user:users!projects_user_id_fkey(email),
        profile:profiles!projects_user_id_fkey(first_name, last_name)
      `
      )
      .eq("id", projectId)
      .single();

    if (error) throw error;

    return { success: true, project: data };
  } catch (error) {
    console.error("Error getting project:", error);
    return { success: false, error };
  }
}

// Update project (Users can only update their own projects)
export async function updateProject(
  projectId: string,
  projectData: Partial<Project>,
  userId: string
) {
  try {
    // Check if user owns the project
    const { data: existingProject, error: checkError } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single();

    if (checkError) throw checkError;

    if (existingProject.user_id !== userId) {
      return { success: false, error: "You can only update your own projects" };
    }

    const { data, error } = await supabase
      .from("projects")
      .update({
        ...projectData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, project: data };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error };
  }
}

// Delete project (Users can only delete their own projects, Admins can delete any)
export async function deleteProject(
  projectId: string,
  userId: string,
  userRole?: string
) {
  try {
    // If not admin/super_admin, check ownership
    if (userRole && userRole !== "admin" && userRole !== "super_admin") {
      const { data: existingProject, error: checkError } = await supabase
        .from("projects")
        .select("user_id")
        .eq("id", projectId)
        .single();

      if (checkError) throw checkError;

      if (existingProject.user_id !== userId) {
        return {
          success: false,
          error: "You can only delete your own projects",
        };
      }
    }

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error };
  }
}

// Get user's projects
export async function getUserProjects(userId: string) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, projects: data };
  } catch (error) {
    console.error("Error getting user projects:", error);
    return { success: false, error };
  }
}
