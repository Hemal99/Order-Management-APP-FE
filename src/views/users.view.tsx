import React, { useState, useEffect } from "react";
import AppBarDrawer from "../components/AppBarDrawer";
import { Container, Button, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectTableState } from "../redux/Slices/tableSlice";
import { fetchDataThunk } from "../redux/Slices/tableSlice";
import { AppDispatch } from "../redux/store";
import CreateUserForm from "../components/Forms/CreateUserForm";
import UserTable from "../components/Tables/UserTable";
import { UserTableColumns } from "../components/Tables/UserTableHeaders";
import axiosInstance from "../utils/axios";

const Users = () => {
  // Initiate your states
  const dispatch = useDispatch<AppDispatch>();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const addRequest = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    fetchUserTableData();
  };

  // For pagination, define maximum of data per page

  const ITEMS_PER_PAGE = 10;

  // useEffect to get the data
  useEffect(() => {
    dispatch(fetchDataThunk());
  }, [dispatch]);

  useEffect(() => {
    setTotalPageCount(10 / ITEMS_PER_PAGE);
  }, [tableData]);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const fetchUserTableData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/user/get-all-users");
      setTableData(res.data);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await fetchUserTableData();
      setLoading(false);
    })();
  }, []);

  console.log({ currentPage });

  return (
    <>
      <AppBarDrawer title="Users" />
      <Container>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button variant="contained" color="primary" onClick={addRequest}>
            Create User
          </Button>
        </Box>

        <Box>
          <UserTable
            data={tableData}
            columns={UserTableColumns}
            searchLabel="Search by Name or job title"
            EmptyText="No staff found!"
            isFetching={loading}
            pageCount={totalPageCount}
            page={handlePageChange}
            fetchData={fetchUserTableData}
          />
        </Box>
      </Container>
      <CreateUserForm open={dialogOpen} handleClose={handleClose} />
    </>
  );
};

export default Users;
