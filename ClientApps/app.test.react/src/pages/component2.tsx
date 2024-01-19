import {
  Box,
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";

function Component2() {
  return (
    <>
      <Box>
        <MuiButton onClick={() => console.log("component 2")}>
          Component2
        </MuiButton>
      </Box>
    </>
  );
}

export default Component2;
