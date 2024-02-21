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
  Button,
  Typography,
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
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { FC, memo, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setFormState,
  setRequestId,
  setCurrentValues,
} from "../../redux/Slices/requestFormSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserRole } from "../../redux/Slices/authSlice";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
  // page?: (page: number) => void;
  search?: (search: string) => void;
  onClickRow?: (cell: Cell<any, unknown>, row: Row<any>) => void;
  searchLabel?: string;
  EmptyText?: string;
  children?: React.ReactNode | React.ReactElement;
  handleRow?: () => void;
  setModalOpen: (value: boolean) => void;
  setInitialValues: (value: any) => void;
  rowsPerPage: number;
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
  // page,
  EmptyText,
  // children,
  rowsPerPage,
  handleRow,
  setModalOpen,
  setInitialValues,
}) => {
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const {
    getHeaderGroups,
    getRowModel,
    getAllColumns,
    setPageSize,
    getState,
    previousPage,
    getCanPreviousPage,
    nextPage,
    getCanNextPage,
    setGlobalFilter,
  } = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: false,
    pageCount,
  });

  useEffect(() => {
    setPageSize(rowsPerPage);
  }, []);

  const skeletons = Array.from({ length: skeletonCount }, (x, i) => i);

  const columnCount = getAllColumns().length;

  const noDataFound =
    !isFetching && (!memoizedData || memoizedData.length === 0);

  const dispatch = useDispatch();
  const userRole = useSelector(selectCurrentUserRole);

  const handleOpenModal = (row: any) => {
    setModalOpen(true);
    dispatch(setRequestId(row?._id));
    dispatch(setCurrentValues(row));
    if (row.status === "pending") {
      dispatch(setFormState("edit"));
    } else {
      dispatch(setFormState("view"));
    }
    setInitialValues(row);
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
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setGlobalFilter(event.target.value);
        }}
      />

      <Box
        sx={{
          display: "flex",
          py: 2,
          justifyContent: "flex-end",
          width: "90%",
          mx: "auto",
          alignItems: "center",
        }}
      >
        <Typography fontSize={12}>
          Page {getState().pagination.pageIndex + 1} of {pageCount}
        </Typography>
        <IconButton
          onClick={() => previousPage()}
          disabled={!getCanPreviousPage()}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton onClick={() => nextPage()} disabled={!getCanNextPage()}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

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
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenModal(row?.original)}
                    >
                      {userRole == "Admin" &&
                        (row?.original.status === "pending"
                          ? "Take Action"
                          : "View")}
                      {userRole == "Requester" &&
                        (row?.original.status === "pending" ? "Edit" : "View")}
                      {userRole == "Purchaser" &&
                        (row?.original.status !== "pending" &&
                        row?.original.status !== "Rejected"
                          ? "Change Status"
                          : "View")}
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
