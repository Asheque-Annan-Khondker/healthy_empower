import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import HomeIcon from "@mui/icons-material/Home";
import EqualizerIcon from "@mui/icons-material/Equalizer";

const BottomNavigationBar = ({ navValue, setNavValue }) => {
  return (
    <BottomNavigation
      value={navValue}
      onChange={(event, newValue) => setNavValue(newValue)}
      sx={{ borderTop: "1px solid #ddd", backgroundColor: "#f8f5fa" }}
    >
      <BottomNavigationAction
        label="Guides"
        icon={<StarIcon />}
        sx={{
          color: navValue === 0 ? "#5e35b1" : "inherit",
        }}
      />
      <BottomNavigationAction
        label="Home"
        icon={<HomeIcon />}
        sx={{
          color: navValue === 1 ? "#5e35b1" : "inherit",
        }}
      />
      <BottomNavigationAction
        label="Stats"
        icon={<EqualizerIcon />}
        sx={{
          color: navValue === 2 ? "#5e35b1" : "inherit",
        }}
      />
    </BottomNavigation>
  );
};

export default BottomNavigationBar;
