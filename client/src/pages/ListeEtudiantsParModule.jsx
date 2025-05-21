//  src/pages/ListeEtudiantsParModule.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ListeEtudiantsParModule() {
  const { id } = useParams();
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEtudiants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/formateurs/modules/${id}/etudiants`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEtudiants(res.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger la liste des étudiants.");
      } finally {
        setLoading(false);
      }
    };
    fetchEtudiants();
  }, [id]);

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Étudiants inscrits
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : etudiants.length === 0 ? (
          <Alert severity="info">Aucun étudiant inscrit pour ce module.</Alert>
        ) : (
          etudiants.map((e) => (
            <Accordion key={e.id} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 500 }}>{e.nom}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography>Email : {e.email}</Typography>
                  <Typography>
                    Inscrit le :{" "}
                    {new Date(e.date_inscription).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                  <Typography>
                    Créneau :{" "}
                    {new Date(e.creneau_date).toLocaleDateString("fr-FR")} à{" "}
                    {e.creneau_heure}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Container>
    </>
  );
}
