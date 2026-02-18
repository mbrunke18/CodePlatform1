import IDEALayout from '@/components/layout/IDEALayout';
import IntegrationHub from '@/pages/IntegrationHub';

export default function IntegrationsPage() {
  return (
    <IDEALayout>
      <IntegrationHub embedded={true} />
    </IDEALayout>
  );
}
