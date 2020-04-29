import { store } from "@risingstack/react-easy-state";

const cartStore = store({
  cart: {},
  set: (newCart) => {
    Object.assign(cartStore, { cart: { ...newCart } });
  },
});

export default cartStore;
