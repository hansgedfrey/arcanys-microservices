import { useCallback, useContext } from "react";
import { Divider, Grid as MuiGrid, Stack } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Button,
  DialogBox,
  Form,
  LabelValue,
  NumberTextInput,
  Select,
  TextAreaInput,
  TextField,
} from "../../../components";
import { number, object, string } from "yup";
import { useAppDispatch, useAppSelector } from "../../../store";
import { DialogBoxProps } from "../../../components/DialogBox";
import { getProductsAsync, upsertProductAsync } from "../../../store/products";
import {
  ProductSortOptions,
  SearchCategoriesResponse,
  UpsertInventoryItemCommand,
  UpsertProductCommand,
} from "../../../api/products-api";
import { SnackbarContext } from "../../../App";
import {
  SnackbarErrorTop,
  SnackbarSuccessTop,
} from "../../../components/SnackBar";
import { MoneyFormat } from "../../../utils";
import { upsertInventoryItemAsync } from "../../../store/inventoryItems";

const validationSchema = object({
  productName: string().required("Name is required"),
  description: string().required("Description is required"),
  price: string().required("Price is required"),
  categoryId: string().required("Category is required"),
  sku: string().required("SKU is required"),
  quantity: number().required("Please specify quantity").min(1),
});

export default function EditProduct({ open, ok, cancel }: DialogBoxProps) {
  const dispatch = useAppDispatch();
  const setSnackbar = useContext(SnackbarContext);
  const { categories } = useAppSelector((state) => state.categories);
  const { selectedProduct, isSubmitting } = useAppSelector(
    (state) => state.products
  );
  return (
    <DialogBox
      open={open}
      icon={<EditNoteIcon color="primary" />}
      title="Edit Product"
    >
      <Form
        initialValues={{
          categoryId: selectedProduct?.category?.categoryId,
          productId: selectedProduct?.productId,
          productName: selectedProduct?.productName,
          description: selectedProduct?.description,
          sku: selectedProduct?.sku,
          price: selectedProduct?.price,
          categoryName: selectedProduct?.category?.name,
          quantity: undefined,
        }}
        onSubmit={(data: UpsertInventoryItemCommand) => {
          dispatch(upsertInventoryItemAsync(data)).then((result: any) => {
            if (!result.error) {
              ok && ok();
              dispatch(
                getProductsAsync({
                  page: 1,
                  sortOption: ProductSortOptions.Created,
                })
              );
              setSnackbar(
                SnackbarSuccessTop("Inventory item added successfully!")
              );
              return;
            }

            setSnackbar(SnackbarErrorTop(result.payload.detail));
          });
        }}
        validationSchema={validationSchema}
      >
        {({ formState, getValues }) => {
          return (
            <MuiGrid container spacing={2}>
              <MuiGrid item xs={12}>
                <LabelValue label="Product Name">
                  {formState.defaultValues?.productName}
                </LabelValue>
              </MuiGrid>
              <MuiGrid item xs={12}>
                <LabelValue label="Product Description">
                  {formState.defaultValues?.description}
                </LabelValue>
              </MuiGrid>
              <MuiGrid item xs={6}>
                <LabelValue label="SKU">
                  {formState.defaultValues?.sku}
                </LabelValue>
              </MuiGrid>
              <MuiGrid item xs={6}>
                <LabelValue label="Unit price">
                  {MoneyFormat(formState.defaultValues?.price)}
                </LabelValue>
              </MuiGrid>
              <MuiGrid item xs={12}>
                <LabelValue label="Category">
                  {formState.defaultValues?.categoryName}
                </LabelValue>
              </MuiGrid>
              <MuiGrid item xs={12}>
                <Divider orientation="horizontal" />
              </MuiGrid>
              <MuiGrid item xs={12}>
                <NumberTextInput
                  name="quantity"
                  label="Quantity"
                  isLoading={isSubmitting}
                  valueType="numericString"
                  thousandsSeparator={true}
                />
              </MuiGrid>
              <MuiGrid item xs={12}>
                <TextAreaInput name="details" label="Details" />
              </MuiGrid>
              <MuiGrid item xs={12}>
                <Stack
                  direction="row"
                  spacing={2}
                  pt={2}
                  justifyContent="flex-end"
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={cancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Add to inventory
                  </Button>
                </Stack>
              </MuiGrid>
            </MuiGrid>
          );
        }}
      </Form>
    </DialogBox>
  );
}
