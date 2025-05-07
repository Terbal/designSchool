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
  const trigger = useScrollTrigger({ threshold: 50 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { mode, toggleColorMode } = useContext(ColorModeContext);

  if (loading) return null;

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

  const renderDesktop = () => (
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
            color: isActive(to) ? theme.palette.secondary.main : "inherit",
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
        <IconButton component={Link} to="/messagerie" sx={{ color: "inherit" }}>
          <Badge badgeContent={2} color="secondary">
            <ChatIcon />
          </Badge>
        </IconButton>
      )}

      {/* Dark/Light Toggle */}
      <IconButton onClick={toggleColorMode} color="inherit">
        {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>

      {user && (
        <IconButton onClick={logout} color="inherit">
          <ExitToAppIcon />
        </IconButton>
      )}
    </Box>
  );

  const renderDrawer = () => (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{ sx: { width: 280, bgcolor: "background.paper" } }}
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
          {drawerItems.map((item) =>
            item.to ? (
              <ListItem
                key={item.label}
                button
                component={Link}
                to={item.to}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: isActive(item.to)
                    ? "action.selected"
                    : "transparent",
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
            ) : (
              <ListItem
                key={item.label}
                button
                onClick={() => {
                  item.action();
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  "&:hover": { bgcolor: "error.light" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            )
          )}

          <Divider sx={{ my: 1 }} />

          {/* Toggle Mode in Drawer */}
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
  );

  return (
    <>
      <CssBaseline />
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backdropFilter: "blur(12px)",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderBottom: trigger
              ? `1px solid ${theme.palette.divider}`
              : "none",
          }}
        >
          <Toolbar
            sx={{
              justifyContent: "space-between",
              px: { xs: 2, md: 4 },
              height: 64,
            }}
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

            {renderDesktop()}

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

      {renderDrawer()}
    </>
  );
}
