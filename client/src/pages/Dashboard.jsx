import Navbar from "../components/Navbar";
import { Typography, Container } from "@mui/material";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" align="center" mt={4}>
          Bienvenue sur le tableau de bord de designSchool 🎓
        </Typography>
      </Container>
    </>
  );
};

export default Dashboard;
