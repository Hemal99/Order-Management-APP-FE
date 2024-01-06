import React, { useState, useEffect } from "react";
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
import { Dayjs } from "dayjs";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "../redux/Slices/authSlice";
import axios from "../utils/axios";
import { uploadImagetoFirebase } from "../firebase";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { fetchDataThunk } from "../redux/Slices/tableSlice";
import {
  selectCurrentFromState,
  selectCurrentRequestId,
} from "../redux/Slices/requestFromSlice";

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
  productName: string;
  quantity: number;
  sellingPrice: number;
  codeNumber: string;
  image?: File;
  status: string;
  createdAt: Dayjs;
};

function OrderRequestForm(props: {
  initialValues: any;
  handleClose: () => void;
}) {
  const [performingAction, setPerformingAction] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(
    props.initialValues?.image
  );
  const [fileUploaded, setFileUploaded] = useState(false);

  console.log(props.initialValues);

  const {
    handleSubmit,
    // register,
    // formState: { errors },
    control,
    watch,
    getValues,
    resetField,
  } = useForm<FormValues>({
    defaultValues: props?.initialValues,
  });

  const user = useSelector(selectCurrentUser);
  const currentFormState = useSelector(selectCurrentFromState);
  const requestId = useSelector(selectCurrentRequestId);

  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch<AppDispatch>();

  const disabled = user?.role === "Admin" ? true : false;

  const viewOnly = user?.role === "Admin" ? true : false;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { productName, quantity, codeNumber, sellingPrice } = data;

    console.log("submit fired");

    const requestBody = {
      productName: productName,
      quantity: quantity,
      codeNumber: codeNumber,
      sellingPrice: sellingPrice,
      status: "pending",
      image: imgUrl,
    };
    setPerformingAction(true);
    try {
      if (currentFormState == "add") {
        const res = await fetch("http://localhost:5000/user/add-request", {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `Bearer ${token}`,
          },
        });
        console.log(res);
      }

      if (currentFormState == "edit") {
        const res = await fetch(
          `http://localhost:5000/user/edit-request/${requestId}`,
          {
            method: "PUT",
            body: JSON.stringify(requestBody),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res);
      }
    } catch (error) {
      console.log(error);
      setPerformingAction(false);
    }
    setPerformingAction(false);
    props.handleClose();
    dispatch(fetchDataThunk());
  };

  useEffect(() => {
    console.log({ fileUploaded, value: getValues("image") });
    if (fileUploaded && getValues("image")) {
      uploadImagetoFirebase(getValues("image"), getValues("image")?.name).then(
        (url) => {
          if (typeof url === "string") {
            setImgUrl(url);
          }
        }
      );
    }
  }, [fileUploaded]);

  useEffect(() => {
    if (props.initialValues?.image) {
      setFileUploaded(true);
    }
  }, []);

  useEffect(() => {
    if (imgUrl) {
      setFileUploaded(true);
    }
  }, [imgUrl]);

  const changeStatus = async (status: string) => {
    console.log("changing status");
    try {
      const response = await axios.put(
        `http://localhost:5000/admin/approve-or-reject-request/${props.initialValues._id}`,
        {
          status: status,
        }
      );

      dispatch(fetchDataThunk());
      props.handleClose();
      console.log(response);
    } catch (err) {}
  };

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
            <Grid item xs={6}></Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <FormField>
                <InputLabel>Product Name</InputLabel>
                <Controller
                  name="productName"
                  control={control}
                  rules={{ required: "A Product Name is required" }}
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
                      disabled={disabled}
                    />
                  )}
                />
              </FormField>
            </Grid>
            <Grid item xs={5}>
              <FormField>
                <InputLabel>Qunatity</InputLabel>
                <Controller
                  rules={{ required: "A Quantity is required" }}
                  name="quantity"
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
                      disabled={disabled}
                    />
                  )}
                />
              </FormField>
            </Grid>
            <Grid item xs={6}>
              <FormField>
                <InputLabel>Code Number</InputLabel>
                <Controller
                  name="codeNumber"
                  control={control}
                  rules={{ required: "Code Number is required" }}
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
                      disabled={disabled}
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
                  name="sellingPrice"
                  control={control}
                  rules={{ required: "Selling Price is required" }}
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
                      disabled={disabled}
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
                {viewOnly ? (
                  <Box
                    sx={{
                      height: "200px",
                      width: "360px",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={props.initialValues?.image}
                      alt="product"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Box>
                ) : (
                  <div>
                    {imgUrl ? (
                      <Box
                        sx={{
                          height: "200px",
                          width: "360px",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt="product"
                          style={{ height: "100%" }}
                        />
                      </Box>
                    ) : (
                      <></>
                    )}
                    {!fileUploaded ? (
                      <Controller
                        control={control}
                        name={"image"}
                        rules={{ required: "Image is required" }}
                        render={({
                          field: { onChange, ...field },
                          fieldState: { error },
                        }) => {
                          return (
                            <>
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
                                  onChange={async (
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    onChange(e.currentTarget.files?.[0]);
                                    setFileUploaded(true);
                                  }}
                                  type="file"
                                  hidden
                                />
                              </Button>
                              {error && (
                                <Typography variant="subtitle2" color={"error"}>
                                  {error.message}
                                </Typography>
                              )}
                            </>
                          );
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 3,
                        }}
                      >
                        <Typography sx={{ fontWeight: "bold" }}>
                          {getValues("image")?.name}
                        </Typography>
                        <IconButton
                          edge="end"
                          onClick={() => {
                            resetField("image");
                            setImgUrl(null);
                            setFileUploaded(false);
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </Box>
                    )}
                  </div>
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
            {user?.role === "Admin" ? (
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
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
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
                  `Save`
                )}
              </Button>
            )}

            {user?.role === "Admin" ? (
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
            ) : (
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
            )}
          </Box>
        </Box>
        <br />
      </Box>
    </Container>
  );
}

export default OrderRequestForm;
