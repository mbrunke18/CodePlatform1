import IDEALayout from '@/components/layout/IDEALayout';
import ProtocolLibrary from '@/pages/ProtocolLibrary';

export default function ProtocolsLibraryPage() {
  return (
    <IDEALayout>
      <ProtocolLibrary embedded={true} />
    </IDEALayout>
  );
}
