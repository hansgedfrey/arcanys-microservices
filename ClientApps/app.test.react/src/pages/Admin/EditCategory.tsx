import { Box, Typography, Grid as MuiGrid, Button } from "@mui/material";
import { Form, TextField } from "../../components";
import { object, string } from "yup";
import { useAppDispatch, useAppSelector } from "../../store";
import { useEffect, useMemo, useState } from "react";
import { getCategoryInfoAsync } from "../../store/categories";
import { useLocation, useSearchParams } from "react-router-dom";

const validationSchema = object({
  name: string().required("Name is required"),
  description: string().required("Description is required"),
});

const lastPathSegment = (path: string) => {
  const segments = path.split("/");
  return segments[segments.length - 1];
};

export default function EditCategory() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { selectedCategory } = useAppSelector((state) => state.categories);
  const categoryId = lastPathSegment(location.pathname);
  console.log(selectedCategory);
  return (
    <MuiGrid container spacing={2} pb={4} pt={2}>
      <MuiGrid item xs={12}>
        <Typography variant="h6">Edit category</Typography>
      </MuiGrid>
      <MuiGrid item xs={12}>
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
              <>
                <MuiGrid item xs={12}>
                  <TextField name="name" label="Name"></TextField>
                </MuiGrid>
                <MuiGrid item xs={12}>
                  <TextField name="description" label="Description"></TextField>
                </MuiGrid>
              </>
            );
          }}
        </Form>
      </MuiGrid>
    </MuiGrid>
  );
}
