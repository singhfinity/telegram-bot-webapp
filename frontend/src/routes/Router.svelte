<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { routes } from '../routes';

    export let url = '/';

    const currentRoute = writable<string>(url);

    onMount(() => {
        const onRouteChange = () => {
            currentRoute.set(window.location.pathname);
        };

        window.addEventListener('popstate', onRouteChange);
        return () => window.removeEventListener('popstate', onRouteChange);
    });

    function navigate(path: string) {
        window.history.pushState({}, '', path);
        currentRoute.set(path);
    }

    $: component = routes[$currentRoute] || routes['*'];
</script>

<svelte:component this={component} {navigate} />