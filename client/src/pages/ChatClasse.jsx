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
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../contexts/AuthContext"; // si dispo

const socket = io("http://localhost:5000");

const ChatClasse = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

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

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        px: 2,
        py: 1,
        bgcolor: "#f0f2f5",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, mt: 1 }}>
        💬 Chat de Classe
      </Typography>
      <Divider />

      {/* Messages */}
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
                  msg.sender === (user?.name || "Moi") ? "#e3f2fd" : "#f5f5f5",
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
  );
};

export default ChatClasse;
