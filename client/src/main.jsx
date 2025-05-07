// src/main.jsx
import { StrictMode, useContext, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { getDesignSchoolTheme } from "./theme";
import {
  ColorModeProvider,
  ColorModeContext,
} from "./contexts/ColorModeContext.jsx";

function Main() {
  // On récupère mode et toggle du contexte
  const { mode } = useContext(ColorModeContext);

  // Memoize le thème pour ne pas le recréer inutilement
  const theme = useMemo(() => getDesignSchoolTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ColorModeProvider>
          <Main />
        </ColorModeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
