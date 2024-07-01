<script lang="ts">
    import {getContext, onDestroy} from 'svelte';
    import type { AppContext } from '../types';
    import LoadingSpinner from '../components/LoadingSpinner.svelte';

    export let navigate: (path: string) => void;

    const { verifyToken, setError, isLoggedIn, telegramId } = getContext<AppContext>('app');
    let tId: string | null = null;
    const unsubscribe = telegramId.subscribe(value => {
        tId = value;
    });
    onDestroy(() => {
        unsubscribe();
    });

    let token = '';
    let isLoading = false;

    async function handleVerify() {
        isLoading = true;
        try {
            if (!tId) {
                throw new Error('Telegram ID not found');
            }
            await verifyToken(tId, token);
            navigate('/profile');
        } catch (error) {
            setError('Token verification failed. Please try again.');
            navigate('/signup');
        } finally {
            isLoading = false;
        }
    }

    $: if (!$isLoggedIn) {
        navigate('/login');
    }
</script>

<h2>Verify Your Token</h2>
<p>Please enter the authorization token you received during signup:</p>
<input bind:value={token} type="text" placeholder="Authorization Token" required disabled={isLoading}>
<div class="action-container">
    <button on:click={handleVerify} disabled={isLoading}>
        Verify
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