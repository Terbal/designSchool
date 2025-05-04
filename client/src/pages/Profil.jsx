import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Box,
  Avatar,
  Grid,
  useTheme,
  InputAdornment,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { Lock, Person, Email, CheckCircle, Error } from "@mui/icons-material";

const Profil = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ nom: "", email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [ancienMotDePasse, setAncienMotDePasse] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFormData({ nom: res.data.nom, email: res.data.email });
      } catch (err) {
        console.error("Erreur chargement profil :", err);
      }
    };
    fetchProfile();
  }, [user.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("✅ Profil mis à jour !");
      setError("");
    } catch (err) {
      setMessage("");
      setError("❌ Erreur lors de la mise à jour");
    }
  };

  const handleChangePassword = async () => {
    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setError("❌ Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/update-password`,
        {
          ancienMotDePasse,
          nouveauMotDePasse,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage(res.data.message);
      setError("");
      setAncienMotDePasse("");
      setNouveauMotDePasse("");
      setConfirmationMotDePasse("");
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.error || "❌ Erreur inconnue");
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 6, pt: 8 }}>
        {/* En-tête profil */}
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            p: 4,

            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: 3,
            color: "white",
            boxShadow: 3,
            position: "relative",
            overflow: "hidden",
            "&:before": {
              content: '""',
              position: "absolute",
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
            },
          }}
        >
          <Avatar
            sx={{
              width: 96,
              height: 96,
              mb: 2,
              margin: "auto",
              bgcolor: "white",
              color: theme.palette.primary.main,
              fontSize: "2.5rem",
            }}
          >
            {user.nom[0]}
          </Avatar>
          <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            {formData.nom}
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            {formData.email}
          </Typography>
        </Box>

        {/* Section informations profil */}
        <Box
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            boxShadow: 2,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontWeight: 600,
            }}
          >
            <Person fontSize="large" color="primary" />
            Informations personnelles
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom complet"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Adresse email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSave}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              letterSpacing: 1,
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            Mettre à jour le profil
          </Button>
        </Box>

        {/* Section sécurité */}
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: 2,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontWeight: 600,
            }}
          >
            <Lock fontSize="large" color="warning" />
            Sécurité du compte
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ancien mot de passe"
                type="password"
                value={ancienMotDePasse}
                onChange={(e) => setAncienMotDePasse(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nouveau mot de passe"
                type="password"
                value={nouveauMotDePasse}
                onChange={(e) => setNouveauMotDePasse(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirmer le mot de passe"
                type="password"
                value={confirmationMotDePasse}
                onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CheckCircle color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Button
            fullWidth
            variant="contained"
            color="warning"
            size="large"
            onClick={handleChangePassword}
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              letterSpacing: 1,
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            Modifier le mot de passe
          </Button>
        </Box>

        {/* Notifications */}
        <Box sx={{ mt: 4 }}>
          {message && (
            <Alert
              severity="success"
              icon={<CheckCircle fontSize="large" />}
              sx={{
                borderRadius: 2,
                alignItems: "center",
                fontSize: "1rem",
                boxShadow: 1,
              }}
            >
              <Typography variant="body1">{message}</Typography>
            </Alert>
          )}
          {error && (
            <Alert
              severity="error"
              icon={<Error fontSize="large" />}
              sx={{
                borderRadius: 2,
                alignItems: "center",
                fontSize: "1rem",
                boxShadow: 1,
              }}
            >
              <Typography variant="body1">{error}</Typography>
            </Alert>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Profil;
