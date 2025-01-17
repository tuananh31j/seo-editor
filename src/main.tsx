import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import "./index.css";
import "@mantine/core/styles.css";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider
      classNamesPrefix="mantine"
      withGlobalClasses
      withCssVariables
      deduplicateCssVariables
    >
      <App />
      <ToastContainer />
    </MantineProvider>
  </StrictMode>
);
