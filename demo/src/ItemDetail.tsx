import { Grid, Typography } from "@mui/material";

type ItemDetailProps = {
  title: string;
  subtitle: string;
  refNumber: string;
}

export function ItemDetail({ title, subtitle, refNumber }: ItemDetailProps) {
  return (
    <Grid item sx={{ mb: 2 }}>
      <Typography variant="h5" component="h5">
        {title}
      </Typography>
      <Typography variant="h6" component="h6">
        {subtitle}
      </Typography>
      <Typography
        variant="subtitle2"
        component="span"
        sx={{ color: "#929295" }}
      >
        {refNumber}
      </Typography>
    </Grid>
  );
}
