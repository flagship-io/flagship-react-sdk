import { Typography } from "@mui/material";

type DiscountedPriceProps = {
  price: string;
  discountPrice: string;
}

export function DiscountedPrice({ price, discountPrice }: DiscountedPriceProps) {
  return (
    <>
      <Typography
        variant="h5"
        component="span"
        sx={{ fontWeight: 500, textDecoration: "line-through" }}
      >
        {price}
      </Typography>
      <Typography
        variant="h5"
        component="span"
        sx={{ fontWeight: 500, color: "red", ml: 2 }}
      >
        {discountPrice}
      </Typography>
    </>
  );
}