import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import { BrowserRouter } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/login.component";
import SignUp from "./components/register.component";


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={ <App /> }/>
        {/* <Route path="/sign-in" element={<Login />} /> */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path='/sign-in'
          element={<Login authed={true}/>}
        />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);