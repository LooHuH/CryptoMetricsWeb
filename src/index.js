import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./home";
import Convert from "./convert";
import Header from "./modules/header";
import "./css/index.css";

const root = ReactDOMClient.createRoot(document.getElementById("root"));

const mainPath = `/`;
const convertPath = `/convert`;

const App = () => {
  return (
    <div className={`body`}>
      <Router>
        <Header />
        <Routes>
          <Route path={mainPath} element={<Home />} />
          <Route path={convertPath} element={<Convert />} />
        </Routes>
      </Router>
    </div>
  );
};

root.render(<App />);
