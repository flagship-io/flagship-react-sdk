import { Button, ButtonProps } from "@mui/material";

type AddCartButtonProps = Omit<ButtonProps, "color"> & {
  backgroundColor: string;
  onClick: () => void;
};

export function AddCartButton({
  backgroundColor,
  onClick,
  ...props
}: AddCartButtonProps) {
  return (
    <Button
      size="large"
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor,
        "&:hover": { backgroundColor },
      }}
      {...props}
    >
      Add to cart
    </Button>
  );
}
