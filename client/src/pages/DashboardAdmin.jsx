import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Modal,
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const DashboardAdmin = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [formData, setFormData] = useState({});
  const [entities, setEntities] = useState({
    courses: [],
    users: [],
    news: [],
    conversations: [],
  });
  const [participants, setParticipants] = useState([]);

  const resetForm = () => {
    setFormData({});
    setSelectedEntity(null);
  };

  const handleOpenModal = (entity) => {
    setSelectedEntity(entity);
    setFormData(entity || {});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    resetForm();
    setOpenModal(false);
  };

  const handleTabChange = (_, newValue) => setTabValue(newValue);

  const fetchData = async () => {
    const [coursesRes, usersRes, newsRes, convsRes] = await Promise.all([
      axios.get("/api/courses"),
      axios.get("/api/users"),
      axios.get("/api/news"),
      axios.get("/api/conversations"),
    ]);
    setEntities({
      users: usersRes.data.map((u) => ({ ...u, id: u.id_user })),
      courses: coursesRes.data.map((c) => ({ ...c, id: c.id_cours })),
      news: newsRes.data.map((n) => ({ ...n, id: n.id_actu })),
      conversations: convsRes.data.map((conv) => ({
        ...conv,
        id: conv.id_conversation,
      })),
    });
  };

  const handleSubmit = async () => {
    try {
      const entityNames = ["courses", "users", "news", "conversations"];
      const current = entityNames[tabValue];
      const endpoint = selectedEntity
        ? `/api/${current}/${selectedEntity.id}`
        : `/api/${current}`;
      const method = selectedEntity ? "put" : "post";

      await axios[method](endpoint, formData);
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  const handleSendMessage = async () => {
    try {
      if (!formData.destinataires || !formData.message) return;

      await axios.post("/api/messages/send", {
        destinataires: formData.destinataires,
        contenu: formData.message,
      });
      alert("Message envoyé !");
      setFormData({ message: "", destinataires: [] });
    } catch (err) {
      console.error("Erreur d’envoi du message :", err);
    }
  };

  useEffect(() => {
    fetchData();
    axios.get("/api/users").then((res) => setParticipants(res.data));
  }, []);

  const renderForm = () => {
    switch (tabValue) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Titre"
              value={formData.titre || ""}
              onChange={(e) =>
                setFormData({ ...formData, titre: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Durée"
              value={formData.duration || ""}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Prix"
              type="number"
              value={formData.prix || ""}
              onChange={(e) =>
                setFormData({ ...formData, prix: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Formateur</InputLabel>
              <Select
                value={formData.formateur_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, formateur_id: e.target.value })
                }
              >
                {Array.isArray(entities.users) &&
                  entities.users
                    .filter((u) => u.role === "formateur")
                    .map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.nom}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          </>
        );
      case 1:
        return (
          <>
            <TextField
              fullWidth
              label="Nom"
              value={formData.nom || ""}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={formData.role || ""}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="formateur">Formateur</MenuItem>
                <MenuItem value="etudiant">Étudiant</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      case 2:
        return (
          <>
            <TextField
              fullWidth
              label="Titre"
              value={formData.titre || ""}
              onChange={(e) =>
                setFormData({ ...formData, titre: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Contenu"
              multiline
              rows={3}
              value={formData.contenu || ""}
              onChange={(e) =>
                setFormData({ ...formData, contenu: e.target.value })
              }
              sx={{ mb: 2 }}
            />
          </>
        );
      default:
        return null;
    }
  };

  const tabLabels = ["Cours", "Utilisateurs", "Actualités", "Messagerie"];
  const tabKeys = ["courses", "users", "news", "conversations"];

  return (
    <Box p={2}>
      <Tabs value={tabValue} onChange={handleTabChange}>
        {tabLabels.map((label, i) => (
          <Tab key={i} label={label} />
        ))}
      </Tabs>

      <Box mt={2}>
        {tabValue < 3 && (
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6">{tabLabels[tabValue]}</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenModal(null)}
            >
              Ajouter
            </Button>
          </Box>
        )}

        {tabValue < 3 ? (
          <DataGrid
            rows={entities[tabKeys[tabValue]]}
            columns={[
              ...Object.keys(entities[tabKeys[tabValue]][0] || {}).map(
                (key) => ({
                  field: key,
                  headerName: key.toUpperCase(),
                  flex: 1,
                })
              ),
              {
                field: "actions",
                headerName: "Actions",
                renderCell: (params) => (
                  <IconButton onClick={() => handleOpenModal(params.row)}>
                    <Edit />
                  </IconButton>
                ),
              },
            ]}
            autoHeight
            pageSize={5}
            disableSelectionOnClick
          />
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Envoyer un message
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Destinataires</InputLabel>
              <Select
                multiple
                value={formData.destinataires || []}
                onChange={(e) =>
                  setFormData({ ...formData, destinataires: e.target.value })
                }
              >
                {participants.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              value={formData.message || ""}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleSendMessage}>
              Envoyer
            </Button>
          </Box>
        )}
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            width: 500,
            bgcolor: "#fff",
            p: 3,
            mx: "auto",
            my: "10%",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {selectedEntity ? "Modifier" : "Ajouter"} {tabLabels[tabValue]}
          </Typography>
          {renderForm()}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={handleCloseModal}
              sx={{ mr: 2 }}
            >
              Annuler
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DashboardAdmin;
