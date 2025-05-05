// Login.jsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Grid,
  useTheme,
  Fade,
} from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import theme from "../theme";

const Illustration = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <svg viewBox="0 0 500 500" style={{ width: "100%", height: "auto" }}>
      <path
        fill="#1976d2"
        d="M112.5 275.7c0-65.8 54.3-119.4 120.9-119.4h131.4c66.6 0 120.9 53.6 120.9 119.4v131.4c0 65.8-54.3 119.4-120.9 119.4H233.4c-66.6 0-120.9-53.6-120.9-119.4V275.7z"
      />
      <path
        fill="#fff"
        d="M246.8 281.3h-81.3c-8.1 0-14.7-6.6-14.7-14.7s6.6-14.7 14.7-14.7h81.3c8.1 0 14.7 6.6 14.7 14.7s-6.6 14.7-14.7 14.7zm0 49.2h-81.3c-8.1 0-14.7-6.6-14.7-14.7s6.6-14.7 14.7-14.7h81.3c8.1 0 14.7 6.6 14.7 14.7s-6.6 14.7-14.7 14.7z"
      />
      <circle cx="349.2" cy="266.6" r="24.6" fill="#ffa726" />
      <path
        fill="#1565c0"
        d="M375.5 375.5h-81.3c-8.1 0-14.7-6.6-14.7-14.7s6.6-14.7 14.7-14.7h81.3c8.1 0 14.7 6.6 14.7 14.7s-6.6 14.7-14.7 14.7z"
      />
    </svg>
  </motion.div>
);

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);

  const navigate = useNavigate(); // ✅ Hook déplacé ici, correct

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(false);

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        mot_de_passe: motDePasse,
      });

      // ✅ Appeler login() du contexte Auth
      login(res.data.user, res.data.token);

      navigate("/dashboard"); // ✅ redirection
    } catch (err) {
      console.error("Erreur complète :", err);
      console.log("Détails axios :", err.response?.data);
      setMessage(
        err.response?.data?.error || "Erreur lors de la tentative de connexion"
      );
      setError(true);
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      <Grid
        item
        md={6}
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          bgcolor: theme.palette.primary.light,
          p: 4,
        }}
      >
        <Box sx={{ maxWidth: 500, width: "100%" }}>
          <Illustration />
        </Box>
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <LockPersonIcon
              sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Bienvenue
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Connectez-vous à votre espace d'apprentissage
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { mb: 2 },
              "& .MuiInputBase-input": { borderRadius: 2 },
            }}
          >
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <EmailIcon sx={{ color: "action.active", mr: 1 }} />
                ),
              }}
              sx={{
                "& fieldset": { borderRadius: 2 },
              }}
            />

            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              InputProps={{
                startAdornment: (
                  <PasswordIcon sx={{ color: "action.active", mr: 1 }} />
                ),
              }}
              sx={{
                "& fieldset": { borderRadius: 2 },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 16,
                textTransform: "none",
                boxShadow: 3,
                "&:hover": {
                  transform: "translateY(-1px)",
                },
              }}
            >
              Se connecter
            </Button>

            {message && (
              <Fade in={!!message}>
                <Alert
                  severity={error ? "error" : "success"}
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  {message}
                </Alert>
              </Fade>
            )}

            <Typography
              variant="body2"
              sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
            >
              Pas encore membre ?{" "}
              <Button
                component={Link}
                to="/signup"
                color="primary"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  p: 0,
                  "&:hover": { bgcolor: "transparent" },
                }}
              >
                Créer un compte
              </Button>
            </Typography>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
}
