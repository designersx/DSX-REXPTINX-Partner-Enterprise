// assets
import { Book1, Security, MessageProgramming, DollarSquare, Airplane } from '@wandersonalwes/iconsax-react';
import { SupportAgent } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
// types
import { NavItemType } from 'types/menu';
import CallIcon from '@mui/icons-material/Call';
import SmartToyIcon from '@mui/icons-material/SmartToy';
// import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
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

const mointor: NavItemType = {
  id: 'group-pages',
  title: 'mointor',
  type: 'group',
  icon: icons.page,
  children: [
    {
      id: 'callHistory',
      title: 'Call History',
      type: 'item',
      url: '/mointor/callHistory',
      icon: CallIcon
    }
  ]
};

export default mointor;
