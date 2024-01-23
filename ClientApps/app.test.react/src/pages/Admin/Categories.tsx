import {
  Grid as MuiGrid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { useAppDispatch, useAppSelector } from "../../store";
import { getCategoriesAsync } from "../../store/categories";
import AdminScreen from "../../layouts/AdminScreen";
import { Colors } from "../../layouts";

function Categories() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);
  const [selected, setSelected] = useState<string | undefined>();
  const classes = useStyles();

  useEffect(() => {
    dispatch(getCategoriesAsync({ page: 1 }));
  }, [dispatch]);

  return (
    <AdminScreen>
      <MuiGrid container spacing={2}>
        <MuiGrid item xs={12}>
          <TextField label="Search" />
        </MuiGrid>
        <MuiGrid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: Colors.Primary }}>
                <TableRow>
                  <TableCell component="th" scope="col" align="left">
                    Name
                  </TableCell>
                  <TableCell component="th" scope="col" align="left">
                    Description
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="col"
                    align="left"
                    width="10%"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories &&
                  categories.results?.map((item, index) => {
                    return (
                      <TableRow hover key={`${item.categoryId} - ${item.name}`}>
                        <TableCell component="th" scope="row">
                          {item.name}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {item.description}
                        </TableCell>
                        <TableCell component="th" scope="row" align="right">
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              startIcon={<EditIcon />}
                              size="small"
                              color="primary"
                            >
                              Edit
                            </Button>
                            <IconButton
                              aria-label="delete"
                              size="small"
                              color="primary"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </MuiGrid>
        <MuiGrid item xs={10}>
          add/edit
        </MuiGrid>
      </MuiGrid>
    </AdminScreen>
  );
}
const useStyles = makeStyles({
  list: {
    backgroundColor: "lightgrey",
  },
});
export default Categories;
