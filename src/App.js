import "./App.scss";
import Dashboard from "./views/Dashboard/Dashboard";
import UserControl from "./views/UserControl/UserControl.js";
import Login from "./views/login/Login.js";
import SignUp from "./views/signUp/signUp.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import PrivateRoute from "./auth/PrivateRoute";
import React from "react";
const theme = createTheme();

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/sign-up" element={<SignUp />} />
            <Route
              exact
              path="/dashboard"
              element={<PrivateRoute redirectTo="/" Component={Dashboard} />}
            />
            <Route
              exact
              path="/users"
              element={<PrivateRoute redirectTo="/" Component={UserControl} />}
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
