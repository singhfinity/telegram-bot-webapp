<script lang="ts">
    import {getContext, onDestroy} from 'svelte';
    import type {AppContext} from "../types";

    export let navigate: (path: string) => void;

    const {firstName} = getContext<AppContext>('app');
    let name: string | null = null;
    const unsubscribe = firstName.subscribe(value => {
        name = value;
    });
    onDestroy(() => {
        unsubscribe();
    });
</script>

<h1>Telegram Bot Web App</h1>
{#if name}
    <p>Welcome, {name}!</p>
{:else}
    <p>Welcome!</p>
{/if}
<button on:click={() => navigate('/signup')}>Sign Up</button>
<button on:click={() => navigate('/login')}>Login</button>
