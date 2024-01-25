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
  tableCellClasses,
  styled,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Backspace";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  getCategoriesAsync,
  getCategoryInfoAsync,
} from "../../store/categories";
import AdminScreen from "../../layouts/AdminScreen";
import { Colors } from "../../layouts";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DialogBox, Form } from "../../components";
import EditCategory from "./EditCategory";

function Categories() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categories, selectedCategory } = useAppSelector(
    (state) => state.categories
  );
  const [openEditCategory, setOpenEditCategory] = useState<boolean>(false);
  const [openDeleteCategory, setOpenDeleteCategory] = useState<boolean>(false);
  const [params] = useSearchParams();

  useEffect(() => {
    dispatch(getCategoriesAsync({ page: 1 }));
  }, [dispatch]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: Colors.Primary,
      color: theme.palette.common.white,
    },
  }));

  return (
    <AdminScreen>
      <MuiGrid container spacing={2}>
        <MuiGrid item xs={12}>
          <TextField label="Search" />
        </MuiGrid>
        <MuiGrid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell component="th" scope="col" align="left">
                    Name
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="col" align="left">
                    Description
                  </StyledTableCell>
                  <StyledTableCell
                    component="th"
                    scope="col"
                    align="left"
                    width="10%"
                  >
                    Actions
                  </StyledTableCell>
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
                              onClick={async () => {
                                await dispatch(
                                  getCategoryInfoAsync({
                                    categoryId: item.categoryId!,
                                  })
                                ).then(() => {
                                  setOpenEditCategory(true);
                                });
                              }}
                            >
                              Edit
                            </Button>
                            <IconButton
                              aria-label="delete"
                              size="small"
                              onClick={async () => {
                                await dispatch(
                                  getCategoryInfoAsync({
                                    categoryId: item.categoryId!,
                                  })
                                ).then(() => {
                                  setOpenDeleteCategory(true);
                                });
                              }}
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
      </MuiGrid>
      <DialogBox
        open={openEditCategory === true}
        icon={<EditNoteIcon color="primary" />}
        okLabel="Save"
        ok={() => setOpenEditCategory(false)}
        cancelLabel="Cancel"
        cancel={() => {
          navigate(`/admin/categories`);
          setOpenEditCategory(false);
        }}
        title="Edit Category"
      >
        <EditCategory />
      </DialogBox>
      <DialogBox
        open={openDeleteCategory === true}
        icon={<HighlightOffIcon color="error" />}
        okLabel="Delete"
        ok={() => setOpenDeleteCategory(false)}
        cancelLabel="Cancel"
        cancel={() => {
          navigate(`/admin/categories`);
          setOpenDeleteCategory(false);
        }}
        title="Confirm Delete"
      >
        <Typography variant="subtitle1">
          Do you want to delete {selectedCategory?.name} category?
        </Typography>
      </DialogBox>
    </AdminScreen>
  );
}

const useStyles = makeStyles({});

export default Categories;
