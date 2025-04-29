// src/components/InscriptionCoursForm.jsx
import { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";

export default function InscriptionCoursForm({ coursId, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setError(null);
    setOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/inscription/cours/${coursId}/inscrire`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpen(false);
      onSuccess(); // pour rafraîchir la liste ou afficher un toast
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        S’inscrire
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmer l’inscription</DialogTitle>
        <DialogContent dividers>
          <p>Êtes-vous sûr de vouloir vous inscrire à ce cours ?</p>
          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading} variant="contained">
            {loading ? "..." : "Confirmer"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
