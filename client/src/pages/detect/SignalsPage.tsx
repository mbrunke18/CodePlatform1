import IDEALayout from '@/components/layout/IDEALayout';
import AIRadarDashboard from '@/pages/AIRadarDashboard';

export default function SignalsPage() {
  return (
    <IDEALayout>
      <AIRadarDashboard embedded={true} />
    </IDEALayout>
  );
}
