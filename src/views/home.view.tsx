import React, { useState, useEffect } from "react";
import AppBarDrawer from "../components/AppBarDrawer";
import { Container, Button, Box , Typography} from "@mui/material";
import Table from "../components/Table";
import { Columns } from "../components/TableHeaders";
import OrderRequestFormDialog from "../components/OrderDialog";
import { useDispatch, useSelector } from "react-redux";
import { selectTableState } from "../redux/Slices/tableSlice";
import { fetchDataThunk } from "../redux/Slices/tableSlice";
import { AppDispatch } from "../redux/store";
import { setFormState, setRequestId } from "../redux/Slices/requestFormSlice";
import { selectCurrentUser } from "../redux/Slices/authSlice";

const Home = () => {
  // Initiate your states
  const dispatch = useDispatch<AppDispatch>();
  const { tableData, loading } = useSelector(selectTableState);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [initialValues, setInitialValues] = useState({
    productName: "",
    quantity: "",
    sellingPrice: "",
    codeNumber: "",
    image: "",
  });

  const addRequest = () => {
    setModalOpen(true);
    dispatch(setFormState("add"));
  };

  const handleClose = () => {
    setModalOpen(false);
    dispatch(setFormState("add"));
    dispatch(setRequestId(null));
    setInitialValues({
      productName: "",
      quantity: "",
      sellingPrice: "",
      codeNumber: "",
      image: "",
    });
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

  console.log({ initialValues, currentPage });

  const currentUser = useSelector(selectCurrentUser);

  return (
    <>
      <AppBarDrawer title="Dashboard" />
      <Container>
        {currentUser?.role === "Requester" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            <Button variant="contained" color="primary" onClick={addRequest}>
              New order Request
            </Button>
          </Box>
        )}
        {currentUser?.role === "Admin" && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
            <Typography> Pending Requests : 0</Typography>
          </Box>
        )}
        <Box>
          <Table
            data={tableData}
            columns={Columns}
            searchLabel="Search by Name or job title"
            EmptyText="No staff found!"
            isFetching={loading}
            pageCount={totalPageCount}
            page={handlePageChange}
            setModalOpen={setModalOpen}
            setInitialValues={setInitialValues}
          />
        </Box>
      </Container>
      <OrderRequestFormDialog
        open={modalOpen}
        handleClose={handleClose}
        initialValues={initialValues}
      />
    </>
  );
};

export default Home;
