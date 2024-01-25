import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  CircularProgress,
} from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentRequestId } from "../../redux/Slices/requestFormSlice";
import axiosInstance from "../../utils/axios";
import { fetchDataThunk } from "../../redux/Slices/tableSlice";
import { AppDispatch } from "../../redux/store";

type PurchaserFormValues = {
  status?: string;
};

function PurchaserForm(props: { handleClose: () => void }) {
  const [performingAction, setPerformingAction] = useState(false);

  const { handleSubmit, control, reset } = useForm<PurchaserFormValues>({
    defaultValues: {
      status: "",
    },
  });

  const dispatch = useDispatch<AppDispatch>();
  const requestId = useSelector(selectCurrentRequestId);

  const purchaserStatusChange : SubmitHandler<PurchaserFormValues> = async (data) => {
    console.log("changing status");
    try {
      const response = await axiosInstance.put(
        `http://localhost:5000/user/change-status/${requestId}`,
        {
          status: data.status,
        }
      );

      dispatch(fetchDataThunk());
      props.handleClose();
      console.log(response);
    } catch (err) {}
  };

  const OPTIONS = [
    "Order-Placed",
    "In-Productoion",
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
        <InputLabel>Chnage Status to</InputLabel>
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
