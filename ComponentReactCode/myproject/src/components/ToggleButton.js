import React from "react";
import { Switch } from "@mui/material";
import { styled } from "@mui/system";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 20,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(14px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#5e35b1', // Purple color when active
        opacity: 1,
        border: 'none',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },
  '& .MuiSwitch-track': {
    borderRadius: 13,
    backgroundColor: '#e0e0e0', // Grey color when inactive
    opacity: 1,
  },
}));

const ToggleButton = () => {
  return (
    <CustomSwitch />
  );
};

export default ToggleButton;
