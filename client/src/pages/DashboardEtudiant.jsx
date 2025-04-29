import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";

export default function DashboardEtudiant() {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [available, setAvailable] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchAll = async () => {
      try {
        const [allRes, myRes] = await Promise.all([
          axios.get("http://localhost:5000/api/cours", config),
          axios.get("http://localhost:5000/api/inscription/mes-cours", config),
        ]);
        setAvailable(allRes.data);
        setEnrolled(myRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4">Bienvenue, {user.nom} !</Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ my: 3 }}>
          <Tab label="Cours disponibles" />
          <Tab label="Mes cours" />
        </Tabs>

        {tab === 0 && (
          <Grid container spacing={2}>
            {available.map((c) => (
              <Grid item xs={12} sm={6} md={4} key={c.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{c.titre}</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {c.description.length > 100
                        ? c.description.slice(0, 100) + "..."
                        : c.description}
                    </Typography>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      gap={1}
                      sx={{ mt: 2 }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          (window.location.href = `/cours/${c.id}`)
                        }
                      >
                        Voir plus
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() =>
                          (window.location.href = `/inscription/${c.id}`)
                        }
                      >
                        S'inscrire
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {tab === 1 && (
          <Grid container spacing={2}>
            {enrolled.map((c) => (
              <Grid item xs={12} sm={6} md={4} key={c.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6">{c.titre}</Typography>
                      <Chip label="Inscrit" size="small" color="success" />
                    </Box>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate(`/inscription/${c.id}`)}
                    >
                      S'inscrire
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
