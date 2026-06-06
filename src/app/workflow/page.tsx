import WorkflowPage from '@/app/[localeOrTool]/workflow/page';
import { RootWrapper } from '@/components/layout';

export default async function RootWorkflowPage() {
  return (
    <RootWrapper>
      <WorkflowPage params={Promise.resolve({ localeOrTool: 'en' })} />
    </RootWrapper>
  );
}


