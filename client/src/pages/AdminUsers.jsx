import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const AdminUsers = () => {
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

    if (user.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  const handleEditClick = (u) => {
    setSelectedUser(u);
    setFormData({
      nom: u.nom,
      email: u.email,
      mot_de_passe: "",
      mot_de_passe_confirm: "",
    });
    setMessage("");
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("❌ Erreur suppression utilisateur:", err);
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
      setMessage("❌ Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${selectedUser.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage("✅ Utilisateur mis à jour");
      setSelectedUser(null);
      // Rechargement de la liste
      const updated = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(updated.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de la mise à jour");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gestion des utilisateurs
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rôle</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.nom}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => handleEditClick(u)}>
                  Modifier
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
      >
        <DialogTitle>Modifier l'utilisateur</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            variant="text"
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            sx={{ mb: 2 }}
          >
            {showPasswordFields
              ? "Annuler le changement de mot de passe"
              : "Modifier le mot de passe ?"}
          </Button>

          {showPasswordFields && (
            <>
              <TextField
                fullWidth
                label="Nouveau mot de passe"
                name="mot_de_passe"
                type="password"
                value={formData.mot_de_passe}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirmer mot de passe"
                name="mot_de_passe_confirm"
                type="password"
                value={formData.mot_de_passe_confirm}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}

          {message && <Typography sx={{ mt: 1 }}>{message}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)}>Annuler</Button>
          <Button onClick={handleSave} variant="contained">
            Sauvegarder
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeleteUser(selectedUser.id)}
            sx={{ ml: 1 }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUsers;
