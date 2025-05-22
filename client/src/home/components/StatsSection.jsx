// src/components/StatsSection.jsx
import { Box, Grid, Typography, Container, Paper } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

const stats = [
  {
    icon: <SchoolIcon fontSize="large" color="primary" />,
    number: "3",
    label: "Formations disponibles",
  },
  {
    icon: <ThumbUpIcon fontSize="large" color="primary" />,
    number: "91,1%",
    label: "Taux de satisfaction",
  },
  {
    icon: <GroupsIcon fontSize="large" color="primary" />,
    number: "+500",
    label: "Apprenants formés",
  },
  {
    icon: <EmojiPeopleIcon fontSize="large" color="primary" />,
    number: "15",
    label: "Formateurs professionnels",
  },
];

const StatsSection = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: "#ffffff" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontFamily: "Poppins", fontWeight: 600 }}
        >
          Nos chiffres clés
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 4,
                  background: "#f5faff",
                }}
              >
                {stat.icon}
                <Typography
                  variant="h5"
                  sx={{ mt: 2, fontWeight: "bold", fontFamily: "Poppins" }}
                >
                  {stat.number}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontFamily: "Roboto" }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsSection;
