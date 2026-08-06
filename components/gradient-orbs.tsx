import { cn } from '@/lib/utils';

export function GradientOrbs({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div className="absolute -left-[10%] top-[5%] h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-[120px] animate-float-slow" />
      <div className="absolute right-[2%] top-[18%] h-[26rem] w-[26rem] rounded-full bg-accent/20 blur-[110px] animate-float-slow [animation-delay:1.6s]" />
      <div className="absolute bottom-[8%] left-[38%] h-[24rem] w-[24rem] rounded-full bg-chart-3/15 blur-[120px] animate-float-slow [animation-delay:2.4s]" />
    </div>
  );
}
