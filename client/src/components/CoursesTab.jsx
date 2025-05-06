// src/components/admin/CoursesTab.jsx
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
import { Add, Edit, Delete } from "@mui/icons-material";
import api from "../api/axios";

const CoursesTab = () => {
  const [courses, setCourses] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    duration: "",
    prix: "",
    formateur_id: "",
  });
  const [error, setError] = useState("");

  // Charger les cours
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cours");
      setCourses(res.data);
    } catch (err) {
      console.error("Erreur fetchCourses:", err);
      setError("Impossible de charger les cours.");
    } finally {
      setLoading(false);
    }
  };

  // Charger les formateurs
  const fetchFormateurs = async () => {
    try {
      // On récupère tous les utilisateurs ayant le rôle "formateur"
      const res = await api.get("/users");
      setFormateurs(res.data.filter((u) => u.role === "formateur"));
    } catch (err) {
      console.error("Erreur fetchFormateurs:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchFormateurs();
  }, []);

  const handleOpen = (course) => {
    setError("");
    setSelected(course || null);
    setForm(
      course
        ? { ...course }
        : {
            titre: "",
            description: "",
            duration: "",
            prix: "",
            formateur_id: "",
          }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setForm({
      titre: "",
      description: "",
      duration: "",
      prix: "",
      formateur_id: "",
    });
    setSelected(null);
    setError("");
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      if (selected) await api.put(`/cours/${selected.id}`, form);
      else await api.post("/cours", form);
      handleClose();
      fetchCourses();
    } catch (err) {
      console.error("Erreur handleSave:", err.response || err);
      if (err.response?.status === 401)
        setError("Non autorisé. Veuillez vous reconnecter.");
      else
        setError(
          err.response?.data?.error || "Erreur lors de l'enregistrement."
        );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce cours ?")) return;
    try {
      await api.delete(`/cours/${id}`);
      fetchCourses();
    } catch (err) {
      console.error("Erreur handleDelete:", err);
      setError("Impossible de supprimer ce cours.");
    }
  };

  const columns = [
    { field: "titre", headerName: "Titre", flex: 1 },
    { field: "formateur_nom", headerName: "Formateur", flex: 1 },
    { field: "duration", headerName: "Durée (h)", flex: 0.5 },
    { field: "prix", headerName: "Prix (€)", flex: 0.5 },
    { field: "studentCount", headerName: "Étudiants", flex: 0.5 },
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
        <Typography variant="h6">Cours</Typography>
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
        rows={courses}
        columns={columns}
        loading={loading}
        autoHeight
        getRowId={(row) => row.id}
        pageSize={5}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selected ? "Modifier" : "Ajouter"} un cours</DialogTitle>
        <DialogContent dividers>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Titre"
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={6}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            sx={{ mb: 2 }}
            placeholder="Tu peux mettre **gras** ou *italique* en Markdown"
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="label-formateur">Formateur</InputLabel>
            <Select
              labelId="label-formateur"
              value={form.formateur_id}
              label="Formateur"
              onChange={(e) =>
                setForm({ ...form, formateur_id: e.target.value })
              }
            >
              {formateurs.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Durée (h)"
            type="number"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Prix (€)"
            type="number"
            value={form.prix}
            onChange={(e) => setForm({ ...form, prix: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CoursesTab;
