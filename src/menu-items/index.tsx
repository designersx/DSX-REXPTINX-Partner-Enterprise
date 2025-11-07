// project-imports
import samplePage from './sample-page';
import support from './support';
import pages from './pages';
import build from './build';
// types
import { NavItemType } from 'types/menu';
import dashboard from './dashboard';
import deploy from './deploy';
import mointor from './mointor';
import system from './system';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  // items: [samplePage, pages, support,build]
  items: [dashboard, build, deploy, mointor, system]
};

export default menuItems;
