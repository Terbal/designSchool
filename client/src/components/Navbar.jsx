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
  ListItemIcon,
  Box,
  useTheme,
  Slide,
  useScrollTrigger,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ChatIcon from "@mui/icons-material/Chat";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const location = useLocation();
  const trigger = useScrollTrigger({ threshold: 100 });
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const progress =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      setScrollProgress(progress);
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDrawer = (state) => () => setOpen(state);

  if (loading) return null; // ✅ évite le flash avant que l'auth soit prête

  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <div>
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              height: 4,
              width: `${scrollProgress}%`,
              backgroundColor: theme.palette.secondary.main,
              zIndex: 1201,
              transition: "width 0.2s ease-out",
            }}
          />
          <AppBar
            position="fixed"
            elevation={scrolled ? 4 : 0}
            sx={{
              background: isHomePage
                ? scrolled
                  ? theme.palette.primary.main
                  : "transparent"
                : theme.palette.primary.main,
              color: "white",
              backdropFilter: isHomePage && !scrolled ? "blur(10px)" : "none",
              transition: "all 0.4s ease",
              height: scrolled ? 64 : 80,
              justifyContent: "center",
            }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              {/* Logo + Slogan */}
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, fontFamily: "Poppins" }}
                >
                  école de design
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 12,
                    fontWeight: 300,
                    opacity: 0.8,
                    marginTop: "-4px",
                    fontStyle: "italic",
                  }}
                >
                  Développez votre créativité.
                </Typography>
              </Box>

              {/* Boutons Desktop */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                {user ? (
                  <>
                    {navButton("/", "Accueil")}
                    {navButton("/dashboard", "Dashboard")}
                    {navButton("/profil", "Profil")}
                    {navButton("/messagerie", "Messagerie")}
                    {navButtonLogout("Déconnexion")}
                  </>
                ) : (
                  <>
                    {navButton("/login", "Connexion")}
                    {navButton("/signup", "Inscription")}
                  </>
                )}
              </Box>

              {/* Menu Mobile */}
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <IconButton
                  onClick={toggleDrawer(true)}
                  sx={{ color: "white" }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
        </div>
      </Slide>

      {/* Drawer Mobile */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            {user ? (
              <>
                {drawerLink("/", <HomeIcon />, "Accueil")}
                {drawerLink("/dashboard", <DashboardIcon />, "Dashboard")}
                {drawerLink("/profil", <PersonIcon />, "Profil")}
                {drawerLink("/messagerie", <ChatIcon />, "Messagerie")}
                <Divider sx={{ my: 1 }} />
                {drawerButton(logout, <ExitToAppIcon />, "Déconnexion")}
              </>
            ) : (
              <>
                {drawerLink("/", <HomeIcon />, "Accueil")}
                {drawerLink("/login", <LoginIcon />, "Connexion")}
                {drawerLink("/signup", <HowToRegIcon />, "Inscription")}
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

// Composants auxiliaires
const navButton = (to, label) => (
  <Button
    component={Link}
    to={to}
    sx={{
      color: "white",
      fontWeight: 600,
      px: 2,
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.1)",
        transform: "scale(1.05)",
      },
      transition: "all 0.3s ease",
    }}
  >
    {label}
  </Button>
);

const navButtonLogout = (label) => (
  <Button
    onClick={() => {
      localStorage.clear();
      window.location.reload();
    }}
    sx={{
      color: "white",
      fontWeight: 600,
      px: 2,
      "&:hover": {
        backgroundColor: "#FF8A80",
        transform: "scale(1.05)",
      },
      transition: "all 0.3s ease",
    }}
  >
    {label}
  </Button>
);

const drawerLink = (to, icon, label) => (
  <ListItem button component={Link} to={to}>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={label} />
  </ListItem>
);

const drawerButton = (action, icon, label) => (
  <ListItem button onClick={action}>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={label} />
  </ListItem>
);

export default Navbar;
