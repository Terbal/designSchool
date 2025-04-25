// src/components/Testimonials.jsx
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";

const testimonials = [
  {
    name: "Claire M.",
    role: "Étudiante en communication",
    text: "Avant designSchool, j’avais du mal à parler en public. Aujourd’hui, je prends la parole avec assurance, même devant une grande audience !",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "Yanis B.",
    role: "Étudiant en journalisme",
    text: "La méthode est claire, progressive et motivante. Les formateurs sont à l’écoute et m’ont vraiment aidé à progresser rapidement.",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Mme Dupont",
    role: "Formatrice en expression orale",
    text: "Chez designSchool, nous mettons tout en œuvre pour révéler le potentiel de chaque apprenant. C’est une fierté d’en faire partie.",
    avatar: "https://i.pravatar.cc/150?img=39",
  },
];

const Testimonials = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: "#f4f6f8" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontFamily: "Poppins", fontWeight: 600 }}
      >
        Ils parlent de nous
      </Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                backgroundColor: "white",
              }}
            >
              <Avatar
                alt={testimonial.name}
                src={testimonial.avatar}
                sx={{ width: 80, height: 80, mb: 2 }}
              />
              <Typography variant="body1" sx={{ mb: 2, fontStyle: "italic" }}>
                “{testimonial.text}”
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                {testimonial.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {testimonial.role}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Testimonials;
