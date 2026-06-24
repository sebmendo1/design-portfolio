import type { Metadata } from 'next';
import { adminRobots } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Admin',
  robots: adminRobots,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
