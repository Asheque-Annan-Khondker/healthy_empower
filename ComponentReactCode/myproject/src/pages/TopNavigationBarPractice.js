import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const TopNavigationBarPractice = () => {
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
        {/* Back Arrow Icon (Left) */}
        <IconButton edge="start" color="inherit" sx={{ marginRight: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        {/* Title (Center) */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
          }}
        >
          Practice Figma
        </Typography>

        {/* Right Icons: Bookmark and Menu */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" sx={{ marginRight: 1 }}>
            <BookmarkBorderIcon />
          </IconButton>
          <IconButton color="inherit">
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavigationBarPractice;
