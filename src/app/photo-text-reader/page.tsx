'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function PhotoTextReaderPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/camera'); }, [router]);
  return null;
}
