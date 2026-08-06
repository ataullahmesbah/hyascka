'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Mail, MapPin, Clock, Phone, Sparkles, Globe, Linkedin, Facebook, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Reveal } from '@/components/reveal';
import { cn } from '@/lib/utils';

const budgetOptions = ['< $10k', '$10k – $50k', '$50k – $150k', '$150k+'];
const interestOptions = [
  'AI Agents',
  'AI Automation',
  'Enterprise Software',
  'Web Application',
  'Ecommerce',
  'Digital Transformation',
  'SEO',
  'Branding',
  'Digital Marketing',
  'API Integration',
];

export function Contact() {
  const [submitted, setSubmitted] = React.useState(false);
  const [interest, setInterest] = React.useState('AI Agents');
  const [budget, setBudget] = React.useState('$10k – $50k');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="relative scroll-mt-20 py-24 sm:py-28 lg:py-32">
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-[1280px] px-5 tab:px-8 lg:px-12">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft-lg">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Left: pitch */}
            <div className="relative flex flex-col justify-between gap-10 border-b border-border bg-gradient-to-br from-primary/8 via-card to-accent/8 p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-10 h-52 w-52 rounded-full bg-accent/15 blur-3xl" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Start the conversation
                </span>
                <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
                  Let's build something{' '}
                  <span className="text-gradient-primary">intelligent</span> together.
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
                  Tell us about your business and the problem you want to solve. We'll get
                  back within one business day with a clear path forward.
                </p>
              </div>

              <div className="relative flex flex-col gap-4">
                <ContactRow icon={Mail} label="Email" value="hello@hyaska.com" />
                <ContactRow icon={Phone} label="Phone" value="+1 (555) 010-2026" />
                <ContactRow icon={MapPin} label="Location" value="Remote-first · Global delivery" />
                <ContactRow icon={Clock} label="Response time" value="Within 1 business day" />
              </div>

              <div className="relative mt-2">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Follow us</div>
                <div className="mt-3 flex items-center gap-3">
                  {[
                    { icon: Linkedin, label: 'LinkedIn' },
                    { icon: Facebook, label: 'Facebook' },
                    { icon: Github, label: 'GitHub' },
                    { icon: Globe, label: 'Website' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href="#"
                      aria-label={s.label}
                      className="flex h-9 w-9 items-center justify-center rounded-btn border border-border bg-background/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      <s.icon className="h-4.5 w-4.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="p-8 sm:p-10">
              {submitted ? (
                <SuccessState onReset={() => setSubmitted(false)} />
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Full name" htmlFor="name">
                      <Input id="name" name="name" placeholder="Jane Doe" required />
                    </Field>
                    <Field label="Work email" htmlFor="email">
                      <Input id="email" name="email" type="email" placeholder="jane@company.com" required />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Company" htmlFor="company">
                      <Input id="company" name="company" placeholder="Acme Inc." />
                    </Field>
                    <Field label="Phone" htmlFor="phone">
                      <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </Field>
                  </div>

                  <Field label="What are you interested in?" htmlFor="interest">
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map((opt) => (
                        <Chip
                          key={opt}
                          active={interest === opt}
                          onClick={() => setInterest(opt)}
                        >
                          {opt}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <Field label="Estimated budget" htmlFor="budget">
                    <div className="flex flex-wrap gap-2">
                      {budgetOptions.map((opt) => (
                        <Chip key={opt} active={budget === opt} onClick={() => setBudget(opt)}>
                          {opt}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <Field label="Tell us about your project" htmlFor="message">
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="What are you trying to build, and what outcome matters most?"
                      required
                      className="resize-none"
                    />
                  </Field>

                  <Button
                    type="submit"
                    size="lg"
                    className="group mt-1 h-12 gap-2 self-start rounded-btn px-6 text-base"
                  >
                    Send project brief
                    <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    By submitting, you agree to be contacted about your inquiry. We never share your information.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
        active
          ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20'
          : 'border-border bg-muted/40 text-muted-foreground hover:border-primary/40 hover:text-foreground'
      )}
    >
      {children}
    </button>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn border border-border bg-background/60 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-full min-h-[24rem] flex-col items-center justify-center gap-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-success to-accent text-white shadow-glow-accent"
      >
        <Check className="h-8 w-8" />
      </motion.div>
      <h3 className="font-display text-2xl font-semibold tracking-tight">Brief received</h3>
      <p className="max-w-sm text-muted-foreground text-pretty">
        Thank you. Our team will review your project and reach out within one business day
        with next steps.
      </p>
      <Button variant="outline" onClick={onReset} className="mt-2 rounded-btn">
        Send another brief
      </Button>
    </motion.div>
  );
}
