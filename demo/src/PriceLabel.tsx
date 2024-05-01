import { Typography } from "@mui/material";

interface PriceLabelProps {
  children: React.ReactNode;
}

export function PriceLabel({ children }: PriceLabelProps) {
  return (
    <Typography variant="body1" component="span">
      {children}
    </Typography>
  );
}