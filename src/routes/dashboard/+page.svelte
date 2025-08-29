<script lang="ts">
  import '../../app.css';
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabase";
  
  // Current active tab
  let activeTab: "members" | "projects" | "blogs" | "events" = "members";

  // Data from Supabase
  type Member = {
    id: number;
    created_at: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    role: string | null;
    auth_id: string;
    phone_num: string | null;
    batch: number | null;
    profile_status: boolean | null;
  };
  
  type Project = {
    id: number;
    title: string | null;
    status: string | null;
    created_at: string;
    user_id: number | null;
  };
  
  type Blog = {
    id: number;
    title: string | null;
    status: string | null;
    created_at: string;
    user_id: number | null;
  };
  
  type Event = {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    duration: string;
    location: string;
    capacity: number;
    registeredCount: number;
    status: string;
    category: string;
    organizer: string;
  };
  
  export let members: Member[];
  export let projects: Project[];
  export let blogs: Blog[];
  export let events: Event[];
  export let errorMembers: string | null;
  export let errorProjects: string | null;
  export let errorBlogs: string | null;
  export let errorEvents: string | null;
  export let connectionError: string | null;

  // Loading and error states
  let loadingMembers = true;
  let loadingProjects = true;
  let loadingBlogs = true;
  let loadingEvents = true;

  // Check Supabase connection
  let supabaseConnected = false;

  // Fetch data from Supabase on mount
  onMount(async () => {
    console.log("Dashboard mounting, starting data fetch...");
    
    // Check if Supabase is connected
    try {
      const { data, error } = await supabase.from('members').select('count').limit(1);
      if (error) {
        console.error("Supabase connection test failed:", error);
        if (error.message.includes("JWT")) {
          connectionError = "Authentication error - please check your Supabase credentials";
        } else if (error.message.includes("relation") || error.message.includes("does not exist")) {
          connectionError = "Database tables not found - please run the database schema first";
        } else {
          connectionError = `Database connection failed: ${error.message}`;
        }
        supabaseConnected = false;
      } else {
        console.log("Supabase connection successful");
        supabaseConnected = true;
        connectionError = "";
      }
    } catch (error) {
      console.error("Exception testing Supabase connection:", error);
      connectionError = "Failed to connect to database - check your environment variables";
      supabaseConnected = false;
    }
    
    if (!supabaseConnected) {
      loadingMembers = false;
      loadingProjects = false;
      loadingBlogs = false;
      loadingEvents = false;
      return;
    }
    
    // Members - fetch from members table
    try {
      console.log("Fetching members from 'members' table...");
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });
      
      console.log("Members response:", { data: membersData, error: membersError });
      
      if (membersError) {
        errorMembers = membersError.message;
        console.error("Members error:", membersError);
      } else {
        members = membersData || [];
        console.log("Members loaded:", members);
      }
    } catch (error) {
      errorMembers = "Error loading members";
      console.error("Exception loading members:", error);
    }
    loadingMembers = false;

    // Projects - fetch from projects table
    try {
      console.log("Fetching projects from 'projects' table...");
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      
      console.log("Projects response:", { data: projectsData, error: projectsError });
      
      if (projectsError) {
        errorProjects = projectsError.message;
        console.error("Projects error:", projectsError);
      } else {
        projects = projectsData || [];
        console.log("Projects loaded:", projects);
      }
    } catch (error) {
      errorProjects = "Error loading projects";
      console.error("Exception loading projects:", error);
    }
    loadingProjects = false;

    // Blogs - fetch from blogs table
    try {
      console.log("Fetching blogs from 'blogs' table...");
      const { data: blogsData, error: blogsError } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      
      console.log("Blogs response:", { data: blogsData, error: blogsError });
      
      if (blogsError) {
        errorBlogs = blogsError.message;
        console.error("Blogs error:", blogsError);
      } else {
        blogs = blogsData || [];
        console.log("Blogs loaded:", blogs);
      }
    } catch (error) {
      errorBlogs = "Error loading blogs";
      console.error("Exception loading blogs:", error);
    }
    loadingBlogs = false;

    // Events - use dummy data for now since table doesn't exist
    try {
      console.log("Setting dummy events data...");
      // For now, we'll use some sample events since the table doesn't exist
      events = [
        {
          id: 1,
          title: "Introduction to Machine Learning Workshop",
          description: "A hands-on workshop covering the basics of ML algorithms",
          date: "2024-02-15",
          time: "14:00",
          duration: "3 hours",
          location: "Room 301, Engineering Building",
          capacity: 50,
          registeredCount: 35,
          status: "upcoming",
          category: "Workshop",
          organizer: "Dr. Sarah Chen"
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
          organizer: "Prof. Michael Rodriguez"
        }
      ];
      console.log("Events loaded:", events);
    } catch (error) {
      errorEvents = "Error loading events";
      console.error("Exception loading events:", error);
    }
    loadingEvents = false;
    
    console.log("All data fetching completed");
  });



  // Theme toggle
  let darkMode = false;
  function toggleTheme() {
    darkMode = !darkMode;
  }

  function logout() {
    window.location.href = "/logout";
  }

  // Modal state
  let showAddMemberModal = false;
  let showChangeRoleModal = false;
  let selectedMemberId: number | null = null;
  let selectedNewRole = "";;

  // Form fields
  let newMemberName = "";
  let newMemberEmail = "";
  let newMemberRole = "member";
  let sendInvitation = true;

  function openAddMemberModal() {
    showAddMemberModal = true;
  }
  function closeAddMemberModal() {
    showAddMemberModal = false;
    newMemberName = "";
    newMemberEmail = "";
    newMemberRole = "member";
    sendInvitation = true;
  }
  function submitAddMember() {
    // TODO: Add member logic here (call server action or Supabase)
    closeAddMemberModal();
  }

  function openChangeRoleModal() {
    showChangeRoleModal = true;
    selectedMemberId = null;
    selectedNewRole = "";
  }
  function closeChangeRoleModal() {
    showChangeRoleModal = false;
    selectedMemberId = null;
    selectedNewRole = "";
  }
  function submitChangeRole() {
    // TODO: Add logic to update member role (call server action or Supabase)
    closeChangeRoleModal();
  }
</script>


<div class={`min-h-screen ${darkMode ? "bg-base-200 text-base-content" : "bg-base-100 text-base-content"} flex`}>
  <!-- Sidebar -->
  <aside class="w-64 bg-base-300 flex flex-col justify-between py-8 px-6">
    <div>
      <div class="flex items-center mb-10">
        <img src="/mlclublogo.png" alt="ML Club Logo" class="h-10 mr-3" />
        <span class="text-lg font-bold tracking-wide">Admin Panel</span>
      </div>
      <ul class="menu menu-lg bg-base-300 rounded-box">
        <li>
          <button class={activeTab === "members" ? "active" : ""} on:click={() => (activeTab = "members")}>
            <span class="flex items-center gap-2">
              <i class="fa fa-users"></i> Members
            </span>
          </button>
        </li>
        <li>
          <button class={activeTab === "events" ? "active" : ""} on:click={() => (activeTab = "events")}>
            <span class="flex items-center gap-2">
              <i class="fa fa-calendar"></i> Events
            </span>
          </button>
        </li>
        <li>
          <button class={activeTab === "projects" ? "active" : ""} on:click={() => (activeTab = "projects")}>
            <span class="flex items-center gap-2">
              <i class="fa fa-folder"></i> Projects
            </span>
          </button>
        </li>
        <li>
          <button class={activeTab === "blogs" ? "active" : ""} on:click={() => (activeTab = "blogs")}>
            <span class="flex items-center gap-2">
              <i class="fa fa-file-alt"></i> Blogs
            </span>
          </button>
        </li>
      </ul>
    </div>
    <div>
      <button class="btn btn-outline btn-error w-full mt-4" on:click={logout}>
        <i class="fa fa-sign-out-alt mr-2"></i> Logout
      </button>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 p-10">
    <h1 class="text-3xl font-bold mb-8 capitalize">{activeTab}</h1>

    <!-- Members Tab -->
    {#if activeTab === "members"}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex justify-between items-center mb-6">
            <h2 class="card-title">Members List</h2>
            <div class="flex gap-2">
              <!-- Replace Add Member button -->
              <button class="btn btn-primary" on:click={openAddMemberModal}>Add Member</button>
              <button class="btn btn-outline" on:click={openChangeRoleModal}>Change Member Role</button>
            </div>
          </div>
          {#if connectionError}
            <div class="alert alert-error mb-4">
              <span>{connectionError}</span>
            </div>
          {:else if loadingMembers}
            <div class="flex justify-center items-center"><span class="loading loading-spinner loading-lg"></span></div>
          {:else if errorMembers}
            <div class="alert alert-error mb-4">
              <span>{errorMembers}</span>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Batch</th>
                  </tr>
                </thead>
                <tbody>
                  {#each members as member (member.id)}
                    <tr>
                      <td>
                        {member.first_name && member.last_name
                          ? `${member.first_name} ${member.last_name}`
                          : member.first_name || member.last_name || 'N/A'}
                      </td>
                      <td>{member.email || 'N/A'}</td>
                      <td>
                        {#if member.role === 'super_admin'}
                          <div class = "badge badge-accent">
                            Super Admin
                          </div>
                        {:else if member.role === 'admin'}
                          <div class = "badge badge-primary">
                            Admin
                          </div>
                        {:else if member.role === 'member'}
                          <div class = "badge badge-secondary">
                            Member
                          </div>
                        {/if}
                      </td>
                      <td>{member.batch || 'N/A'}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Events Tab -->
    {#if activeTab === "events"}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-6">Events List</h2>
          {#if loadingEvents}
            <div class="flex justify-center items-center"><span class="loading loading-spinner loading-lg"></span></div>
          {:else if errorEvents}
            <div class="alert alert-error mb-4">
              <span>{errorEvents}</span>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Organizer</th>
                  </tr>
                </thead>
                <tbody>
                  {#each events as event (event.id)}
                    <tr>
                      <td>{event.title}</td>
                      <td>{event.date}</td>
                      <td>{event.location}</td>
                      <td>{event.organizer}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Projects Tab -->
    {#if activeTab === "projects"}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-6">Projects List</h2>
          {#if loadingProjects}
            <div class="flex justify-center items-center"><span class="loading loading-spinner loading-lg"></span></div>
          {:else if errorProjects}
            <div class="alert alert-error mb-4">
              <span>{errorProjects}</span>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {#each projects as project (project.id)}
                    <tr>
                      <td>{project.title || 'N/A'}</td>
                      <td>{project.status || 'N/A'}</td>
                      <td>{project.user_id || 'N/A'}</td>
                      <td>{project.created_at?.split("T")[0] || 'N/A'}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Blogs Tab -->
    {#if activeTab === "blogs"}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-6">Blogs List</h2>
          {#if loadingBlogs}
            <div class="flex justify-center items-center"><span class="loading loading-spinner loading-lg"></span></div>
          {:else if errorBlogs}
            <div class="alert alert-error mb-4">
              <span>{errorBlogs}</span>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {#each blogs as blog (blog.id)}
                    <tr>
                      <td>{blog.title || 'N/A'}</td>
                      <td>{blog.user_id || 'N/A'}</td>
                      <td>{blog.status || 'N/A'}</td>
                      <td>{blog.created_at?.split("T")[0] || 'N/A'}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Add Member Modal -->
    {#if showAddMemberModal}
      <dialog class="modal modal-open">
        <form method="POST" action="?/addMember" class="modal-box bg-[#23243a] text-white max-w-lg">
          <h3 class="font-bold text-2xl mb-6">Add Member</h3>
          <div class="form-control mb-4">
            <label class="label" for="new-member-name">
              <span class="label-text text-base-content">Name</span>
            </label>
            <input id="new-member-name" name="name" type="text" class="input w-full outline-none" bind:value={newMemberName} required />
          </div>
          <div class="form-control mb-4">
            <label class="label" for="new-member-email">
              <span class="label-text text-base-content">Email</span>
            </label>
            <input id="new-member-email" name="email" type="email" class="input w-full outline-none" bind:value={newMemberEmail} required />
          </div>
          <div class="form-control mb-4">
            <label class="label" for="new-member-role">
              <span class="label-text text-base-content">Role</span>
            </label>
            <select id="new-member-role" name="role" class="select outline-none w-full" bind:value={newMemberRole}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div class="form-control mb-6">
            <label class="cursor-pointer flex items-center gap-2">
              <input type="checkbox" class="checkbox checkbox-primary" checked disabled />
              <span class="text-base-content">Send invitation link</span>
            </label>
            <span class="text-xs text-gray-400 ml-7">The new member will receive an email to set their own password.</span>
          </div>
          <div class="modal-action flex justify-end gap-2">
            <button type="button" class="btn btn-outline" on:click={closeAddMemberModal}>Cancel</button>
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
        <button type="button" class="modal-backdrop w-full h-full absolute top-0 left-0" on:click={closeAddMemberModal} aria-label="Close modal"></button>
      </dialog>
    {/if}

    <!-- Change Role Modal -->
    {#if showChangeRoleModal}
      <dialog class="modal modal-open">
        <form method="dialog" class="modal-box bg-[#23243a] text-white max-w-lg">
          <h3 class="font-bold text-2xl mb-6">Change Member Role</h3>
          <div class="form-control mb-4">
            <label class="label" for="select-member">
              <span class="label-text text-base-content">Member</span>
            </label>
            <select id="select-member" class="select outline-none w-full" bind:value={selectedMemberId}>
              <option value="" disabled selected>Select a member</option>
              {#each members as member}
                <option value={member.id}>
                  {member.first_name && member.last_name
                    ? `${member.first_name} ${member.last_name}`
                    : member.first_name || member.last_name || member.email || 'N/A'}
              </option>
              {/each}
            </select>
          </div>
          <div class="form-control mb-4">
            <label class="label" for="new-role">
              <span class="label-text text-base-content">New Role</span>
            </label>
            <select id="new-role" class="select outline-none w-full" bind:value={selectedNewRole}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div class="modal-action flex justify-end gap-2">
            <button type="button" class="btn btn-outline" on:click={closeChangeRoleModal}>Cancel</button>
            <button type="button" class="btn btn-primary" on:click={submitChangeRole}>Submit</button>
          </div>
        </form>
        <button type="button" class="modal-backdrop w-full h-full absolute top-0 left-0" on:click={closeChangeRoleModal} aria-label="Close modal"></button>
      </dialog>
    {/if}
  </main>
</div>