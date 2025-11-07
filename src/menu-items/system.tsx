// assets
import { Book1, Security, MessageProgramming, DollarSquare, UserSquare, Airplane } from '@wandersonalwes/iconsax-react';
import { SupportAgent } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
// types
import { NavItemType } from 'types/menu';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
// icons
const icons = {
  page: DashboardIcon,
  authentication: Security,
  maintenance: MessageProgramming,
  pricing: DollarSquare,
  // contactus: I24Support,
  profile: UserSquare,
  landing: Airplane,
  agent: SmartToyIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const system: NavItemType = {
  id: 'group-pages',
  title: 'system',
  type: 'group',
  icon: icons.page,
  children: [
    {
      id: 'billingHistory',
      title: 'Billing',
      type: 'item',
      url: '/system/billingHistory',
      icon: AccountBalanceIcon
    },
    {
      id: 'profile',
      title: 'profile',
      type: 'collapse',
      icon: icons.profile,
      children: [
        {
          id: 'userprofile',
          title: 'user-profile',
          type: 'item',
          url: '/system/userprofile',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default system;
