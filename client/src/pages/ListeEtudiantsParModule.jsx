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

  const [dejaInscrit, setDejaInscrit] = useState(false);

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/cours/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCours(res.data);

        // Vérifie si l'utilisateur est déjà inscrit à ce cours
        if (res.data.inscriptions) {
          const inscrit = res.data.inscriptions.some(
            (i) => i.etudiant_email === user.email
          );
          setDejaInscrit(inscrit);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCours();
  }, [id, user.email]);

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
