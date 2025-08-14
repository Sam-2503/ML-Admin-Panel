import { supabase, type Blog } from "./supabase";

// Create new blog (Members can create blogs)
export async function createBlog(blogData: Omit<Blog, "id" | "created_at">) {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .insert({
        ...blogData,
        status: "pending", // All new blogs start as pending
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, blog: data };
  } catch (error) {
    console.error("Error creating blog:", error);
    return { success: false, error };
  }
}

// Get all blogs (Admins see all, Members see their own)
export async function getAllBlogs(authId?: string, userRole?: string) {
  try {
    let query = supabase
      .from("blogs")
      .select(
        `
        *,
        user:users!blogs_user_id_fkey(email, auth_id)
      `
      )
      .order("created_at", { ascending: false });

    // If user is not admin/super_admin, only show their own blogs
    if (
      userRole &&
      userRole !== "admin" &&
      userRole !== "super_admin" &&
      authId
    ) {
      query = query.eq("user_id", authId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, blogs: data };
  } catch (error) {
    console.error("Error getting blogs:", error);
    return { success: false, error };
  }
}

// Get blog by ID
export async function getBlogById(blogId: number) {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select(
        `
        *,
        user:users!blogs_user_id_fkey(email, auth_id)
      `
      )
      .eq("id", blogId)
      .single();

    if (error) throw error;

    return { success: true, blog: data };
  } catch (error) {
    console.error("Error getting blog:", error);
    return { success: false, error };
  }
}

// Update blog (Users can only update their own blogs)
export async function updateBlog(
  blogId: number,
  blogData: Partial<Blog>,
  authId: string
) {
  try {
    // Check if user owns the blog
    const { data: existingBlog, error: checkError } = await supabase
      .from("blogs")
      .select("user_id, status")
      .eq("id", blogId)
      .single();

    if (checkError) throw checkError;

    if (existingBlog.user_id !== authId) {
      return { success: false, error: "You can only update your own blogs" };
    }

    // If blog is approved/rejected, users can't edit it
    if (
      existingBlog.status === "approved" ||
      existingBlog.status === "rejected"
    ) {
      return {
        success: false,
        error: "Cannot edit approved or rejected blogs",
      };
    }

    const { data, error } = await supabase
      .from("blogs")
      .update({
        ...blogData,
        status: "pending", // Reset to pending when updated
        updated_at: new Date().toISOString(),
      })
      .eq("id", blogId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, blog: data };
  } catch (error) {
    console.error("Error updating blog:", error);
    return { success: false, error };
  }
}

// Moderate blog (Admins and Super Admins only)
export async function moderateBlog(
  blogId: number,
  status: "approved" | "rejected"
) {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", blogId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, blog: data };
  } catch (error) {
    console.error("Error moderating blog:", error);
    return { success: false, error };
  }
}

// Delete blog (Users can only delete their own blogs, Admins can delete any)
export async function deleteBlog(
  blogId: number,
  authId: string,
  userRole?: string
) {
  try {
    // If not admin/super_admin, check ownership
    if (userRole && userRole !== "admin" && userRole !== "super_admin") {
      const { data: existingBlog, error: checkError } = await supabase
        .from("blogs")
        .select("user_id")
        .eq("id", blogId)
        .single();

      if (checkError) throw checkError;

      if (existingBlog.user_id !== authId) {
        return { success: false, error: "You can only delete your own blogs" };
      }
    }

    const { error } = await supabase.from("blogs").delete().eq("id", blogId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting blog:", error);
    return { success: false, error };
  }
}

// Get user's blogs
export async function getUserBlogs(authId: string) {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("user_id", authId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, blogs: data };
  } catch (error) {
    console.error("Error getting user blogs:", error);
    return { success: false, error };
  }
}
