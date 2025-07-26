import { supabase, type User, type Profile } from "./supabase";

// Get all users (Super Admin only)
export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        profile:profiles(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, users: data };
  } catch (error) {
    console.error("Error getting users:", error);
    return { success: false, error };
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        profile:profiles(*)
      `
      )
      .eq("id", userId)
      .single();

    if (error) throw error;

    return { success: true, user: data };
  } catch (error) {
    console.error("Error getting user:", error);
    return { success: false, error };
  }
}

// Update user role (Super Admin only)
export async function updateUserRole(
  userId: string,
  newRole: "member" | "admin" | "super_admin"
) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, user: data };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error };
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  profileData: Partial<Profile>
) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    // Mark profile as completed
    await supabase
      .from("users")
      .update({ profile_completed: true })
      .eq("id", userId);

    return { success: true, profile: data };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error };
  }
}

// Delete user (Super Admin only)
export async function deleteUser(userId: string) {
  try {
    // Delete profile first
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("user_id", userId);

    if (profileError) throw profileError;

    // Delete user
    const { error: userError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (userError) throw userError;

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error };
  }
}

// Get current user's profile
export async function getCurrentUserProfile() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No authenticated user" };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) throw error;

    return { success: true, profile: data };
  } catch (error) {
    console.error("Error getting current user profile:", error);
    return { success: false, error };
  }
}

// Check if user has completed profile
export async function checkProfileCompletion(userId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("profile_completed")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return { success: true, profileCompleted: data.profile_completed };
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return { success: false, error };
  }
}
