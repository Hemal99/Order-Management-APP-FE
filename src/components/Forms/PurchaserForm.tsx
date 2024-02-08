import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentRequestId } from "../../redux/Slices/requestFormSlice";
import axiosInstance from "../../utils/axios";
import { fetchDataThunk } from "../../redux/Slices/tableSlice";
import { AppDispatch } from "../../redux/store";
import { setSnackbarOpen } from "../../redux/Slices/snackBarslice";

type PurchaserFormValues = {
  status?: string;
  eta?: string;
};

function PurchaserForm(props: { handleClose: () => void }) {
  const [performingAction, setPerformingAction] = useState(false);

  const { handleSubmit, control, watch } = useForm<PurchaserFormValues>({
    defaultValues: {
      status: "",
      eta: "",
    },
  });

  const dispatch = useDispatch<AppDispatch>();
  const requestId = useSelector(selectCurrentRequestId);

  const changedStatus = watch("status");

  const purchaserStatusChange: SubmitHandler<PurchaserFormValues> = async (
    data
  ) => {
    console.log("changing status");
    setPerformingAction(true);
    try {
      const response = await axiosInstance.put(
        `/user/change-status/${requestId}`,
        {
          status: data.status,
          eta: data.eta ? data.eta : null,
        }
      );

      dispatch(fetchDataThunk({ url: "get-all-current-request" }));
      dispatch(
        setSnackbarOpen({
          text: `Status Successfully changed Status to "${data.status}".`,
          type: "success",
        })
      );
      props.handleClose();
      console.log(response);
    } catch (err) {
      dispatch(fetchDataThunk({ url: "get-all-current-request" }));
      dispatch(
        setSnackbarOpen({
          text: `Error :  ${err}.`,
          type: "error",
        })
      );
      props.handleClose();
      setPerformingAction(false);
    }
  };

  const OPTIONS = [
    "Order-Placed",
    "In-Production",
    "In-Transit",
    "Shipment-Arrived",
    "Goods-In-Warehouse",
  ];

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(purchaserStatusChange)}
      sx={{ mt: 5 }}
    >
      <FormControl size={"small"} sx={{ mt: 1, width: "50%" }} fullWidth>
        <InputLabel>Change Status to</InputLabel>
        <Controller
          render={({ field: { onChange, value } }) => (
            <Select onChange={onChange} value={value} label="Change Status to">
              {OPTIONS.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          )}
          control={control}
          name={"status"}
        />
      </FormControl>
      <Box sx={{ mt: 3, width: "50%", display: "block" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "20% 80%",
            justifyContent: "space-between",
          }}
        >
          {changedStatus == "In-Transit" && (
            <>
              <Typography>ETA : </Typography>
              <FormControl size={"small"} fullWidth>
                <Controller
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      multiline
                      rows={2}
                      size="small"
                      onChange={onChange}
                      value={value}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  control={control}
                  name={"eta"}
                />
              </FormControl>
            </>
          )}
        </Box>
      </Box>

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
            ml: 0,
            minWidth: "100px",
          }}
          disabled={performingAction}
          type="submit"
        >
          {performingAction ? (
            <CircularProgress color="inherit" size="1.5rem" />
          ) : (
            `Change Status`
          )}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            mt: 3,
            ml: 4,
            minWidth: "100px",
          }}
          onClick={props.handleClose}
          disabled={performingAction}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

export default PurchaserForm;
