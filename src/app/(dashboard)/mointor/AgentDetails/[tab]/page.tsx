// ==============================|| PROFILE - ACCOUNT ||============================== //

import AccountProfile from 'views/mointor/AgentDetail/AgentDetail';
import { notFound } from 'next/navigation';
type Props = {
  params: Promise<{ tab: string }>;
};

// Define valid tabs for validation
const validTabs = ['basic', 'personal', 'my-account', 'password', 'role', 'settings'];

// Server component for the dynamic route
export default async function Page({ params }: Props) {
  console.log('test3');
  console.log(params);

  const { tab } = await params;
  console.log(tab);
  console.log('test2');
  // Validate the tab parameter
  if (!validTabs.includes(tab)) {
    console.log('jai baba ki');
    notFound(); // Redirect to 404 page if tab is invalid
  }

  return <AccountProfile tab={tab} />;
}

// Generate static parameters for pre-rendering
export async function generateStaticParams() {
  console.log('test1');

  return validTabs.map((tab) => ({
    tab
  }));
}
