<script lang="ts">
    import {onDestroy, onMount} from 'svelte';
    import { getContext } from 'svelte';
    import type { AppContext } from '../types';
    import LoadingSpinner from '../components/LoadingSpinner.svelte';

    export let navigate: (path: string) => void;

    const { setError, telegramId } = getContext<AppContext>('app');
    let tId: string | null = null;
    const unsubscribe = telegramId.subscribe(value => {
        tId = value;
    });
    onDestroy(() => {
        unsubscribe();
    });

    let password = '';
    let showToken = false;
    let copySuccess = false;
    let token = '';
    let isLoading = false;

    async function signUp() {
        isLoading = true;
        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telegramId: tId, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Signup failed');
            }

            const data = await response.json();
            token = data.token;
            showToken = true;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to sign up. Please try again.');
            } else {
                setError('An unknown error occurred');
            }
            throw err;
        }
        finally {
            isLoading = false;
        }
    }

    function confirmToken() {
        showToken = false;
        navigate('/login');
    }

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(token);
            copySuccess = true;
            setTimeout(() => copySuccess = false, 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
</script>

{#if !showToken}
    <h2>Sign Up</h2>
    <form on:submit|preventDefault={signUp}>
        <input bind:value={tId} type="text" placeholder="Telegram ID" required>
        <input bind:value={password} type="password" placeholder="Password" required>
        <div class="action-container">
            <button type="submit" disabled={isLoading}>
                Sign Up
            </button>
            {#if isLoading}
                <LoadingSpinner />
            {/if}
        </div>
    </form>
{:else}
    <div class="modal">
        <div class="modal-content">
            <h2>Your Authorization Token</h2>
            <div class="token-container">
                <p>{token}</p>
                <button on:click={copyToClipboard} disabled={copySuccess}>
                    {copySuccess ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <p>Please copy and save this token somewhere safe. You will need it to log in.</p>
            <button on:click={confirmToken}>OK</button>
        </div>
    </div>
{/if}

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background-color: white;
        color: black;
        padding: 20px;
        border-radius: 5px;
        text-align: center;
    }

    .token-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1em;
    }

    .token-container p {
        margin-right: 1em;
        word-break: break-all;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>