// ==========================================================
// REPLACE EXISTING FILE
// LOCATION: constants/dashboard-nav.ts
// ==========================================================
import type { LucideIcon } from 'lucide-react';
import type { Role } from '@/lib/permissions';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Shield,
  FolderKanban,
  Wrench,
  FileText,
  FolderTree,
  Tag,
  Image,
  Cpu,
  Quote,
  HelpCircle,
  Mail,
  Newspaper,
  Bot,
  Workflow,
  FileBarChart,
  Settings,
  Palette,
  Bell,
  ScrollText,
  Activity,
  User,
  LogOut,
  ShoppingBag,
  ClipboardList,
  ReceiptText,
  UserPlus,
  FileSignature,
} from 'lucide-react';

export type DashboardRole = Role;

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: DashboardRole[];
  badge?: string;
}

export interface DashboardNavGroup {
  label: string;
  items: DashboardNavItem[];
}

export const dashboardNavGroups: DashboardNavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, roles: ['SUPER_ADMIN', 'ADMIN'] },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Users', href: '/dashboard/users', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { label: 'Roles', href: '/dashboard/roles', icon: Shield, roles: ['SUPER_ADMIN'] },
      { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban, roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'CLIENT'] },
      { label: 'Services', href: '/dashboard/services', icon: Wrench, roles: ['SUPER_ADMIN', 'ADMIN'] },
    ],
  },
  {
    label: 'Sales',
    items: [
      { label: 'Leads', href: '/dashboard/leads', icon: UserPlus, roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] },
      { label: 'Offers', href: '/dashboard/offers', icon: FileSignature, roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] },
      { label: 'My Offers', href: '/dashboard/my-offers', icon: FileSignature, roles: ['CLIENT', 'USER'] },
    ],
  },
  {
    label: 'Billing',
    items: [
      { label: 'Orders', href: '/dashboard/orders', icon: ClipboardList, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { label: 'My Services', href: '/dashboard/my-services', icon: ShoppingBag, roles: ['CLIENT', 'USER'] },
      { label: 'My Orders', href: '/dashboard/orders', icon: ReceiptText, roles: ['CLIENT', 'USER'] },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Blog', href: '/dashboard/blog', icon: FileText, roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'] },
      { label: 'Categories', href: '/dashboard/categories', icon: FolderTree, roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] },
      { label: 'Tags', href: '/dashboard/tags', icon: Tag, roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] },
      { label: 'Media Library', href: '/dashboard/media', icon: Image, roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'] },
      { label: 'Technologies', href: '/dashboard/technologies', icon: Cpu, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { label: 'Testimonials', href: '/dashboard/testimonials', icon: Quote, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { label: 'FAQ', href: '/dashboard/faq', icon: HelpCircle, roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] },
    ],
  },
  {
    label: 'Communication',
    items: [
      { label: 'Messages', href: '/dashboard/messages', icon: Mail, roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] },
      { label: 'Newsletter', href: '/dashboard/newsletter', icon: Newspaper, roles: ['SUPER_ADMIN', 'ADMIN'] },
    ],
  },
  {
    label: 'AI & Automation',
    items: [
      { label: 'AI Agents', href: '/dashboard/ai-agents', icon: Bot, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { label: 'Automation', href: '/dashboard/automation', icon: Workflow, roles: ['SUPER_ADMIN', 'ADMIN'] },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Reports', href: '/dashboard/reports', icon: FileBarChart, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { label: 'Appearance', href: '/dashboard/appearance', icon: Palette, roles: ['SUPER_ADMIN'] },
      { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
      { label: 'Audit Logs', href: '/dashboard/audit-logs', icon: ScrollText, roles: ['SUPER_ADMIN'] },
      { label: 'Activity Logs', href: '/dashboard/activity', icon: Activity, roles: ['SUPER_ADMIN', 'ADMIN'] },
    ],
  },
];

export const dashboardAccountItems: DashboardNavItem[] = [
  { label: 'Profile', href: '/dashboard/profile', icon: User },
  { label: 'Logout', href: '/api/auth/logout', icon: LogOut },
];