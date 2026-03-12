import IDEALayout from '@/components/layout/IDEALayout';
import PlaybookCustomization from '@/pages/PlaybookCustomization';

export default function WizardPage() {
  return (
    <IDEALayout>
      <PlaybookCustomization embedded={true} />
    </IDEALayout>
  );
}
