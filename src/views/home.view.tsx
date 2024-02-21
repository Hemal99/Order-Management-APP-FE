import React, { useState, useEffect } from "react";
import AppBarDrawer from "../components/AppBarDrawer";
import { Container, Button, Box, Typography } from "@mui/material";
import Table from "../components/Tables/Table";
import { RequsterColumnsCurrent } from "../components/Tables/THCurrentRequester";
import { AdminColumnsCurrent } from "../components/Tables/THCurrentAdmin";
import OrderRequestFormDialog from "../components/OrderDialog";
import { useDispatch, useSelector } from "react-redux";
import { selectTableState, fetchDataThunk } from "../redux/Slices/tableSlice";
import { AppDispatch } from "../redux/store";
import { setFormState, setRequestId } from "../redux/Slices/requestFormSlice";
import { selectCurrentUser } from "../redux/Slices/authSlice";

const Home = () => {
  // Initiate your states
  const dispatch = useDispatch<AppDispatch>();
  const { tableData, loading, pendingRequests } = useSelector(selectTableState);
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

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    setTotalPageCount(Math.ceil(tableData.length / ITEMS_PER_PAGE));
  }, [tableData]);

  const currentUser = useSelector(selectCurrentUser);

  // useEffect to get the data
  useEffect(() => {
    if (currentUser?.role === "Requester") {
      dispatch(fetchDataThunk({ url: "get-current-requests-by-requester-id" }));
    } else {
      dispatch(fetchDataThunk({ url: "get-all-current-request" }));
    }
  }, [dispatch, currentUser?.role]);

  return (
    <>
      <AppBarDrawer />
      <Container>
        {currentUser?.role === "Requester" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            <Button variant="contained" color="primary" onClick={addRequest}>
              New order Request
            </Button>
          </Box>
        )}
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Current Requests
        </Typography>
        {currentUser?.role === "Admin" && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
            <Typography> Pending Requests : {pendingRequests} </Typography>
          </Box>
        )}
        <Box>
          <Table
            data={tableData}
            columns={
              currentUser?.role === "Requester"
                ? RequsterColumnsCurrent
                : AdminColumnsCurrent
            }
            searchLabel="Search by Name or Code"
            EmptyText="No Data found!"
            isFetching={loading}
            rowsPerPage={ITEMS_PER_PAGE}
            pageCount={totalPageCount}
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
