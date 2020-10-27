const express = require("express");
const path = require("path");

const indexRoute = require("./Routes");

const port = 8080;

const main = async () => {
  const app = express();
  app.set("views", __dirname + "/Views");
  app.set("view engine", "jsx");
  app.engine("jsx", require("express-react-views").createEngine());

  app.use(
    "/scripts",
    express.static(
      path.join(__dirname, "..") + "/node_modules/react-bootstrap/dist/"
    )
  );
  app.use(indexRoute);

  app.listen(port, () => {
    console.log("express server listening");
  });
};

main().catch(err => {
  console.error(err);
});
