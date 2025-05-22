import { Box, Typography, Button } from "@mui/material";

export function EmptyCourses({ tab, onBrowse }) {
  return (
    <Box sx={{ textAlign: "center", p: 8 }}>
      <Typography variant="h6" color="text.secondary">
        {tab === 0
          ? "Aucun cours disponible pour le moment"
          : "Vous n'êtes inscrit à aucun cours"}
      </Typography>
      {tab === 1 && (
        <Button variant="outlined" sx={{ mt: 2 }} onClick={onBrowse}>
          Parcourir les cours
        </Button>
      )}
    </Box>
  );
}
