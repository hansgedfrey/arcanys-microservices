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
import { InventoryItemSortOptions } from "../../../api/products-api";
import {
  getInventoryItemsAsync,
  removeInventoryItemAsync,
} from "../../../store/inventoryItems";

export default function DeleteProduct({ open, ok, cancel }: DialogBoxProps) {
  const dispatch = useAppDispatch();
  const setSnackbar = useContext(SnackbarContext);
  const { selectedInventoryItem, isSubmitting } = useAppSelector(
    (state) => state.inventoryItems
  );

  return (
    <DialogBox
      open={open}
      icon={<HighlightOffIcon color="error" />}
      okLabel="Delete"
      ok={async () =>
        dispatch(
          await removeInventoryItemAsync({
            inventoryItemId: selectedInventoryItem?.inventoryItemId,
          })
        ).then((result: any) => {
          if (result.error) {
            setSnackbar(SnackbarErrorTop(result.payload.detail));
          } else {
            setSnackbar(
              SnackbarSuccessTop("Inventory item deleted successfully")
            );
            dispatch(
              getInventoryItemsAsync({
                page: 1,
                sortOption: InventoryItemSortOptions.Created,
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
        Do you want to delete {selectedInventoryItem?.product?.productName}{" "}
        inventory item?
      </Typography>
    </DialogBox>
  );
}
