import React, { useState } from "react";
import { Box } from "@mui/material";
import TopStatusBar from "./TopStatusBar"; // Import TopStatusBar
import TopNavigationBar from "./TopNavigationBar"; // Import TopNavigationBar
import BottomNavigationBar from "./BottomNavigationBar"; // Import BottomNavigationBar
import BackButton from "./BackButton"; // Import BackButton

const GeneralLayout = ({ children }) => {
  const [navValue, setNavValue] = useState(0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "375px", margin: "0 auto", borderRadius: "30px", boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)" }}>
      {/* Top Status Bar */}
      <TopStatusBar />

      {/* Top Navigation Bar */}
      <TopNavigationBar />

      {/* Blue Underline */}
      <Box
        sx={{
          height: "2px",
          backgroundColor: "#3f51b5", // Blue color
          width: "50%",
          margin: "0 auto",
        }}
      />

      {/* Back Button Section */}
      <BackButton />

      {/* Content Area */}
      <Box sx={{ flexGrow: 1, padding: 2, backgroundColor: "#f8f5fa" }}>
        {children}
      </Box>

      {/* Bottom Navigation Bar */}
      <BottomNavigationBar navValue={navValue} setNavValue={setNavValue} />
    </Box>
  );
};

export default GeneralLayout;
