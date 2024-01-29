import { useContext } from "react";
import { Grid as MuiGrid, Stack } from "@mui/material";
import AddNoteIcon from "@mui/icons-material/NoteAdd";
import {
  Button,
  DialogBox,
  Form,
  TextAreaInput,
  TextField,
} from "../../../components";
import { object, string } from "yup";
import { useAppDispatch, useAppSelector } from "../../../store";
import { DialogBoxProps } from "../../../components/DialogBox";
import {
  getCategoriesAsync,
  upsertCategoryAsync,
} from "../../../store/categories";
import { UpsertCategoryCommand } from "../../../api/products-api";
import { SnackbarContext } from "../../../App";
import {
  SnackbarErrorTop,
  SnackbarSuccessTop,
} from "../../../components/SnackBar";

const validationSchema = object({
  name: string().required("Name is required"),
  description: string().required("Description is required"),
});

export default function AddCategory({ open, ok, cancel }: DialogBoxProps) {
  const dispatch = useAppDispatch();
  const setSnackbar = useContext(SnackbarContext);
  const { isSubmitting } = useAppSelector((state) => state.categories);

  return (
    <DialogBox
      open={open}
      icon={<AddNoteIcon color="primary" />}
      title="Add Category"
    >
      <Form
        initialValues={{
          categoryId: null,
          name: "",
          description: "",
        }}
        onSubmit={(data: UpsertCategoryCommand) =>
          dispatch(upsertCategoryAsync(data)).then((result: any) => {
            if (!result.error) {
              ok && ok();
              dispatch(getCategoriesAsync({ page: 1 }));
              setSnackbar(SnackbarSuccessTop("Category saved successfully"));
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
                <TextField name="name" label="Name" fullWidth />
              </MuiGrid>
              <MuiGrid item xs={12}>
                <TextAreaInput name="description" label="Description" />
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
