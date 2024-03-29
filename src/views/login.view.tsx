import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/Slices/authSlice";
import { useLoginMutation } from "../api/auth.api";
import { useForm, SubmitHandler } from "react-hook-form";
import { anonymousSignIn } from "../firebase";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Order Management App
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

type Inputs = {
  email: string;
  password: string;
};

type LoginError = {
  status: number;
  data: {
    msg: string;
  };
};

type serverError = {
  status: string;
  error: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [loginErr, setLoginErr] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  console.log(watch("email"));

  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    const { email, password } = data;
    setLoginErr("");

    try {
      const userData = await login({
        email: email,
        password: password,
      }).unwrap();
      await anonymousSignIn();
      dispatch(
        setCredentials({
          user: {
            name: userData.firstName,
            email: userData.email,
            role: userData.role,
            id: userData.id,
            isEmailVerified: false,
          },
          accessToken: userData.signature,
        })
      );

      sessionStorage.setItem("user", JSON.stringify(userData));

      sessionStorage.setItem("accessToken", userData.signature);

      navigate("/");
    } catch (error) {
      if ((error as serverError).status === "FETCH_ERROR") {
        setLoginErr("server Unavailable");
      } else {
        setLoginErr((error as LoginError).data?.msg);
      }
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 12,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1, width: "80%", mx: "auto" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Typography variant="overline" display="block" gutterBottom>
              {loginErr}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1, height: "48px" }}
            >
              {isLoading ? (
                <Box sx={{ display: "flex" }}>
                  <CircularProgress color="inherit" size={28} />
                </Box>
              ) : (
                <>Sign In </>
              )}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
