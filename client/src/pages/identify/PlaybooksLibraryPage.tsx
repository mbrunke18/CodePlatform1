import IDEALayout from '@/components/layout/IDEALayout';
import PlaybookLibraryV2 from '@/pages/PlaybookLibraryV2';

export default function PlaybooksLibraryPage() {
  return (
    <IDEALayout>
      <PlaybookLibraryV2 embedded={true} />
    </IDEALayout>
  );
}
