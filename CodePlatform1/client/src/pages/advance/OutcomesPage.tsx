import IDEALayout from '@/components/layout/IDEALayout';
import ComprehensiveROIBreakdown from '@/pages/ComprehensiveROIBreakdown';

export default function OutcomesPage() {
  return (
    <IDEALayout>
      <ComprehensiveROIBreakdown embedded={true} />
    </IDEALayout>
  );
}
