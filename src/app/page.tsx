import HomePage from './[localeOrTool]/page';
import LanguageRedirect from './LanguageRedirect';
import { RootWrapper } from '@/components/layout';

// Root page renders the English homepage directly (for SEO and non-prefixed English URL support)
// and loads LanguageRedirect for client-side routing of non-English users.
export default async function RootPage() {
  return (
    <RootWrapper>
      <LanguageRedirect />
      <HomePage params={Promise.resolve({ localeOrTool: 'en' })} />
    </RootWrapper>
  );
}


