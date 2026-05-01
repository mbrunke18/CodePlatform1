import IDEALayout from '@/components/layout/IDEALayout';
import ProtocolCustomization from '@/pages/ProtocolCustomization';

export default function WizardPage() {
  return (
    <IDEALayout>
      <ProtocolCustomization embedded={true} />
    </IDEALayout>
  );
}
