import { useCallback, useContext } from "react";
import { Grid as MuiGrid, Stack } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Button,
  DialogBox,
  Form,
  NumberTextInput,
  Select,
  TextAreaInput,
  TextField,
} from "../../../components";
import { object, string } from "yup";
import { useAppDispatch, useAppSelector } from "../../../store";
import { DialogBoxProps } from "../../../components/DialogBox";
import { getProductsAsync, upsertProductAsync } from "../../../store/products";
import {
  ProductSortOptions,
  SearchCategoriesResponse,
  UpsertProductCommand,
} from "../../../api/products-api";
import { SnackbarContext } from "../../../App";
import {
  SnackbarErrorTop,
  SnackbarSuccessTop,
} from "../../../components/SnackBar";

const validationSchema = object({
  productName: string().required("Name is required"),
  description: string().required("Description is required"),
  price: string().required("Price is required"),
  categoryId: string().required("Category is required"),
  sku: string().required("SKU is required"),
});

export default function EditProduct({ open, ok, cancel }: DialogBoxProps) {
  const dispatch = useAppDispatch();
  const setSnackbar = useContext(SnackbarContext);
  const { categories } = useAppSelector((state) => state.categories);
  const { selectedProduct, isSubmitting } = useAppSelector(
    (state) => state.products
  );
  const getCategories = useCallback((categories: SearchCategoriesResponse) => {
    const options: Array<{ label: string; value: string }> = [];

    categories.results?.map((item) =>
      options.push({
        label: item.name!,
        value: item.categoryId!,
      })
    );

    return options;
  }, []);

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
        }}
        onSubmit={(data: UpsertProductCommand) => {
          dispatch(upsertProductAsync(data)).then((result: any) => {
            if (!result.error) {
              ok && ok();
              dispatch(
                getProductsAsync({
                  page: 1,
                  sortOption: ProductSortOptions.Created,
                })
              );
              setSnackbar(SnackbarSuccessTop("Category saved successfully"));
              return;
            }

            setSnackbar(SnackbarErrorTop(result.payload.detail));
          });
        }}
        validationSchema={validationSchema}
      >
        {({ formState }) => {
          return (
            <MuiGrid container spacing={2}>
              <MuiGrid item xs={12}>
                <TextField name="productName" label="Name" fullWidth />
              </MuiGrid>
              <MuiGrid item xs={12}>
                <TextField name="sku" label="SKU" fullWidth />
              </MuiGrid>
              <MuiGrid item xs={12}>
                <TextAreaInput name="description" label="Description" />
              </MuiGrid>
              <MuiGrid item xs={12}>
                <NumberTextInput
                  name="price"
                  label="Unit Price"
                  isLoading={isSubmitting}
                  valueType="numericString"
                  thousandsSeparator={true}
                />
              </MuiGrid>
              <MuiGrid item xs={12}>
                <Select
                  name="categoryId"
                  label="Category"
                  options={getCategories(categories!)}
                />
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
                    Save
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
