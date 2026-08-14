// FILE: app/dashboard/messages/page.tsx
'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, Send, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useDashboardData } from '@/hooks/use-dashboard-data';

interface Participant {
  user: { id: string; name: string | null; email: string; image: string | null };
}

interface ConversationRow {
  id: string;
  subject: string | null;
  contact: { id: string; name: string; email: string } | null;
  participants: Participant[];
  messages: Array<{ id: string; content: string; createdAt: string }>;
  unreadCount: number;
  updatedAt: string;
}

interface MessageRow {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string | null; image: string | null };
}

interface ConversationDetail {
  id: string;
  contact: { name: string; email: string } | null;
  participants: Participant[];
  messages: MessageRow[];
}

function initials(name: string | null | undefined, fallback: string) {
  return name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : fallback[0]?.toUpperCase() ?? 'U';
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = searchParams.get('c');

  const { data, loading, error, refetch } = useDashboardData<{ conversations: ConversationRow[] }>('/api/conversations');
  const { data: detail, loading: detailLoading, refetch: refetchDetail } = useDashboardData<ConversationDetail>(
    activeId ? `/api/conversations/${activeId}` : null
  );

  const [draft, setDraft] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (activeId) {
      fetch(`/api/conversations/${activeId}/read`, { method: 'POST' }).then(() => refetch());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [detail?.messages.length]);

  const handleSend = async () => {
    if (!activeId || !draft.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${activeId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Unable to send message');
      }
      setDraft('');
      refetchDetail();
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <DashboardSkeleton />;
  if (error || !data) return <ErrorState message="Failed to load conversations" onRetry={refetch} />;

  const { conversations } = data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Messages" description={`${conversations.length} conversation${conversations.length === 1 ? '' : 's'}`} />

      {conversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Start one from a lead's detail page with &quot;Message Customer&quot;."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
          <Card className="flex max-h-[600px] flex-col overflow-hidden p-0">
            <ScrollArea className="flex-1">
              {conversations.map((c) => {
                const other = c.participants.find((p) => p.user.id !== session?.user?.id)?.user;
                const last = c.messages[0];
                return (
                  <button
                    key={c.id}
                    onClick={() => router.push(`/dashboard/messages?c=${c.id}`)}
                    className={cn(
                      'flex w-full items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-secondary/60',
                      activeId === c.id && 'bg-secondary'
                    )}
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback>{initials(other?.name, other?.email ?? c.contact?.name ?? 'U')}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">
                          {other?.name ?? c.contact?.name ?? 'Unknown'}
                        </span>
                        {c.unreadCount > 0 && (
                          <Badge className="h-5 shrink-0 px-1.5 text-[10px]">{c.unreadCount}</Badge>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {last ? last.content : 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </ScrollArea>
          </Card>

          <Card className="flex max-h-[600px] flex-col overflow-hidden p-0">
            {!activeId ? (
              <EmptyState icon={MessageSquare} title="Select a conversation" description="Pick one from the list to view messages." className="border-0" />
            ) : detailLoading || !detail ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="border-b border-border p-4">
                  <p className="font-medium">{detail.contact?.name ?? 'Conversation'}</p>
                  <p className="text-xs text-muted-foreground">{detail.contact?.email}</p>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col gap-3">
                    {detail.messages.map((m) => {
                      const isMine = m.sender.id === session?.user?.id;
                      return (
                        <div key={m.id} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
                          <div
                            className={cn(
                              'max-w-[75%] rounded-2xl px-3.5 py-2 text-sm',
                              isMine ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                            )}
                          >
                            <p>{m.content}</p>
                            <p className={cn('mt-1 text-[10px]', isMine ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                              {new Date(m.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-end gap-2 border-t border-border p-3">
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className="min-h-9 flex-1 resize-none"
                    disabled={sending}
                  />
                  <Button size="icon" onClick={handleSend} disabled={sending || !draft.trim()} className="h-9 w-9 shrink-0">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}