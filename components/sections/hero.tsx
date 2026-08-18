'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Figma,
  Timer,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

const features = [
  {
    icon: Figma,
    title: 'Modern Design',
    description: 'Clean, modern and user friendly designs.',
  },
  {
    icon: Timer,
    title: 'High Performance',
    description: 'Optimized for speed, SEO and performance.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive',
    description: 'Perfect experience on all devices.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Scalable',
    description: 'Built with best practices for security and scale.',
  },
];

export function Hero() {
  return (
    <section className="relative flex flex-col justify-between overflow-hidden bg-[#050914] font-sans selection:bg-purple-500/30">
      
      {/* Background Glows */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-[#3B82F6]/10 blur-[130px]" aria-hidden />
      <div className="pointer-events-none absolute right-[15%] top-1/3 h-[500px] w-[500px] rounded-full bg-[#7C3AED]/15 blur-[120px]" aria-hidden />

      {/* Main Hero Content */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1340px] grid-cols-1 items-center gap-12 px-6 pb-20 pt-28 lg:grid-cols-[1fr_1fr] lg:gap-8 lg:px-12 lg:pt-36">
        
        {/* Left Column (Text) */}
        <div className="flex flex-col items-start lg:pr-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-8 flex items-center gap-2.5 rounded-full border border-slate-700/50 bg-[#111826] px-4 py-1.5 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="text-sm font-medium text-slate-300">We Build Digital Success</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="mb-6 text-[2.75rem] font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4rem]"
          >
            We Build Modern <br />
            Websites That <br />
            <span className="bg-gradient-to-r from-[#9333EA] to-[#3B82F6] bg-clip-text text-transparent">
              Drive Results
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="mb-10 max-w-[28rem] text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            We design and develop fast, secure and user-friendly websites that help your business grow online.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/services"
              className="group flex items-center gap-2 rounded-md bg-gradient-to-r from-[#5a46ff] to-[#7c58ff] px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(90,70,255,0.4)]"
            >
              Explore Our Services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/portfolio"
              className="flex items-center justify-center rounded-md border border-slate-700/60 bg-[#0B1120]/50 px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-slate-800/60"
            >
              View Our Projects
            </Link>
          </motion.div>
        </div>

        {/* Right Column (Fixed 3D Devices) */}
        <div className="relative z-10 w-full pt-10 lg:pt-0">
          <HeroDevices />
        </div>
      </div>

      {/* Bottom Features Strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative z-20 w-full border-t border-slate-800/60 bg-[#080d1a] py-10"
      >
        <div className="mx-auto grid w-full max-w-[1340px] grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-700/60 text-[#9333EA]">
                <feature.icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-[15px] font-semibold tracking-wide text-white">
                  {feature.title}
                </h4>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────
   Fixed 3D Device Mockups (Correct Angles & Colors)
   ──────────────────────────────────────────────────────────────── */

function HeroDevices() {
  return (
    <div className="relative mx-auto w-full max-w-[650px] lg:max-w-none lg:scale-105 [perspective:2000px]">
      
      {/* 
        Corrected Rotation:
        rotateY(-20deg) = हल्का বামে ঘুরবে (আগের মত অতিরিক্ত না)
        rotateX(12deg) = উপর থেকে একটু নিচের দিকে দেখার ভিউ
      */}
      <motion.div
        initial={{ opacity: 0, rotateY: -5, rotateX: 5 }}
        animate={{ opacity: 1, rotateY: -20, rotateX: 12, rotateZ: -2 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative w-full [transform-style:preserve-3d]"
      >
        
        {/* 💻 Laptop Structure */}
        <div className="relative w-[88%] ml-auto [transform-style:preserve-3d]">
          
          {/* 1. Laptop Lid / Screen (Dark Metallic Gray Border) */}
          <div className="relative z-10 w-full rounded-t-[16px] bg-[#1a1c23] p-[1.5%] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] border-t border-x border-[#3b4054]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-[#050812]">
              <LaptopScreen />
            </div>
          </div>

          {/* 2. Laptop Base / Keyboard Deck (Laying Flat perfectly) */}
          <div
            className="absolute left-0 top-[99%] w-full origin-top rounded-b-[16px] bg-gradient-to-b from-[#252836] to-[#12141c] border-x border-b border-[#3b4054] shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            style={{
              height: '85%',
              transform: 'rotateX(-90deg)', // Lays the keyboard flat
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Keyboard Layout */}
            <div className="absolute left-[5%] top-[8%] flex h-[55%] w-[90%] flex-col gap-[3%] rounded-[6px] bg-[#0c0d12] p-[2%] shadow-[inset_0_2px_15px_rgba(0,0,0,0.9)] border border-[#1a1c23]">
              {/* Row 1: Function keys */}
              <div className="flex h-[12%] w-full gap-[1.5%]">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-[2px] bg-[#222634] shadow-[0_1px_0_rgba(0,0,0,1)]" />
                ))}
              </div>
              {/* Row 2: Numbers */}
              <div className="flex h-[16%] w-full gap-[1.5%]">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-[3px] bg-[#2a2f42] shadow-[0_2px_0_rgba(0,0,0,1)]" />
                ))}
              </div>
              {/* Row 3: Tab Row */}
              <div className="flex h-[16%] w-full gap-[1.5%]">
                <div className="w-[10%] rounded-[3px] bg-[#222634]" />
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-[3px] bg-[#2a2f42] shadow-[0_2px_0_rgba(0,0,0,1)]" />
                ))}
                <div className="w-[12%] rounded-[3px] bg-[#222634]" />
              </div>
              {/* Row 4: Caps Row */}
              <div className="flex h-[16%] w-full gap-[1.5%]">
                <div className="w-[12%] rounded-[3px] bg-[#222634]" />
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-[3px] bg-[#2a2f42] shadow-[0_2px_0_rgba(0,0,0,1)]" />
                ))}
                <div className="w-[15%] rounded-[3px] bg-[#222634]" />
              </div>
              {/* Row 5: Shift Row */}
              <div className="flex h-[16%] w-full gap-[1.5%]">
                <div className="w-[16%] rounded-[3px] bg-[#222634]" />
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-[3px] bg-[#2a2f42] shadow-[0_2px_0_rgba(0,0,0,1)]" />
                ))}
                <div className="w-[18%] rounded-[3px] bg-[#222634]" />
              </div>
              {/* Row 6: Spacebar */}
              <div className="flex h-[16%] w-full gap-[1.5%]">
                <div className="w-[6%] rounded-[3px] bg-[#222634]" />
                <div className="w-[6%] rounded-[3px] bg-[#222634]" />
                <div className="w-[6%] rounded-[3px] bg-[#222634]" />
                <div className="w-[36%] rounded-[3px] bg-[#2a2f42] shadow-[0_2px_0_rgba(0,0,0,1)]" />
                <div className="w-[6%] rounded-[3px] bg-[#222634]" />
                <div className="w-[6%] rounded-[3px] bg-[#222634]" />
                {/* Arrows */}
                <div className="flex flex-1 gap-[5%]">
                  <div className="mt-auto h-[45%] flex-1 rounded-[2px] bg-[#222634]" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="h-[45%] w-full rounded-[2px] bg-[#222634]" />
                    <div className="h-[45%] w-full rounded-[2px] bg-[#222634]" />
                  </div>
                  <div className="mt-auto h-[45%] flex-1 rounded-[2px] bg-[#222634]" />
                </div>
              </div>
            </div>

            {/* Trackpad */}
            <div className="absolute bottom-[8%] left-1/2 h-[22%] w-[28%] -translate-x-1/2 rounded-[6px] bg-[#1a1d26] shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] border border-[#2a2e3d]" />
            
            {/* Front Lip / Thickness of Base */}
            <div className="absolute top-full left-0 w-full h-[4%] bg-[#080a0f] rounded-b-[16px] origin-top [transform:rotateX(-90deg)]" />
          </div>
        </div>

        {/* 📱 Mobile Phone (Repositioned to fit the new angle naturally) */}
        <div
          className="absolute bottom-[-2%] left-[5%] w-[25%] [transform-style:preserve-3d]"
          style={{
            transform: 'translateZ(120px) rotateY(5deg)', // Adjusted to float nicely with the new laptop angle
          }}
        >
          <div className="rounded-[12%/5.5%] bg-gradient-to-tr from-[#252836] to-[#0f121a] p-[3.5%] shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-[#485270]/50">
            <div className="relative aspect-[9/19] overflow-hidden rounded-[10%/4.8%] bg-[#050812] shadow-inner">
              <PhoneScreen />
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

function LaptopScreen() {
  return (
    <div className="absolute inset-0 bg-[#050914]">
      <div className="pointer-events-none absolute -right-[10%] -top-[15%] h-[60%] w-[55%] rounded-full bg-[#6366f1] opacity-30 blur-3xl" aria-hidden />
      
      <div className="relative flex items-center justify-between border-b border-white/[0.05] px-[4%] py-[2.5%]">
        <span className="text-[0.45rem] font-bold tracking-[0.16em] text-white lg:text-[0.6rem]">HYASCKA</span>
        <div className="flex items-center gap-[5%] text-[0.35rem] text-white/50 lg:text-[0.45rem]">
          <span>Home</span><span>About</span><span>Services</span><span>Contact</span>
          <span className="rounded-full bg-[#4f46e5] px-[0.5rem] py-[0.18rem] text-white">Get Started</span>
        </div>
      </div>

      <div className="relative flex gap-[4%] px-[8%] pt-[6%]">
        <div className="w-[50%] pt-[2%]">
          <h3 className="text-[0.8rem] font-semibold italic leading-[1.2] text-white lg:text-[1.1rem]">
            Digital Solutions<br />That Drive Growth
          </h3>
          <div className="mt-[8%] flex flex-col gap-[4%]">
            <span className="h-[2px] w-full rounded-full bg-white/[0.1]" />
            <span className="h-[2px] w-[85%] rounded-full bg-white/[0.1]" />
            <span className="h-[2px] w-[60%] rounded-full bg-white/[0.1]" />
          </div>
        </div>

        <div className="flex w-[48%] flex-col gap-[5%]">
          <div className="flex gap-[5%]">
            <div className="w-[55%] rounded-md border border-white/[0.05] bg-white/[0.02] p-[6%]">
              <span className="block h-2 w-2 rounded-full bg-[#8b5cf6]" />
              <div className="mt-[15%] flex items-end gap-[6%]">
                {[40, 70, 50, 90].map((h, i) => (
                  <span key={i} className="flex-1 rounded-sm bg-[#4f46e5]" style={{ height: `${h * 0.2}px` }} />
                ))}
              </div>
            </div>
            <div className="flex w-[40%] flex-col gap-[8%]">
              {[0, 1].map((i) => (
                <div key={i} className="flex items-center gap-[8%] rounded border border-white/[0.05] bg-white/[0.02] p-[8%]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#818cf8]" />
                  <span className="h-[2px] flex-1 rounded-full bg-white/[0.1]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneScreen() {
  return (
    <div className="absolute inset-0 bg-[#050914]">
      <div className="pointer-events-none absolute -right-[20%] -top-[8%] h-[40%] w-[80%] rounded-full bg-[#6366f1] opacity-35 blur-2xl" aria-hidden />
      <span className="absolute left-1/2 top-[2%] h-[3px] w-[25%] -translate-x-1/2 rounded-full bg-white/20" />

      <div className="relative px-[10%] pt-[14%]">
        <h4 className="mt-[15%] text-[0.55rem] font-semibold italic leading-[1.3] text-white">
          Digital Solutions That Drive Growth
        </h4>
        <div className="mt-[10%] flex flex-col gap-[4px]">
          <span className="h-[2px] w-full rounded-full bg-white/[0.1]" />
          <span className="h-[2px] w-[75%] rounded-full bg-white/[0.1]" />
        </div>
        <div className="mt-[12%] rounded bg-[#4f46e5] py-[5%] text-center text-[0.4rem] font-medium text-white">
          Get Started
        </div>
      </div>
    </div>
  );
}