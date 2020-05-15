import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect } from "react";
import { view } from "@risingstack/react-easy-state";
import { useFsModifications } from "@flagship.io/react-sdk";

import cartStore from "../state/cart";

export default view(({ cartObj }) => {
  const router = useRouter();
  const pathname = router.pathname;

  useEffect(() => {
    if (JSON.stringify(cartStore.cart) != JSON.stringify(cartObj)) {
      cartStore.set(cartObj);
    }
  }, []);

  let fsFlags = {};
  try {
    fsFlags = useFsModifications([
      { key: "menuOrder", defaultValue: "" },
      { key: "wishlist", defaultValue: false },
    ]);
  } catch (e) {
    console.log("error on useFsModifications : ", e.message);
  }

  const nbCart = Object.keys(cartStore.cart).reduce((acc, cur) => {
    return acc + cartStore.cart[cur].quantity;
  }, 0);

  const wishlist = fsFlags.wishlist;
  const order =
    typeof fsFlags.menuOrder === "string" ? fsFlags.menuOrder.split(",") : [];
  const menu = [
    {
      title: "home",
      path: "/",
    },
    {
      title: "about",
      path: "/about",
    },
    {
      title: "shop",
      path: "/shop",
    },
    {
      title: "catalog",
      path: "/shop",
    },
    {
      title: "new arrivals",
      path: "/shop",
    },
    {
      title: "contact",
      path: "/contact",
    },
  ];

  return (
    <header className="site-navbar" role="banner">
      <div className="site-navbar-top">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-6 col-md-4 order-2 order-md-1 site-search-icon text-left">
              <form action="" className="site-block-top-search">
                <span className="icon icon-search2"></span>
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Search"
                />
              </form>
            </div>

            <div className="col-12 mb-3 mb-md-0 col-md-4 order-1 order-md-2 text-center">
              <div className="site-logo">
                <Link href="/">
                  <a className="js-logo-clone">Shoppers</a>
                </Link>
              </div>
            </div>

            <div className="col-6 col-md-4 order-3 order-md-3 text-right">
              <div className="site-top-icons">
                <ul>
                  <li>
                    <a href="#">
                      <span className="icon icon-person"></span>
                    </a>
                  </li>
                  {wishlist && (
                    <li>
                      <a href="#">
                        <span className="icon icon-heart-o"></span>
                      </a>
                    </li>
                  )}
                  <li>
                    <Link href="/cart">
                      <a className="site-cart">
                        <span className="icon icon-shopping_cart"></span>
                        <span className="count">{nbCart}</span>
                      </a>
                    </Link>
                  </li>
                  <li className="d-inline-block d-md-none ml-md-0">
                    <a href="#" className="site-menu-toggle js-menu-toggle">
                      <span className="icon-menu"></span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav
        className="site-navigation text-right text-md-center"
        role="navigation"
      >
        <div className="container">
          <ul className="site-menu js-clone-nav d-none d-md-block">
            {menu
              .sort((a, b) => {
                const aIndex = order.findIndex((i) => i === a.title) || 0;
                const bIndex = order.findIndex((i) => i === b.title) || 0;
                return aIndex - bIndex;
              })
              .map((m) => (
                <li
                  key={m.title}
                  className={(pathname == m.path && "active") || ""}
                >
                  <Link href={m.path}>
                    <a>{m.title}</a>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </nav>
    </header>
  );
});
