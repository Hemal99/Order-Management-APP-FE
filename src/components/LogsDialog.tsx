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
// import generatePDF from "react-to-pdf";
import html2PDF from "jspdf-html2canvas";

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
  const handleDownloadPdf = () => {
    const page = document.getElementById("pdf-content")!;
    console.log(page);

    html2PDF(page, {
      jsPDF: {
        format: "a4",
        orientation: "landscape",
      },
      html2canvas: {
        useCORS: true,
      },
      imageType: "image/jpeg",
      output: "./pdf/generate.pdf",
      autoResize: true,
    });
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
        <div id="pdf-content">
          <Container>
            <OrderView />
            <CompletedOrderView />
          </Container>
        </div>
        <Container>
          <Box
            sx={{
              m: 4,
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                ml: 4,
                minWidth: "100px",
              }}
            >
              Delete
            </Button>
          </Box>
        </Container>
      </Dialog>
    </>
  );
}
