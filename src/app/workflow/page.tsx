import WorkflowPage from '@/app/[locale]/workflow/page';
import { RootWrapper } from '@/components/layout';

export default async function RootWorkflowPage() {
  return (
    <RootWrapper>
      <WorkflowPage params={Promise.resolve({ locale: 'en' })} />
    </RootWrapper>
  );
}
