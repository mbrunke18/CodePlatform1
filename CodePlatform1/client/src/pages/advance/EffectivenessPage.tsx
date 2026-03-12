import IDEALayout from '@/components/layout/IDEALayout';
import PreparednessReport from '@/pages/PreparednessReport';

export default function EffectivenessPage() {
  return (
    <IDEALayout>
      <PreparednessReport embedded={true} />
    </IDEALayout>
  );
}
