<script lang="ts">
  let email = '';
  let password = '';
  export let form;
</script>

<div
  class="min-h-screen bg-gradient-to-br bg-[#121212] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
>
  <div
    class="max-w-md w-full bg-black backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-8 border border-white/10"
  >
    <div class="flex flex-col items-center space-y-3">
      <img
        src="/mlclublogo.png"
        alt="ML Club Logo"
        class="h-20 w-20 object-contain"
      />
      <h1 class="text-2xl font-bold text-white">ML Club</h1>
      <p class="text-md text-yellow-700 font-bold">
        NIT Silchar ML Club Admin Panel
      </p>
      <h2 class="text-xl font-semibold text-white">Sign in to your account</h2>
    </div>

    <form method="POST" class="space-y-6">
      <div class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-white mb-1"
            >Email address</label
          >
          <input
            id="email"
            name="email"
            type="email"
            required
            bind:value={email}
            class="w-full px-3 py-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email address"
          />
        </div>
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-white mb-1">Password</label
          >
          <input
            id="password"
            name="password"
            type="password"
            required
            bind:value={password}
            class="w-full px-3 py-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Password"
          />
        </div>
      </div>

      <div class="flex items-center justify-between text-indigo-200 text-sm">
        <label class="flex items-center">
          <input type="checkbox" class="form-checkbox text-white" />
          <span class="ml-2">Remember me</span>
        </label>

      </div>

      <button
        type="submit"
        class="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50"
      >
        Sign in
      </button>

      {#if form?.error}
        <div class="error">{form.error}</div>
      {/if}
    </form>
  </div>
</div>
