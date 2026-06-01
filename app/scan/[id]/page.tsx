import type { Metadata } from 'next';
import { ScanView } from '@/components/scan-view';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // Scans are persisted client-side (sessionStorage), so the server cannot
  // read the title here. Use a stable, id-based title instead.
  return {
    title: `scan ${id.slice(0, 8)}`,
    description: 'View your X-ray scan results.',
  };
}

export default async function ScanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ScanView id={id} />;
}
