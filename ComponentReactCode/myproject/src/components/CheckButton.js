import React from "react";
import { Checkbox } from "@mui/material";
import { styled } from "@mui/system";
import CheckIcon from '@mui/icons-material/Check';

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  color: "#5e35b1", // Purple outline when not checked
  '&.Mui-checked': {
    color: "#5e35b1", // Purple color when checked
  },
  '& .MuiSvgIcon-root': {
    borderRadius: '4px', // Rounded corners
  },
}));

const CheckButton = () => {
  return (
    <CustomCheckbox
      icon={<CheckIcon style={{ visibility: 'hidden' }} />} // Empty box
      checkedIcon={<CheckIcon />} // Show check icon when checked
    />
  );
};

export default CheckButton;
