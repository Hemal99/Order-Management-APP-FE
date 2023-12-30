import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  InputLabel,
  Grid,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/Slices/authSlice";

const FormField = (props: { children: React.ReactElement[] }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "30% 70%",
      m: 2,
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    {props.children}
  </Box>
);

type FormValues = {
  date: Dayjs;
  itemName: "";
  qty: number;
  codenumber: string;
  price: number;
  image: File;
};

function OrderRequestForm(props: { handleCancel: () => void }) {
  const [performingAction, setPerformingAction] = useState(false);

  const {
    handleSubmit,
    // register,
    // formState: { errors },
    control,
    watch,
    getValues,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      date: dayjs(),
      itemName: "",
      qty: 0,
      codenumber: "",
      price: 0.0,
    },
  });

  const token = useSelector(selectCurrentToken);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const { itemName, qty, codenumber, price } = data;

    const requestBody = {
      productName: itemName,
      quantity: qty,
      codeNumber: codenumber,
      sellingPrice: price,
      status: "pending",
      image: "https://example.com/product-image.jpg",
    };
    setPerformingAction(true);
    fetch("http://localhost:5000/user/add-request", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res);
        setPerformingAction(false);
      })
      .catch((err) => {
        console.log(err);
        setPerformingAction(false);
      });
  };

  const fileUploaded = watch("image");

  return (
    <Container>
      <Box sx={{ py: 3, my: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Create a New order
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1 }}
        >
          <Grid container spacing={3} columnSpacing={10}>
            <Grid item xs={6}>
              <FormField>
                <InputLabel>Date</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        slotProps={{ textField: { size: "small" } }}
                        sx={{
                          width: "100%",
                          ".MuiPickersToolbar-content": { py: 0 },
                        }}
                        {...field}
                        value={dayjs(field.value)}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormField>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <FormField>
                <InputLabel>Item Name</InputLabel>
                <Controller
                  name="itemName"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      helperText={error ? error.message : null}
                      size="small"
                      error={!!error}
                      onChange={onChange}
                      value={value}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </FormField>
            </Grid>
            <Grid item xs={5}>
              <FormField>
                <InputLabel>Qunatity</InputLabel>
                <Controller
                  rules={{ required: true }}
                  name="qty"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      helperText={error ? error.message : null}
                      size="small"
                      error={!!error}
                      onChange={(event) => onChange(+event.target.value)}
                      type="number"
                      value={value}
                      variant="outlined"
                      sx={{ maxWidth: "150px" }}
                    />
                  )}
                />
              </FormField>
            </Grid>
            <Grid item xs={6}>
              <FormField>
                <InputLabel>Code Number</InputLabel>
                <Controller
                  name="codenumber"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      helperText={error ? error.message : null}
                      size="small"
                      error={!!error}
                      onChange={onChange}
                      value={value}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </FormField>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <FormField>
                <InputLabel>Price</InputLabel>
                <Controller
                  name="price"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      helperText={error ? error.message : null}
                      size="small"
                      error={!!error}
                      onChange={onChange}
                      value={value}
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          paddingLeft: 0,
                          // "&.Mui-focused": {
                          //   "& .MuiInputAdornment-root": {
                          //     color: "white",
                          //     backgroundColor: (theme) => theme.palette.primary.main
                          //   }
                          // }
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            sx={{
                              backgroundColor: "#dcdde1",
                              padding: "20px 14px",
                              borderTopLeftRadius: (theme) =>
                                theme.shape.borderRadius + "px",
                              borderBottomLeftRadius: (theme) =>
                                theme.shape.borderRadius + "px",
                            }}
                            position="start"
                          >
                            AED
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </FormField>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <FormField>
                <InputLabel>Image</InputLabel>
                {!fileUploaded ? (
                  <Controller
                    control={control}
                    name={"image"}
                    rules={{ required: "Image is required" }}
                    render={({ field: { onChange, ...field } }) => {
                      return (
                        <Button
                          variant="contained"
                          component="label"
                          sx={{
                            maxWidth: "280px",
                            backgroundColor: "#dcdde1",
                            color: "black",
                            "&:hover": {
                              backgroundColor: "#dcdde1",
                              boxShadow: "none",
                            },
                            "&:active": {
                              boxShadow: "none",
                              backgroundColor: "#dcdde1",
                            },
                          }}
                        >
                          Upload Image
                          <input
                            {...field}
                            value={undefined}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              onChange(e.currentTarget.files?.[0]);
                            }}
                            type="file"
                            hidden
                          />
                        </Button>
                      );
                    }}
                  />
                ) : (
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>{getValues("image").name}</Typography>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        reset({ image: undefined });
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Box>
                )}
              </FormField>
            </Grid>
          </Grid>
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
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                ml: 4,
                minWidth: "100px",
              }}
              // disabled={performingAction ? true : false}
            >
              {performingAction ? (
                <CircularProgress color="inherit" size="1.5rem" />
              ) : (
                `Save`
              )}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              sx={{
                mt: 3,
                ml: 4,
                minWidth: "100px",
              }}
              onClick={props.handleCancel}
              // disabled={performingAction ? true : false}
            >
              Cancel
            </Button>
          </Box>
        </Box>
        <br />
      </Box>
    </Container>
  );
}

export default OrderRequestForm;
