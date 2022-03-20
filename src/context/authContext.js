import { createContext, useContext, useEffect, useReducer } from "react";

const AppContext = createContext();

const initialState = {
  token: "",
  first_name: "",
  last_name: "",
  type: "",
  isLoading: false,
};

const manageAuth = (state, result) => {
  localStorage.setItem("user", JSON.stringify(result));
  return {
    ...state,
    first_name: result.first_name,
    last_name: result.last_name,
    token: result.token,
    id: result.id,
    type: result.type,
    isLoading: false,
  };
};
const manageInfo = (state, result) => {
  return {
    ...state,
    first_name: result.first_name,
    last_name: result.last_name,
    type: result.type,
    id: result.id,
    isLoggedIn: true,
    isLoading: false,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "userInfo":
      return manageInfo(state, action.payload);
    case "register":
      return manageAuth(state, action.payload);
    case "login":
      return manageAuth(state, action.payload);
    case "logout":
      localStorage.clear();
      return initialState;
    case "notLoading":
      return { ...state, isLoading: false };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducer,
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  const value = { state, dispatch };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
