<script lang="ts">
    import {getContext, onDestroy} from 'svelte';
    import type { AppContext } from '../types';
    import LoadingSpinner from '../components/LoadingSpinner.svelte';

    export let navigate: (path: string) => void;

    const { login, setError, telegramId } = getContext<AppContext>('app');
    let tId: string | null = null;
    const unsubscribe = telegramId.subscribe(value => {
        tId = value;
    });
    onDestroy(() => {
        unsubscribe();
    });

    let password = '';
    let isLoading = false;

    async function handleLogin() {
        isLoading = true;
        try {
            await login(tId!, password);
            navigate('/verify-token');
        } catch (error) {
            setError('Login failed. Please try again.');
        } finally {
            isLoading = false;
        }
    }
</script>

<h2>Login</h2>
<form on:submit|preventDefault={handleLogin}>
    <input bind:value={tId} type="text" placeholder="Telegram ID" required disabled={isLoading}>
    <input bind:value={password} type="password" placeholder="Password" required disabled={isLoading}>
    <div class="action-container">
        <button type="submit" disabled={isLoading}>
            Login
        </button>
        {#if isLoading}
            <LoadingSpinner />
        {/if}
    </div>

</form>

<style>
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>