import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./general.css";
import "./i18n";
import "./rtl.css";
document.documentElement.setAttribute("data-theme", "dark");
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
