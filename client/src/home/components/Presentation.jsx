// src/components/Presentation.jsx
import { Box, Typography, Grid, Container } from "@mui/material";
import schoolImg from "../../assets/learn.png"; // remplace par ton image réelle

const Presentation = () => {
  return (
    <Box
      sx={{ py: 8, background: "linear-gradient(to bottom, #f7f9fc, #ffffff)" }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <img
              src={schoolImg}
              alt="Notre centre"
              style={{
                width: "100%",
                borderRadius: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontFamily: "Poppins", fontWeight: 600 }}
            >
              Un centre dédié à votre expression
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", fontFamily: "Roboto" }}
            >
              Chez <strong>designSchool</strong>, nous croyons que la prise de
              parole en public est une compétence essentielle dans le monde
              professionnel moderne.
              <br />
              <br />
              Grâce à des formations innovantes, une pédagogie humaine et une
              équipe de formateurs passionnés, nous aidons chacun à prendre
              confiance et à s’exprimer avec impact.
              <br />
              <br />
              Que vous soyez étudiant, professionnel ou formateur, notre mission
              est de vous accompagner à chaque étape de votre progression.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Presentation;
