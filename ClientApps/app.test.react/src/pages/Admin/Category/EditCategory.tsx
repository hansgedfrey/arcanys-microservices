import { Grid as MuiGrid } from "@mui/material";
import { Form, TextAreaInput, TextField } from "../../../components";
import { object, string } from "yup";
import { useAppDispatch, useAppSelector } from "../../../store";

const validationSchema = object({
  name: string().required("Name is required"),
  description: string().required("Description is required"),
});

export default function EditCategory() {
  const dispatch = useAppDispatch();
  const { selectedCategory } = useAppSelector((state) => state.categories);

  return (
    <Form
      initialValues={{
        categoryId: selectedCategory?.categoryId,
        name: selectedCategory?.name,
        description: selectedCategory?.description,
      }}
      onSubmit={(data: any) => console.log(data)}
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
          </MuiGrid>
        );
      }}
    </Form>
  );
}
