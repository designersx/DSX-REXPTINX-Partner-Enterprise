// assets
import { Book1, Security, MessageProgramming, DollarSquare, Airplane } from '@wandersonalwes/iconsax-react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
  landing: MenuBookIcon,
  agent: SmartToyIcon
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
      type: 'collapse',
      url: '/build/agents/all',
      icon: SmartToyIcon,
       open: true,
      children: [
         {
          id: 'allAgents',
          title: 'All',
          type: 'item',
          url: '/build/agents/all'
        }
        ,
        {
          id: 'myAgents',
          title: 'My Agents',
          type: 'item',
          url: '/build/agents/my'
        },
        {
          id: 'regionalAgents',
          title: 'Regional',
          type: 'item',
          url: '/build/agents/regional'
        },
        {
          id: 'enterpriseAgents',
          title: 'Enterprise',
          type: 'item',
          url: '/build/agents/enterprise'
        }
      ]
    },
    {
      id: 'knowledgeBase',
      title: 'knowledge Base',
      type: 'item',
      url: '/build/knowledgeBase',
      icon: icons.landing
    }
  ]
};

export default build;
