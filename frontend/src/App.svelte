<script lang="ts">
  import {onMount, setContext} from 'svelte';
  import { writable } from 'svelte/store';
  import Router from './routes/Router.svelte';
  import type { AppContext } from "./types";

  const isLoggedIn = writable(false);
  const isTokenVerified = writable(false);
  const userData = writable(null);
  const error = writable('');

  const firstName = writable('');
  const telegramId = writable('');

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    firstName.set(params.get('name') ?? '');
    telegramId.set(params.get('id') ?? '');
  });

  function setError(message: string) {
    error.set(message);
  }

  function clearError() {
    error.set('');
  }

  async function login(telegramId: string, password: string) {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId, password })
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('jwt', data.token);
        isLoggedIn.set(true);
      } else {
        throw new Error('No token received');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.set(err.message || 'Login failed');
      } else {
        error.set('An unknown error occurred');
      }
      throw err;
    }
  }

  async function verifyToken(telegramId: string, token: string) {
    try {
      const response = await fetch('http://localhost:3000/api/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId, token })
      });
      if (!response.ok) throw new Error('Token verification failed');
      const data = await response.json();
      localStorage.setItem('jwt', data.jwt);
      isTokenVerified.set(true);
      await fetchUserData();
    } catch (err) {
      throw new Error('Token verification failed');
    }
  }

  async function fetchUserData() {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return;

    try {
      const response = await fetch('http://localhost:3000/api/user', {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      userData.set(data);
    } catch (err) {
      throw new Error('Failed to fetch user data');
    }
  }

  function logout() {
    localStorage.removeItem('jwt');
    isLoggedIn.set(false);
    isTokenVerified.set(false);
    userData.set(null);
  }

  const appContext: AppContext = {
    login,
    logout,
    verifyToken,
    setError,
    isLoggedIn,
    isTokenVerified,
    userData,
    firstName,
    telegramId,
  };

  setContext<AppContext>('app', appContext);
</script>

<main>
  {#if $error}
    <div class="error">
      {$error}
      <button on:click={clearError}>Dismiss</button>
    </div>
  {/if}

  <Router url={window.location.pathname} />
</main>

<style>
  .error {
    background-color: #ffcccc;
    border: 1px solid #ff0000;
    color: #ff0000;
    padding: 10px;
    margin-bottom: 10px;
  }
</style>