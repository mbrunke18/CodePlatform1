import IDEALayout from '@/components/layout/IDEALayout';
import TriggersManagement from '@/pages/TriggersManagement';

export default function AlertsPage() {
  return (
    <IDEALayout>
      <TriggersManagement embedded={true} />
    </IDEALayout>
  );
}
