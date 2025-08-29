<script lang="ts">
  import { createClient } from '@supabase/supabase-js';
  import { goto } from '$app/navigation';

  // Replace with your Supabase credentials
  const supabaseUrl = 'https://qjtyffeqwsiyzjsgeczt.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqdHlmZmVxd3NpeXpqc2dlY3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTE5MjcsImV4cCI6MjA3MDcyNzkyN30.w3oPBbV3B2CP6xK0I2NMJXlef7Qo_FQJdVNAN1o9a0w';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  let email = '';
  let password = '';
  let loading = false;
  let error = '';
  let success = '';

  async function handleRegister(event: Event) {
    event.preventDefault();
    loading = true;
    error = '';
    success = '';

    // Sign up user in Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      error = signUpError.message;
      loading = false;
      return;
    }

    // Insert user into users table as super_admin
    const userId = data.user?.id;
    if (!userId) {
      error = "Could not get user ID after registration.";
      loading = false;
      return;
    }

    const { error: dbError } = await supabase
      .from('users')
      .insert([{ id: userId, email, role: 'super_admin' }]);

    if (dbError) {
      error = dbError.message;
      loading = false;
      return;
    }

    success = "Super admin registered successfully!";
    // Optionally redirect to dashboard
    setTimeout(() => goto('/dashboard'), 1500);
    loading = false;
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-[#121212] px-4 py-12">
  <div class="max-w-md w-full bg-black rounded-2xl shadow-2xl p-8 space-y-8 border border-white/10">
    <h1 class="text-2xl font-bold text-white text-center">Register Super Admin</h1>
    <form class="space-y-6" on:submit|preventDefault={handleRegister}>
      <div>
        <label for="email" class="block text-white mb-2">Email</label>
        <input id="email" type="email" bind:value={email} required class="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700" />
      </div>
      <div>
        <label for="password" class="block text-white mb-2">Password</label>
        <input id="password" type="password" bind:value={password} required class="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700" />
      </div>
      <button type="submit" class="w-full py-2 bg-yellow-700 text-white rounded font-bold" disabled={loading}>
        {loading ? 'Registering...' : 'Register as Super Admin'}
      </button>
      {#if error}
        <div class="bg-red-100 border-l-4 border-red-500 p-4 rounded-md mt-2 text-black">{error}</div>
      {/if}
      {#if success}
        <div class="bg-green-100 border-l-4 border-green-500 p-4 rounded-md mt-2 text-black">{success}</div>
      {/if}
    </form>
    <p class="text-gray-400 text-sm text-center mt-4">
      After registration, you can invite other members from the dashboard.
    </p>
  </div>
  </div>