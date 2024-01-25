import {
  Box,
  Paper,
  Skeleton,
  Table as MuiTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  // Menu,
  // MenuItem,
  // Pagination,
  // styled,
  InputAdornment,
  TablePagination,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { FC, memo, useMemo, useState } from "react";
import axiosInstance from "../../utils/axios";
import { useDispatch } from "react-redux";
import { setSnackbarOpen } from "../../redux/Slices/snackBarslice";

// Styles with styled-component

export const StyledTableRow = styled(TableRow)`
  &:last-child td,
  &:last-child th {
    border: 0;
  }
  :hover {
    background-color: #d9d9d9;
  }
`;

// Typescript interface

interface TableProps {
  data: any[];
  columns: ColumnDef<any>[];
  isFetching?: boolean;
  skeletonCount?: number;
  skeletonHeight?: number;
  headerComponent?: JSX.Element;
  pageCount?: number;
  page?: (page: number) => void;
  search?: (search: string) => void;
  onClickRow?: (cell: Cell<any, unknown>, row: Row<any>) => void;
  searchLabel?: string;
  EmptyText?: string;
  children?: React.ReactNode | React.ReactElement;
  handleRow?: () => void;
  fetchData: () => void;
}

// The main table

const TableUI: FC<TableProps> = ({
  data,
  columns,
  isFetching,
  skeletonCount = 10,
  skeletonHeight = 28,
  // headerComponent,
  pageCount,
  onClickRow,
  page,
  EmptyText,
  // children,
  handleRow,
  fetchData,
}) => {
  const [paginationPage, setPaginationPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [performingAction, setPerformingAction] = useState(false);

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);
  // const memoisedHeaderComponent = useMemo(
  //   () => headerComponent,
  //   [headerComponent]
  // );

  const dispatch = useDispatch();

  const { getHeaderGroups, getRowModel, getAllColumns } = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  });

  const skeletons = Array.from({ length: skeletonCount }, (x, i) => i);

  const columnCount = getAllColumns().length;

  const noDataFound =
    !isFetching && (!memoizedData || memoizedData.length === 0);

  // const handlePageChange = (
  //   event: ChangeEvent<unknown>,
  //   currentPage: number
  // ) => {
  //   setPaginationPage(currentPage === 0 ? 1 : currentPage);
  //   page?.(currentPage === 0 ? 1 : currentPage);
  // };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPaginationPage(newPage === 0 ? 1 : newPage);
    page?.(newPage === 0 ? 1 : newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPaginationPage(0);
  };

  const handleDelete = (row: any) => async () => {
    console.log(row);
    setPerformingAction(true);
    try {
      const res = await axiosInstance.delete(`/user/delete-user/${row._id}`);
      dispatch(
        setSnackbarOpen({ text: "User deleted successfully", type: "success" })
      );
    } catch (error) {
      console.log(error);
      dispatch(
        setSnackbarOpen({ text: "Failed to delete user", type: "error" })
      );
    }
    setPerformingAction(false);
    fetchData();
  };

  return (
    <Paper elevation={2} style={{ padding: "0 0 1rem 0" }}>
      <TextField
        variant="filled"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        fullWidth
        placeholder="Search"
      />
      {pageCount && page && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={pageCount}
          rowsPerPage={rowsPerPage}
          page={paginationPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      <Box style={{ overflowX: "auto" }}>
        <MuiTable>
          {!isFetching && (
            <TableHead>
              {getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      sx={{ fontWeight: 600, fontSize: 13 }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <span>Actions</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableHead>
          )}
          <TableBody>
            {!isFetching ? (
              getRowModel()?.rows.map((row) => (
                <StyledTableRow key={row.id} onClick={handleRow}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      onClick={() => onClickRow?.(cell, row)}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleDelete(row.original)}
                      disabled={performingAction}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <>
                {skeletons.map((skeleton) => (
                  <TableRow key={skeleton}>
                    {Array.from({ length: columnCount }, (x, i) => i).map(
                      (elm) => (
                        <TableCell key={elm}>
                          <Skeleton height={skeletonHeight} />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </MuiTable>
      </Box>
      {noDataFound && (
        <Box my={2} textAlign="center">
          {EmptyText}
        </Box>
      )}
    </Paper>
  );
};

TableUI.defaultProps = {
  EmptyText: "No Data is found",
};

export default memo(TableUI);
