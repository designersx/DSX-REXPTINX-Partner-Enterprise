// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import { Card, Edit2, Logout, Profile, Profile2User } from '@wandersonalwes/iconsax-react';

interface Props {
  handleLogout: () => void;
  handleChangePassword: () => void;
  onProfileClick: () => void; // new prop for profile redirect
}

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab({ handleLogout, handleChangePassword, onProfileClick }: Props) {
  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      {/* Profile button */}
      <ListItemButton onClick={onProfileClick}>
        <ListItemIcon>
          <Profile variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>

      {/* Change Password */}
      {/* <ListItemButton onClick={handleChangePassword}>
        <ListItemIcon>
          <Edit2 variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Change Password" />
      </ListItemButton> */}

      {/* Logout */}
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <Logout variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
}
