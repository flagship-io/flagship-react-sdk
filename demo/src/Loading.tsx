import { CircularProgress, Container, Grid } from "@mui/material";

export function Loading() {
  return (
    <Container maxWidth="xs">
        <Grid xs={12}>
            <CircularProgress />
        </Grid>
    </Container>
  );
}
