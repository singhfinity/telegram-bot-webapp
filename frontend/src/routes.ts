import Home from './routes/Home.svelte';
import Login from './routes/Login.svelte';
import SignUp from './routes/SignUp.svelte';
import TokenVerification from './routes/TokenVerification.svelte';
import Profile from './routes/Profile.svelte';
import NotFound from './routes/NotFound.svelte';
import type { Routes } from "./types";

export const routes: Routes = {
    '/': Home,
    '/login': Login,
    '/signup': SignUp,
    '/verify-token': TokenVerification,
    '/profile': Profile,
    '*': NotFound
};