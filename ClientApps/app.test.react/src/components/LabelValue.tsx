import { Typography, TypographyProps } from "@mui/material";
import { Colors } from "../layouts";
import { ReactNode } from "react";

export default ({
  label,
  children,
}: {
  label?: string;
  children?: ReactNode;
}) => (
  <>
    <Typography variant="subtitle2" style={{ color: Colors.Grey }}>
      {label}
    </Typography>
    <Typography
      variant="h6"
      style={{ color: Colors.DarkGrey, fontSize: "1.2rem" }}
    >
      {children}
    </Typography>
  </>
);
