import { CardMedia, Grid } from "@mui/material";

type ItemImageProps = {
  imageUrl: string;
  imageAlt: string;
  imageTitle: string;
};

export const ItemImage = ({
  imageUrl,
  imageAlt,
  imageTitle,
}: ItemImageProps) => {
  return (
    <Grid container justifyContent="center" sx={{ mb: 2 }}>
      <Grid item xs={8}>
        <CardMedia
          component="img"
          alt={imageAlt}
          image={imageUrl}
          title={imageTitle}
        />
      </Grid>
    </Grid>
  );
};
