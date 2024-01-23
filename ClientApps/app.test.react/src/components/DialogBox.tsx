import { FC, MouseEvent, ReactNode } from "react";
import {
  Box,
  Dialog,
  DialogProps,
  Grid,
  SvgIcon,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Button from "./Button";

const DialogBox: FC<
  DialogProps & {
    icon?: ReactNode;
    ok?: () => void;
    cancel?: () => void;
    okLabel?: string;
    cancelLabel?: string;
    isSubmitting?: boolean;
    disableBackdropClick?: boolean;
    disableEscapeKeyDown?: boolean;
  }
> = ({
  cancel,
  children,
  disableBackdropClick,
  disableEscapeKeyDown,
  icon,
  isSubmitting,
  ok,
  onClose,
  open,
  okLabel,
  cancelLabel,
}) => {
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
      <Box p={3}>{children}</Box>
      {(!!cancel || !!ok) && (
        <Box pb={3} pl={3} pr={3}>
          <Grid container justifyContent="space-between">
            {cancel ? (
              <Button
                key="btnCancelConfirm"
                variant="contained"
                onClick={cancel}
                disabled={isSubmitting}
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
          </Grid>
        </Box>
      )}
    </Dialog>
  );
};

export default DialogBox;
