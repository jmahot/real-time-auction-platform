import React from "react";
import ReactDOM from "react-dom/client";
import RootApp from "./App";
import "./styles.css"; // si tu as un fichier CSS global

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
