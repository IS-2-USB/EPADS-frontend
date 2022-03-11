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
        <Route path="/" element={<Login />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sign-up" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
