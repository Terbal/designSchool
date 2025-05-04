// src/theme.js

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3F51B5", // Bleu plus vif
      light: "#7986CB",
      dark: "#303F9F",
    },
    secondary: {
      main: "#4CAF50", // Vert plus soutenu
      light: "#81C784",
      dark: "#388E3C",
    },
    background: {
      default: "#F8F9FA", // Gris très clair
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
    },

    h3: { fontFamily: "Poppins, sans-serif" },
    h4: { fontFamily: "Poppins, sans-serif" },
    h5: { fontFamily: "Poppins, sans-serif" },
    h6: { fontFamily: "Poppins, sans-serif" },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
        },
      },
    },
  },
});

export default theme;
