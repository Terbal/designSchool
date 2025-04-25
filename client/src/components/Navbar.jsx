// src/components/Navbar.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // après 50px de scroll => devient opaque
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: scrolled ? "#1976D2" : "transparent",
          transition: "background 0.3s",
          boxShadow: scrolled ? 3 : "none",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontFamily: "Poppins",
              fontWeight: 600,
              color: "white",
            }}
          >
            école de design
          </Typography>

          {/* Desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {user ? (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/dashboard"
                  sx={{
                    color: "white",
                    "&:hover": {
                      color: "#BBDEFB",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/profil"
                  sx={{
                    color: "white",
                    "&:hover": {
                      color: "#BBDEFB",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Mon Profil
                </Button>
                <Button
                  color="inherit"
                  onClick={logout}
                  sx={{
                    color: "white",
                    "&:hover": {
                      color: "#FF8A80",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{
                    color: "white",
                    "&:hover": {
                      color: "#BBDEFB",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Connexion
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/signup"
                  sx={{
                    color: "white",
                    "&:hover": {
                      color: "#BBDEFB",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Inscription
                </Button>
              </>
            )}
          </Box>

          {/* Mobile */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <IconButton onClick={toggleDrawer(true)} sx={{ color: "white" }}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer menu */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            {user ? (
              <>
                <ListItem button component={Link} to="/dashboard">
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/profil">
                  <ListItemText primary="Mon Profil" />
                </ListItem>
                <ListItem button onClick={logout}>
                  <ListItemText primary="Déconnexion" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/login">
                  <ListItemText primary="Connexion" />
                </ListItem>
                <ListItem button component={Link} to="/signup">
                  <ListItemText primary="Inscription" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
