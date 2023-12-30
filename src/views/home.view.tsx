import React, { useState, useEffect } from "react";
import AppBarDrawer from "../components/AppBarDrawer";
import { Container, Button, Box } from "@mui/material";
import Table from "../components/Table";
import { Columns } from "../components/TableHeaders";
import { sampleData } from "../components/sampleData";
import OrderRequestFormDialog from "../components/OrderRequestDialog";
import axios from "../utils/axios";

type dataRow = {
  date: string;
  ItemName: string;
  qty: number;
  price: string;
  CodeNumber: string;
  image: string;
};

const Home = () => {
  // Initiate your states
  const [items, setItems] = useState<dataRow[]>([]);
  const [loading, setLoading] = useState(false);
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

  const handleClickOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  // For pagination, define maximum of data per page

  const ITEMS_PER_PAGE = 10;

  // useEffect to get the data

  const fetchData = async () => {
    setLoading(true);
    try {
      // If you have an API, do your normal axios or fetch

      const { data } = await axios.get("/user/get-all-request");
      console.log(data);
      setItems(data);

      setTotalPageCount(10 / ITEMS_PER_PAGE);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  return (
    <>
      <AppBarDrawer title="Dashboard" />
      <Container>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            New order Request
          </Button>
        </Box>

        <Box>
          <Table
            data={items}
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
