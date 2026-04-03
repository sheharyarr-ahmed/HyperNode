const http = require("http");
const fs = require("fs");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate.js");
const slugify = require("slugify");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8",
);
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8",
);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((product) => replaceTemplate(tempCard, product))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else if (pathname === "/product") {
    const product = dataObj[query.id];

    if (!product) {
      res.writeHead(404, { "Content-type": "text/html" });
      res.end("<h1>Product not found</h1>");
      return;
    }

    res.writeHead(200, { "Content-type": "text/html" });
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () =>
  console.log("listening o requests on port 8000"),
);
