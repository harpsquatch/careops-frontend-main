import axiosInstance from './axiosInstance';
import { LOGIN, VERIFY_TOKEN } from '../config';

const TOKEN_KEY = 'access_token';

/**
 * Call the backend login endpoint.
 * On success, stores the JWT in localStorage and returns the token.
 */
export async function login(email, password) {
    const { data } = await axiosInstance.post(LOGIN, { email, password });
    localStorage.setItem(TOKEN_KEY, data.access_token);
    return data;
}

/**
 * Check if a stored token is still valid by calling /verify.
 * Returns { valid, uid, email } on success, or null if expired/missing.
 */
export async function verifyToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
        const { data } = await axiosInstance.get(VERIFY_TOKEN);
        return data;   // { valid: true, uid, email }
    } catch {
        localStorage.removeItem(TOKEN_KEY);
        return null;
    }
}

/**
 * Remove the JWT from storage.
 */
export function logout() {
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * Quick check — is there a token at all? (does NOT verify it)
 */
export function hasToken() {
    return !!localStorage.getItem(TOKEN_KEY);
}

