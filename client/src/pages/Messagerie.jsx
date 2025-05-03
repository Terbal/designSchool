// src/pages/Messagerie.jsx
import { useEffect, useState, useRef } from "react";
import {
  Box,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Paper,
  Stack,
  Fab,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ListItemButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import io from "socket.io-client";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

const API_BASE_URL = "http://localhost:5000";
const socket = io(API_BASE_URL);

const Messagerie = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md")); // md = 960px
  const [showChat, setShowChat] = useState(false);

  // Messagerie
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredConvs, setFilteredConvs] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Option B
  const [step, setStep] = useState("none");
  const [courses, setCourses] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  // ⚙️ Fetch conversations
  useEffect(() => {
    if (user) {
      axios
        .get(`${API_BASE_URL}/api/conversations/${user.id}`)
        .then((res) => {
          const data = Array.isArray(res.data)
            ? res.data
            : res.data.conversations || [];
          const convs = data.map((c) => ({
            id: c.conversationId,
            name: c.otherName,
            type: c.type || "private",
          }));
          setConversations(convs);
        })
        .catch(console.error);
    }
  }, [user]);

  // Filtrer
  useEffect(() => {
    setFilteredConvs(
      conversations.filter((conv) =>
        conv.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, conversations]);

  // Fetch messages + join room
  useEffect(() => {
    if (currentConv) {
      axios
        .get(`${API_BASE_URL}/api/messages/${currentConv.id}`)
        .then((res) => setMessages(res.data))
        .catch(console.error);
      socket.emit("joinConversation", currentConv.id);
    }
  }, [currentConv]);

  // New message listener
  useEffect(() => {
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("newMessage");
  }, []);

  // Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Envoyer
  const handleSend = () => {
    if (!message.trim() || !currentConv) return;
    socket.emit("sendMessage", {
      conversationId: currentConv.id,
      senderId: user.id,
      text: message,
    });
    setMessage("");
  };

  // + pour mobile/tablette/desktop
  const handlePlus = async () => {
    try {
      setStep("chooseCourse");
      const res = await axios.get(`${API_BASE_URL}/api/users/${user.id}/cours`);
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectCourse = async (coursId) => {
    try {
      setStep("chooseUser");
      const res = await axios.get(
        `${API_BASE_URL}/api/cours/${coursId}/utilisateurs`
      );
      const formateurs = res.data.filter((u) => u.role === "formateur");
      const etudiants = res.data.filter((u) => u.role === "etudiant");
      setAvailableUsers([...formateurs, ...etudiants]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectUser = async (user2_id) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/conversations/new`, {
        user1_id: user.id,
        user2_id,
      });
      const conv = {
        id: res.data.conversationId,
        name: availableUsers.find((u) => u.id === user2_id)?.nom || "Privée",
        type: "private",
      };
      setConversations((prev) => [...prev, conv]);
      setCurrentConv(conv);
    } catch (err) {
      console.error(err);
    } finally {
      setStep("none");
    }
  };

  // Contrôle de l'affichage mobile
  const showSidebar = !isMobile || (isMobile && !currentConv);
  // const showChat = !isMobile || (isMobile && !!currentConv);

  return (
    <Box sx={{ display: "flex", height: "100vh", position: "relative" }}>
      <Navbar />
      {(!isMobileOrTablet || !showChat) && (
        <Box
          sx={{
            width: isMobileOrTablet ? "100%" : "30%",
            bgcolor: "#ffffff",
            borderRight: "1px solid #ddd",
            p: 2,
            pt: 11,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <TextField
            placeholder="Recherche..."
            variant="outlined"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <List>
            {filteredConvs.map((conv) => (
              <ListItem disablePadding key={conv.id}>
                <ListItemButton
                  selected={currentConv?.id === conv.id}
                  onClick={() => {
                    setCurrentConv(conv);
                    if (isMobileOrTablet) setShowChat(true);
                  }}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    "&.Mui-selected": { bgcolor: "#e3f2fd" },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>{conv.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={conv.name} secondary={conv.type} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Bouton + */}
          <Fab
            color="primary"
            onClick={handlePlus}
            sx={{
              position: "fixed",
              bottom: 16,
              left: isMobile ? "50%" : 16,
              transform: isMobile ? "translateX(-50%)" : "none",
            }}
          >
            <AddIcon />
          </Fab>
        </Box>
      )}

      {(!isMobileOrTablet || showChat) && (
        <Box
          sx={{
            flexGrow: 1,
            width: isMobileOrTablet ? "100%" : "70%",
            p: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {isMobileOrTablet && (
            <IconButton
              onClick={() => setShowChat(false)}
              sx={{ mb: 1, pt: 5 }}
            >
              ←
            </IconButton>
          )}

          {/* En mobile, bouton retour */}
          {/* {isMobile && currentConv && (
            <IconButton onClick={() => setCurrentConv(null)}>
              <ArrowBackIosIcon />
            </IconButton>
          )} */}

          {/* Chat header */}

          {currentConv && (
            <Typography
              variant="h6"
              sx={{ p: 2, borderBottom: "1px solid #ddd" }}
            >
              {currentConv.name}
            </Typography>
          )}

          {/* Messages ou instruction */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              bgcolor: currentConv ? "#f0f2f5" : "inherit",
              overflowY: currentConv ? "auto" : "visible",
            }}
          >
            {currentConv ? (
              <Stack spacing={1}>
                {messages.map((msg) => {
                  const mine = Number(msg.senderId) === user.id;
                  return (
                    <Box
                      key={msg.id}
                      sx={{
                        alignSelf: mine ? "flex-end" : "flex-start",
                        bgcolor: mine ? "#1976d2" : "#e0e0e0",
                        color: mine ? "#fff" : "#000",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        maxWidth: "70%",
                      }}
                    >
                      <Typography variant="body2">{msg.text}</Typography>
                    </Box>
                  );
                })}
                <div ref={messagesEndRef} />
              </Stack>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                }}
              >
                <Typography>
                  Sélectionnez une conversation pour commencer
                </Typography>
              </Box>
            )}
          </Box>

          {/* Input */}
          {currentConv && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ p: 2, borderTop: "1px solid #ddd" }}
            >
              <TextField
                fullWidth
                size="small"
                value={message}
                placeholder="Tapez un message..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
                multiline
                maxRows={6} // Limite à environ 6 lignes visibles
                sx={{
                  "& .MuiInputBase-root": {
                    overflowY: "auto",
                    maxHeight: 150, // Limite physique du champ
                  },
                }}
              />

              <IconButton color="primary" onClick={handleSend}>
                <SendIcon />
              </IconButton>
            </Stack>
          )}
        </Box>
      )}

      {/* Modal 1 */}
      <Dialog
        open={step === "chooseCourse"}
        onClose={() => setStep("none")}
        fullWidth
      >
        <DialogTitle>Choisissez un cours</DialogTitle>
        <DialogContent dividers>
          {courses.map((c) => (
            <ListItemButton key={c.id} onClick={() => handleSelectCourse(c.id)}>
              <ListItemText primary={c.titre} />
            </ListItemButton>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStep("none")}>Annuler</Button>
        </DialogActions>
      </Dialog>

      {/* Modal 2 */}
      <Dialog
        open={step === "chooseUser"}
        onClose={() => setStep("none")}
        fullWidth
      >
        <DialogTitle>Avec qui parler ?</DialogTitle>
        <DialogContent dividers>
          {availableUsers.map((u) => (
            <ListItemButton key={u.id} onClick={() => handleSelectUser(u.id)}>
              <ListItemText
                primary={u.nom}
                secondary={u.role === "formateur" ? "Formateur" : "Étudiant"}
              />
            </ListItemButton>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStep("none")}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Messagerie;
