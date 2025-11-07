// assets
import { Book1, Security, MessageProgramming, DollarSquare, Airplane } from '@wandersonalwes/iconsax-react';
import { SupportAgent } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
// types
import { NavItemType } from 'types/menu';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import LiveTvIcon from '@mui/icons-material/LiveTv';
// icons
const icons = {
  page: DashboardIcon,
  authentication: Security,
  maintenance: MessageProgramming,
  pricing: DollarSquare,
  // contactus: I24Support,
  landing: Airplane,
  agent: SmartToyIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const deploy: NavItemType = {
  id: 'group-pages',
  title: 'deploy',
  type: 'group',
  icon: icons.page,
  children: [
    {
      id: 'phoneNumbers',
      title: 'Phone Numbers',
      type: 'item',
      url: '/deploy/phoneNumbers',
      icon: ContactPhoneIcon
    },
    ...(localStorage.getItem('roleId') !== '4'
      ? [
          {
            id: 'phoneNumbers',
            title: 'Phone Numbers',
            type: 'item',
            url: '/deploy/phoneNumbers',
            icon: ContactPhoneIcon
          }
        ]
      : []),
    {
      id: 'DemoApp',
      title: 'Demo',
      type: 'item',
      url: '/deploy/Demo',
      icon: LiveTvIcon
    }
  ]
};

export default deploy;
