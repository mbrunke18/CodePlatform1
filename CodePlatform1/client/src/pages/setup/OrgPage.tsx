import IDEALayout from '@/components/layout/IDEALayout';
import OrganizationSetup from '@/pages/OrganizationSetup';

export default function OrgPage() {
  return (
    <IDEALayout>
      <OrganizationSetup embedded={true} />
    </IDEALayout>
  );
}
