<script lang="ts">
  import { signIn } from "$lib/auth";
  import { goto } from "$app/navigation";

  let email: string = "";
  let password: string = "";
  let loading: boolean = false;
  let error: string = "";

  interface SignInResult {
    success: boolean;
    error?: Error | { message: string } | unknown;
  }

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    loading = true;
    error = "";

    try {
      const result: SignInResult = await signIn(email, password);
      if (result.success) {
        goto("/");
      } else {
        error =
          result.error instanceof Error
            ? result.error.message
            : typeof result.error === "object" &&
                result.error !== null &&
                "message" in result.error
              ? (result.error as { message: string }).message
              : "Login failed";
      }
    } catch (err) {
      error =
        err instanceof Error ? err.message : "An unexpected error occurred";
    } finally {
      loading = false;
    }
  }
</script>

<div
  class="min-h-screen bg-gradient-to-br bg-[#121212] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
>
  <div
    class="max-w-md w-full bg-black backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-8 border border-white/10"
  >
    <div class="flex flex-col items-center space-y-3">
      <img
        src="data:image/png;base64,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"
        alt="ML Club Logo"
        class="h-20 w-20 object-contain"
      />
      <h1 class="text-2xl font-bold text-white">ML Club</h1>
      <p class="text-md text-yellow-700 font-bold">
        NIT Silchar ML Club Admin Panel
      </p>
      <h2 class="text-xl font-semibold text-white">Sign in to your account</h2>
    </div>

    {#if error}
      <div class="bg-red-100 border-l-4 border-red-500 p-4 rounded-md">
        <div class="flex">
          <svg
            class="h-5 w-5 text-red-600 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
              clip-rule="evenodd"
            />
          </svg>
          <p class="text-sm text-red-800">{error}</p>
        </div>
      </div>
    {/if}

    <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
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
        <a href="#" class="hover:underline text-yellow-700 font-bold"
          >Forgot your password?</a
        >
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50"
      >
        {#if loading}
          <svg
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4zm2 5.3A8 8 0 014 12H0c0 3.1 1.2 5.8 3 7.9l3-2.6z"
            />
          </svg>
          Signing in...
        {:else}
          <svg
            class="h-5 w-5 text-indigo-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clip-rule="evenodd"
            />
          </svg>
          Sign in
        {/if}
      </button>
    </form>
  </div>
</div>
