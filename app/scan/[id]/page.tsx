import { ScanView } from '@/components/scan/scan-view';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `scan ${id.slice(0, 8)}`,
    description: 'View your X-ray scan results.',
  };
}

export default async function ScanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ScanView id={id} />;
}
