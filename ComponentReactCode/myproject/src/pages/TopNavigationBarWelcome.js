import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsIcon from "@mui/icons-material/Settings";

const TopNavigationBarWelcome = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#f8f5fa", // Light background color
        color: "#000", // Black text color
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ padding: "8px" }}>
        {/* Left Profile Icon */}
        <IconButton edge="start" color="inherit" sx={{ marginRight: 2 }}>
          <PersonIcon />
        </IconButton>

        {/* Center Title */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
          }}
        >
          Welcome Back, CaloriBlazer!
        </Typography>

        {/* Right Icons: Notifications and Settings */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" sx={{ marginRight: 1 }}>
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavigationBarWelcome;
