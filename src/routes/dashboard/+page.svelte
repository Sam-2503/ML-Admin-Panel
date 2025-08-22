<script lang="ts">
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
</script>

<div
  class={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}
>
  <!-- Header -->
  <header
    class={`${darkMode ? "bg-gray-800" : "bg-gray-800"} text-white p-2 shadow`}
  >
    <div class="container mx-auto flex justify-between items-center max-w-7xl">
      <div class="flex items-center space-x-2">
        <img
          src="/mlclublogo.png"
          alt="ML Club Logo"
          class="h-16"
        />
        <h1 class="text-xl font-bold">ML Club Admin Panel</h1>
      </div>
      <div class="flex items-center space-x-4">
        <button
          on:click={toggleTheme}
          class={`p-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-700 hover:bg-gray-600"}`}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {#if darkMode}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clip-rule="evenodd"
              />
            </svg>
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
              />
            </svg>
          {/if}
        </button>
        <button
          class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          on:click={logout}
        >
          Logout
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="container mx-auto p-4 max-w-7xl">
    <!-- Tab Navigation -->
    <div
      class={`flex border-b ${darkMode ? "border-gray-700" : "border-gray-200"} mb-6`}
    >
      <button
        class={`px-4 py-2 font-medium ${activeTab === "members" ? `${darkMode ? "text-indigo-400 border-b-2 border-indigo-400" : "text-indigo-600 border-b-2 border-indigo-600"}` : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}`}
        on:click={() => (activeTab = "members")}
      >
        Members
      </button>
      <button
        class={`px-4 py-2 font-medium ${activeTab === "projects" ? `${darkMode ? "text-indigo-400 border-b-2 border-indigo-400" : "text-indigo-600 border-b-2 border-indigo-600"}` : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}`}
        on:click={() => (activeTab = "projects")}
      >
        Projects
      </button>
      <button
        class={`px-4 py-2 font-medium ${activeTab === "blogs" ? `${darkMode ? "text-indigo-400 border-b-2 border-indigo-400" : "text-indigo-600 border-b-2 border-indigo-600"}` : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}`}
        on:click={() => (activeTab = "blogs")}
      >
        Blogs
      </button>
      <button
        class={`px-4 py-2 font-medium ${activeTab === "events" ? `${darkMode ? "text-indigo-400 border-b-2 border-indigo-400" : "text-indigo-600 border-b-2 border-indigo-600"}` : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}`}
        on:click={() => (activeTab = "events")}
      >
        Events
      </button>
    </div>

    <!-- Members Tab -->
    {#if activeTab === "members"}
      <div
        class={`rounded-lg shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h2 class="text-xl font-semibold mb-6">Member Management</h2>
        
        {#if connectionError}
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong class="font-bold">Connection Error:</strong>
            <span class="block sm:inline">{connectionError}</span>
            <div class="mt-2 text-sm">
              <p>To fix this:</p>
              <ol class="list-decimal list-inside ml-4">
                <li>Create a <code>.env.local</code> file in your project root</li>
                <li>Add your Supabase credentials:</li>
                <li><code>PUBLIC_SUPABASE_URL=your_supabase_project_url</code></li>
                <li><code>PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key</code></li>
                <li>Restart your development server</li>
              </ol>
            </div>
          </div>
        {:else if loadingMembers}
          <div>Loading members...</div>
        {:else if errorMembers}
          <div class="text-red-500">{errorMembers}</div>
        {:else}
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Name</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Email</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Role</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Batch</th
                  >
                </tr>
              </thead>
              <tbody
                class={`divide-y ${darkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"}`}
              >
                {#each members as member (member.id)}
                  <tr class={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {member.first_name && member.last_name 
                        ? `${member.first_name} ${member.last_name}` 
                        : member.first_name || member.last_name || 'N/A'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">{member.email || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{member.role || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{member.batch || 'N/A'}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    {:else if activeTab === "projects"}
      <!-- Projects Tab -->
      <div
        class={`rounded-lg shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h2 class="text-xl font-semibold mb-6">Project Management</h2>
        {#if loadingProjects}
          <div>Loading projects...</div>
        {:else if errorProjects}
          <div class="text-red-500">{errorProjects}</div>
        {:else}
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Title</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Status</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Created By</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Created</th
                  >
                </tr>
              </thead>
              <tbody
                class={`divide-y ${darkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"}`}
              >
                {#each projects as project (project.id)}
                  <tr class={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                    <td class="px-6 py-4 whitespace-nowrap">{project.title || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{project.status || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{project.user_id || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{project.created_at?.split("T")[0] || 'N/A'}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    {:else if activeTab === "blogs"}
      <!-- Blogs Tab -->
      <div
        class={`rounded-lg shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h2 class="text-xl font-semibold mb-6">Blog Management</h2>
        {#if loadingBlogs}
          <div>Loading blogs...</div>
        {:else if errorBlogs}
          <div class="text-red-500">{errorBlogs}</div>
        {:else}
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Title</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Author</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Status</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Created</th
                  >
                </tr>
              </thead>
              <tbody
                class={`divide-y ${darkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"}`}
              >
                {#each blogs as blog (blog.id)}
                  <tr class={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                    <td class="px-6 py-4 whitespace-nowrap">{blog.title || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{blog.user_id || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{blog.status || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{blog.created_at?.split("T")[0] || 'N/A'}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    {:else if activeTab === "events"}
      <!-- Events Tab -->
      <div
        class={`rounded-lg shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h2 class="text-xl font-semibold mb-6">Event Management</h2>
        {#if loadingEvents}
          <div>Loading events...</div>
        {:else if errorEvents}
          <div class="text-red-500">{errorEvents}</div>
        {:else}
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Title</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Date</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Location</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Created By</th
                  >
                </tr>
              </thead>
              <tbody
                class={`divide-y ${darkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"}`}
              >
                {#each events as event (event.id)}
                  <tr class={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                    <td class="px-6 py-4 whitespace-nowrap">{event.title}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{event.date}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{event.location}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{event.organizer}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    {/if}
  </main>
</div>
