import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/authContext";
function PrivateRoute({ Component, redirectTo }) {
  const { state } = useAuth();
  return state.token ? <Component /> : <Navigate to={redirectTo} replace />;
}

PrivateRoute.propTypes = {
  Component: PropTypes.any.isRequired,
  redirectTo: PropTypes.string,
};

export default PrivateRoute;
