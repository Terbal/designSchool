import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";

export default function CourseCard({ course }) {
  return (
    <Card sx={{ maxWidth: 345, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {course.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {course.level} - {course.duration} heures
        </Typography>
        <Typography variant="body2">{course.shortDescription}</Typography>
        <Typography sx={{ mt: 2 }} variant="h6">
          {course.price} €
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          href={`/course/${course.id}`}
          variant="contained"
          sx={{
            bgcolor: "primary.main",
            borderRadius: 5,
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
          }}
        >
          Voir Détails
        </Button>
      </CardActions>
    </Card>
  );
}
