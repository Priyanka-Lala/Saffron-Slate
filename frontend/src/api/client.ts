/**
 * Central API client.
 *
 * Every network call in the app goes through `apiFetch`, which:
 *  - prefixes the backend's base URL
 *  - attaches the JWT auth token (if we have one) to every request
 *  - parses JSON responses and throws a readable Error on failure,
 *    so calling code can just `try { ... } catch (err) { setError(err.message) }`
 *
 * The backend URL comes from an environment variable so it's easy to
 * point at a different server (e.g. a deployed backend) without
 * touching code — see the .env.example in this folder.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const TOKEN_STORAGE_KEY = 'saffron_slate_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

interface ApiFetchOptions extends RequestInit {
  /** Set true to send a FormData body (file uploads) instead of JSON. */
  isFormData?: boolean;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };

  if (!options.isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // The backend always responds with JSON (even for errors), so we can
  // safely parse it here and pull out a friendly message on failure.
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data as T;
}

/**
 * Turns whatever the backend gave us for an image into a URL the
 * browser can actually load.
 *
 * - Full HTTP(S) URLs are returned unchanged.
 * - blob: URLs are returned unchanged for local file previews.
 * - Relative backend paths such as /uploads/169...jpg are prefixed
 *   with the API base URL.
 */
export function getImageUrl(path: string): string {
  if (!path) return '';

  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}
