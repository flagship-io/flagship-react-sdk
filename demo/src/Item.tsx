//start demo
//Path: demo/src/Item.tsx
import { Grid } from "@mui/material";
import { itemData } from "./itemData";
import { EventCategory, HitType, useFlagship, useFsFlag } from "@flagship.io/react-sdk";
import { ItemImage } from "./ItemImage";
import { ItemDetail } from "./ItemDetail";
import { DiscountedPrice } from "./DiscountedPrice";
import { ItemPrice } from "./ItemPrice";
import { AddCartButton } from "./AddCartButton";
import { PriceLabel } from "./PriceLabel";

export const Item = () => {
  const { title, subtitle, refNumber, price, imageUrl, imageAlt, imageTitle, discountPrice } = itemData;

  const fs = useFlagship();

  /*Step 2: Get the values of the flags for the visitor*/
  const enableDiscountFlag = useFsFlag("fs_enable_discount", false).getValue();
  const addToCartBtnColorFlag = useFsFlag("fs_add_to_cart_btn_color", "#556cd6").getValue();

  const handleAddToCart = () => {
    // Step 3: Send a hit to track an action
    fs.hit.send({
      type: HitType.EVENT,
      category: EventCategory.ACTION_TRACKING,
      action: "add-to-cart-clicked",
    });

    alert("Item added to cart");
  };

  return (
    <Grid sx={{ backgroundColor: "#f2f2f7", p: 2 }}>
      <ItemDetail title={title} subtitle={subtitle} refNumber={refNumber} />
      <ItemImage imageUrl={imageUrl} imageAlt={imageAlt} imageTitle={imageTitle} />
      <Grid container sx={{ mb: 2, justifyContent:"space-between", flexWrap:"nowrap"}} >
        <PriceLabel>Price:</PriceLabel>
        {enableDiscountFlag ? (
          <DiscountedPrice price={price} discountPrice={discountPrice} />
        ) : (
          <ItemPrice price={price} />
        )}
      </Grid>

      <Grid container justifyContent="center">
        <AddCartButton backgroundColor={addToCartBtnColorFlag} onClick={handleAddToCart} />
      </Grid>
    </Grid>
  );
};
//end demo
