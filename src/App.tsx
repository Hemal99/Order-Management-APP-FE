import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./views/home.view";
import Login from "./views/login.view";
import RequireAuth from "./components/Requireauth";
import Unauthorized from "./views/unauthorized.view";
import OrderRequest from "./views/orderRequest.view";

import Auth from "./components/Auth/Auth";
import Users from "./views/users.view";
import { selectCurrentUser } from "./redux/Slices/authSlice";
import { useSelector } from "react-redux";
import PermissibleRender from "./components/PermissibleRender";
import SnackBar from "./components/Feedback/SnackBar";
import Logs from "./views/logs.view";

function App() {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <div className="app">
      <Auth>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            {/* protected routes */}
            <Route element={<RequireAuth allowedRoles={["admin"]} />}>
              <Route path="/" element={<Home />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/order-request" element={<OrderRequest />} />
              <Route
                path="/users"
                element={
                  <PermissibleRender
                    userPermissions={currentUser?.role}
                    requiredPermissions="Admin"
                  >
                    <Users />
                  </PermissibleRender>
                }
              />
            </Route>
          </Routes>
        </Router>
        <SnackBar />
      </Auth>
    </div>
  );
}

export default App;
