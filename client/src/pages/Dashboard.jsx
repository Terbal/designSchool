// src/pages/Dashboard.jsx
import { useAuth } from "../contexts/AuthContext"; // ← on importe le hook
import Navbar from "../components/Navbar";
import { Typography, Container, Box } from "@mui/material";

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
          <Typography variant="body1">Ton rôle est : {user.role}</Typography>

          {/* Affichage conditionnel selon le rôle */}
          {user.role === "admin" && (
            <Typography variant="body2">
              👑 Vous êtes un administrateur
            </Typography>
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
