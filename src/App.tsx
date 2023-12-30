import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./views/home.view";
import Login from "./views/login.view";
import RequireAuth from "./components/Requireauth";
import Unauthorized from "./views/unauthorized.view";
import OrderRequest from "./views/orderRequest.view";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* protected routes */}
          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route path="/" element={<Home />} />
            <Route path="/order-request" element={<OrderRequest />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
