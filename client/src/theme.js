// src/theme.js
import { createTheme } from "@mui/material/styles";

export const getDesignSchoolTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode, // clé : light | dark
      primary: {
        main: "#3F51B5",
        light: "#7986CB",
        dark: "#303F9F",
      },
      secondary: {
        main: "#4CAF50",
        light: "#81C784",
        dark: "#388E3C",
      },
      background: {
        // MUI choisit par défaut selon `mode`
        default: mode === "light" ? "#F8F9FA" : "#121212",
        paper: mode === "light" ? "#FFFFFF" : "#1D1D1D",
      },
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      h1: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
      h2: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
      h3: { fontFamily: "Poppins, sans-serif" },
      h4: { fontFamily: "Poppins, sans-serif" },
      h5: { fontFamily: "Poppins, sans-serif" },
      h6: { fontFamily: "Poppins, sans-serif" },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { transition: "all 0.2s ease" },
        },
      },
    },
  });

export default getDesignSchoolTheme;
