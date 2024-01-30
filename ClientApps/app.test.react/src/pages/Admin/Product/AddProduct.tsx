import { useCallback, useContext, useEffect } from "react";
import { Grid as MuiGrid, Stack } from "@mui/material";
import AddNoteIcon from "@mui/icons-material/NoteAdd";
import {
  Button,
  DialogBox,
  Form,
  NumberTextInput,
  TextAreaInput,
  TextField,
} from "../../../components";
import { number, object, string } from "yup";
import { useAppDispatch, useAppSelector } from "../../../store";
import { DialogBoxProps } from "../../../components/DialogBox";
import { getProductsAsync, upsertProductAsync } from "../../../store/products";
import { UpsertProductCommand } from "../../../api/products-api";
import { SnackbarContext } from "../../../App";
import {
  SnackbarErrorTop,
  SnackbarSuccessTop,
} from "../../../components/SnackBar";
import Select from "../../../components/Select";
import { getCategoriesAsync } from "../../../store/categories";

const validationSchema = object({
  productName: string().required("Name is required"),
  description: string().required("Description is required"),
  price: string().required("Price is required"),
});
export const VALUE_LABEL_OPTIONS = [
  {
    value: "1",
    label: "Label 1",
  },
  {
    value: "2",
    label: "Label 2",
  },
  {
    value: "3",
    label: "Label 3",
  },
  {
    value: "4",
    label: "Label 4",
  },
];
export default function AddProduct({ open, ok, cancel }: DialogBoxProps) {
  const dispatch = useAppDispatch();
  const setSnackbar = useContext(SnackbarContext);
  const { isSubmitting } = useAppSelector((state) => state.products);
  const { categories, isLoadingCategories } = useAppSelector(
    (state) => state.categories
  );
  const test = useCallback(() => {
    return [{ value: 1, label: "test" }];
    console.log(categories);
  }, [categories]);

  return (
    <DialogBox
      open={open}
      icon={<AddNoteIcon color="primary" />}
      title="Add Product"
    >
      <Form
        initialValues={{
          productId: null,
          productName: "",
          description: "",
          price: "",
          sku: "54321",
          categoryId: "",
        }}
        onSubmit={(data: UpsertProductCommand) =>
          dispatch(upsertProductAsync(data)).then((result: any) => {
            if (!result.error) {
              ok && ok();
              dispatch(getProductsAsync({ page: 1 }));
              setSnackbar(SnackbarSuccessTop("Product saved successfully"));
              return;
            }

            setSnackbar(SnackbarErrorTop(result.payload.detail));
          })
        }
        validationSchema={validationSchema}
      >
        {({ formState }) => {
          return (
            <MuiGrid container spacing={2}>
              <MuiGrid item xs={12}>
                <TextField name="productName" label="Name" fullWidth />
              </MuiGrid>
              <MuiGrid item xs={12}>
                <TextAreaInput name="description" label="Description" />
              </MuiGrid>
              <MuiGrid item xs={12}>
                <NumberTextInput
                  name="price"
                  label="Price"
                  isLoading={isSubmitting}
                  valueType="numericString"
                  thousandsSeparator={true}
                />
              </MuiGrid>
              <MuiGrid item xs={12}>
                <Select name="select" label="Select" options={test()} />
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
