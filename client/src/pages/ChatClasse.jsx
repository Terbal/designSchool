import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Divider,
  IconButton,
  Drawer,
  List,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const socket = io("http://localhost:5000");

const ChatClasse = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off("message");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        sender: user?.name || "Moi",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      socket.emit("message", newMessage);
      setMessage("");
    }
  };

  const drawerLink = (path, icon, label) => (
    <Box
      onClick={() => {
        navigate(path);
        setDrawerOpen(false);
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
        setDrawerOpen(false);
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
      {/* Barre en haut avec menu */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          bgcolor: "#1976d2",
          color: "white",
        }}
      >
        <Typography variant="h6">💬 Chat de Classe</Typography>
        <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
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

      {/* Contenu du chat */}
      <Box
        sx={{
          height: "calc(100vh - 56px)",
          display: "flex",
          flexDirection: "column",
          px: 2,
          py: 1,
          bgcolor: "#f0f2f5",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 1,
            mt: 1,
            bgcolor: "#fff",
          }}
        >
          <Stack spacing={1}>
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf:
                    msg.sender === (user?.name || "Moi")
                      ? "flex-end"
                      : "flex-start",
                  maxWidth: "85%",
                  bgcolor:
                    msg.sender === (user?.name || "Moi")
                      ? "#e3f2fd"
                      : "#f5f5f5",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "gray" }}
                >
                  {msg.sender}
                </Typography>
                <Typography variant="body1">{msg.text}</Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", textAlign: "right", color: "gray" }}
                >
                  {msg.time}
                </Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
        </Paper>

        {/* Zone de saisie */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 1, pt: 1, borderTop: "1px solid #ccc" }}
        >
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={sendMessage}
          >
            Envoyer
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default ChatClasse;
