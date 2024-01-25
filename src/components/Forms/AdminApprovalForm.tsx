import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentRequestId } from "../../redux/Slices/requestFormSlice";
import axiosInstance from "../../utils/axios";
import { fetchDataThunk } from "../../redux/Slices/tableSlice";
import { AppDispatch } from "../../redux/store";
import { setSnackbarOpen } from "../../redux/Slices/snackBarslice";

type adminFormValues = {
  comments?: string;
};

function AdminApprovalForm(props: { handleClose: () => void }) {
  const [performingAction, setPerformingAction] = useState(false);

  const { getValues, control, reset } = useForm<adminFormValues>({
    defaultValues: {
      comments: "",
    },
  });

  const dispatch = useDispatch<AppDispatch>();
  const requestId = useSelector(selectCurrentRequestId);

  const changeStatus = async (status: string) => {
    console.log("changing status");

    const comments = getValues("comments");

    try {
      const response = await axiosInstance.put(
        `/user/approve-or-reject-request/${requestId}`,
        {
          comments: comments,
          status: status,
        }
      );

      dispatch(fetchDataThunk());
      props.handleClose();
      if (status === "Approved") {
        dispatch(
          setSnackbarOpen({
            type: "success",
            Text: "Request Approved",
          })
        );
      } else {
        dispatch(
          setSnackbarOpen({
            type: "success",
            text: "Request Rejected",
          })
        );
      }
      console.log(response);
    } catch (err) {}
  };

  return (
    <Box component="form" sx={{ mt: 5 }}>
      <FormControl size={"small"} sx={{ mt: 1, width: "50%" }} fullWidth>
        <Controller
          render={({ field: { onChange, value } }) => (
            <TextField
              multiline
              rows={4}
              size="small"
              onChange={onChange}
              value={value}
              fullWidth
              variant="outlined"
              label="Comments"
            />
          )}
          control={control}
          name={"comments"}
        />
      </FormControl>
      <Box
        sx={{
          m: 0,
          mt: 3,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="success"
          sx={{
            mt: 3,
            ml: 4,
            minWidth: "100px",
          }}
          disabled={performingAction}
          onClick={() => changeStatus("Approved")}
        >
          {performingAction ? (
            <CircularProgress color="inherit" size="1.5rem" />
          ) : (
            `Approve`
          )}
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => changeStatus("Rejected")}
          sx={{
            mt: 3,
            ml: 4,
            minWidth: "100px",
          }}
          disabled={performingAction}
        >
          {performingAction ? (
            <CircularProgress color="inherit" size="1.5rem" />
          ) : (
            `Reject`
          )}
        </Button>
      </Box>
    </Box>
  );
}

export default AdminApprovalForm;
