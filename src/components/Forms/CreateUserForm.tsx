import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import axiosInstance from "../../utils/axios";
import { useDispatch } from "react-redux";
import { setSnackbarOpen } from "../../redux/Slices/snackBarslice";

type FormValues = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
};

const accessLevels = [
  {
    label: "Admin",
    value: "Admin",
  },
  {
    label: "Requester",
    value: "Requester",
  },
  {
    label: "Purchaser",
    value: "Purchaser",
  },
];

export default function CreateUserForm(props: {
  open: boolean;
  handleClose: () => void;
}) {
  const { open, handleClose } = props;

  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const dispatch = useDispatch();

  const createUser: SubmitHandler<FormValues> = async (data) => {
    try {
      const res = await axiosInstance.post("/user/signup", data);
      console.log(res);
      dispatch(
        setSnackbarOpen({ text: "User Created Successfully", type: "success" })
      );
      handleClose();
    } catch (error) {
      dispatch(
        setSnackbarOpen({
          text: "Failed to Create User",
          type: "error",
        })
      );
    }
  };

  const handleCancel = () => {
    handleClose();
    reset();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ mt: 1 }}
        fullWidth
        maxWidth="sm"
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(createUser)}
          sx={{ mt: 1 }}
        >
          <DialogTitle>Create New User </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} columnSpacing={2}>
              <Grid item xs={6}>
                <Controller
                  rules={{ required: "First Name is Required" }}
                  name="firstName"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      helperText={error ? error.message : null}
                      error={!!error}
                      onChange={onChange}
                      value={value}
                      margin="dense"
                      size="small"
                      id="name"
                      label="First Name"
                      variant="outlined"
                      autoComplete="email"
                      fullWidth
                      placeholder="First Name"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      helperText={error ? error.message : null}
                      error={!!error}
                      onChange={onChange}
                      value={value}
                      margin="dense"
                      size="small"
                      id="lastname"
                      label="Last Name"
                      variant="outlined"
                      fullWidth
                      placeholder="Last Name"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  rules={{
                    required: "Email is Required.",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Entered value does not match email format",
                    },
                  }}
                  name="email"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      helperText={error ? error.message : null}
                      error={!!error}
                      onChange={onChange}
                      value={value}
                      margin="dense"
                      size="small"
                      id="name"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      placeholder="Email"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  rules={{ required: "Password is Required." }}
                  name="password"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      helperText={error ? error.message : null}
                      error={!!error}
                      onChange={onChange}
                      value={value}
                      margin="dense"
                      size="small"
                      id="password"
                      label="Set Password"
                      variant="outlined"
                      fullWidth
                      placeholder="********"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel component="p">Access Level</FormLabel>
                <Controller
                  name={"role"}
                  rules={{ required: "Access Level is required" }}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup value={value} onChange={onChange}>
                      <Grid
                        container
                        direction="row"
                        justifyContent="start"
                        alignItems="center"
                      >
                        {accessLevels.map((accessLevel, index) => (
                          <Grid item xs={3} key={index}>
                            <FormControlLabel
                              value={accessLevel.value}
                              label={accessLevel.label}
                              control={<Radio />}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </RadioGroup>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ mb: 1 }}>
            <Button variant="outlined" color="primary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit">
              Create User
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
