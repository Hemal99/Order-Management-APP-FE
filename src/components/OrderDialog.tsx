import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import OrderRequestForm from "./OrderRequestForm";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/Slices/authSlice";
import PurchaserForm from "./Forms/PurchaserForm";
import { Container } from "@mui/material";
import OrderView from "./OrderView";
import AdminApprovalForm from "./Forms/AdminApprovalForm";
import {
  selectCurrentFromState,
  selectCurrentValues,
} from "../redux/Slices/requestFormSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const HEADERS = {
  Admin: {
    dialogTitle: "Order Approval Form",
    actionTitle: "Viewing Order",
  },
  Requester: {
    dialogTitle: "Order Request Form",
    actionTitle: "Create New Order",
  },
  Purchaser: {
    dialogTitle: "Order Status Form",
    actionTitle: "Viewing Order",
  },
};

export default function OrderRequestFormDialog(props: {
  open: boolean;
  handleClose: () => void;
  initialValues: any;
}) {
  const currentUser = useSelector(selectCurrentUser);
  const currentFormState = useSelector(selectCurrentFromState);

  const role =
    currentUser?.role !== undefined
      ? (currentUser.role as keyof typeof HEADERS)
      : "Requester";

  const currentValues = useSelector(selectCurrentValues);

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
              {HEADERS[role].dialogTitle}
            </Typography>
          </Toolbar>
        </AppBar>
        <Container>
          <>
            {currentUser?.role === "Requester" &&
              currentFormState != "view" && (
                <OrderRequestForm
                  handleClose={props.handleClose}
                  initialValues={props?.initialValues}
                />
              )}
            {currentUser?.role === "Requester" &&
              currentFormState == "view" && <OrderView />}
            {currentUser?.role === "Admin" && (
              <>
                <OrderView />
                {currentValues.status === "pending" && (
                  <AdminApprovalForm handleClose={props.handleClose} />
                )}
              </>
            )}
            {currentUser?.role === "Purchaser" && (
              <>
                <OrderView />
                <PurchaserForm handleClose={props.handleClose} />
              </>
            )}
          </>
        </Container>
      </Dialog>
    </>
  );
}
