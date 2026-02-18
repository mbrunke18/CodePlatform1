import { ExecutiveWarRoom } from '@/components/ExecutiveWarRoom';
import PageLayout from '@/components/layout/PageLayout';

export default function ExecutiveWarRoomPage({ embedded }: { embedded?: boolean }) {
  return (
    <PageLayout embedded={embedded}>
      <ExecutiveWarRoom />
    </PageLayout>
  );
}