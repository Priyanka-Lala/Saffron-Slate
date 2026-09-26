import { apiFetch } from './client';
import type { User } from './types';

interface AuthResponse {
  token: string;
  user: User;
}

export function signup(name: string, email: string, password: string) {
  return apiFetch<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function forgotPassword(email: string) {
  return apiFetch<{ message: string }>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function getMe() {
  return apiFetch<{ user: User }>('/api/auth/me');
}
