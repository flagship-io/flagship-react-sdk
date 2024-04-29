//start demo
import { Button, CardMedia, Grid, Typography } from "@mui/material";
import { itemData } from "./itemData";
import {
  EventCategory,
  HitType,
  useFlagship,
  useFsFlag,
} from "@flagship.io/react-sdk";

export const Item = () => {
  const { title, subtitle, refNumber, price, imageUrl, imageAlt, imageTitle,discountPrice } = itemData;

  const fs = useFlagship();

  /*Step 2: Get the values of the flags for the visitor*/
  const enableDiscountFlag = useFsFlag("fs_enable_discount", false);
  const addToCartBtnColorFlag = useFsFlag("fs_add_to_cart_btn_color", "#556cd6");

  //Step 3: get the flags value
  const enableDiscountValue = enableDiscountFlag.getValue();
  const addToCartBtnColorValue = addToCartBtnColorFlag.getValue();

  const handleAddToCart = () => {
    // Step 4: Send a hit to track an action
    fs.hit.send({
      type: HitType.EVENT,
      category: EventCategory.ACTION_TRACKING,
      action: "add-to-cart-clicked",
    });

    alert("Item added to cart");
  };

  function renderPrice() {
    if (enableDiscountValue) {
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
    return (
      <Typography variant="h5" component="span" sx={{ fontWeight: 500 }}>
        {price}
      </Typography>
    );
  }

  return (
    <Grid sx={{ backgroundColor: "#f2f2f7", p: 2 }}>
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
      <Grid item sx={{ mb: 2 }}>
        {renderPrice()}
      </Grid>

      <Grid container justifyContent="center">
        <Button
          size="large"
          variant="contained"
          onClick={handleAddToCart}
          sx={{
            backgroundColor: addToCartBtnColorValue,
            "&:hover": { backgroundColor: addToCartBtnColorValue },
          }}
        >
          Add to cart
        </Button>
      </Grid>
    </Grid>
  );
};
//end demo