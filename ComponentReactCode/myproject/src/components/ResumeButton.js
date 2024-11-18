import React from "react";
import { Button } from "@mui/material";
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';

const ResumeButton = () => {
  return (
    <Button
      variant="outlined"
      sx={{
        borderRadius: "20px",
        backgroundColor: "#e0e0e0", // Light grey color for the button background
        color: "#5e35b1", // Purple color for text and icon
        textTransform: "none",
        padding: "8px 16px",
        border: "2px solid #5e35b1", // Purple outline
        "&:hover": {
          backgroundColor: "#d5d5d5", // Slightly darker grey on hover
        },
      }}
      startIcon={<PlayArrowOutlinedIcon sx={{ color: "#5e35b1" }} />}
    >
      Resume
    </Button>
  );
};

export default ResumeButton;
