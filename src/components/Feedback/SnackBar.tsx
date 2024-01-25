import React from "react";
import Snackbar from "@mui/material/Snackbar";
import {
  selectSnackBarState,
  selectSnackBarText,
  selectSnackBarType,
  snackBarClose,
} from "../../redux/Slices/snackBarslice";
import { useSelector, useDispatch } from "react-redux";
import MuiAlert from "@mui/material/Alert";

function SnackBar() {
  const snackBarState = useSelector(selectSnackBarState);
  const snackBarText = useSelector(selectSnackBarText);
  const snackBarType = useSelector(selectSnackBarType);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(snackBarClose());
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={snackBarState}
      onClose={handleClose}
      message={snackBarText}
      autoHideDuration={2000}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={snackBarType}
        sx={{ width: "100%" }}
      >
        {snackBarText}
      </MuiAlert>
    </Snackbar>
  );
}

export default SnackBar;
