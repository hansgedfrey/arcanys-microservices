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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Backspace";
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
import { DialogBox } from "../../components";
import EditCategory from "./EditCategory";

function Categories() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categories } = useAppSelector((state) => state.categories);
  const [open, setOpen] = useState<boolean>(false);
  const [params] = useSearchParams();
  console.log(params);
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
                                  //   navigate(`/admin/category/${item.categoryId}`);
                                  setOpen(true);
                                });
                              }}
                            >
                              Edit
                            </Button>
                            <IconButton aria-label="delete" size="small">
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
      <DialogBox
        open={open === true}
        icon={<EditIcon />}
        okLabel="Save"
        ok={() => setOpen(false)}
        cancelLabel="Cancel"
        cancel={() => {
          navigate(`/admin/categories`);
          setOpen(false);
        }}
      >
        <EditCategory />
      </DialogBox>
    </AdminScreen>
  );
}

const useStyles = makeStyles({});

export default Categories;
