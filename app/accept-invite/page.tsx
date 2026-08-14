'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { acceptInvitationSchema, type AcceptInvitationInput } from '@/lib/validation';
import { User, Lock, ArrowRight, Loader2, CheckCircle2, MailWarning } from 'lucide-react';

type TokenState =
    | { status: 'checking' }
    | { status: 'valid'; email: string }
    | { status: 'invalid'; reason: string };

const REASON_MESSAGES: Record<string, string> = {
    not_found: 'This invitation link is invalid.',
    used: 'This invitation has already been used. If you already set up your account, please log in instead.',
    expired: 'This invitation link has expired. Ask your HYASCKA contact to send a new one.',
    error: 'Something went wrong while checking your invitation. Please try again shortly.',
};

export default function AcceptInvitePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token') ?? '';

    const [tokenState, setTokenState] = React.useState<TokenState>({ status: 'checking' });
    const [success, setSuccess] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (!token) {
            setTokenState({ status: 'invalid', reason: 'not_found' });
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/invitations/${token}`);
                const data = await res.json();
                if (cancelled) return;
                if (data.valid) {
                    setTokenState({ status: 'valid', email: data.email });
                } else {
                    setTokenState({ status: 'invalid', reason: data.reason ?? 'not_found' });
                }
            } catch {
                if (!cancelled) setTokenState({ status: 'invalid', reason: 'error' });
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [token]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AcceptInvitationInput>({
        resolver: zodResolver(acceptInvitationSchema),
        defaultValues: { token, name: '', password: '', confirmPassword: '' },
    });

    const onSubmit = async (data: AcceptInvitationInput) => {
        setSubmitting(true);
        try {
            const res = await fetch('/api/invitations/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, token }),
            });
            const result = await res.json().catch(() => null);

            if (!res.ok) {
                toast.error(result?.error ?? 'Unable to set up your account.');
                return;
            }

            toast.success('Account created — you can now sign in.');
            setSuccess(true);
            setTimeout(() => router.push('/login'), 2500);
        } catch {
            toast.error('Network error — please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (tokenState.status === 'checking') {
        return (
            <div className="flex min-h-screen items-center justify-center px-5 pt-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (tokenState.status === 'invalid') {
        return (
            <div className="flex min-h-screen items-center justify-center px-5 pt-20">
                <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-soft-lg">
                    <MailWarning className="mx-auto h-12 w-12 text-destructive" />
                    <h1 className="mt-4 font-display text-xl font-semibold">Invitation not valid</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {REASON_MESSAGES[tokenState.reason] ?? REASON_MESSAGES.not_found}
                    </p>
                    <Link href="/login" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
                        Go to login
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center px-5 pt-20">
                <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-soft-lg">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
                    <h1 className="mt-4 font-display text-xl font-semibold">Account created!</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Redirecting you to login...</p>
                    <Link href="/login" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
                        Sign in now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-5 pt-20">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-border bg-card p-8 shadow-soft-lg">
                    <div className="mb-6 text-center">
                        <h1 className="font-display text-2xl font-semibold tracking-tight">Set up your account</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Activating access for <span className="font-medium text-foreground">{tokenState.email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <input type="hidden" {...register('token')} />

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input id="name" placeholder="Jane Doe" className="pl-10" {...register('name')} />
                            </div>
                            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input id="password" type="password" placeholder="••••••••" className="pl-10" {...register('password')} />
                            </div>
                            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                            <p className="text-xs text-muted-foreground">
                                Min 8 chars with uppercase, lowercase, number, and special character.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-10" {...register('confirmPassword')} />
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                        </div>

                        <Button type="submit" disabled={submitting} className="group gap-2">
                            {submitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}