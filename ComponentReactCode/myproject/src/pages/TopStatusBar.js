import React from "react";
import { Box, Typography } from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import SignalCellular4BarIcon from "@mui/icons-material/SignalCellular4Bar";

const TopStatusBar = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
        backgroundColor: "#f8f5fa",
        position: "relative",
      }}
    >
      {/* Time */}
      <Typography variant="body2" sx={{ fontSize: 14, fontWeight: "bold" }}>
        9:30
      </Typography>

      {/* Camera dot */}
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#222", // Black dot
        }}
      />

      {/* Status Icons (WiFi and Signal) */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <WifiIcon sx={{ fontSize: 18, color: "#757575", marginRight: 1 }} />
        <SignalCellular4BarIcon sx={{ fontSize: 18, color: "#757575" }} />
      </Box>
    </Box>
  );
};

export default TopStatusBar;
