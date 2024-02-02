import { MouseEvent, ReactNode, useState } from "react";
import { Popover, Typography } from "@mui/material";
import { Colors } from "../layouts";
import { makeStyles } from "@mui/styles";

function IconPopover({
  icon,
  message,
}: {
  icon: ReactNode;
  message: string | ReactNode;
}) {
  const classes = useStyles();
  const [anchorElement, setAnchorElement] = useState<HTMLSpanElement | null>(
    null
  );
  const openPopup = Boolean(anchorElement);

  const onClick = (event: MouseEvent<HTMLSpanElement>) => {
    setAnchorElement(event.currentTarget);
    event.preventDefault();
  };

  return (
    <>
      <span className={classes.icon} onClick={onClick}>
        {icon}
      </span>
      <Popover
        elevation={4}
        open={openPopup}
        anchorEl={anchorElement}
        onClose={() => setAnchorElement(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Typography className={classes.message}>{message}</Typography>
      </Popover>
    </>
  );
}

const useStyles = makeStyles({
  message: {
    padding: 9,
    maxWidth: 300,
    fontSize: "0.81em",
    lineHeight: 1.2,
    backgroundColor: Colors.White,
    color: Colors.DarkGrey,
  },
  icon: {
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    "& > svg": {
      color: Colors.DarkGrey,
      fontSize: "21px",
      margin: "0 0 0 6px",
    },
  },
});

export default IconPopover;
