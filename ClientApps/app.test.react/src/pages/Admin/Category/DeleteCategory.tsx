import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { DialogBox } from "../../../components";
import { DialogBoxProps } from "../../../components/DialogBox";
import {
  SnackbarErrorTop,
  SnackbarSuccessTop,
} from "../../../components/SnackBar";
import { SnackbarContext } from "../../../App";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getCategoriesAsync,
  removeCategoryAsync,
} from "../../../store/categories";

export default function DeleteCategory({ open, ok, cancel }: DialogBoxProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const setSnackbar = useContext(SnackbarContext);
  const { selectedCategory, isSubmitting } = useAppSelector(
    (state) => state.categories
  );

  return (
    <DialogBox
      open={open}
      icon={<HighlightOffIcon color="error" />}
      okLabel="Delete"
      ok={async () =>
        dispatch(
          await removeCategoryAsync({
            categoryId: selectedCategory?.categoryId,
          })
        ).then((result: any) => {
          if (result.error) {
            setSnackbar(SnackbarErrorTop(result.payload.detail));
          } else {
            setSnackbar(SnackbarSuccessTop("Category deleted successfully"));
            dispatch(getCategoriesAsync({ page: 1 }));
            ok && ok();
          }
        })
      }
      cancelLabel="Cancel"
      cancel={() => {
        cancel && cancel();
      }}
      isSubmitting={isSubmitting}
      title="Confirm Delete"
    >
      <Typography variant="subtitle1">
        Do you want to delete {selectedCategory?.name} category?
      </Typography>
    </DialogBox>
  );
}
