import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Avatar,
  Stack,
  useTheme,
  Divider,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  VpnKey as VpnKeyIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const AdminUsers = () => {
  const theme = useTheme();
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    mot_de_passe: "",
    mot_de_passe_confirm: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Erreur chargement utilisateurs:", err);
      }
    };
    if (user.role === "admin") fetchUsers();
  }, [user]);

  const handleEditClick = (u) => {
    setSelectedUser(u);
    setFormData({
      nom: u.nom,
      email: u.email,
      mot_de_passe: "",
      mot_de_passe_confirm: "",
    });
    setShowPasswordFields(false);
    setMessage("");
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (
      formData.mot_de_passe &&
      formData.mot_de_passe !== formData.mot_de_passe_confirm
    ) {
      setMessage("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/api/users/${selectedUser.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage("Utilisateur mis à jour !");
      // Refresh
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour");
    }
  };

  return (
    <Container sx={{ py: 6 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Avatar
          sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56 }}
        >
          <PersonIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" fontWeight={700}>
          Administration des Utilisateurs
        </Typography>
      </Stack>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 2, overflow: "hidden" }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.nom}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell align="right">
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => handleEditClick(u)}
                      sx={{ textTransform: "none", mr: 1 }}
                    >
                      Modifier
                    </Button>
                    <Button
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteUser(u.id)}
                      sx={{ textTransform: "none" }}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      <Dialog
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Modifier l'utilisateur</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            margin="dense"
            InputProps={{
              startAdornment: (
                <PersonIcon
                  sx={{ mr: 1, color: theme.palette.text.disabled }}
                />
              ),
            }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="dense"
            InputProps={{
              startAdornment: (
                <EmailIcon sx={{ mr: 1, color: theme.palette.text.disabled }} />
              ),
            }}
          />
          <Button
            variant="text"
            onClick={() => setShowPasswordFields((prev) => !prev)}
            sx={{ mt: 1, textTransform: "none" }}
          >
            {showPasswordFields
              ? "Annuler modification mot de passe"
              : "Modifier mot de passe"}
          </Button>
          {showPasswordFields && (
            <>
              <Divider sx={{ my: 2 }} />
              <TextField
                fullWidth
                label="Nouveau mot de passe"
                name="mot_de_passe"
                type="password"
                value={formData.mot_de_passe}
                onChange={handleChange}
                margin="dense"
                InputProps={{
                  startAdornment: (
                    <VpnKeyIcon
                      sx={{ mr: 1, color: theme.palette.text.disabled }}
                    />
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Confirmer mot de passe"
                name="mot_de_passe_confirm"
                type="password"
                value={formData.mot_de_passe_confirm}
                onChange={handleChange}
                margin="dense"
                InputProps={{
                  startAdornment: (
                    <VpnKeyIcon
                      sx={{ mr: 1, color: theme.palette.text.disabled }}
                    />
                  ),
                }}
              />
            </>
          )}
          {message && (
            <Typography
              color={message.includes("Erreur") ? "error" : "success.main"}
              sx={{ mt: 2 }}
            >
              {message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUsers;
