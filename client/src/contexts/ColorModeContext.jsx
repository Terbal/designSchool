// src/contexts/ColorModeContext.jsx
import { createContext, useState, useMemo, useEffect } from "react";

export const ColorModeContext = createContext({
  mode: "light",
  toggleColorMode: () => {},
});

export function ColorModeProvider({ children }) {
  // 1. init depuis localStorage ou fallback light
  const [mode, setMode] = useState(
    () => localStorage.getItem("ds-mode") || "light"
  );

  // 2. persister à chaque changement
  useEffect(() => {
    localStorage.setItem("ds-mode", mode);
  }, [mode]);

  // 3. fonction toggle
  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      {children}
    </ColorModeContext.Provider>
  );
}
