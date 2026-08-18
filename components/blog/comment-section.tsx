'use client';
// FILE: components/blog/comment-section.tsx
// PURPOSE: Public comment list + submission form for a blog post. New
// comments are always PENDING server-side until a moderator approves them
// (see app/api/blog/[slug]/comments/route.ts) — this component never shows
// an optimistic "your comment is live" state, only "submitted for review."
import * as React from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Reveal } from '@/components/reveal';
import { toast } from 'sonner';

interface CommentRow {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days < 1) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString();
}

export function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = React.useState<CommentRow[] | null>(null);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [content, setContent] = React.useState('');
  const [website, setWebsite] = React.useState(''); // honeypot
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/blog/${slug}/comments`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setComments)
      .catch(() => setComments([]));
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || content.trim().length < 3) {
      toast.error('Please fill in your name, email, and a comment.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, content, website }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to submit comment');
      }
      setSubmitted(true);
      setName('');
      setEmail('');
      setContent('');
      toast.success('Comment submitted — it will appear once approved.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-border pt-10">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
        <MessageSquare className="h-5 w-5 text-primary" />
        Comments {comments && comments.length > 0 ? `(${comments.length})` : ''}
      </h2>

      {comments === null ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Be the first to comment.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {comments.map((c) => (
            <Reveal key={c.id}>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">{c.content}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-sm font-semibold">Leave a comment</h3>
        {submitted && (
          <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
            Thanks — your comment is awaiting moderation and will appear once approved.
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input type="email" placeholder="Your email (not published)" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {/* Honeypot — hidden from real visitors via CSS, not display:none
            (some bots skip display:none fields), off-screen instead. */}
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
          aria-hidden="true"
        />
        <Textarea placeholder="Write your comment…" rows={4} value={content} onChange={(e) => setContent(e.target.value)} required />
        <Button type="submit" disabled={submitting} className="gap-2">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? 'Submitting…' : 'Post Comment'}
        </Button>
      </form>
    </div>
  );
}
