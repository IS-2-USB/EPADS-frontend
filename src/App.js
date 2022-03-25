import "./App.scss";
import Dashboard from "./views/Dashboard/Dashboard";
import UserControl from "./views/UserControl/UserControl.js";
import Login from "./views/login/Login.js";
import Logger from "./views/Logger/Logger.js"
import SignUp from "./views/signUp/signUp.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import PrivateRoute from "./auth/PrivateRoute";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
const theme = createTheme();

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
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
                element={
                  <PrivateRoute redirectTo="/" Component={UserControl} />
                }
              />
              <Route
                exact
                path="/logger"
                element={
                  <PrivateRoute redirectTo="/" Component={Logger} />
                }
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
