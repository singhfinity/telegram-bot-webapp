<script lang="ts">
    import { getContext } from 'svelte';
    import type { AppContext } from '../types';
    import LoadingSpinner from '../components/LoadingSpinner.svelte';

    export let navigate: (path: string) => void;

    const { logout, isLoggedIn, isTokenVerified, userData } = getContext<AppContext>('app');

    let isLoading = false;

    async function handleLogout() {
        isLoading = true;
        logout();
        navigate('/');
        isLoading = false;
    }

    $: if (!$isLoggedIn || !$isTokenVerified) {
        navigate('/login');
    }
</script>

<h2>Profile</h2>
{#if $userData}
    <p>Telegram ID: {$userData.telegramId}</p>
    <p>Created: {new Date($userData.createdAt).toLocaleDateString()}</p>
{:else}
    <p>Loading user data...</p>
{/if}
<div class="action-container">
    <button on:click={handleLogout} disabled={isLoading}>
        Log Out
    </button>
    {#if isLoading}
        <LoadingSpinner />
    {/if}
</div>

<style>
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>