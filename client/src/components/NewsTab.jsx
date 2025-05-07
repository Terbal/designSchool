import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import axios from "axios";

// Axios instance for actualités
const newsApi = axios.create({
  baseURL: "http://localhost:5000/api/actualites",
});

const NewsTab = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ titre: "", contenu: "" });

  // Charger toutes les actualités et ajouter formattedDate
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await newsApi.get("/");
      const dataWithDate = res.data.map((item) => ({
        ...item,
        formattedDate: item.date_publication
          ? new Date(item.date_publication).toLocaleString("fr-FR")
          : "",
      }));
      setNews(dataWithDate);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les actualités.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Ouvrir le dialog d'édition ou création
  const handleEditOpen = (item) => {
    setError("");
    setSelected(item || null);
    setForm(
      item
        ? { titre: item.titre, contenu: item.contenu }
        : { titre: "", contenu: "" }
    );
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setSelected(null);
    setForm({ titre: "", contenu: "" });
    setError("");
  };

  // Ouvrir le dialog de vue
  const handleViewOpen = (item) => {
    setSelected(item);
    setViewOpen(true);
  };
  const handleViewClose = () => {
    setViewOpen(false);
    setSelected(null);
  };

  // Enregistrer création ou mise à jour
  const handleSave = async () => {
    try {
      if (selected) {
        await newsApi.put(`/${selected.id}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await newsApi.post("/", form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      handleEditClose();
      fetchNews();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Erreur lors de l'enregistrement.");
    }
  };

  // Supprimer une actualité
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette actualité ?")) return;
    try {
      await newsApi.delete(`/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchNews();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer l'actualité.");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "titre", headerName: "Titre", flex: 1 },
    { field: "formattedDate", headerName: "Date", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleViewOpen(row);
            }}
          >
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEditOpen(row);
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Actualités</Typography>
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleEditOpen(null);
          }}
        >
          Créer
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <DataGrid
        rows={news}
        columns={columns}
        loading={loading}
        autoHeight
        getRowId={(row) => row.id}
        pageSize={5}
      />

      {/* Dialog création/édition */}
      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {selected ? "Modifier" : "Créer"} une actualité
        </DialogTitle>
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
            label="Contenu"
            multiline
            rows={4}
            value={form.contenu}
            onChange={(e) => setForm({ ...form, contenu: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Annuler</Button>
          <Button variant="contained" onClick={handleSave}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog vue */}
      <Dialog open={viewOpen} onClose={handleViewClose} fullWidth maxWidth="sm">
        <DialogTitle>{selected?.titre}</DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {selected?.contenu}
          </Typography>
          {selected?.formattedDate && (
            <Typography variant="caption" display="block" sx={{ mt: 2 }}>
              Publié le {selected.formattedDate}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewsTab;
