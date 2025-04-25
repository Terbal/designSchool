import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          designSchool
        </Typography>

        {user ? (
          <>
            <Box mr={2}>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/profil">
                Mon Profil
              </Button>
            </Box>
            <Button color="inherit" onClick={logout}>
              Se déconnecter
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Connexion
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Inscription
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
