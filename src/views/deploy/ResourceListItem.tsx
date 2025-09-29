import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Stack,
  Chip,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import SipIcon from "@mui/icons-material/Router"; // example SIP icon, replace if you have a custom one

const ResourceListItem = ({ resource, selected, onSelect, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeIcon = (type) => {
    return type === "sip" ? <SipIcon fontSize="small" /> : <PhoneIcon fontSize="small" />;
  };

  const getTypeColor = (type) => {
    return type === "sip" ? "info.main" : "primary.main";
  };

  return (
    <ListItem
      button
      onClick={() => onSelect(resource)}
      selected={selected}
      sx={{
        borderRadius: 1,
        mb: 0.5,
        mx: 1,
        "&:hover": { bgcolor: "action.hover" },
        bgcolor: selected ? "action.selected" : "inherit",
        border: selected ? "2px solid" : "none",
        borderColor: selected ? "primary.main" : "transparent",
      }}
    >
      <ListItemIcon>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            background: `linear-gradient(135deg, ${getTypeColor(
              resource.import_type
            )} 0%, ${getTypeColor(resource.import_type)}80 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {getTypeIcon(resource.import_type)}
        </Box>
      </ListItemIcon>

      <ListItemText
        primary={
          <Box>
            <Typography
              variant="body2"
              fontWeight="medium"
              noWrap
              sx={{ maxWidth: 200 }}
            >
              {resource.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: 200 }}
            >
              {resource.import_type === "phone"
                ? resource.phoneNumber
                : resource.terminationUri || "SIP Config"}
            </Typography>
          </Box>
        }
        secondary={
          <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
            <Chip
              label={resource.import_type === "sip" ? "SIP" : "Phone"}
              size="small"
              color={resource.import_type === "sip" ? "info" : "primary"}
              variant="outlined"
            />
            {resource.isActive && (
              <CheckCircleIcon sx={{ fontSize: "12px", color: "success.main" }} />
            )}
            <Typography variant="caption" color="text.secondary">
              {formatDate(resource.createdAt)}
            </Typography>
          </Stack>
        }
        secondaryTypographyProps={{ component: "div", sx: { mt: 0.25 } }}
      />

      {/* <Stack direction="row" spacing={0.5}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(resource);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(resource);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack> */}
    </ListItem>
  );
};

export default ResourceListItem;
