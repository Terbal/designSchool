import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  Typography,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useAuth } from "../contexts/AuthContext"; // si tu as un contexte

import { useNavigate } from "react-router-dom";

const NavbarChat = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth(); // ou adapte selon ton contexte
  const navigate = useNavigate();

  const toggleDrawer = () => setOpen(!open);

  const drawerLink = (path, icon, label) => (
    <Box
      onClick={() => {
        navigate(path);
        setOpen(false);
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.5,
        cursor: "pointer",
        "&:hover": { backgroundColor: "#f0f0f0" },
      }}
    >
      {icon}
      <Typography>{label}</Typography>
    </Box>
  );

  const drawerButton = (onClick, icon, label) => (
    <Box
      onClick={() => {
        onClick();
        setOpen(false);
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.5,
        cursor: "pointer",
        "&:hover": { backgroundColor: "#f0f0f0" },
      }}
    >
      {icon}
      <Typography>{label}</Typography>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>
            DesignSchool
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <List sx={{ width: 250 }}>
          {user ? (
            <>
              {drawerLink("/", <HomeIcon />, "Accueil")}
              {drawerLink("/dashboard", <DashboardIcon />, "Dashboard")}
              {drawerLink("/profil", <PersonIcon />, "Mon Profil")}
              {drawerLink("/chat", <ChatIcon />, "Chat de Classe")}
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
      </Drawer>
    </>
  );
};

export default NavbarChat;
