const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");
// const slugify = require("slugify");
//reading a file
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// writing a file

// const textOut = `This is what we know about the avocado .${textIn}.\n created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written");

//using async function to read a file

// fs.readFile(`./txt/start.txt`, "utf-8", (err, data) => {
//   console.log(data);
// });
// console.log("will read file");

//callback async function demo with error throwing
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR1!!! 💥");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     if (err) return console.log("ERROR2!!! 💥");
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         `./txt/final.txt`,
//         `${data2} \n ${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("Your file has been written");
//         }
//       );
//     });
//   });
// });
// console.log("will read file!");

//creating a simple web server
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data).map((product) => {
  return {
    ...product,
    slug: slugify(product.productName, { lower: true }),
  };
});

const cardsHTML = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);
    res.end(output);
  } else if (pathname.startsWith("/product/")) {
    const slug = pathname.split("/product/")[1];
    const product = dataObj.find((el) => el.slug === slug);

    if (product) {
      res.writeHead(200, { "content-type": "text/html" });
      const output = replaceTemplate(tempProduct, product);
      res.end(output);
    } else {
      res.writeHead(404, { "Content-type": "text/html" });
      res.end("<h1>Product Not found</h1>");
    }
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "hello-world",
    });
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port number 8000");
});
