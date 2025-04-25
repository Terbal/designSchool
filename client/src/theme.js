// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5C6BC0", // Bleu doux
    },
    secondary: {
      main: "#66BB6A", // Vert pastel
    },
    background: {
      default: "#F4F6F8", // Gris très clair
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: { fontFamily: "Poppins, sans-serif" },
    h2: { fontFamily: "Poppins, sans-serif" },
    h3: { fontFamily: "Poppins, sans-serif" },
    h4: { fontFamily: "Poppins, sans-serif" },
    h5: { fontFamily: "Poppins, sans-serif" },
    h6: { fontFamily: "Poppins, sans-serif" },
  },
});

export default theme;
