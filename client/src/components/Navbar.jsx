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
} from "@mui/material";
import { motion } from "framer-motion"; // <== NOUVEAU
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { user, logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const trigger = useScrollTrigger({ threshold: 100 });

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const progress =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      setScrolled(window.scrollY > 50);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <div>
          {/* ProgressBar */}
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

          {/* NAVBAR */}
          <AppBar
            position="fixed"
            elevation={0}
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
              display: "flex",
              justifyContent: "center",
              boxShadow: scrolled
                ? `0 2px ${Math.min(scrolled * 0.1, 8)}px rgba(0,0,0,0.3)`
                : "none",
            }}
          >
            <Toolbar>
              {/* LOGO - avec Motion (classique) */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ flexGrow: 1 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    color: "white",
                    transition: "color 0.3s ease",
                  }}
                >
                  école de design
                </Typography>
              </motion.div>

              {/* BOUTONS Desktop - avec whileInView */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                {user ? (
                  <>
                    {navButton("/dashboard", "Dashboard", 0.1)}
                    {navButton("/profil", "Mon Profil", 0.2)}
                    {navButtonLogout("Déconnexion", 0.3)}
                  </>
                ) : (
                  <>
                    {navButton("/login", "Connexion", 0.1)}
                    {navButton("/signup", "Inscription", 0.2)}
                  </>
                )}
              </Box>

              {/* Menu Burger Mobile */}
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

          <Box />
        </div>
      </Slide>

      {/* Drawer Menu Mobile */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        transitionDuration={{ enter: 400, exit: 300 }}
      >
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
                {drawerLink("/profil", <PersonIcon />, "Mon Profil")}
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

// --- Composants auxiliaires mis à jour ---

const navButton = (to, label, delay = 0) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
  >
    <Button
      component={Link}
      to={to}
      sx={{
        color: "white",
        fontWeight: 600,
        "&:hover": {
          color: "#BBDEFB",
          transform: "scale(1.05)",
        },
        transition: "all 0.3s ease",
      }}
    >
      {label}
    </Button>
  </motion.div>
);

const navButtonLogout = (label, delay = 0) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
  >
    <Button
      onClick={() => window.location.reload()}
      sx={{
        color: "white",
        fontWeight: 600,
        "&:hover": {
          color: "#FF8A80",
          transform: "scale(1.05)",
        },
        transition: "all 0.3s ease",
      }}
    >
      {label}
    </Button>
  </motion.div>
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
