import {
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import { School } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function CourseCard({
  course,
  tab,
  isEnrolled,
  onEnroll,
  onDetails,
}) {
  const navigate = useNavigate();
  const truncate = (text, max) =>
    text.length > max ? text.substring(0, max) + "..." : text;

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        maxWidth: 360,
        width: "100%",
        mx: "auto",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <School sx={{ mr: 1.5, color: "primary.main" }} />
          <Typography variant="h6" component="div">
            {course.titre}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {truncate(course.description, 100)}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
        {tab === 0 ? (
          <>
            {isEnrolled ? (
              <Chip
                label="Déjà inscrit"
                color="success"
                size="small"
                sx={{ borderRadius: 1 }}
              />
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={onEnroll}
                sx={{ borderRadius: 1 }}
              >
                S'inscrire
              </Button>
            )}
            <Button
              size="small"
              onClick={onDetails}
              sx={{ color: "primary.main" }}
            >
              Voir détails
            </Button>
          </>
        ) : (
          <Button
            fullWidth
            variant="contained"
            startIcon={<School />}
            onClick={() => navigate(`/cours/${course.id}/contenu`)}
            sx={{ borderRadius: 1 }}
          >
            Accéder au cours
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
