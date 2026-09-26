import { useState, useRef, useEffect } from 'react';
import type { NavigateFn } from '../data';
import { CameraIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import * as usersApi from '../api/users';
import { getImageUrl } from '../api/client';

interface EditProfileProps {
  navigate: NavigateFn;
}

export default function EditProfile({ navigate }: EditProfileProps) {
  const { user, refreshUser, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [email] = useState(user?.email ?? ''); // email changes aren't supported yet — see README
  const [avatarPreview, setAvatarPreview] = useState(getImageUrl(user?.avatar ?? ''));
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const BIO_MAX = 200;

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUsername(user.username);
      setBio(user.bio);
      setLocation(user.location);
      setAvatarPreview(getImageUrl(user.avatar));
    }
  }, [user]);

  const handleAvatarChange = async (file: File | undefined | null) => {
    if (!file) return;
    setIsUploadingAvatar(true);
    setError('');
    try {
      const updated = await usersApi.updateMyAvatar(file);
      setUser(updated);
      setAvatarPreview(getImageUrl(updated.avatar));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setError('');
    if (bio.length > BIO_MAX) return;
    setIsSaving(true);
    try {
      const updated = await usersApi.updateMyProfile({ name, username, bio, location });
      setUser(updated);
      await refreshUser();
      navigate('profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong saving your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[680px] mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('profile')}
            className="text-muted hover:text-charcoal transition-colors text-sm font-medium"
          >
            ← Back to Profile
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-1">Account</p>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Edit Profile</h1>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Avatar section */}
        <div className="bg-card rounded-2xl border border-warm-border p-6 mb-6 flex items-center gap-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleAvatarChange(e.target.files?.[0])}
          />
          <div className="relative">
            <img
              src={avatarPreview}
              alt={name}
              className="w-20 h-20 rounded-full object-cover border-4 border-warm-border"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute inset-0 rounded-full bg-charcoal/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <CameraIcon className="w-6 h-6 text-white" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-charcoal text-sm mb-1">Profile Photo</p>
            <p className="text-muted text-xs mb-3">JPG, PNG or WebP · Max 10MB</p>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="text-xs font-semibold text-charcoal border border-warm-border hover:border-gold hover:text-gold px-4 py-1.5 rounded-full transition-all disabled:opacity-50"
              >
                {isUploadingAvatar ? 'Uploading…' : 'Change Photo'}
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl border border-warm-border overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-warm-border">
            <h2 className="font-serif font-bold text-lg text-charcoal">Personal Information</h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Display name */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Display Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal text-sm"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">@</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-z0-9_.]/gi, '').toLowerCase())}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal text-sm"
                />
              </div>
              <p className="text-xs text-muted mt-1.5">saffronandslate.com/u/{username || 'username'} · Only letters, numbers, underscores, and dots.</p>
            </div>

            {/* Email — read-only for now; changing email needs re-verification, which isn't built yet (see README) */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream-dark text-charcoal-mid text-sm cursor-not-allowed"
              />
              <p className="text-xs text-muted mt-1.5">Email changes aren't supported yet.</p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London, UK"
                className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm"
              />
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider">Bio</label>
                <span className={`text-xs ${bio.length > BIO_MAX ? 'text-red-500' : 'text-muted'}`}>
                  {bio.length}/{BIO_MAX}
                </span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Tell the community about yourself — your cooking style, favourite cuisines, what inspires you..."
                className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm resize-none"
              />
              {bio.length > BIO_MAX && (
                <p className="text-xs text-red-500 mt-1">Bio is too long by {bio.length - BIO_MAX} characters.</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-warm-border flex items-center justify-between bg-cream/40">
            <button
              onClick={() => navigate('profile')}
              className="text-sm font-semibold text-muted hover:text-charcoal transition-colors border border-warm-border px-5 py-2.5 rounded-full"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={bio.length > BIO_MAX || isSaving}
              className="bg-gold hover:bg-gold-dark disabled:opacity-50 disabled:cursor-not-allowed text-charcoal font-semibold text-sm px-7 py-2.5 rounded-full transition-colors"
            >
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
