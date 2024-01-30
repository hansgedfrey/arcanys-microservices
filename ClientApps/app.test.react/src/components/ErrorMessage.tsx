import { FormHelperText, SxProps, Theme } from "@mui/material";

export interface ErrorMessageProps {
  message?: string;
  sx?: SxProps<Theme>;
  textAlign?: "center" | "left" | "right";
}

export default function FormErrorMessage({ message, sx = [], textAlign = "left" }: ErrorMessageProps) {
  return message ? (
    <FormHelperText error sx={[{ textAlign }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {message}
    </FormHelperText>
  ) : null;
}
