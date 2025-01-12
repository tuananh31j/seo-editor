import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import "./index.css";
import "@mantine/core/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider
      classNamesPrefix="mantine"
      withGlobalClasses
      withCssVariables
      deduplicateCssVariables
    >
      <App />
    </MantineProvider>
  </StrictMode>
);
