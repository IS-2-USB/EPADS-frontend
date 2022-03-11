import "./App.scss";
import Dashboard from "./views/Dashboard/Dashboard";
import Login from "./views/login/Login.js";
import SignUp from "./views/signUp/signUp.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  /*return (
    <>
      <SignUp />
    </>
    /*<>
      <Login />
    </>
    <>
      <Dashboard />
    </>
  );*/
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/sign-up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
