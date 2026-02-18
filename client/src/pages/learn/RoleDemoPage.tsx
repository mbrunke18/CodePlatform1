import IDEALayout from '@/components/layout/IDEALayout';
import RoleSelector from '@/pages/RoleSelector';

export default function RoleDemoPage() {
  return (
    <IDEALayout>
      <RoleSelector embedded={true} />
    </IDEALayout>
  );
}
