import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { useForm, SubmitHandler, Controller, set } from "react-hook-form";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/Slices/authSlice";
import axiosInstance from "../../utils/axios";
import { useDispatch } from "react-redux";
import { setSnackbarOpen } from "../../redux/Slices/snackBarslice";
import { logOut } from "../../redux/Slices/authSlice";

type FormValues = {
  password?: string;
  confirmPassword?: string;
};

export default function ResetPasswordDialog(props: {
  open: boolean;
  handleClose: () => void;
}) {
  const { open, handleClose } = props;
  const dispatch = useDispatch();

  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const currentUser = useSelector(selectCurrentUser);

  const resetPassword: SubmitHandler<FormValues> = async (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const res = await axiosInstance.post("/user/reset-password", {
        email: currentUser?.email,
        newPassword: data.password,
      });
      console.log(res);
      handleCancel();
      dispatch(
        setSnackbarOpen({
          text: "Password Successfully changed.",
          type: "success",
        })
      );
      setTimeout(() => {
        dispatch(logOut());
      }, 3000);
    } catch (error) {
      console.log(error);
      dispatch(
        setSnackbarOpen({ text: "Something went wrong", type: "error" })
      );
    }
  };
  const handleCancel = () => {
    handleClose();
    reset();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(resetPassword)}
          sx={{ mt: 1 }}
        >
          <DialogTitle>Reset your password</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>
              Please enter your New Password in both the fileds below. After
              Password reset , you will be logged out and you will have to log
              backin with the new password.
            </DialogContentText>
            <Controller
              rules={{ required: "New Password can not be empty." }}
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
                  id="name"
                  label="New Password"
                  variant="outlined"
                  autoComplete="email"
                  fullWidth
                  placeholder="Enter your new password"
                />
              )}
            />
            <Controller
              rules={{ required: "This Field can not be empty." }}
              name="confirmPassword"
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
                  id="name"
                  label="Confirm Password"
                  variant="outlined"
                  autoComplete="email"
                  fullWidth
                  placeholder="Re-enter your new password"
                />
              )}
            />
          </DialogContent>
          <DialogActions sx={{ mb: 1 }}>
            <Button variant="outlined" color="primary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit">
              Reset Password
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
