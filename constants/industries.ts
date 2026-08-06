import {
  HeartPulse, GraduationCap, ShoppingBag, UtensilsCrossed, Hotel, Wallet,
  Plane, Home, Building2,
} from 'lucide-react';
import type { Industry } from '@/types';

export const industries: Industry[] = [
  { icon: HeartPulse, name: 'Healthcare', desc: 'Compliant AI systems for patient and clinical data' },
  { icon: GraduationCap, name: 'Education', desc: 'Adaptive learning and intelligent tutoring' },
  { icon: ShoppingBag, name: 'Retail', desc: 'AI search, merchandising, and personalization' },
  { icon: UtensilsCrossed, name: 'Restaurants', desc: 'AI ordering, inventory, and demand forecasting' },
  { icon: Hotel, name: 'Hotels', desc: 'Personalized guest experiences at scale' },
  { icon: Wallet, name: 'Finance', desc: 'Risk scoring, fraud detection, and automated reporting' },
  { icon: Plane, name: 'Travel', desc: 'AI itinerary planning and booking automation' },
  { icon: Home, name: 'Real Estate', desc: 'Property matching and intelligent lead routing' },
  { icon: Building2, name: 'Corporate', desc: 'Enterprise systems for thousands of users' },
];
