'use client';

import { useEffect } from 'react';

// next
import { useRouter, usePathname } from 'next/navigation';

// material-ui
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';

// project-imports
import { handlerActiveItem, useGetMenuMaster } from 'api/menu';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';
import { APP_DEFAULT_PATH, GRID_COMMON_SPACING } from 'config';
import TabProfile from 'sections/apps/profiles/account/TabProfile';
import TabPersonal from 'sections/apps/profiles/account/TabPersonal';
import TabAccount from 'sections/apps/profiles/account/TabAccount';
import TabPassword from 'sections/apps/profiles/account/TabPassword';
import TabRole from 'sections/apps/profiles/account/TabRole';
import TabSettings from 'sections/apps/profiles/account/TabSettings';

// assets
import { DocumentText, Lock, Profile, Profile2User, Setting3, TableDocument } from '@wandersonalwes/iconsax-react';

type Props = {
  tab: string;
};

// ==============================|| PROFILE - ACCOUNT ||============================== //
export default function AccountProfile({ tab }: Props) {
  console.log('test4');
  const router = useRouter();
  const pathname = usePathname();
  console.log('test5');
  const { menuMaster } = useGetMenuMaster();
  console.log('test6');
  console.log(tab);

  // Validate tab to prevent invalid rendering
  const validTabs = ['basic', 'personal', 'my-account', 'password', 'role', 'settings'];
  const currentTab = validTabs.includes(tab) ? tab : 'basic'; // Fallback to 'basic' if tab is invalid
  console.log(currentTab);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log(`/apps/profiles/account/${newValue}/apps/profiles/account/${newValue}`);
    router.push(`/apps/profiles/account/${newValue}`);
  };
  console.log('test8');
  // Breadcrumb logic
  let breadcrumbTitle = '';
  let breadcrumbHeading = '';
  //  console.log("test4")
  switch (currentTab) {
    case 'personal':
      breadcrumbTitle = 'Agent';
      breadcrumbHeading = 'Agent Info';
      break;
    case 'my-account':
      breadcrumbTitle = 'Phone number';
      breadcrumbHeading = 'Phone Number';
      break;
    case 'password':
      breadcrumbTitle = 'Knowledge Base ';
      breadcrumbHeading = 'Knowledge base';
      break;
    case 'role':
      breadcrumbTitle = 'Language & Accent';
      breadcrumbHeading = 'Accountant';
      break;
    case 'settings':
      breadcrumbTitle = 'Settings';
      breadcrumbHeading = 'Account Settings';
      break;
    case 'basic':
    default:
      breadcrumbTitle = 'Agent';
      breadcrumbHeading = 'Agent Info';
  }
  console.log('test9');
  const breadcrumbLinks =
    currentTab === 'basic'
      ? [{ title: 'Agent', to: APP_DEFAULT_PATH }, { title: 'Agent Info' }]
      : [{ title: 'Agent', to: APP_DEFAULT_PATH }, { title: 'Agent info', to: '/apps/profiles/account/basic' }, { title: breadcrumbTitle }];

  useEffect(() => {
    if (menuMaster.openedItem !== 'account-profile') {
      handlerActiveItem('account-profile');
    }
  }, [pathname, menuMaster.openedItem]);
  console.log('test10');
  return (
    <>
      <Breadcrumbs custom heading={breadcrumbHeading} links={breadcrumbLinks} />
      <MainCard border={false}>
        <Stack sx={{ gap: GRID_COMMON_SPACING }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
            <Tabs value={currentTab} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
              <Tab label="Details" icon={<Profile />} value="basic" iconPosition="start" />
              <Tab label="Agent info" icon={<DocumentText />} value="personal" iconPosition="start" />
              <Tab label="Phone number" icon={<TableDocument />} value="my-account" iconPosition="start" />
              <Tab label="Language & Accent" icon={<Lock />} value="password" iconPosition="start" />
              <Tab label="Role" icon={<Profile2User />} value="role" iconPosition="start" />
              <Tab label="Settings" icon={<Setting3 />} value="settings" iconPosition="start" />
            </Tabs>
          </Box>
          <Box>
            {currentTab === 'basic' && <TabProfile />}
            {currentTab === 'personal' && <TabPersonal />}
            {currentTab === 'my-account' && <TabAccount />}
            {currentTab === 'password' && <TabPassword />}
            {currentTab === 'role' && <TabRole />}
            {currentTab === 'settings' && <TabSettings />}
          </Box>
        </Stack>
      </MainCard>
    </>
  );
}
