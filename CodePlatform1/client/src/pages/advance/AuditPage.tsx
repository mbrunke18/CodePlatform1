import IDEALayout from '@/components/layout/IDEALayout';
import AuditLoggingCenter from '@/pages/AuditLoggingCenter';

export default function AuditPage() {
  return (
    <IDEALayout>
      <AuditLoggingCenter embedded={true} />
    </IDEALayout>
  );
}
