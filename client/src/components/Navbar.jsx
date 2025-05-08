import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Badge,
  Divider,
  Avatar,
  Typography,
  useTheme,
  useScrollTrigger,
  Slide,
  CssBaseline,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  Login as LoginIcon,
  HowToReg as HowToRegIcon,
  Chat as ChatIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ColorModeContext } from "../contexts/ColorModeContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const theme = useTheme();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const trigger = useScrollTrigger({ threshold: 0 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Met à jour la progression de scroll (pour la barre et le style)
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const fullHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min((scrolled / fullHeight) * 100, 100));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return null;
  const scrolled = scrollProgress > 0;
  const isActive = (path) => location.pathname === path;

  const desktopLinks = user
    ? [
        { to: "/", label: "Accueil", icon: <HomeIcon /> },
        { to: "/dashboard", label: "Tableau de bord", icon: <DashboardIcon /> },
        { to: "/profil", label: "Profil", icon: <PersonIcon /> },
      ]
    : [
        { to: "/login", label: "Connexion", icon: <LoginIcon /> },
        { to: "/signup", label: "S'inscrire", icon: <HowToRegIcon /> },
      ];

  const drawerItems = user
    ? [
        { to: "/", label: "Accueil", icon: <HomeIcon /> },
        { to: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
        { to: "/messagerie", label: "Messages", icon: <ChatIcon />, badge: 2 },
        {
          action: logout,
          label: "Déconnexion",
          icon: <ExitToAppIcon />,
          variant: "action",
        },
      ]
    : [
        { to: "/", label: "Accueil", icon: <HomeIcon /> },
        { to: "/login", label: "Connexion", icon: <LoginIcon /> },
        { to: "/signup", label: "S'inscrire", icon: <HowToRegIcon /> },
      ];

  return (
    <>
      <CssBaseline />

      {/* Barre de progression */}
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

      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backdropFilter: isHomePage && !scrolled ? "blur(8px)" : "none", // Blur uniquement en haut
            background: isHomePage
              ? scrolled
                ? theme.palette.background.paper
                : "rgba(255, 255, 255, 0.1)"
              : theme.palette.background.paper,
            color:
              isHomePage && !scrolled ? "white" : theme.palette.text.primary,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            height: 70,
            borderBottom: scrolled
              ? `1px solid ${theme.palette.divider}`
              : "none",
          }}
        >
          <Toolbar
            sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}
          >
            <Box
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                École de Design
              </Typography>
            </Box>

            {/* Liens bureau */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {desktopLinks.map(({ to, label, icon }) => (
                <Button
                  key={to}
                  component={Link}
                  to={to}
                  startIcon={icon}
                  sx={{
                    color: isActive(to)
                      ? theme.palette.secondary.main
                      : "inherit",
                    fontWeight: isActive(to) ? 700 : 600,
                    px: 2,
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  {label}
                </Button>
              ))}

              {user && (
                <IconButton
                  component={Link}
                  to="/messagerie"
                  sx={{ color: "inherit" }}
                >
                  <Badge badgeContent={2} color="secondary">
                    <ChatIcon />
                  </Badge>
                </IconButton>
              )}

              {/* Toggle thema */}
              <IconButton onClick={toggleColorMode} color="inherit">
                {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>

              {user && (
                <IconButton onClick={logout} color="inherit">
                  <ExitToAppIcon />
                </IconButton>
              )}
            </Box>

            {/* Menu mobile */}
            <IconButton
              edge="end"
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: "flex", md: "none" }, color: "inherit" }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Slide>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: theme.palette.background.paper },
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
                mb: 2,
                p: 1,
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

          <List>
            {drawerItems.map((item) => (
              <ListItem
                key={item.label}
                button
                component={item.to ? Link : "div"}
                to={item.to}
                onClick={() => {
                  if (item.action) item.action();
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: isActive(item.to)
                    ? theme.palette.action.selected
                    : "transparent",
                  color: theme.palette.text.primary,
                  "&:hover": { bgcolor: theme.palette.action.hover },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="secondary">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.to) ? 700 : 500,
                  }}
                />
              </ListItem>
            ))}

            <Divider sx={{ my: 1 }} />

            {/* Toggle mode dans Drawer */}
            <ListItem button onClick={toggleColorMode} sx={{ borderRadius: 2 }}>
              <ListItemIcon>
                {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
              </ListItemIcon>
              <ListItemText
                primary={mode === "light" ? "Mode Sombre" : "Mode Clair"}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
