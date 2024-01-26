import {
  Box,
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import ProgressSpinner from "./ProgressSpinner";

export interface ButtonProps extends Omit<MuiButtonProps, "disableElevation"> {
  processing?: boolean;
}

export default function Button({
  processing,
  children,
  ...props
}: ButtonProps) {
  return (
    <MuiButton {...props}>
      <Box component="span" sx={{ ...(processing && { opacity: 0 }) }}>
        {children}
      </Box>
      {processing && <ProgressSpinner />}
    </MuiButton>
  );
}
