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
  Avatar,
  Badge,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
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
  // Modifier la fonction navButton
  const navButton = (to, label) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
      <Button
        component={Link}
        to={to}
        sx={{
          color: isActive ? theme.palette.secondary.main : "inherit",
          fontWeight: isActive ? 700 : 600,
          px: 2,
          borderRadius: 2,
          transition: "all 0.2s",
          position: "relative",
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: 4,
            left: "50%",
            transform: "translateX(-50%)",
            width: isActive ? "60%" : 0,
            height: 2,
            backgroundColor: theme.palette.secondary.main,
            transition: "width 0.2s",
          },
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.1)",
            transform: "translateY(-1px)",
            "&:after": {
              width: "60%",
            },
          },
        }}
      >
        {label}
      </Button>
    );
  };

  if (loading) return null;

  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <div>
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              height: 3,
              width: `${scrollProgress}%`,
              background: `linear-gradient(90deg, ${theme.palette.secondary.light} 0%, ${theme.palette.error.main} 100%)`,
              zIndex: 1201,
              transition: "width 0.2s ease-out",
              opacity: 0.9,
            }}
          />
          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              background: isHomePage
                ? scrolled
                  ? `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                  : "rgba(255, 255, 255, 0.05)"
                : `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              color: "white",
              backdropFilter: "blur(12px)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              height: 70,
              borderBottom: scrolled
                ? `1px solid ${theme.palette.divider}`
                : "none",
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                height: "100%",
                px: { xs: 2, md: 4 },
              }}
            >
              {/* Section Logo + Avatar Utilisateur */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                {/* Logo Section (existant) */}
                <Box
                  component={Link}
                  to="/"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "inherit",
                    gap: 1.5,
                  }}
                >
                  {/* ... (texte du logo existant) */}
                </Box>

                {/* Avatar Utilisateur (nouvel élément) */}

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: -0.5,
                  }}
                >
                  École de Design
                </Typography>
              </Box>

              {/* Desktop Navigation Modifiée */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1.5 }}>
                {user ? (
                  <>
                    {navButton("/", "Accueil")}
                    {navButton("/dashboard", "Dashboard")}
                    {/* Suppression du bouton Profil */}
                    <IconButton
                      component={Link}
                      to="/messagerie"
                      sx={{
                        color: "inherit",
                        position: "relative",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      <Badge
                        badgeContent={
                          /* À remplacer par messageCount du contexte */ 2
                        }
                        color="secondary"
                      >
                        <ChatIcon />
                      </Badge>
                    </IconButton>

                    <Tooltip title="Déconnexion" arrow>
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          overflow: "hidden",
                          width: 40, // largeur icône seule
                          transition: "width 0.3s ease",
                          "&:hover": {
                            width: 140, // s’étend pour montrer l’étiquette
                          },
                        }}
                      >
                        <Button
                          onClick={logout}
                          variant="text"
                          startIcon={<ExitToAppIcon />}
                          sx={{
                            color: theme.palette.warning.main,
                            justifyContent: "flex-start",
                            textTransform: "none",
                            fontWeight: 600,
                            px: 1,
                            py: 0.5,
                            minWidth: 0, // pour que width du parent s’applique
                            transition: "background-color 0.2s ease",
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        >
                          Déconnexion
                        </Button>
                      </Box>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    {navButton("/login", "Sign In", <LoginIcon />)}
                    <Button
                      component={Link}
                      to="/signup"
                      variant="contained"
                      color="secondary"
                      startIcon={<HowToRegIcon />}
                      sx={{
                        px: 2.5,
                        borderRadius: 2,
                        fontWeight: 700,
                        boxShadow: 3,
                        "&:hover": {
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </Box>

              {/* Mobile Menu Button */}
              <IconButton
                onClick={toggleDrawer(true)}
                sx={{
                  display: { xs: "flex", md: "none" },
                  color: "inherit",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
      </Slide>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: "background.paper",
            backgroundImage: "none",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {user && (
            <Box
              component={Link}
              to="/profil"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                textDecoration: "none",
                color: "text.primary",
              }}
            >
              <Avatar sx={{ width: 40, height: 40 }}>{user.nom[0]}</Avatar>
              <Box>
                <Typography variant="subtitle1">{user.nom}</Typography>
                <Typography variant="caption">{user.email}</Typography>
              </Box>
            </Box>
          )}

          <List sx={{ py: 0 }}>
            {user ? (
              <>
                {drawerLink("/", <HomeIcon />, "Home")}
                {drawerLink("/dashboard", <DashboardIcon />, "Dashboard")}
                {/* Suppression du lien Profil */}
                {drawerLink(
                  "/messagerie",
                  <Badge
                    badgeContent={/* À remplacer par messageCount */ 2}
                    color="secondary"
                  >
                    <ChatIcon />
                  </Badge>,
                  "Messages"
                )}
                <Divider sx={{ my: 2 }} />
                {drawerButton(logout, <ExitToAppIcon />, "Log Out")}
              </>
            ) : (
              <>
                {drawerLink("/", <HomeIcon />, "Home")}
                {drawerLink("/login", <LoginIcon />, "Sign In")}
                {drawerLink("/signup", <HowToRegIcon />, "Get Started")}
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

// Helper Components
const navButton = (to, label, icon) => (
  <Button
    component={Link}
    to={to}
    startIcon={icon}
    sx={{
      color: "inherit",
      fontWeight: 600,
      px: 2,
      borderRadius: 2,
      transition: "all 0.2s",
      "&:hover": {
        bgcolor: "rgba(255,255,255,0.1)",
        transform: "translateY(-1px)",
      },
    }}
  >
    {label}
  </Button>
);

const drawerLink = (to, icon, label) => (
  <ListItem
    button
    component={Link}
    to={to}
    sx={{
      borderRadius: 2,
      mb: 0.5,
      "&:hover": {
        bgcolor: "action.hover",
      },
    }}
  >
    <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
    <ListItemText
      primary={label}
      primaryTypographyProps={{ fontWeight: 500 }}
    />
  </ListItem>
);

const drawerButton = (action, icon, label) => (
  <ListItem
    button
    onClick={action}
    sx={{
      borderRadius: 2,
      mb: 0.5,
      "&:hover": {
        bgcolor: "error.light",
      },
    }}
  >
    <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
    <ListItemText
      primary={label}
      primaryTypographyProps={{ fontWeight: 500 }}
    />
  </ListItem>
);

export default Navbar;
