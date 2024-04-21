import React from "react";
import App from "./components/App";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";

ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById("root")
  );