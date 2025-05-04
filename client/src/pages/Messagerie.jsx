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
  Badge,
  Chip,
  Divider,
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

  // Ajoutez cette fonction au début du composant
  const formatMessageTime = (timestamp) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    if (isNaN(date)) return "--:--";

    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          // Conversion sécurisée de la date
          createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
        },
      ]);
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
    <Box
      sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}
    >
      <Navbar />

      {/* Conversation List */}
      {(!isMobileOrTablet || !showChat) && (
        <Box
          sx={{
            width: isMobileOrTablet ? "100%" : 360,
            borderRight: `1px solid ${theme.palette.divider}`,
            height: "100vh",
            pt: 8,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ p: 2, bgcolor: "background.paper" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher une conversation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 4 },
              }}
            />
          </Box>

          <List sx={{ flex: 1, overflow: "auto", p: 1 }}>
            {filteredConvs.map((conv) => (
              <ListItem key={conv.id} disablePadding>
                <ListItemButton
                  selected={currentConv?.id === conv.id}
                  onClick={() => {
                    setCurrentConv(conv);
                    if (isMobileOrTablet) setShowChat(true);
                  }}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                      "&:hover": { bgcolor: "action.selected" },
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      variant="dot"
                      color="success"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    >
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {conv.name.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={conv.name}
                    primaryTypographyProps={{ fontWeight: 500 }}
                    secondary={
                      <Chip
                        label={conv.type === "private" ? "Privé" : "Groupe"}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.7rem",
                          bgcolor:
                            conv.type === "private"
                              ? "primary.light"
                              : "secondary.light",
                        }}
                      />
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Fab
            color="primary"
            onClick={handlePlus}
            sx={{
              position: "absolute",
              bottom: 24,
              right: 24,
              boxShadow: 3,
              "&:hover": { transform: "scale(1.1)" },
            }}
          >
            <AddIcon />
          </Fab>
        </Box>
      )}

      {/* Chat Section */}
      {(!isMobileOrTablet || showChat) && (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.default",
            pt: 8,
          }}
        >
          {isMobileOrTablet && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: "background.paper",
              }}
            >
              <IconButton onClick={() => setShowChat(false)} sx={{ mr: 1 }}>
                <ArrowBackIosIcon />
              </IconButton>
              <Typography variant="h6" fontWeight={600}>
                {currentConv?.name}
              </Typography>
            </Box>
          )}

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 2,
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {currentConv ? (
              messages.map((msg) => {
                const mine = Number(msg.senderId) === user.id;
                return (
                  <Box
                    key={msg.id}
                    sx={{
                      alignSelf: mine ? "flex-end" : "flex-start",
                      maxWidth: "75%",
                      minWidth: 120,
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 4,
                        bgcolor: mine ? "primary.main" : "background.paper",
                        color: mine ? "common.white" : "text.primary",
                        boxShadow: 1,
                        border: mine
                          ? "none"
                          : `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="body2">{msg.text}</Typography>

                      <Typography
                        variant="caption"
                        display="block"
                        textAlign="right"
                        sx={{ mt: 1, opacity: 0.7 }}
                      >
                        {formatMessageTime(msg.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Sélectionnez une conversation ou créez-en une nouvelle
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Message Input */}
          {currentConv && (
            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                bgcolor: "background.paper",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="flex-end">
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSend()
                  }
                  placeholder="Écrivez un message..."
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      bgcolor: "background.default",
                      "&:hover fieldset": { borderColor: "primary.light" },
                    },
                  }}
                />
                <IconButton
                  onClick={handleSend}
                  disabled={!message.trim()}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                    height: 40,
                    width: 40,
                    mb: 0.5,
                  }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          )}
        </Box>
      )}

      {/* Modals */}
      <Dialog
        open={step === "chooseCourse"}
        onClose={() => setStep("none")}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "background.paper" }}>
          Sélectionnez un cours
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <List>
            {courses.map((c) => (
              <ListItemButton
                key={c.id}
                onClick={() => handleSelectCourse(c.id)}
                sx={{
                  "&:hover": { bgcolor: "action.hover" },
                  px: 3,
                  py: 2,
                }}
              >
                <ListItemText
                  primary={c.titre}
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondary={`${c.lecons?.length || 0} leçons`}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      <Dialog
        open={step === "chooseUser"}
        onClose={() => setStep("none")}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "background.paper" }}>
          Sélectionnez un contact
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <List>
            <Typography variant="subtitle2" sx={{ px: 3, pt: 2, pb: 1 }}>
              Formateurs
            </Typography>
            {availableUsers
              .filter((u) => u.role === "formateur")
              .map((u) => (
                <ListItemButton
                  key={u.id}
                  onClick={() => handleSelectUser(u.id)}
                  sx={{ px: 3, py: 1.5 }}
                >
                  <ListItemAvatar>
                    <Avatar>{u.nom[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={u.nom} secondary="Formateur" />
                </ListItemButton>
              ))}

            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle2" sx={{ px: 3, pt: 2, pb: 1 }}>
              Étudiants
            </Typography>
            {availableUsers
              .filter((u) => u.role === "etudiant")
              .map((u) => (
                <ListItemButton
                  key={u.id}
                  onClick={() => handleSelectUser(u.id)}
                  sx={{ px: 3, py: 1.5 }}
                >
                  <ListItemAvatar>
                    <Avatar>{u.nom[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={u.nom} secondary="Étudiant" />
                </ListItemButton>
              ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Messagerie;
