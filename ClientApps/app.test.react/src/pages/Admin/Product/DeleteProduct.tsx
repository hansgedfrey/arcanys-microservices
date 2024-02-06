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
import { getProductsAsync, removeProductAsync } from "../../../store/products";
import { ProductSortOptions } from "../../../api/products-api";

export default function DeleteProduct({ open, ok, cancel }: DialogBoxProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const setSnackbar = useContext(SnackbarContext);
  const { selectedProduct, isSubmitting } = useAppSelector(
    (state) => state.products
  );

  return (
    <DialogBox
      open={open}
      icon={<HighlightOffIcon color="error" />}
      okLabel="Delete"
      ok={async () =>
        dispatch(
          await removeProductAsync({
            productId: selectedProduct?.productId,
          })
        ).then((result: any) => {
          if (result.error) {
            setSnackbar(SnackbarErrorTop(result.payload.detail));
          } else {
            setSnackbar(SnackbarSuccessTop("Category deleted successfully"));
            dispatch(
              getProductsAsync({
                page: 1,
                sortOption: ProductSortOptions.Created,
              })
            );
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
        Do you want to delete {selectedProduct?.productName} category?
      </Typography>
    </DialogBox>
  );
}
