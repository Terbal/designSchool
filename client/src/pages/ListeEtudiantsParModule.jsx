import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
  Skeleton,
} from "@mui/material";
import Navbar from "../components/Navbar";

const ListeEtudiantsParModule = () => {
  const { id } = useParams();
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEtudiants = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/modules/${id}/etudiants`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEtudiants(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur chargement étudiants :", err);
        setLoading(false);
      }
    };
    fetchEtudiants();
  }, [id]);

  const handleAddCours = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cours",
        newCours,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCours((prevCours) => [...prevCours, res.data]);
      setNewCours({ titre: "", description: "", formateur_id: "" });
    } catch (err) {
      console.error("Erreur ajout cours :", err);
      alert("Erreur lors de l'ajout du cours.");
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" mt={4} mb={2}>
          Étudiants inscrits au module
        </Typography>

        {loading ? (
          <>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height={50} sx={{ mb: 2 }} />
            ))}
          </>
        ) : etudiants.length === 0 ? (
          <Typography>Aucun étudiant inscrit pour l'instant.</Typography>
        ) : (
          <List>
            {etudiants.map((etudiant) => (
              <ListItem key={etudiant.id}>
                <ListItemText
                  primary={etudiant.nom}
                  secondary={etudiant.email}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Button
          variant="contained"
          sx={{ mt: 4 }}
          onClick={() => window.history.back()}
        >
          Retour
        </Button>
      </Container>
    </>
  );
};

export default ListeEtudiantsParModule;
