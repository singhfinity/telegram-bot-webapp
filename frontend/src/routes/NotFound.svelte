<script lang="ts">
    export let navigate: (path: string) => void;
</script>

<h2>404 - Page Not Found</h2>
<p>The page you're looking for doesn't exist.</p>
<button on:click={() => navigate('/')}>Go Home</button>