import { useState } from 'react';
import type { NavigateFn } from '../data';
import { UserIcon, BellIcon, ShieldIcon, SaladIcon, HelpIcon, LogOutIcon, ChevronRightIcon, CameraIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import * as usersApi from '../api/users';
import { getImageUrl } from '../api/client';

interface SettingsProps {
  navigate: NavigateFn;
}

type Section = 'account' | 'notifications' | 'privacy' | 'dietary' | 'help';

const MENU_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'account', label: 'Account', icon: <UserIcon className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <BellIcon className="w-4 h-4" /> },
  { id: 'privacy', label: 'Privacy', icon: <ShieldIcon className="w-4 h-4" /> },
  { id: 'dietary', label: 'Dietary Preferences', icon: <SaladIcon className="w-4 h-4" /> },
  { id: 'help', label: 'Help & Support', icon: <HelpIcon className="w-4 h-4" /> },
];

const DIETARY_TAGS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Keto', 'Paleo', 'Halal', 'Low-Carb'];

type Notifs = {
  newFollower: boolean;
  recipeComments: boolean;
  weeklyDigest: boolean;
  trending: boolean;
  savedReminders: boolean;
};

type Privacy = {
  publicProfile: boolean;
  showRecipeCount: boolean;
  allowRecipeSaves: boolean;
};

export default function Settings({ navigate }: SettingsProps) {
  const { user, logout, refreshUser, setUser } = useAuth();
  const [section, setSection] = useState<Section>('account');
  const [name, setName] = useState(user?.name ?? '');
  const [email] = useState(user?.email ?? '');
  const [dietary, setDietary] = useState<string[]>(user?.dietaryPreferences ?? []);
  const [notifs, setNotifs] = useState<Notifs>(
    user?.notificationSettings ?? {
      newFollower: true,
      recipeComments: true,
      weeklyDigest: false,
      trending: true,
      savedReminders: false,
    }
  );
  const [privacy, setPrivacy] = useState<Privacy>(
    user?.privacySettings ?? { publicProfile: true, showRecipeCount: true, allowRecipeSaves: true }
  );

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Inline "change password" mini-form state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (!user) return null;

  const flashSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const toggleDietary = (tag: string) => {
    setDietary((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const toggleNotif = (key: keyof Notifs) => {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key: keyof Privacy) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveAccount = async () => {
    setError('');
    setIsSaving(true);
    try {
      const updated = await usersApi.updateMyProfile({ name });
      const withSettings = await usersApi.updateMySettings({ notificationSettings: notifs });
      setUser({ ...updated, ...withSettings });
      flashSuccess('Account settings saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveNotifications = async () => {
    setError('');
    setIsSaving(true);
    try {
      const updated = await usersApi.updateMySettings({ notificationSettings: notifs });
      setUser(updated);
      flashSuccess('Notification preferences saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const savePrivacy = async (nextPrivacy: Privacy) => {
    setError('');
    try {
      const updated = await usersApi.updateMySettings({ privacySettings: nextPrivacy });
      setUser(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes.');
    }
  };

  const saveDietary = async () => {
    setError('');
    setIsSaving(true);
    try {
      const updated = await usersApi.updateMySettings({ dietaryPreferences: dietary });
      setUser(updated);
      flashSuccess('Dietary preferences saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setError('');
    if (!currentPassword || !newPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    setIsChangingPassword(true);
    try {
      await usersApi.changePassword(currentPassword, newPassword);
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      flashSuccess('Password updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Delete your account permanently? This will remove your profile and all your recipes. This cannot be undone.')) {
      return;
    }
    try {
      await usersApi.deleteMyAccount();
      logout();
      navigate('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('login');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-1">Account</p>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Settings</h1>
        </div>

        {(error || successMessage) && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl border text-sm ${
              error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
            }`}
          >
            {error || successMessage}
          </div>
        )}

        <div className="grid grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <div className="bg-card rounded-2xl border border-warm-border overflow-hidden h-fit">
            <div className="p-4 border-b border-warm-border">
              <div className="flex items-center gap-3">
                <img src={getImageUrl(user.avatar)} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-charcoal text-sm">{user.name}</p>
                  <p className="text-xs text-muted">@{user.username}</p>
                </div>
              </div>
            </div>
            <nav className="p-2">
              {MENU_ITEMS.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setSection(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                    section === id
                      ? 'bg-gold-light text-gold font-semibold'
                      : 'text-charcoal-mid hover:bg-cream-dark hover:text-charcoal'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
              <div className="mt-2 pt-2 border-t border-warm-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOutIcon className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </nav>
          </div>

          {/* Content panel */}
          <div className="bg-card rounded-2xl border border-warm-border overflow-hidden">
            {section === 'account' && (
              <>
                <div className="px-7 pt-6 pb-4 border-b border-warm-border">
                  <h2 className="font-serif text-xl font-bold text-charcoal">Account Settings</h2>
                  <p className="text-muted text-sm mt-0.5">Manage your personal information and login details.</p>
                </div>
                <div className="p-7 space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-5 pb-6 border-b border-warm-border">
                    <div className="relative">
                      <img src={getImageUrl(user.avatar)} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-warm-border" />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal text-sm mb-1">Profile Photo</p>
                      <button
                        onClick={() => navigate('edit-profile')}
                        className="text-xs font-semibold text-gold hover:text-gold-dark transition-colors"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>

                  {/* Name + email */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Display Name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Email Address</label>
                      <input type="email" value={email} disabled className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream-dark text-charcoal-mid text-sm cursor-not-allowed" />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Password</label>
                    {!showPasswordForm ? (
                      <div className="flex items-center gap-3">
                        <input type="password" value="••••••••••••" readOnly className="flex-1 px-4 py-3 rounded-xl border border-warm-border bg-cream text-charcoal text-sm opacity-60 cursor-not-allowed" />
                        <button
                          onClick={() => setShowPasswordForm(true)}
                          className="text-sm font-semibold text-gold hover:text-gold-dark border border-gold hover:border-gold-dark px-4 py-3 rounded-xl transition-all"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 p-4 rounded-xl border border-warm-border bg-cream">
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Current password"
                          className="w-full px-4 py-2.5 rounded-xl border border-warm-border bg-card focus:outline-none focus:border-gold text-charcoal text-sm"
                        />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password (at least 8 characters)"
                          className="w-full px-4 py-2.5 rounded-xl border border-warm-border bg-card focus:outline-none focus:border-gold text-charcoal text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleChangePassword}
                            disabled={isChangingPassword}
                            className="bg-gold hover:bg-gold-dark text-charcoal font-semibold text-xs px-4 py-2 rounded-full transition-colors disabled:opacity-60"
                          >
                            {isChangingPassword ? 'Updating…' : 'Update Password'}
                          </button>
                          <button
                            onClick={() => { setShowPasswordForm(false); setCurrentPassword(''); setNewPassword(''); }}
                            className="text-xs font-semibold text-muted hover:text-charcoal px-4 py-2 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dietary preferences */}
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-3">Dietary Preferences</label>
                    <div className="flex flex-wrap gap-2">
                      {DIETARY_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleDietary(tag)}
                          className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                            dietary.includes(tag)
                              ? 'bg-gold border-gold text-charcoal'
                              : 'border-warm-border text-muted hover:border-gold hover:text-gold'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notification toggles */}
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-3">Email Notifications</label>
                    <div className="space-y-3">
                      {([
                        { key: 'newFollower', label: 'New followers', desc: 'When someone starts following you' },
                        { key: 'recipeComments', label: 'Recipe comments', desc: 'When someone comments on your recipes' },
                        { key: 'weeklyDigest', label: 'Weekly digest', desc: 'A roundup of top recipes each week' },
                        { key: 'trending', label: 'Trending recipes', desc: 'Popular recipes in your cuisine preferences' },
                        { key: 'savedReminders', label: 'Saved recipe reminders', desc: 'Reminders to cook your saved recipes' },
                      ] as { key: keyof Notifs; label: string; desc: string }[]).map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between py-2 border-b border-warm-border last:border-0">
                          <div>
                            <p className="text-sm font-medium text-charcoal">{label}</p>
                            <p className="text-xs text-muted mt-0.5">{desc}</p>
                          </div>
                          <button
                            onClick={() => toggleNotif(key)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${notifs[key] ? 'bg-gold' : 'bg-warm-border'}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifs[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={saveAccount}
                      disabled={isSaving}
                      className="bg-gold hover:bg-gold-dark text-charcoal font-semibold px-7 py-2.5 rounded-full transition-colors text-sm shadow-sm disabled:opacity-60"
                    >
                      {isSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {section === 'notifications' && (
              <>
                <div className="px-7 pt-6 pb-4 border-b border-warm-border">
                  <h2 className="font-serif text-xl font-bold text-charcoal">Notification Preferences</h2>
                  <p className="text-muted text-sm mt-0.5">Choose what you want to be notified about.</p>
                </div>
                <div className="p-7 space-y-3">
                  {([
                    { key: 'newFollower', label: 'New followers', desc: 'When someone starts following you' },
                    { key: 'recipeComments', label: 'Recipe comments', desc: 'When someone comments on your recipes' },
                    { key: 'weeklyDigest', label: 'Weekly digest', desc: 'A roundup of top recipes each week' },
                    { key: 'trending', label: 'Trending recipes', desc: 'Popular recipes in your cuisine preferences' },
                    { key: 'savedReminders', label: 'Saved recipe reminders', desc: 'Reminders to cook your saved recipes' },
                  ] as { key: keyof Notifs; label: string; desc: string }[]).map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-warm-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-charcoal">{label}</p>
                        <p className="text-xs text-muted mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => toggleNotif(key)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${notifs[key] ? 'bg-gold' : 'bg-warm-border'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifs[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))}
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={saveNotifications}
                      disabled={isSaving}
                      className="bg-gold hover:bg-gold-dark text-charcoal font-semibold px-7 py-2.5 rounded-full transition-colors text-sm shadow-sm disabled:opacity-60"
                    >
                      {isSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {section === 'privacy' && (
              <>
                <div className="px-7 pt-6 pb-4 border-b border-warm-border">
                  <h2 className="font-serif text-xl font-bold text-charcoal">Privacy</h2>
                  <p className="text-muted text-sm mt-0.5">Control who can see your profile and content.</p>
                </div>
                <div className="p-7 space-y-5">
                  {([
                    { key: 'publicProfile', label: 'Public Profile', desc: 'Anyone can see your profile and recipes' },
                    { key: 'showRecipeCount', label: 'Show Recipe Count', desc: "Display how many recipes you've published" },
                    { key: 'allowRecipeSaves', label: 'Allow Recipe Saves', desc: 'Others can save your recipes to their favorites' },
                  ] as { key: keyof Privacy; label: string; desc: string }[]).map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-warm-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-charcoal">{label}</p>
                        <p className="text-xs text-muted mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          const next = { ...privacy, [key]: !privacy[key] };
                          setPrivacy(next);
                          savePrivacy(next);
                        }}
                        className={`relative w-11 h-6 rounded-full transition-colors ${privacy[key] ? 'bg-gold' : 'bg-warm-border'}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${privacy[key] ? 'translate-x-5' : 'translate-x-0'} left-0.5`} />
                      </button>
                    </div>
                  ))}
                  <div className="pt-2">
                    <button onClick={handleDeleteAccount} className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">Delete Account</button>
                    <p className="text-xs text-muted mt-1">This action is permanent and cannot be undone.</p>
                  </div>
                </div>
              </>
            )}

            {section === 'dietary' && (
              <>
                <div className="px-7 pt-6 pb-4 border-b border-warm-border">
                  <h2 className="font-serif text-xl font-bold text-charcoal">Dietary Preferences</h2>
                  <p className="text-muted text-sm mt-0.5">We use these to personalise recipe recommendations for you.</p>
                </div>
                <div className="p-7">
                  <div className="flex flex-wrap gap-3 mb-7">
                    {DIETARY_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleDietary(tag)}
                        className={`text-sm font-semibold px-4 py-2 rounded-full border transition-all ${
                          dietary.includes(tag)
                            ? 'bg-gold border-gold text-charcoal shadow-sm'
                            : 'border-warm-border text-muted hover:border-gold hover:text-gold'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={saveDietary}
                    disabled={isSaving}
                    className="bg-gold hover:bg-gold-dark text-charcoal font-semibold px-7 py-2.5 rounded-full transition-colors text-sm disabled:opacity-60"
                  >
                    {isSaving ? 'Saving…' : 'Save Preferences'}
                  </button>
                </div>
              </>
            )}

            {section === 'help' && (
              <>
                <div className="px-7 pt-6 pb-4 border-b border-warm-border">
                  <h2 className="font-serif text-xl font-bold text-charcoal">Help & Support</h2>
                  <p className="text-muted text-sm mt-0.5">We&apos;re here to help.</p>
                </div>
                <div className="p-7 space-y-3">
                  {[
                    'Getting Started Guide',
                    'How to Add a Recipe',
                    'Managing Your Account',
                    'Privacy & Data',
                    'Report a Problem',
                    'Contact Support',
                  ].map((item) => (
                    <button key={item} className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-warm-border hover:border-gold hover:bg-gold-light transition-all text-sm font-medium text-charcoal-mid hover:text-charcoal">
                      {item}
                      <ChevronRightIcon className="w-4 h-4 text-muted" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
