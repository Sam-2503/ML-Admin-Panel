<script lang="ts">
  // Current active tab
  let activeTab: "members" | "projects" | "blogs" | "events" = "members";

  // Sample data
  let members = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      joined: "2023-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Member",
      joined: "2023-02-20",
    },
    {
      id: 3,
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "Moderator",
      joined: "2023-03-10",
    },
  ];

  let projects = [
    {
      id: 1,
      title: "Image Classification",
      status: "Active",
      lead: "John Doe",
      deadline: "2023-12-15",
    },
    {
      id: 2,
      title: "Sentiment Analysis",
      status: "Completed",
      lead: "Jane Smith",
      deadline: "2023-06-30",
    },
    {
      id: 3,
      title: "Recommendation System",
      status: "Planning",
      lead: "Alex Johnson",
      deadline: "2024-02-28",
    },
  ];

  let blogs = [
    {
      id: 1,
      title: "Introduction to Machine Learning",
      author: "John Doe",
      status: "Published",
      date: "2023-04-15",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
    {
      id: 2,
      title: "Deep Learning Fundamentals",
      author: "Jane Smith",
      status: "Draft",
      date: "2023-05-20",
      content:
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    },
    {
      id: 3,
      title: "NLP Techniques Overview",
      author: "Alex Johnson",
      status: "Published",
      date: "2023-06-10",
      content:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...",
    },
  ];

  let events = [
    {
      id: 1,
      title: "ML Workshop",
      date: "2023-07-15",
      location: "Room A101",
      attendees: 45,
      description: "Hands-on workshop covering basic ML concepts",
    },
    {
      id: 2,
      title: "Hackathon",
      date: "2023-08-20",
      location: "Main Auditorium",
      attendees: 120,
      description: "24-hour coding competition with prizes",
    },
    {
      id: 3,
      title: "Guest Lecture",
      date: "2023-09-05",
      location: "Online",
      attendees: 85,
      description: "Industry expert discussing AI trends",
    },
  ];

  // Form states
  let newMember = { name: "", email: "", role: "Member" };
  let newProject = { title: "", status: "Planning", lead: "", deadline: "" };
  let newBlog = { title: "", author: "", status: "Draft", content: "" };
  let newEvent = { title: "", date: "", location: "", description: "" };

  // Edit states
  let editingMemberId: number | null = null;
  let editingProjectId: number | null = null;
  let editingBlogId: number | null = null;
  let editingEventId: number | null = null;

  // CRUD functions
  function addMember() {
    members = [
      ...members,
      {
        ...newMember,
        id: members.length + 1,
        joined: new Date().toISOString().split("T")[0],
      },
    ];
    newMember = { name: "", email: "", role: "Member" };
  }

  function editMember(id: number) {
    const member = members.find((m) => m.id === id);
    if (member) {
      newMember = { ...member };
      editingMemberId = id;
    }
  }

  function updateMember() {
    if (editingMemberId) {
      members = members.map((m) =>
        m.id === editingMemberId
          ? {
              ...m, // Keep all existing properties
              ...newMember, // Override with updated values
              id: editingMemberId, // Ensure ID remains unchanged
            }
          : m
      );
      newMember = { name: "", email: "", role: "Member" };
      editingMemberId = null;
    }
  }

  function cancelEdit() {
    newMember = { name: "", email: "", role: "Member" };
    editingMemberId = null;
  }

  function deleteMember(id: number) {
    members = members.filter((m) => m.id !== id);
  }

  // Project CRUD
  function addProject() {
    projects = [
      ...projects,
      {
        ...newProject,
        id: projects.length + 1,
      },
    ];
    newProject = { title: "", status: "Planning", lead: "", deadline: "" };
  }

  function editProject(id: number) {
    const project = projects.find((p) => p.id === id);
    if (project) {
      newProject = { ...project };
      editingProjectId = id;
    }
  }

  function updateProject() {
    if (editingProjectId) {
      projects = projects.map((p) =>
        p.id === editingProjectId ? { ...newProject, id: editingProjectId } : p
      );
      newProject = { title: "", status: "Planning", lead: "", deadline: "" };
      editingProjectId = null;
    }
  }

  function cancelProjectEdit() {
    newProject = { title: "", status: "Planning", lead: "", deadline: "" };
    editingProjectId = null;
  }

  function deleteProject(id: number) {
    projects = projects.filter((p) => p.id !== id);
  }

  // Blog CRUD
  function addBlog() {
    blogs = [
      ...blogs,
      {
        ...newBlog,
        id: blogs.length + 1,
        date: new Date().toISOString().split("T")[0],
      },
    ];
    newBlog = { title: "", author: "", status: "Draft", content: "" };
  }

  function editBlog(id: number) {
    const blog = blogs.find((b) => b.id === id);
    if (blog) {
      newBlog = { ...blog };
      editingBlogId = id;
    }
  }

  function updateBlog() {
    if (editingBlogId) {
      blogs = blogs.map((b) =>
        b.id === editingBlogId
          ? {
              ...b, // Keep all existing properties
              ...newBlog, // Override with updated values
              id: editingBlogId, // Ensure ID remains the same
            }
          : b
      );
      newBlog = { title: "", author: "", status: "Draft", content: "" };
      editingBlogId = null;
    }
  }

  function cancelBlogEdit() {
    newBlog = { title: "", author: "", status: "Draft", content: "" };
    editingBlogId = null;
  }

  function deleteBlog(id: number) {
    blogs = blogs.filter((b) => b.id !== id);
  }

  function publishBlog(id: number) {
    blogs = blogs.map((b) => (b.id === id ? { ...b, status: "Published" } : b));
  }

  // Event CRUD
  function addEvent() {
    events = [
      ...events,
      {
        ...newEvent,
        id: events.length + 1,
        attendees: 0,
      },
    ];
    newEvent = { title: "", date: "", location: "", description: "" };
  }

  function editEvent(id: number) {
    const event = events.find((e) => e.id === id);
    if (event) {
      newEvent = {
        title: event.title,
        date: event.date,
        location: event.location,
        description: event.description,
      };
      editingEventId = id;
    }
  }

  function updateEvent() {
    if (editingEventId) {
      const event = events.find((e) => e.id === editingEventId);
      if (event) {
        events = events.map((e) =>
          e.id === editingEventId
            ? {
                ...newEvent,
                id: editingEventId,
                attendees: event.attendees,
              }
            : e
        );
      }
      newEvent = { title: "", date: "", location: "", description: "" };
      editingEventId = null;
    }
  }

  function cancelEventEdit() {
    newEvent = { title: "", date: "", location: "", description: "" };
    editingEventId = null;
  }

  function deleteEvent(id: number) {
    events = events.filter((e) => e.id !== id);
  }

  // Theme toggle
  let darkMode = false;
  function toggleTheme() {
    darkMode = !darkMode;
  }
</script>

<div
  class={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}
>
  <!-- Header -->
  <header
    class={`${darkMode ? "bg-gray-800" : "bg-gray-800"} text-white p-4 shadow`}
  >
    <div class="container mx-auto flex justify-between items-center max-w-7xl">
      <div class="flex items-center space-x-2">
        <img
          src="data:image/png;base64,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"
          alt="ML Club Logo"
          class="h-10 w-10"
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
        <button class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
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
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Member Management</h2>
          <button
            class={`px-4 py-2 rounded ${darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white`}
            on:click={() => {
              newMember = { name: "", email: "", role: "Member" };
              editingMemberId = null;
            }}
          >
            {editingMemberId ? "Cancel Edit" : "Add New Member"}
          </button>
        </div>

        <!-- Add/Edit Member Form -->
        <div
          class={`p-4 rounded-lg mb-6 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
        >
          <h3 class="font-medium mb-3">
            {editingMemberId ? "Edit Member" : "Add New Member"}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label
                for="member-name"
                class={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >Name</label
              >
              <input
                id="member-name"
                bind:value={newMember.name}
                class={`w-full px-3 py-2 rounded-md ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"}`}
                placeholder="Full name"
              />
            </div>
            <div>
              <label
                for="member-email"
                class={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >Email</label
              >
              <input
                id="member-email"
                bind:value={newMember.email}
                class={`w-full px-3 py-2 rounded-md ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"}`}
                placeholder="Email address"
              />
            </div>
            <div>
              <label
                for="member-role"
                class={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >Role</label
              >
              <select
                id="member-role"
                bind:value={newMember.role}
                class={`w-full px-3 py-2 rounded-md ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"}`}
              >
                <option value="Member">Member</option>
                <option value="Moderator">Moderator</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div class="flex items-end space-x-2">
              {#if editingMemberId}
                <button
                  on:click={updateMember}
                  class={`w-full px-4 py-2 rounded ${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"} text-white`}
                >
                  Update
                </button>
              {:else}
                <button
                  on:click={addMember}
                  class={`w-full px-4 py-2 rounded ${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"} text-white`}
                >
                  Add Member
                </button>
              {/if}
            </div>
          </div>
        </div>

        <!-- Members Table -->
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
                  >Joined</th
                >
                <th
                  class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                  >Actions</th
                >
              </tr>
            </thead>
            <tbody
              class={`divide-y ${darkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"}`}
            >
              {#each members as member (member.id)}
                <tr class={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                  <td class="px-6 py-4 whitespace-nowrap">{member.name}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{member.email}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        member.role === "Admin"
                          ? darkMode
                            ? "bg-purple-900 text-purple-200"
                            : "bg-purple-100 text-purple-800"
                          : member.role === "Moderator"
                            ? darkMode
                              ? "bg-blue-900 text-blue-200"
                              : "bg-blue-100 text-blue-800"
                            : darkMode
                              ? "bg-green-900 text-green-200"
                              : "bg-green-100 text-green-800"
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{member.joined}</td>
                  <td class="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      on:click={() => editMember(member.id)}
                      class={darkMode
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-900"}>Edit</button
                    >
                    <button
                      on:click={() => deleteMember(member.id)}
                      class={darkMode
                        ? "text-red-400 hover:text-red-300"
                        : "text-red-600 hover:text-red-900"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {:else if activeTab === "projects"}
      <!-- Projects Tab -->
      <div
        class={`rounded-lg shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Project Management</h2>
          <button
            class={`px-4 py-2 rounded ${darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white`}
            on:click={() => {
              newProject = {
                title: "",
                status: "Planning",
                lead: "",
                deadline: "",
              };
              editingProjectId = null;
            }}
          >
            {editingProjectId ? "Cancel Edit" : "Add New Project"}
          </button>
        </div>

        <!-- Add/Edit Project Form -->
        <div
          class={`p-4 rounded-lg mb-6 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
        >
          <h3 class="font-medium mb-3">
            {editingProjectId ? "Edit Project" : "Add New Project"}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label
                for="project-title"
                class={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >Title</label
              >
              <input
                id="project-title"
                bind:value={newProject.title}
                class={`w-full px-3 py-2 rounded-md ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"}`}
                placeholder="Project title"
              />
            </div>
            <div>
              <label
                for="project-status"
                class={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >Status</label
              >
              <select
                id="project-status"
                bind:value={newProject.status}
                class={`w-full px-3 py-2 rounded-md ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"}`}
              >
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label
                for="project-deadline"
                class={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >Deadline</label
              >
              <input
                id="project-deadline"
                type="date"
                bind:value={newProject.deadline}
                class={`w-full px-3 py-2 rounded-md ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"}`}
              />
            </div>
            <div class="flex items-end space-x-2">
              {#if editingProjectId}
                <button
                  on:click={updateProject}
                  class={`w-full px-4 py-2 rounded ${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"} text-white`}
                >
                  Update
                </button>
              {:else}
                <button
                  on:click={addProject}
                  class={`w-full px-4 py-2 rounded ${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"} text-white`}
                >
                  Add Project
                </button>
              {/if}
            </div>
          </div>
        </div>

        <!-- Projects Table -->
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
                  >Lead</th
                >
                <th
                  class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                  >Deadline</th
                >
                <th
                  class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                  >Actions</th
                >
              </tr>
            </thead>
            <tbody
              class={`divide-y ${darkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"}`}
            >
              {#each projects as project (project.id)}
                <tr class={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                  <td class="px-6 py-4 whitespace-nowrap">{project.title}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        project.status === "Active"
                          ? darkMode
                            ? "bg-green-900 text-green-200"
                            : "bg-green-100 text-green-800"
                          : project.status === "Completed"
                            ? darkMode
                              ? "bg-gray-600 text-gray-200"
                              : "bg-gray-100 text-gray-800"
                            : darkMode
                              ? "bg-yellow-900 text-yellow-200"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{project.lead}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{project.deadline}</td
                  >
                  <td class="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      on:click={() => editProject(project.id)}
                      class={darkMode
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-900"}>Edit</button
                    >
                    <button
                      on:click={() => deleteProject(project.id)}
                      class={darkMode
                        ? "text-red-400 hover:text-red-300"
                        : "text-red-600 hover:text-red-900"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {:else if activeTab === "blogs"}
      <!-- Blogs Tab -->
      <div
        class={`rounded-lg shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Blog Management</h2>
          <button
            class={`px-4 py-2 rounded ${darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white`}
            on:click={() => {
              newBlog = { title: "", author: "", status: "Draft", content: "" };
              editingBlogId = null;
            }}
          >
            {editingBlogId ? "Cancel Edit" : "Add New Blog"}
          </button>
        </div>

        <!-- Add/Edit Blog Form -->
        <div
          class={`p-4 rounded-lg mb-6 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
        >
          <h3 class="font-medium mb-3">
            {editingBlogId ? "Edit Blog" : "Add New Blog"}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label
                for="blog-title"
                class={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >Title</label
              >
              <input
                id="blog-title"
                bind:value={newBlog.title}
                class={`w-full px-3 py-2 rounded-md ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"}`}
                placeholder="Blog title"
              />
            </div>
            <div>
              <label
                for="blog-author"
                class={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >Author</label
              >
              <input
                id="blog-author"
                bind:value={newBlog.author}
                class={`w-full px-3 py-2 rounded-md ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"}`}
                placeholder="Author name"
              />
            </div>
            <div>
              <label
                for="blog-status"
                class={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >Status</label
              >
              <select
                id="blog-status"
                bind:value={newBlog.status}
                class={`w-full px-3 py-2 rounded-md ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"}`}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
          <div class="mb-4">
            <label
              for="blog-content"
              class={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Content
            </label>
            >
            <textarea
              id="blog-content"
              bind:value={newBlog.content}
              rows="4"
              class={`w-full px-3 py-2 rounded-md ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"}`}
              placeholder="Blog content..."
            ></textarea>
          </div>
          <div class="flex justify-end">
            {#if editingBlogId}
              <button
                on:click={updateBlog}
                class={`px-4 py-2 rounded ${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"} text-white`}
              >
                Update Blog
              </button>
            {:else}
              <button
                on:click={addBlog}
                class={`px-4 py-2 rounded ${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"} text-white`}
              >
                Add Blog
              </button>
            {/if}
          </div>
        </div>

        <!-- Blogs Table -->
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
                  >Date</th
                >
                <th
                  class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                  >Actions</th
                >
              </tr>
            </thead>
            <tbody
              class={`divide-y ${darkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"}`}
            >
              {#each blogs as blog (blog.id)}
                <tr class={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                  <td class="px-6 py-4 whitespace-nowrap">{blog.title}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{blog.author}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        blog.status === "Published"
                          ? darkMode
                            ? "bg-green-900 text-green-200"
                            : "bg-green-100 text-green-800"
                          : darkMode
                            ? "bg-yellow-900 text-yellow-200"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{blog.date}</td>
                  <td class="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      on:click={() => editBlog(blog.id)}
                      class={darkMode
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-900"}>Edit</button
                    >
                    <button
                      on:click={() => deleteBlog(blog.id)}
                      class={darkMode
                        ? "text-red-400 hover:text-red-300"
                        : "text-red-600 hover:text-red-900"}
                    >
                      Delete
                    </button>
                    {#if blog.status === "Draft"}
                      <button
                        on:click={() => publishBlog(blog.id)}
                        class={darkMode
                          ? "text-green-400 hover:text-green-300"
                          : "text-green-600 hover:text-green-900"}
                        >Publish</button
                      >
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {:else if activeTab === "events"}
      <!-- Events Tab -->
      <div
        class={`rounded-lg shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Event Management</h2>
          <button
            class={`px-4 py-2 rounded ${darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white`}
            on:click={() => {
              newEvent = { title: "", date: "", location: "", description: "" };
              editingEventId = null;
            }}
          >
            {editingEventId ? "Cancel Edit" : "Add New Event"}
          </button>
        </div>

        <!-- Add/Edit Event Form -->
        <div
          class={`p-4 rounded-lg mb-6 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
        >
          <h3 class="font-medium mb-3">
            {editingEventId ? "Edit Event" : "Add New Event"}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label
                for="event-title"
                class={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >Title</label
              >
              <input
                id="event-title"
                bind:value={newEvent.title}
                class={`w-full px-3 py-2 rounded-md ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"}`}
                placeholder="Event title"
              />
            </div>
            <div>
              <label
                for="event-date"
                class={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >Date</label
              >
              <input
                id="event-date"
                type="date"
                bind:value={newEvent.date}
                class={`w-full px-3 py-2 rounded-md ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"}`}
              />
            </div>
            <div>
              <label
                for="event-location"
                class={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >Location</label
              >
              <input
                id="event-location"
                bind:value={newEvent.location}
                class={`w-full px-3 py-2 rounded-md ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"}`}
                placeholder="Event location"
              />
            </div>
            <div class="flex items-end">
              {#if editingEventId}
                <button
                  on:click={updateEvent}
                  class={`w-full px-4 py-2 rounded ${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"} text-white`}
                >
                  Update
                </button>
              {:else}
                <button
                  on:click={addEvent}
                  class={`w-full px-4 py-2 rounded ${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"} text-white`}
                >
                  Add Event
                </button>
              {/if}
            </div>
          </div>
          <div>
            <label
              for="event-description"
              class={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >Description</label
            >
            <textarea
              id="event-description"
              bind:value={newEvent.description}
              rows="3"
              class={`w-full px-3 py-2 rounded-md ${darkMode ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"}`}
              placeholder="Event description..."
            ></textarea>
          </div>
        </div>

        <!-- Events Table -->
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
                  >Attendees</th
                >
                <th
                  class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                  >Actions</th
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
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"}`}
                    >
                      {event.attendees}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      on:click={() => editEvent(event.id)}
                      class={darkMode
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-900"}>Edit</button
                    >
                    <button
                      on:click={() => deleteEvent(event.id)}
                      class={darkMode
                        ? "text-red-400 hover:text-red-300"
                        : "text-red-600 hover:text-red-900"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  </main>
</div>
