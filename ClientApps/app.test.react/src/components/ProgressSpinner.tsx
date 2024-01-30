import { Box, CircularProgress, circularProgressClasses } from "@mui/material";

export interface ProgressSpinnerProps {
  padding?: number;
  small?: boolean;
  useCurrentColor?: boolean;
}

export default function ProgressSpinner({
  padding,
  small,
  useCurrentColor,
}: ProgressSpinnerProps) {
  return (
    <Box
      sx={({ typography }) => ({
        position: "relative",
        display: "flex",
        justifyContent: "center",
        ...(padding && {
          padding: typography.pxToRem(padding),
        }),
      })}
      className="spinner"
    >
      <Box
        width={small ? 24 : 40}
        height={small ? 24 : 40}
        sx={{ position: "relative" }}
        className="spinner-indicator"
      >
        <CircularProgress
          variant="determinate"
          sx={{
            color: "transparent",
            position: "absolute",
            left: 0,
            top: 0,
          }}
          size={small ? 24 : 40}
          thickness={3}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: useCurrentColor ? "currentColor" : "primary.main",
            animationDuration: "550ms",
            position: "absolute",
            left: 0,
            top: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: "round",
            },
          }}
          size={small ? 24 : 40}
          thickness={3}
        />
      </Box>
    </Box>
  );
}
