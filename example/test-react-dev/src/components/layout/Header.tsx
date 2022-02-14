import React from "react";
import { Link } from "react-router-dom";
import { RouteItem } from "../../@types/types";
import routeList from "../../routes/routeList";

type Props = {
  technology?: string;
  branch?: string;
  environment?: string;
};

const Header: React.FC<Props> = ({ technology, branch, environment }) => {
  const RouteLink = ({ item }: { item: RouteItem }) => {
    return (
      <li className="nav-item">
        <Link className={"nav-link"} to={item.path}>
          {item.key}
        </Link>
      </li>
    );
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/#">
        Flagship {technology} SDK QA App
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          {routeList.map((item) => (
            <RouteLink item={item} key={item.key} />
          ))}
        </ul>
        <span className="navbar-text">
          Branch : {branch} / Env : {environment}
        </span>
      </div>
    </nav>
  );
};

export default Header;
