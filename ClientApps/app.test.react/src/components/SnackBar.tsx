import { Alert, AlertColor } from "@mui/material";
import MuiSnackbar, {
  SnackbarCloseReason,
  SnackbarOrigin,
} from "@mui/material/Snackbar";
import { ReactNode, SyntheticEvent } from "react";
import ErrorIcon from "@mui/icons-material/HighlightOff";
import SuccessIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export interface SnackBarProps {
  anchorOrigin?: SnackbarOrigin | undefined;
  onClose?: () => void;
  message?: ReactNode;
  autoHideDuration?: number | null;
  open?: boolean;
  severity?: AlertColor;
  icon?: React.ReactNode;
}

const errorMessage = "Error";
const successMessage = "Success";
const warningMessage = "Warning";

export default function SnackBar({
  anchorOrigin = { horizontal: "center", vertical: "top" },
  autoHideDuration = 4000,
  message,
  onClose,
  open,
  severity = "error",
  icon,
}: SnackBarProps) {
  function handleOnClose(
    _: SyntheticEvent<any> | Event,
    reason: SnackbarCloseReason
  ) {
    if (reason === "clickaway" || reason === "escapeKeyDown") {
      return;
    }

    onClose && onClose();
  }
  return (
    <MuiSnackbar
      anchorOrigin={anchorOrigin}
      autoHideDuration={autoHideDuration}
      onClose={handleOnClose}
      open={open}
    >
      <Alert severity={severity} icon={icon}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
}

export function SnackbarSuccessTop(message?: ReactNode): SnackBarProps {
  return {
    message: message || successMessage,
    severity: "success",
    anchorOrigin: { horizontal: "center", vertical: "top" },
    icon: <SuccessIcon />,
  };
}

export function SnackbarErrorTop(message?: ReactNode): SnackBarProps {
  return {
    message: message || errorMessage,
    severity: "error",
    anchorOrigin: { horizontal: "center", vertical: "top" },
    icon: <ErrorIcon />,
  };
}

export function SnackbarWarningTop(message?: ReactNode): SnackBarProps {
  return {
    message: message || warningMessage,
    severity: "warning",
    anchorOrigin: { horizontal: "center", vertical: "top" },
    icon: <WarningAmberIcon />,
  };
}
