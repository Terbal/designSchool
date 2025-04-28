import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const DetailsCours = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cours, setCours] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cours/${id}`);
        setCours(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur récupération cours :", error);
        setLoading(false);
      }
    };
    fetchCours();
  }, [id]);

  const handleInscription = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/inscription/cours/${id}/inscrire`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Inscription réussie !");
      navigate("/mes-cours");
    } catch (error) {
      console.error(
        "Erreur inscription :",
        error.response?.data || error.message
      );
      alert("Erreur lors de l'inscription.");
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;
  if (!cours) return <Typography>Ce cours n'existe pas.</Typography>;

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        {cours.titre}
      </Typography>
      <Typography variant="body1" paragraph>
        {cours.description}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        {user?.role === "etudiant" && (
          <Button variant="contained" onClick={handleInscription}>
            S'inscrire
          </Button>
        )}
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </Stack>
    </Container>
  );
};

export default DetailsCours;
