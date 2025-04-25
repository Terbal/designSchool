import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/formations">
            Formations
          </Button>
          <Button color="inherit" component={Link} to="/profil">
            Profil
          </Button>
        </Box>
        <Button color="inherit" component={Link} to="/login">
          Déconnexion
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
