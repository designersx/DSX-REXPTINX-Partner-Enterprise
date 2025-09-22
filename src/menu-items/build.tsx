// assets
import { Book1,  Security, MessageProgramming, DollarSquare, Airplane } from '@wandersonalwes/iconsax-react';
import { SupportAgent } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
// types
import { NavItemType } from 'types/menu';
import SmartToyIcon from '@mui/icons-material/SmartToy';
// icons
const icons = {
  page: DashboardIcon,
  authentication: Security,
  maintenance: MessageProgramming,
  pricing: DollarSquare,
  // contactus: I24Support,
  landing: Airplane,
  agent:SmartToyIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const build: NavItemType = {
  id: 'group-pages',
  title: 'build',
  type: 'group',
  icon: icons.page,
  children: [
    {
      id: 'agents',
      title: 'Agents',
      type: 'item',
      url: '/build/agents',
      icon: SmartToyIcon,
     
    },
    {
      id: 'knowledgeBase',
      title: 'knowledge Base',
      type: 'item',
      url: '/build/knowledgeBase',
      icon: icons.landing,
    
    },
    // {
    //   id: 'Integrations',
    //   title: 'Integrations',
    //   type: 'item',
    //   url: '/build/Integrations',
    //   icon: icons.contactus,
    
    // },
  {
      id: 'DemoAgents',
      title: 'Demo Agents',
      type: 'item',
      url: '/build/Demoview',
      icon: icons.landing,
    
    },
  ]
};

export default build;
