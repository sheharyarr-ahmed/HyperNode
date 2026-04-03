const http = require("http");
const fs = require("fs");
const url = require("url");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const overviewCards = dataObj
  .map(
    (product) => `
      <li>
        <a href="/product?id=${product.id}">
          ${product.image} ${product.productName}
        </a>
        <p>From: ${product.from}</p>
        <p>Price: $${product.price}</p>
      </li>
    `,
  )
  .join("");

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    res.end(`
      <h1>Node Farm Overview</h1>
      <p>Open <a href="/api">/api</a> to see the JSON data.</p>
      <p>Click any product below to open its page.</p>
      <ul>
        ${overviewCards}
      </ul>
    `);
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else if (pathname === "/product") {
    const product = dataObj[query.id];

    res.writeHead(200, { "Content-type": "text/html" });

    if (!product) {
      res.end("<h1>Product not found</h1>");
      return;
    }

    res.end(`
      <h1>${product.productName}</h1>
      <p>${product.image}</p>
      <p>From: ${product.from}</p>
      <p>Price: $${product.price}</p>
      <p>Quantity: ${product.quantity}</p>
      <p>${product.description}</p>
      <p><a href="/api">See raw API JSON</a></p>
    `);
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () =>
  console.log("listening o requests on port 8000"),
);
