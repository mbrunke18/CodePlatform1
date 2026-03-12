import IDEALayout from '@/components/layout/IDEALayout';
import SuccessMetricsConfiguration from '@/pages/SuccessMetricsConfiguration';

export default function MetricsPage() {
  return (
    <IDEALayout>
      <SuccessMetricsConfiguration embedded={true} />
    </IDEALayout>
  );
}
