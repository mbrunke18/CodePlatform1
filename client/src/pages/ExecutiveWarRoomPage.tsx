import { ExecutiveWarRoom } from '@/components/ExecutiveWarRoom';
import PageLayout from '@/components/layout/PageLayout';

export default function ExecutiveWarRoomPage({ embedded }: { embedded?: boolean }) {
  return (
    <PageLayout embedded={embedded}>
      <h1 className="sr-only">Executive War Room — Readiness OS</h1>
      <ExecutiveWarRoom />
    </PageLayout>
  );
}