import { Typography } from "@mui/material";

type ItemPriceProps = {
  price: string;
}

export function ItemPrice({ price }: ItemPriceProps) {
  return (
    <Typography variant="h5" component="span" sx={{ fontWeight: 500 }}>
      {price}
    </Typography>
  );
}