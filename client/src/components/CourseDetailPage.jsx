<Button
  variant="contained"
  size="large"
  sx={{
    bgcolor: "secondary.main",
    borderRadius: 8,
    px: 5,
    py: 2,
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: "1rem",
    mt: 4,
    "&:hover": { bgcolor: "secondary.dark" },
  }}
  href={`/course/${course.id}/register`}
>
  S'inscrire
</Button>;
