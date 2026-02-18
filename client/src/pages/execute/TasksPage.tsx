import IDEALayout from '@/components/layout/IDEALayout';
import TaskManagement from '@/pages/TaskManagement';

export default function TasksPage() {
  return (
    <IDEALayout>
      <TaskManagement embedded={true} />
    </IDEALayout>
  );
}
