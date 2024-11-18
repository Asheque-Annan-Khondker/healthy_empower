import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
      }}
    >
      <IconButton color="inherit" sx={{ marginRight: 1 }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        Back
      </Typography>
    </Box>
  );
};

export default BackButton;
