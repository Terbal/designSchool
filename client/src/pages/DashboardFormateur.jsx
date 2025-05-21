import React, { useEffect, useState } from "react";
import apiFormateur from "../api/axiosFormateur";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Box,
  IconButton,
  Divider,
  Input,
} from "@mui/material";
import { Edit as EditIcon, People as PeopleIcon } from "@mui/icons-material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Link } from "react-router-dom";

export default function DashboardProf() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dialog état pour modifier module et ajouter créneau
  const [openEdit, setOpenEdit] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    duration: 0,
    imageFile: null,
  });
  const [creneauData, setCreneauData] = useState({
    date: null,
    heure: null,
    places_disponibles: 0,
  });

  useEffect(() => {
    apiFormateur
      .get("/mes-modules")
      .then((res) => setModules(res.data))
      .catch(() => setError("Impossible de charger les modules."))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenEdit = (mod) => {
    setCurrentModule(mod);
    setFormData({
      titre: mod.titre,
      description: mod.description,
      duration: mod.duration || 0,
      imageFile: null,
    });
    setCreneauData({ date: null, heure: null, places_disponibles: 0 });
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const handleSaveEdit = async () => {
    try {
      // Update module metadata
      const payload = new FormData();
      payload.append("titre", formData.titre);
      payload.append("description", formData.description);
      payload.append("duration", formData.duration);
      if (formData.imageFile) payload.append("image", formData.imageFile);

      const resMod = await apiFormateur.put(
        `/modules/${currentModule.id}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Add creneau if provided
      if (creneauData.date && creneauData.heure) {
        const creneauPayload = {
          date: creneauData.date.toISOString().slice(0, 10),
          heure: creneauData.heure.toISOString().slice(11, 19),
          places_disponibles: creneauData.places_disponibles,
        };
        await apiFormateur.post(
          `/modules/${currentModule.id}/creneaux`,
          creneauPayload
        );
      }

      // get modules
      apiFormateur.get("/mes-modules");
      // put module
      apiFormateur.put(`/modules/${currentModule.id}`, payload);
      // post créneau
      apiFormateur.post(
        `/modules/${currentModule.id}/creneaux`,
        creneauPayload
      );

      // Refresh modules list
      const updatedList = await apiFormateur.get("/mes-modules");
      setModules(updatedList.data);
      handleCloseEdit();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour.");
    }
  };

  if (loading)
    return (
      <Container sx={{ textAlign: "center", mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  if (error)
    return (
      <Container sx={{ textAlign: "center", mt: 8 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mes Modules
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {modules.map((mod) => (
          <Grid item xs={12} sm={6} md={4} key={mod.id}>
            <Card
              sx={{
                height: 360,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 2,
                mx: "auto",
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={mod.imageUrl || "/default-course.jpg"}
                alt={mod.titre}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {mod.titre}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    height: 48,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {mod.description}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {mod.inscriptionsCount || 0} inscrits
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Durée : {mod.duration || 0}h
                </Typography>
              </CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
              >
                <Button
                  component={Link}
                  to={`/modules/${mod.id}/etudiants`}
                  size="small"
                >
                  Détails
                </Button>
                <IconButton onClick={() => handleOpenEdit(mod)}>
                  <EditIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog Édition Module + Créneau + Image upload */}
      <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth>
        <DialogTitle>Modifier le Module</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Titre"
            value={formData.titre}
            onChange={(e) =>
              setFormData({ ...formData, titre: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Durée (heures)"
            type="number"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: +e.target.value })
            }
            fullWidth
          />
          <Box>
            <Typography variant="subtitle1">Image du cours</Typography>
            <Input
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={(e) =>
                setFormData({ ...formData, imageFile: e.target.files[0] })
              }
              fullWidth
            />
          </Box>
          <Divider />
          <Typography variant="subtitle1">Ajouter un créneau</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={creneauData.date}
              onChange={(date) => setCreneauData((d) => ({ ...d, date }))}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <TimePicker
              label="Heure"
              value={creneauData.heure}
              onChange={(heure) => setCreneauData((d) => ({ ...d, heure }))}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
          <TextField
            label="Places disponibles"
            type="number"
            value={creneauData.places_disponibles}
            onChange={(e) =>
              setCreneauData((d) => ({
                ...d,
                places_disponibles: +e.target.value,
              }))
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Annuler</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Enregistrer tout
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
