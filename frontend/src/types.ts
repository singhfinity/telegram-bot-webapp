import type { ComponentType } from "svelte";
import type { Writable } from 'svelte/store';

export interface Routes {
    [key: string]: ComponentType;
    '/': ComponentType;
    '/login': ComponentType;
    '/signup': ComponentType;
    '/verify-token': ComponentType;
    '/profile': ComponentType;
    '*': ComponentType;
}

export interface User {
    telegramId: string;
    createdAt: string;
}

export interface AppContext {
    login: (telegramId: string, password: string) => Promise<void>;
    logout: () => void;
    verifyToken: (telegramId: string, token: string) => Promise<void>;
    setError: (message: string) => void;
    isLoggedIn: Writable<boolean>;
    isTokenVerified: Writable<boolean>;
    userData: Writable<User | null>;
    firstName: Writable<string | null>;
    telegramId: Writable<string | null>;
}
