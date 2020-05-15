import Link from "next/link";
import products from "../data/products";
import Quantity from "../components/quantity";
import { useState, useReducer } from "react";
import { setCookie, parseCookies } from "nookies";
import cartStore from "../state/cart";
import { view } from "@risingstack/react-easy-state";

export default function Cart({ ctx }) {
  const computeCartObject = () => {
    const { cart } = parseCookies(ctx);

    let cartObj = {};
    if (cart) {
      cartObj = JSON.parse(cart);
    }
    return cartObj;
  };

  const computeCartProducts = () => {
    const cartObj = computeCartObject();
    return products
      .filter((p) => Object.keys(cartObj).includes(p.id.toString()))
      .map((p) => ({
        ...p,
        quantity: cartObj[p.id].quantity,
      }));
  };

  const [cartProducts, setCartProducts] = useState(computeCartProducts());

  const updateQuantity = (pid, qty) => {
    const newCart = { ...computeCartObject() };
    newCart[pid] = newCart[pid] || { quantity: 0 };
    newCart[pid] = { quantity: qty };

    setCookie(null, "cart", JSON.stringify(newCart), {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    cartStore.set(newCart);
    setCartProducts(computeCartProducts());
  };

  const removeFromCart = (pid) => {
    const newCart = { ...computeCartObject() };
    delete newCart[pid];

    setCookie(null, "cart", JSON.stringify(newCart), {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    cartStore.set(newCart);
    setCartProducts(computeCartProducts());
  };

  return (
    <>
      <div className="bg-light py-3">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-0">
              <Link href="/">
                <a>Home </a>
              </Link>
              <span className="mx-2 mb-0">/</span>{" "}
              <strong className="text-black">Cart</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section">
        <div className="container">
          <div className="row mb-5">
            <form className="col-md-12" method="post">
              <div className="site-blocks-table">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="product-thumbnail">Image</th>
                      <th className="product-name">Product</th>
                      <th className="product-price">Price</th>
                      <th className="product-quantity">Quantity</th>
                      <th className="product-total">Total</th>
                      <th className="product-remove">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartProducts.map((p) => (
                      <tr key={p.id}>
                        <td className="product-thumbnail">
                          <img
                            src={p.picture}
                            alt="Image"
                            className="img-fluid"
                          />
                        </td>
                        <td className="product-name">
                          <h2 className="h5 text-black">{p.name}</h2>
                        </td>
                        <td>${p.price}</td>
                        <td>
                          <Quantity
                            quantity={p.quantity}
                            onChange={(qty) => updateQuantity(p.id, qty)}
                          />
                        </td>
                        <td>${p.price * p.quantity}</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => removeFromCart(p.id)}
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </form>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="row mb-5">
                <div className="col-md-6 mb-3 mb-md-0">
                  <button className="btn btn-primary btn-sm btn-block">
                    Update Cart
                  </button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-outline-primary btn-sm btn-block">
                    Continue Shopping
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <label className="text-black h4" htmlFor="coupon">
                    Coupon
                  </label>
                  <p>Enter your coupon code if you have one.</p>
                </div>
                <div className="col-md-8 mb-3 mb-md-0">
                  <input
                    type="text"
                    className="form-control py-3"
                    id="coupon"
                    placeholder="Coupon Code"
                  />
                </div>
                <div className="col-md-4">
                  <button className="btn btn-primary btn-sm">
                    Apply Coupon
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6 pl-5">
              <div className="row justify-content-end">
                <div className="col-md-7">
                  <div className="row">
                    <div className="col-md-12 text-right border-bottom mb-5">
                      <h3 className="text-black h4 text-uppercase">
                        Cart Totals
                      </h3>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <span className="text-black">Subtotal</span>
                    </div>
                    <div className="col-md-6 text-right">
                      <strong className="text-black">$230.00</strong>
                    </div>
                  </div>
                  <div className="row mb-5">
                    <div className="col-md-6">
                      <span className="text-black">Total</span>
                    </div>
                    <div className="col-md-6 text-right">
                      <strong className="text-black">$230.00</strong>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <Link href="/checkout">
                        <a className="btn btn-primary btn-lg py-3 btn-block">
                          Proceed To Checkout
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
