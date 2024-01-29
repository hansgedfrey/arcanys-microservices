import { FC, MouseEvent, ReactNode } from "react";
import {
  Box,
  Dialog,
  DialogProps,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Button from "./Button";

export interface DialogBoxProps extends DialogProps {
  icon?: ReactNode;
  ok?: () => void;
  cancel?: () => void;
  okLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
}

export default function DialogBox({
  icon,
  cancel,
  children,
  disableBackdropClick,
  disableEscapeKeyDown,
  isSubmitting,
  ok,
  onClose,
  open,
  okLabel,
  cancelLabel,
  title,
}: DialogBoxProps) {
  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"));

  return (
    <Dialog
      transitionDuration={0}
      open={open}
      fullScreen={fullScreen}
      onClose={(event, reason) => {
        if (
          (disableBackdropClick && reason === "backdropClick") ||
          (disableEscapeKeyDown && reason === "escapeKeyDown")
        )
          return false;
        if (!!onClose) onClose(event, reason);
      }}
      onClick={(event: MouseEvent<HTMLSpanElement>) => event.stopPropagation()}
    >
      <Box textAlign="center" pt={2}>
        {icon && (
          <SvgIcon viewBox="0 0 600 476.6" style={{ width: 120, height: 120 }}>
            {icon}
          </SvgIcon>
        )}
      </Box>
      <Box p={2} textAlign="center">
        <Typography variant="h5">{title}</Typography>
      </Box>
      <Box p={3}>{children}</Box>
      {(!!cancel || !!ok) && (
        <Box p={3}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {cancel ? (
              <Button
                key="btnCancelConfirm"
                variant="contained"
                onClick={cancel}
                disabled={isSubmitting}
                color="secondary"
              >
                {cancelLabel ?? "Cancel"}
              </Button>
            ) : (
              <>&nbsp;</>
            )}
            {ok && (
              <Button
                key="btnConfirmConfirm"
                color="primary"
                variant="contained"
                type="submit"
                onClick={ok}
                disabled={isSubmitting}
              >
                {okLabel ?? "OK"}
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </Dialog>
  );
}
