import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import NavDrawer from "./NavDrawer";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/Slices/authSlice";
import ResetPasswordDialog from "./Forms/ResetPasswordForm";

export default function AppBarDrawer(props: { title: string }) {
  // const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [navDrawerOpen, setNavDrawerOpen] = React.useState<boolean>(false);
  const [resetPwOpen, setresetPwOpen] = React.useState<boolean>(false);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setAuth(event.target.checked);
  // };

  const dispatch = useDispatch();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawerOpen = () => {
    setNavDrawerOpen(true);
  };

  const drawerClose = () => {
    setNavDrawerOpen(false);
  };

  const handleLogOut = () => {
    dispatch(logOut());
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
  };

  const handleClickResetPW = () => {
    setresetPwOpen(true);
    handleClose();
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={drawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {props.title}
            </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClickResetPW}>Reset Password</MenuItem>
                <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <NavDrawer open={navDrawerOpen} onClose={drawerClose} />
      <ResetPasswordDialog
        open={resetPwOpen}
        handleClose={() => setresetPwOpen(false)}
      />
    </>
  );
}
