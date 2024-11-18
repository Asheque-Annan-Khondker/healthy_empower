import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TopNavigationBarPractice from "./pages/TopNavigationBarPractice"; // Import the new Top Navigation Bar

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        {/* Use the new TopNavigationBarPractice for testing */}
        <TopNavigationBarPractice />
      </div>
    </ThemeProvider>
  );
}

export default App;
