import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit, Delete, School } from "@mui/icons-material";
import api from "../api/axios";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ nom: "", email: "", role: "etudiant" });
  const [error, setError] = useState("");
  const [coursesDialogOpen, setCoursesDialogOpen] = useState(false);
  const [currentUserCourses, setCurrentUserCourses] = useState([]);
  const [currentUserName, setCurrentUserName] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCourses = async (userId, userName) => {
    try {
      const res = await api.get(`/users/${userId}/cours`);
      setCurrentUserCourses(res.data);
      setCurrentUserName(userName);
      setCoursesDialogOpen(true);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les cours de l'utilisateur.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = (user) => {
    setError("");
    setSelected(user || null);
    setForm(
      user
        ? { nom: user.nom, email: user.email, role: user.role }
        : { nom: "", email: "", role: "etudiant" }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setForm({ nom: "", email: "", role: "etudiant" });
    setSelected(null);
    setError("");
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      if (selected) await api.put(`/users/${selected.id}`, form);
      else await api.post("/users", form);
      handleClose();
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Erreur lors de l'enregistrement.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer cet utilisateur.");
    }
  };

  const columns = [
    {
      field: "cours",
      headerName: "Cours",
      sortable: false,
      renderCell: ({ row }) => (
        <IconButton onClick={() => fetchUserCourses(row.id, row.nom)}>
          <School />
        </IconButton>
      ),
    },
    { field: "id", headerName: "ID", width: 70 },
    { field: "nom", headerName: "Nom", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Rôle", flex: 0.5 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <IconButton onClick={() => handleOpen(row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Utilisateurs</Typography>
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => handleOpen(null)}
        >
          Ajouter
        </Button>
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}
      <DataGrid
        rows={users}
        columns={columns}
        loading={loading}
        autoHeight
        getRowId={(row) => row.id}
        pageSize={5}
      />
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selected ? "Modifier" : "Ajouter"} un utilisateur
        </DialogTitle>
        <DialogContent dividers>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Nom"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="label-role">Rôle</InputLabel>
            <Select
              labelId="label-role"
              value={form.role}
              label="Rôle"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="formateur">Formateur</MenuItem>
              <MenuItem value="etudiant">Étudiant</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={coursesDialogOpen}
        onClose={() => setCoursesDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Cours de {currentUserName}</DialogTitle>
        <DialogContent dividers>
          {currentUserCourses.length > 0 ? (
            <ul>
              {currentUserCourses.map((c) => (
                <li key={c.id}>{c.titre}</li>
              ))}
            </ul>
          ) : (
            <Typography>Aucun cours trouvé.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCoursesDialogOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
      ;
    </Box>
  );
};

export default UsersTab;
