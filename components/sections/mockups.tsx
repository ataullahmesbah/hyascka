'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  TrendingUp,
  Activity,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  BarChart3,
  Boxes,
  Search,
  ShoppingCart,
  Zap,
} from 'lucide-react';

type MockupProps = { className?: string };

/* ── Support agent dashboard ── */
export function SupportAgentMockup({ className }: MockupProps) {
  const tickets = [
    { id: '#4821', subject: 'Billing discrepancy', status: 'resolved', confidence: 94 },
    { id: '#4822', subject: 'API rate limit question', status: 'resolved', confidence: 88 },
    { id: '#4823', subject: 'Account upgrade', status: 'resolved', confidence: 96 },
    { id: '#4824', subject: 'Custom integration', status: 'escalated', confidence: 41 },
  ];
  return (
    <MockupShell className={className}>
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
            <Bot className="h-4 w-4" />
          </div>
          <span className="font-display text-sm font-semibold">Support Agent</span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Active
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        <StatTile label="Resolved" value="72%" tint="text-success" />
        <StatTile label="Avg time" value="8.4s" tint="text-primary" />
        <StatTile label="Escalated" value="28%" tint="text-accent" />
      </div>
      <div className="flex flex-col gap-2 px-4 pb-4">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Recent tickets
        </div>
        {tickets.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-2.5"
          >
            <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
            <span className="flex-1 text-sm">{t.subject}</span>
            {t.status === 'resolved' ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <ArrowRight className="h-4 w-4 text-accent" />
            )}
            <span className="text-xs font-medium text-muted-foreground">{t.confidence}%</span>
          </motion.div>
        ))}
      </div>
    </MockupShell>
  );
}

/* ── Ecommerce storefront with AI search ── */
export function EcommerceMockup({ className }: MockupProps) {
  const products = [
    { name: 'Aurora Headphones', price: '$249', lift: '+24%' },
    { name: 'Nimbus Watch', price: '$399', lift: '+31%' },
    { name: 'Pulse Speaker', price: '$179', lift: '+18%' },
  ];
  return (
    <MockupShell className={className}>
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <ShoppingCart className="h-4 w-4 text-primary" />
        <span className="font-display text-sm font-semibold">AI Storefront</span>
        <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          Personalized
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">AI search: "wireless audio for travel"</span>
        </div>
        <div className="mt-3 flex flex-col gap-2.5">
          {products.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20" />
              <div className="flex-1">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.price}</div>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-success">
                <TrendingUp className="h-3.5 w-3.5" />
                {p.lift}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </MockupShell>
  );
}

/* ── Operations / logistics intelligence dashboard ── */
export function OperationsMockup({ className }: MockupProps) {
  const bars = [42, 58, 35, 71, 64, 83, 55, 78, 49, 88, 62, 94];
  return (
    <MockupShell className={className}>
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-accent" />
          <span className="font-display text-sm font-semibold">Operations Intelligence</span>
        </div>
        <span className="text-xs text-muted-foreground">Live</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Throughput" value="14.2k/h" tint="text-primary" />
          <StatTile label="Anomalies" value="3" tint="text-accent" />
        </div>
        <div className="mt-4 rounded-xl border border-border/60 bg-background/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Output trend (12h)
            </span>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3 flex h-24 items-end gap-1.5">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
                className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-accent"
              />
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-2.5">
          <Zap className="h-4 w-4 text-success" />
          <span className="flex-1 text-sm">Forecast: output +12% next cycle</span>
        </div>
      </div>
    </MockupShell>
  );
}

/* ── AI workspace / agent orchestration ── */
export function AgentWorkspaceMockup({ className }: MockupProps) {
  const agents = [
    { name: 'Research Agent', status: 'running', icon: Search },
    { name: 'Summary Agent', status: 'running', icon: MessageSquare },
    { name: 'Validation Agent', status: 'done', icon: CheckCircle2 },
    { name: 'Report Agent', status: 'queued', icon: Boxes },
  ];
  return (
    <MockupShell className={className}>
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <Boxes className="h-4 w-4 text-primary" />
        <span className="font-display text-sm font-semibold">Agent Orchestration</span>
        <span className="ml-auto rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
          3 live
        </span>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2.5">
          {agents.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <a.icon className="h-4 w-4" />
              </div>
              <span className="flex-1 text-sm font-medium">{a.name}</span>
              <StatusPill status={a.status} />
            </motion.div>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center gap-2 text-sm">
            <Bot className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Pipeline output ready for review</span>
          </div>
        </div>
      </div>
    </MockupShell>
  );
}

/* ── shared building blocks ── */
function MockupShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border bg-card shadow-soft-lg ${className ?? ''}`}
    >
      <div className="flex items-center gap-1.5 border-b border-border/60 bg-background-secondary px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-chart-4/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/50" />
      </div>
      {children}
    </div>
  );
}

function StatTile({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-lg font-semibold ${tint}`}>{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { class: string; label: string }> = {
    running: { class: 'bg-primary/10 text-primary', label: 'Running' },
    done: { class: 'bg-success/10 text-success', label: 'Done' },
    queued: { class: 'bg-muted text-muted-foreground', label: 'Queued' },
  };
  const s = map[status] ?? map.queued;
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.class}`}>
      {s.label}
    </span>
  );
}
