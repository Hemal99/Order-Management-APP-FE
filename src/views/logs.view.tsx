import React, { useState, useEffect } from "react";
import AppBarDrawer from "../components/AppBarDrawer";
import { Container, Box } from "@mui/material";
import LogsTable from "../components/Tables/LogsTable";
import { RequesterColumnsProcessed } from "../components/Tables/THProcessedRequester";
import { AdminColumnsProcessed } from "../components/Tables/THProcessedAdmin";
import { useDispatch, useSelector } from "react-redux";
import { selectTableState } from "../redux/Slices/tableSlice";
import { fetchDataThunk } from "../redux/Slices/tableSlice";
import { AppDispatch } from "../redux/store";
import { selectCurrentUser } from "../redux/Slices/authSlice";
import LogsDialog from "../components/LogsDialog";

const Logs = () => {
  // Initiate your states
  const dispatch = useDispatch<AppDispatch>();
  const { tableData, loading } = useSelector(selectTableState);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [modalOpen, setModalOpen] = React.useState(false);

  // For pagination, define maximum of data per page

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    setTotalPageCount(Math.ceil(tableData.length / ITEMS_PER_PAGE));
  }, [tableData]);

  const handleClose = () => {
    setModalOpen(false);
  };

  const currentUser = useSelector(selectCurrentUser);

  // useEffect to get the data
  useEffect(() => {
    if (currentUser?.role === "Requester") {
      dispatch(fetchDataThunk({ url: "get-past-requests-by-requester-id" }));
    } else {
      dispatch(fetchDataThunk({ url: "get-all-past-request" }));
    }
  }, [dispatch]);

  return (
    <>
      <AppBarDrawer title="Logs" />
      <Container>
        <Box>
          <LogsTable
            data={tableData}
            columns={
              currentUser?.role === "Requester"
                ? RequesterColumnsProcessed
                : AdminColumnsProcessed
            }
            searchLabel="Search by Name or Code"
            EmptyText="No Data found!"
            isFetching={loading}
            pageCount={totalPageCount}
            setModalOpen={setModalOpen}
            rowsPerPage={ITEMS_PER_PAGE}
          />
        </Box>
      </Container>
      <LogsDialog open={modalOpen} handleClose={handleClose} />
    </>
  );
};

export default Logs;
