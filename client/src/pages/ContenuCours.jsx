import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";

const ContenuCours = () => {
  const { id } = useParams();
  const [contenu, setContenu] = useState(null);
  const [loading, setLoading] = useState(true);

  const transformYouTubeUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    return url; // sinon, laisse tel quel (utile si c’est un autre type d'URL)
  };

  useEffect(() => {
    const fetchContenu = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/cours/${id}/contenu`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setContenu(res.data);
      } catch (error) {
        console.error("Erreur chargement contenu :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContenu();
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;
  if (!contenu) return <Typography>Contenu non disponible.</Typography>;

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        {contenu.titre}
      </Typography>

      {/* Affichage des vidéos */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Vidéos :
      </Typography>
      <List>
        {contenu.videos?.map((video, index) => (
          <ListItem
            key={index}
            sx={{ flexDirection: "column", alignItems: "flex-start", mb: 3 }}
          >
            <Typography variant="subtitle1" gutterBottom>
              {video.titre}
            </Typography>
            <Box
              component="iframe"
              src={transformYouTubeUrl(video.url)}
              width="100%"
              height="360"
              frameBorder="0"
              allowFullScreen
              sx={{ borderRadius: 2 }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 4 }} />

      {/* Affichage des documents */}
      <Typography variant="h6" gutterBottom>
        Documents :
      </Typography>
      <List>
        {contenu.documents?.map((doc, index) => (
          <ListItem
            key={index}
            sx={{ flexDirection: "column", alignItems: "flex-start", mb: 3 }}
          >
            <Typography variant="subtitle1" gutterBottom>
              {doc.nom}
            </Typography>
            <Box
              component="iframe"
              src={doc.url}
              width="100%"
              height="500"
              sx={{ border: "1px solid #ccc", borderRadius: 2 }}
            />
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: "0.5rem" }}
            >
              Télécharger / Ouvrir dans un nouvel onglet
            </a>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ContenuCours;
