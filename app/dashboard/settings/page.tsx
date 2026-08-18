'use client';

import * as React from 'react';
import { Save, Building, Share2, Search, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/dashboard/page-header';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { toast } from 'sonner';

interface SiteSettings {
  id: string;
  siteName: string;
  siteUrl: string | null;
  logo: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  socialLinks: any;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  analyticsId: string | null;
  fbPixelId: string | null;
  fbPixelEnabled: boolean;
  metaCapiAccessTokenSet: boolean;
  metaCapiEnabled: boolean;
  gtmContainerId: string | null;
  gtmEnabled: boolean;
  ga4MeasurementId: string | null;
  ga4Enabled: boolean;
  clarityProjectId: string | null;
  clarityEnabled: boolean;
}

export default function SettingsPage() {
  const { data: settings, refetch } = useDashboardData<SiteSettings>('/api/dashboard/settings');

  const [formData, setFormData] = React.useState({
    siteName: '', siteUrl: '', description: '', email: '', phone: '', address: '',
    seoTitle: '', seoDescription: '', seoKeywords: '',
    twitter: '', linkedin: '', github: '', instagram: '', youtube: '',
    fbPixelId: '', fbPixelEnabled: false,
    metaCapiAccessToken: '', metaCapiEnabled: false, metaCapiAccessTokenSet: false,
    gtmContainerId: '', gtmEnabled: false,
    ga4MeasurementId: '', ga4Enabled: false,
    clarityProjectId: '', clarityEnabled: false,
  });

  React.useEffect(() => {
    if (settings) {
      const social = (settings.socialLinks ?? {}) as Record<string, string>;
      setFormData({
        siteName: settings.siteName ?? '',
        siteUrl: settings.siteUrl ?? '',
        description: settings.description ?? '',
        email: settings.email ?? '',
        phone: settings.phone ?? '',
        address: settings.address ?? '',
        seoTitle: settings.seoTitle ?? '',
        seoDescription: settings.seoDescription ?? '',
        seoKeywords: settings.seoKeywords ?? '',
        twitter: social.twitter ?? '',
        linkedin: social.linkedin ?? '',
        github: social.github ?? '',
        instagram: social.instagram ?? '',
        youtube: social.youtube ?? '',
        fbPixelId: settings.fbPixelId ?? '',
        fbPixelEnabled: settings.fbPixelEnabled,
        metaCapiAccessToken: '',
        metaCapiEnabled: settings.metaCapiEnabled,
        metaCapiAccessTokenSet: settings.metaCapiAccessTokenSet,
        gtmContainerId: settings.gtmContainerId ?? '',
        gtmEnabled: settings.gtmEnabled,
        ga4MeasurementId: settings.ga4MeasurementId ?? '',
        ga4Enabled: settings.ga4Enabled,
        clarityProjectId: settings.clarityProjectId ?? '',
        clarityEnabled: settings.clarityEnabled,
      });
    }
  }, [settings]);

  const handleSave = async (section: string) => {
    try {
      const payload: Record<string, unknown> = {};
      if (section === 'general') {
        Object.assign(payload, {
          siteName: formData.siteName, siteUrl: formData.siteUrl, description: formData.description,
          email: formData.email, phone: formData.phone, address: formData.address,
        });
      } else if (section === 'social') {
        payload.socialLinks = {
          twitter: formData.twitter, linkedin: formData.linkedin, github: formData.github,
          instagram: formData.instagram, youtube: formData.youtube,
        };
      } else if (section === 'seo') {
        Object.assign(payload, {
          seoTitle: formData.seoTitle, seoDescription: formData.seoDescription, seoKeywords: formData.seoKeywords,
        });
      } else if (section === 'analytics') {
        Object.assign(payload, {
          fbPixelId: formData.fbPixelId, fbPixelEnabled: formData.fbPixelEnabled,
          metaCapiEnabled: formData.metaCapiEnabled,
          gtmContainerId: formData.gtmContainerId, gtmEnabled: formData.gtmEnabled,
          ga4MeasurementId: formData.ga4MeasurementId, ga4Enabled: formData.ga4Enabled,
          clarityProjectId: formData.clarityProjectId, clarityEnabled: formData.clarityEnabled,
        });
        // Only send the token if the admin actually typed a new one — an
        // empty field must never overwrite an already-saved token.
        if (formData.metaCapiAccessToken) {
          payload.metaCapiAccessToken = formData.metaCapiAccessToken;
        }
      }

      const res = await fetch('/api/dashboard/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      toast.success(`${section} settings saved`);
      refetch();
    } catch {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Site Settings" description="Manage your website configuration and preferences." />

      <Tabs defaultValue="general">
        <TabsList className="w-fit">
          <TabsTrigger value="general" className="gap-1.5"><Building className="h-3.5 w-3.5" /> General</TabsTrigger>
          <TabsTrigger value="social" className="gap-1.5"><Share2 className="h-3.5 w-3.5" /> Social</TabsTrigger>
          <TabsTrigger value="seo" className="gap-1.5"><Search className="h-3.5 w-3.5" /> SEO</TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader className="p-5"><CardTitle className="text-base font-semibold">Company Information</CardTitle></CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="siteName">Site Name</Label><Input id="siteName" value={formData.siteName} onChange={(e) => setFormData({ ...formData, siteName: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="siteUrl">Site URL</Label><Input id="siteUrl" value={formData.siteUrl} onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="email">Contact Email</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="address">Address</Label><Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
              <Separator />
              <div className="flex justify-end"><Button className="gap-2" onClick={() => handleSave('general')}><Save className="h-4 w-4" /> Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-4">
          <Card>
            <CardHeader className="p-5"><CardTitle className="text-base font-semibold">Social Media Links</CardTitle></CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              {(['twitter', 'linkedin', 'github', 'instagram', 'youtube'] as const).map((platform) => (
                <div key={platform} className="space-y-2">
                  <Label htmlFor={platform} className="capitalize">{platform}</Label>
                  <Input id={platform} value={formData[platform]} onChange={(e) => setFormData({ ...formData, [platform]: e.target.value })} placeholder={`https://${platform}.com/hyaska`} />
                </div>
              ))}
              <Separator />
              <div className="flex justify-end"><Button className="gap-2" onClick={() => handleSave('social')}><Save className="h-4 w-4" /> Save Social Links</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <Card>
            <CardHeader className="p-5"><CardTitle className="text-base font-semibold">SEO Settings</CardTitle></CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="space-y-2"><Label htmlFor="seoTitle">Meta Title</Label><Input id="seoTitle" value={formData.seoTitle} onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="seoDesc">Meta Description</Label><Textarea id="seoDesc" value={formData.seoDescription} onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} rows={3} /></div>
              <div className="space-y-2"><Label htmlFor="seoKeywords">Meta Keywords</Label><Input id="seoKeywords" value={formData.seoKeywords} onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })} /></div>
              <Separator />
              <div className="flex justify-end"><Button className="gap-2" onClick={() => handleSave('seo')}><Save className="h-4 w-4" /> Save SEO Settings</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader className="p-5">
              <CardTitle className="text-base font-semibold">Analytics & Tracking</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Each integration only loads on the live site when its toggle is on.</p>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-6">
              <div className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ga4MeasurementId" className="font-medium">Google Analytics 4</Label>
                  <Switch id="ga4Enabled" checked={formData.ga4Enabled} onCheckedChange={(c) => setFormData({ ...formData, ga4Enabled: c })} />
                </div>
                <Input id="ga4MeasurementId" value={formData.ga4MeasurementId} onChange={(e) => setFormData({ ...formData, ga4MeasurementId: e.target.value })} placeholder="G-XXXXXXXXXX" />
              </div>

              <div className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gtmContainerId" className="font-medium">Google Tag Manager</Label>
                  <Switch id="gtmEnabled" checked={formData.gtmEnabled} onCheckedChange={(c) => setFormData({ ...formData, gtmEnabled: c })} />
                </div>
                <Input id="gtmContainerId" value={formData.gtmContainerId} onChange={(e) => setFormData({ ...formData, gtmContainerId: e.target.value })} placeholder="GTM-XXXXXXX" />
              </div>

              <div className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fbPixelId" className="font-medium">Facebook Pixel</Label>
                  <Switch id="fbPixelEnabled" checked={formData.fbPixelEnabled} onCheckedChange={(c) => setFormData({ ...formData, fbPixelEnabled: c })} />
                </div>
                <Input id="fbPixelId" value={formData.fbPixelId} onChange={(e) => setFormData({ ...formData, fbPixelId: e.target.value })} placeholder="Pixel ID" />
              </div>

              <div className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="metaCapiToken" className="font-medium">Meta Conversions API</Label>
                  <Switch id="metaCapiEnabled" checked={formData.metaCapiEnabled} onCheckedChange={(c) => setFormData({ ...formData, metaCapiEnabled: c })} />
                </div>
                <Input
                  id="metaCapiToken"
                  type="password"
                  value={formData.metaCapiAccessToken}
                  onChange={(e) => setFormData({ ...formData, metaCapiAccessToken: e.target.value })}
                  placeholder={formData.metaCapiAccessTokenSet ? 'Access token saved — enter a new one to replace it' : 'Access token'}
                />
                <p className="text-xs text-muted-foreground">
                  Never displayed once saved, only whether one exists. Server-to-server event dispatch using this token is not wired up yet.
                </p>
              </div>

              <div className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="clarityProjectId" className="font-medium">Microsoft Clarity</Label>
                  <Switch id="clarityEnabled" checked={formData.clarityEnabled} onCheckedChange={(c) => setFormData({ ...formData, clarityEnabled: c })} />
                </div>
                <Input id="clarityProjectId" value={formData.clarityProjectId} onChange={(e) => setFormData({ ...formData, clarityProjectId: e.target.value })} placeholder="Project ID" />
              </div>

              <Separator />
              <div className="flex justify-end"><Button className="gap-2" onClick={() => handleSave('analytics')}><Save className="h-4 w-4" /> Save Analytics</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}