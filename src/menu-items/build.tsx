// assets
import { Book1, Security, MessageProgramming, DollarSquare, Airplane } from '@wandersonalwes/iconsax-react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DashboardIcon from '@mui/icons-material/Dashboard';
// types
import { NavItemType } from 'types/menu';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useGetMenuMaster } from 'api/menu';
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
      // open: true,
      children: [
         {
          id: 'allAgents',
          title: 'All',
          type: 'item',
          url: '/build/agents/all',
          breadcrumbs: false
        }
        ,
        {
          id: 'myAgents',
          title: 'My Agents',
          type: 'item',
          url: '/build/agents/my',
          breadcrumbs: false
        },
        {
          id: 'regionalAgents',
          title: 'Regional',
          type: 'item',
          url: '/build/agents/regional',
          breadcrumbs: false
        },
        {
          id: 'enterpriseAgents',
          title: 'Enterprise',
          type: 'item',
          url: '/build/agents/enterprise',
          breadcrumbs: false
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


export function MenuFromAPI() {
  const { menu, menuLoading } = useGetMenuMaster();

  if (menuLoading) return build;

  const subChildrenList = (children: NavItemType[]) => {
    return children?.map((subList: NavItemType) => {
      return fillItem(subList);
    });
  };

  const itemList = (subList: NavItemType) => {
    const list = fillItem(subList);

    // if collapsible item, we need to feel its children as well
    if (subList.type === 'collapse') {
      list.children = subChildrenList(subList.children!);
    }
    return list;
  };

  const childrenList: NavItemType[] | undefined = menu?.children?.map((subList: NavItemType) => {
    return itemList(subList);
  });

  const menuList = fillItem(menu, childrenList);
  return menuList;
}

function fillItem(item: NavItemType, children?: NavItemType[] | undefined) {
  return {
    ...item,
    title: item?.title,
    icon: item?.icon ? icons[item.icon as keyof typeof icons] : undefined,
    ...(children && { children })
  };
}
