import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
} from "@mui/material";

const MesCours = () => {
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMesCours = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/mes-cours", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCours(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur récupération mes cours :", error);
        setLoading(false);
      }
    };
    fetchMesCours();
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Mes cours
      </Typography>
      <Grid container spacing={2}>
        {cours.length === 0 ? (
          <Typography>Vous n'êtes inscrit à aucun cours.</Typography>
        ) : (
          cours.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{c.titre}</Typography>
                  <Typography variant="body2">{c.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default MesCours;
