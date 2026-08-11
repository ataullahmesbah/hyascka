'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, Save, Camera, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/page-header';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { ErrorState } from '@/components/dashboard/error-state';

interface ProfileData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  createdAt: string;
  role: { name: string };
}

export default function DashboardProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const { data: profile, loading, error, refetch } = useDashboardData<ProfileData>('/api/dashboard/profile');

  const [name, setName] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [image, setImage] = React.useState('');
  const [savingProfile, setSavingProfile] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [savingPassword, setSavingPassword] = React.useState(false);

  React.useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setBio(profile.bio ?? '');
      setImage(profile.image ?? '');
    }
  }, [profile]);

  const initials = (profile?.name ?? session?.user?.name ?? 'U')
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const roleLabel = (profile?.role.name ?? session?.user?.role ?? 'USER').replace('_', ' ').toLowerCase();

  const handleProfileSave = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch('/api/dashboard/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, image }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to update profile');
      }
      const updated = await res.json();
      await updateSession({
        ...session,
        user: { ...session?.user, name: updated.name, image: updated.image },
      });
      refetch();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'avatars');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const result = await res.json();
      setImage(result.url);
      toast.success('Image uploaded', { description: 'Click Save Changes to apply.' });
    } catch {
      toast.error('Upload failed');
    }
  };

  const handlePasswordChange = async () => {
    setSavingPassword(true);
    try {
      const res = await fetch('/api/dashboard/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to change password');
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <DashboardSkeleton />;
  if (error || !profile) return <ErrorState message="Failed to load profile" onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your personal information and preferences." />

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
          <Card>
            <CardContent className="flex flex-col items-center p-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={image || undefined} alt={profile.name ?? 'User'} />
                  <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">{initials}</AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft hover:bg-primary/90">
                  <Camera className="h-4 w-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold">{profile.name ?? 'User'}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <Badge variant="secondary" className="mt-3 capitalize">{roleLabel}</Badge>

              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="truncate text-sm font-medium">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-sm font-medium capitalize">{roleLabel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="text-sm font-medium">{new Date(profile.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="p-5"><CardTitle className="text-base font-semibold">Personal Information</CardTitle></CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile.email} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={4} />
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button className="gap-2" onClick={handleProfileSave} disabled={savingProfile}>
                  <Save className="h-4 w-4" />
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5"><CardTitle className="text-base font-semibold">Security</CardTitle></CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div />
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Min 8 chars with uppercase, lowercase, number, and special character.</p>
              <Separator />
              <div className="flex justify-end">
                <Button className="gap-2" onClick={handlePasswordChange} disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}>
                  <Lock className="h-4 w-4" />
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}