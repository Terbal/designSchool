import { Container, CircularProgress } from "@mui/material";

export default function LoadingSpinner() {
  return (
    <Container sx={{ textAlign: "center", mt: 4 }}>
      <CircularProgress />
    </Container>
  );
}
