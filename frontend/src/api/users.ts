import { apiFetch } from './client';
import type { User } from './types';

export async function getMyProfile(): Promise<User> {
  const { user } = await apiFetch<{ user: User }>('/api/users/me');
  return user;
}

export async function updateMyProfile(fields: {
  name?: string;
  username?: string;
  bio?: string;
  location?: string;
}): Promise<User> {
  const { user } = await apiFetch<{ user: User }>('/api/users/me', {
    method: 'PUT',
    body: JSON.stringify(fields),
  });
  return user;
}

export async function updateMyAvatar(file: File): Promise<User> {
  const formData = new FormData();
  formData.append('avatar', file);
  const { user } = await apiFetch<{ user: User }>('/api/users/me/avatar', {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
  return user;
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiFetch<{ message: string }>('/api/users/me/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function updateMySettings(fields: {
  dietaryPreferences?: string[];
  notificationSettings?: Partial<User['notificationSettings']>;
  privacySettings?: Partial<User['privacySettings']>;
}): Promise<User> {
  const { user } = await apiFetch<{ user: User }>('/api/users/me/settings', {
    method: 'PUT',
    body: JSON.stringify(fields),
  });
  return user;
}

export function deleteMyAccount() {
  return apiFetch<{ message: string }>('/api/users/me', { method: 'DELETE' });
}
