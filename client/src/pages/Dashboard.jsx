// src/pages/Dashboard.jsx
import { useAuth } from "../contexts/AuthContext"; // ← on importe le hook
import Navbar from "../components/Navbar";
import { Typography, Container, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth(); // ← on récupère user

  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" align="center" mt={4}>
          Bienvenue sur le tableau de bord de designSchool 🎓
        </Typography>

        {/* Bloc d’informations utilisateur */}
        <Box mt={4}>
          <Typography variant="h6">Bienvenue, {user.nom} !</Typography>
          {/* <Typography variant="body1">Ton rôle est : {user.role}</Typography> */}

          {/* Affichage conditionnel selon le rôle */}
          {user.role === "admin" && (
            <>
              <Typography variant="body2" gutterBottom>
                👑 Vous êtes un administrateur
              </Typography>
              <Button
                component={Link}
                to="/admin/users"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Gérer les utilisateurs
              </Button>
            </>
          )}
          {user.role === "formateur" && (
            <Typography variant="body2">📚 Vous êtes un formateur</Typography>
          )}
          {user.role === "etudiant" && (
            <Typography variant="body2">🎓 Vous êtes un étudiant</Typography>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
