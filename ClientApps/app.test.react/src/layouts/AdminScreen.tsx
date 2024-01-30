import { Box, Grid as MuiGrid } from "@mui/material";
import { ReactNode } from "react";
import Navigator from "./Navigator";

export default function AdminScreen({
  children,
  hideNavigator,
}: {
  children: ReactNode;
  hideNavigator?: boolean;
}) {
  return (
    <MuiGrid container spacing={2}>
      <MuiGrid item xs={12}>
        {!hideNavigator && (
          <Box sx={{ borderBottom: 0, borderColor: "divider" }}>
            <Navigator />
          </Box>
        )}
      </MuiGrid>
      <MuiGrid item xs={12}>
        {children}
      </MuiGrid>
    </MuiGrid>
  );
}
