import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";

const TopNavigationBar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#f8f5fa", color: "#000", boxShadow: "none" }}>
      <Toolbar sx={{ padding: "8px" }}>
        <IconButton edge="start" color="inherit" sx={{ marginRight: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Hi, Syed
        </Typography>
        <IconButton color="inherit">
          <PersonIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavigationBar;
