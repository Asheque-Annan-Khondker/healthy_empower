import React from "react";
import { Button } from "@mui/material";

const StartButton = () => {
  return (
    <Button
      variant="contained"
      sx={{
        borderRadius: "20px",
        backgroundColor: "#5e35b1", // Purple color for button
        color: "#fff", // White color for text
        textTransform: "none",
        padding: "8px 16px",
        "&:hover": {
          backgroundColor: "#4527a0", // Slightly darker purple on hover
        },
      }}
    >
      Start
    </Button>
  );
};

export default StartButton;
