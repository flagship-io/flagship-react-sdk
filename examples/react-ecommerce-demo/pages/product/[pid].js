import { useRouter } from "next/router";
import Link from "next/link";

import products from "../../data/products";
import { setCookie } from "nookies";
import { useState } from "react";
import cartStore from "../../state/cart";

export default function Product({ cartObj }) {
  const router = useRouter();
  const { pid } = router.query;

  const product = products.find((p) => p.id === Number.parseInt(pid));

  if (!product) {
    return <></>;
  }

  const [quantity, setQuantity] = useState(1);

  const addToCart = () => {
    const newCart = { ...cartObj };
    newCart[pid] = newCart[pid] || { quantity: 0 };
    newCart[pid] = { quantity: newCart[pid].quantity + quantity };

    setCookie(null, "cart", JSON.stringify(newCart), {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    cartStore.set(newCart);
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
              <strong className="text-black">{product.name}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <img src={product.picture} alt="Image" className="img-fluid" />
            </div>
            <div className="col-md-6">
              <h2 className="text-black">{product.name}</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Pariatur, vitae, explicabo? Incidunt facere, natus soluta
                dolores iusto! Molestiae expedita veritatis nesciunt doloremque
                sint asperiores fuga voluptas, distinctio, aperiam, ratione
                dolore.
              </p>
              <p className="mb-4">
                Ex numquam veritatis debitis minima quo error quam eos dolorum
                quidem perferendis. Quos repellat dignissimos minus, eveniet nam
                voluptatibus molestias omnis reiciendis perspiciatis illum hic
                magni iste, velit aperiam quis.
              </p>
              <p>
                <strong className="text-primary h4">$50.00</strong>
              </p>
              <div className="mb-1 d-flex">
                <label htmlFor="option-sm" className="d-flex mr-3 mb-3">
                  <span
                    className="d-inline-block mr-2"
                    style={{ top: "-2px", position: "relative" }}
                  >
                    <input type="radio" id="option-sm" name="shop-sizes" />
                  </span>{" "}
                  <span className="d-inline-block text-black">Small</span>
                </label>
                <label htmlFor="option-md" className="d-flex mr-3 mb-3">
                  <span
                    className="d-inline-block mr-2"
                    style={{ top: "-2px", position: "relative" }}
                  >
                    <input type="radio" id="option-md" name="shop-sizes" />
                  </span>{" "}
                  <span className="d-inline-block text-black">Medium</span>
                </label>
                <label htmlFor="option-lg" className="d-flex mr-3 mb-3">
                  <span
                    className="d-inline-block mr-2"
                    style={{ top: "-2px", position: "relative" }}
                  >
                    <input type="radio" id="option-lg" name="shop-sizes" />
                  </span>{" "}
                  <span className="d-inline-block text-black">Large</span>
                </label>
                <label htmlFor="option-xl" className="d-flex mr-3 mb-3">
                  <span
                    className="d-inline-block mr-2"
                    style={{ top: "-2px", position: "relative" }}
                  >
                    <input type="radio" id="option-xl" name="shop-sizes" />
                  </span>{" "}
                  <span className="d-inline-block text-black">
                    {" "}
                    Extra Large
                  </span>
                </label>
              </div>
              <div className="mb-5">
                <div className="input-group mb-3" style={{ maxWidth: "120px" }}>
                  <div className="input-group-prepend">
                    <button
                      className="btn btn-outline-primary js-btn-minus"
                      type="button"
                      onClick={() => setQuantity(Math.max(quantity - 1, 0))}
                    >
                      &minus;
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control text-center"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder=""
                    aria-label="Example text with button addon"
                    aria-describedby="button-addon1"
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-primary js-btn-plus"
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <p>
                <button
                  className="buy-now btn btn-sm btn-primary"
                  onClick={() => addToCart()}
                >
                  Add To Cart
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section block-3 site-blocks-2 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-7 site-section-heading text-center pt-4">
              <h2>Featured Products</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="nonloop-block-3 owl-carousel">
                <div className="item">
                  <div className="block-4 text-center">
                    <figure className="block-4-image">
                      <img
                        src={product.picture}
                        alt="Image placeholder"
                        className="img-fluid"
                      />
                    </figure>
                    <div className="block-4-text p-4">
                      <h3>
                        <a href="#">Tank Top</a>
                      </h3>
                      <p className="mb-0">Finding perfect t-shirt</p>
                      <p className="text-primary font-weight-bold">$50</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="block-4 text-center">
                    <figure className="block-4-image">
                      <img
                        src="/images/shoe_1.jpg"
                        alt="Image placeholder"
                        className="img-fluid"
                      />
                    </figure>
                    <div className="block-4-text p-4">
                      <h3>
                        <a href="#">Corater</a>
                      </h3>
                      <p className="mb-0">Finding perfect products</p>
                      <p className="text-primary font-weight-bold">$50</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="block-4 text-center">
                    <figure className="block-4-image">
                      <img
                        src="/images/cloth_2.jpg"
                        alt="Image placeholder"
                        className="img-fluid"
                      />
                    </figure>
                    <div className="block-4-text p-4">
                      <h3>
                        <a href="#">Polo Shirt</a>
                      </h3>
                      <p className="mb-0">Finding perfect products</p>
                      <p className="text-primary font-weight-bold">$50</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="block-4 text-center">
                    <figure className="block-4-image">
                      <img
                        src="/images/cloth_3.jpg"
                        alt="Image placeholder"
                        className="img-fluid"
                      />
                    </figure>
                    <div className="block-4-text p-4">
                      <h3>
                        <a href="#">T-Shirt Mockup</a>
                      </h3>
                      <p className="mb-0">Finding perfect products</p>
                      <p className="text-primary font-weight-bold">$50</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="block-4 text-center">
                    <figure className="block-4-image">
                      <img
                        src="/images/shoe_1.jpg"
                        alt="Image placeholder"
                        className="img-fluid"
                      />
                    </figure>
                    <div className="block-4-text p-4">
                      <h3>
                        <a href="#">Corater</a>
                      </h3>
                      <p className="mb-0">Finding perfect products</p>
                      <p className="text-primary font-weight-bold">$50</p>
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
