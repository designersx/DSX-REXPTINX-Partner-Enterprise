'use client';

import { useEffect, useRef } from 'react';

// next
import { usePathname } from 'next/navigation';

// material-ui
import Grid from '@mui/material/Grid';

// project-imports
import GRID_COMMON_SPACING  from 'config';

// import ProfileCard from 'sections/apps/profiles/user/ProfileCard';
import ProfileTabs from './KnowledgeBasePage';
// import TabPersonal from 'sections/apps/profiles/user/TabPersonal';
// import TabPayment from 'sections/apps/profiles/user/TabPayment';
// import TabPassword from 'sections/apps/profiles/user/TabPassword';
// import TabSettings from 'sections/apps/profiles/user/TabSettings';

import { handlerActiveItem, useGetMenuMaster } from 'api/menu';
import Typography from 'themes/typography';

type Props = {
  tab: string;
};

// ==============================|| PROFILE - USER ||============================== //

export default function UserProfile() {
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { menuMaster } = useGetMenuMaster();

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (menuMaster.openedItem !== 'user-profile') handlerActiveItem('user-profile');
    // eslint-disable-next-line
  }, [pathname]);

  return (
    // <Grid container  >
      
      <Grid size={{ xs: 12 }}>
        <ProfileTabs focusInput={focusInput} />
      </Grid>
     
    // </Grid>
  );
}
