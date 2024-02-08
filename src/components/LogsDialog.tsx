import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Container, Box, Button } from "@mui/material";
import OrderView from "./OrderView";
import CompletedOrderView from "./CompletedOrderView";
import { AppDispatch } from "../redux/store";
import html2PDF from "jspdf-html2canvas";
import { useSelector } from "react-redux";
import { selectCurrentValues } from "../redux/Slices/requestFormSlice";
import { selectCurrentUserRole } from "../redux/Slices/authSlice";
import axiosInstance from "../utils/axios";
import { setSnackbarOpen } from "../redux/Slices/snackBarslice";
import { useDispatch } from "react-redux";
import { fetchDataThunk } from "../redux/Slices/tableSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LogsDialog(props: {
  open: boolean;
  handleClose: () => void;
}) {
  const values = useSelector(selectCurrentValues);
  const user = useSelector(selectCurrentUserRole);

  const dispatch = useDispatch<AppDispatch>();

  const handleDownloadPdf = () => {
    const page = document.getElementById("pdf-content")!;

    const fileName = `${values.reqId.match(/\d+/)[0].padStart(4, "0")}.pdf`;

    html2PDF(page, {
      jsPDF: {
        format: "a4",
        orientation: "landscape",
      },
      html2canvas: {
        useCORS: true,
        allowTaint: true,
      },
      imageType: "image/jpeg",
      success: function (pdf) {
        pdf.save(fileName);
      },
      autoResize: true,
    });
  };

  const handleDelete = async () => {
    console.log("delete");
    try {
      await axiosInstance.delete(`/user/delete-request/${values._id}`);
      dispatch(
        setSnackbarOpen({
          text: "Request Order Succesfully Deleted.",
          type: "success",
        })
      );
      props.handleClose();
      dispatch(fetchDataThunk({ url: "get-all-past-request" }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dialog
        fullScreen
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Viewing Request Order
            </Typography>
          </Toolbar>
        </AppBar>
        <Box id="pdf-content" sx={{ m: 5 }}>
          <Container>
            <OrderView />
            <CompletedOrderView />
          </Container>
        </Box>
        <Container>
          <Box
            sx={{
              m: 4,
              mt: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              sx={{
                mt: 3,
                ml: 4,
                minWidth: "100px",
              }}
              onClick={handleDownloadPdf}
            >
              Generate Pdf
            </Button>
            {user === "Admin" && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  ml: 4,
                  minWidth: "100px",
                }}
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </Box>
        </Container>
      </Dialog>
    </>
  );
}
