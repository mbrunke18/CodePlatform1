import IDEALayout from '@/components/layout/IDEALayout';
import StakeholderManagement from '@/pages/StakeholderManagement';

export default function UpdatesPage() {
  return (
    <IDEALayout>
      <StakeholderManagement embedded={true} />
    </IDEALayout>
  );
}
