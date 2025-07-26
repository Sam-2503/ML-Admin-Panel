import { supabase } from "./supabase";

export interface Invitation {
  id: string;
  email: string;
  role: "member" | "admin" | "super_admin";
  invited_by: string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

// Create invitation (Super Admin only)
export async function createInvitation(
  email: string,
  role: "member" | "admin" | "super_admin",
  invitedBy: string
) {
  try {
    // Generate a secure token
    const token = crypto.randomUUID();

    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data, error } = await supabase
      .from("invitations")
      .insert({
        email,
        role,
        invited_by: invitedBy,
        token,
        expires_at: expiresAt.toISOString(),
        used: false,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, invitation: data };
  } catch (error) {
    console.error("Error creating invitation:", error);
    return { success: false, error };
  }
}

// Get invitation by token
export async function getInvitationByToken(token: string) {
  try {
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .single();

    if (error) throw error;

    // Check if invitation has expired
    if (new Date() > new Date(data.expires_at)) {
      return { success: false, error: "Invitation has expired" };
    }

    return { success: true, invitation: data };
  } catch (error) {
    console.error("Error getting invitation:", error);
    return { success: false, error };
  }
}

// Accept invitation and create user
export async function acceptInvitation(
  token: string,
  password: string,
  firstName: string,
  lastName: string
) {
  try {
    // Get invitation
    const invitationResult = await getInvitationByToken(token);
    if (!invitationResult.success) {
      return invitationResult;
    }

    const invitation = invitationResult.invitation;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: invitation.email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (authError) throw authError;

    // Create user record in our users table
    const { error: userError } = await supabase.from("users").insert({
      id: authData.user!.id,
      email: invitation.email,
      role: invitation.role,
      profile_completed: false,
    });

    if (userError) throw userError;

    // Create profile record
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: authData.user!.id,
      first_name: firstName,
      last_name: lastName,
    });

    if (profileError) throw profileError;

    // Mark invitation as used
    const { error: updateError } = await supabase
      .from("invitations")
      .update({ used: true })
      .eq("token", token);

    if (updateError) throw updateError;

    return { success: true, user: authData.user };
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return { success: false, error };
  }
}

// Get all invitations (Super Admin only)
export async function getAllInvitations() {
  try {
    const { data, error } = await supabase
      .from("invitations")
      .select(
        `
        *,
        invited_by_user:users!invitations_invited_by_fkey(email)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, invitations: data };
  } catch (error) {
    console.error("Error getting invitations:", error);
    return { success: false, error };
  }
}

// Delete invitation (Super Admin only)
export async function deleteInvitation(invitationId: string) {
  try {
    const { error } = await supabase
      .from("invitations")
      .delete()
      .eq("id", invitationId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return { success: false, error };
  }
}
