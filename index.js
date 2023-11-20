const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.use(express.json());

// just like a simple web server like Apache web server
// we are mapping file system paths to the app's virtual paths
app.use("/scripts", express.static(path.join(__dirname, "./scripts")));
app.use("/firebase", express.static(path.join(__dirname, "./node_modules/firebase")));
app.use("/components", express.static(path.join(__dirname, "./components")));
app.use("/styles", express.static(path.join(__dirname, "./styles")));
app.use("/images", express.static(path.join(__dirname, "./images")));
app.use("/pages", express.static(path.join(__dirname, "./pages")));

app.get("/", function (req, res) {
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("pages/index.html");
    res.send(doc);
})

app.get("/eachRecipe", function (req, res) {
  let dov = fs.readFileSync("pages/eachRecipe.html");
  res.send(doc);
})

app.get("/recipes", function (req, res) {
  // retrieve and send an HTML document from the file system
  let doc = fs.readFileSync("pages/recipeMenu.html");
  res.send(doc);
})

// for page not found (i.e., 404)
app.use(function (req, res, next) {
  // this could be a separate file too - but you'd have to make sure that you have the path
  // correct, otherewise, you'd get a 404 on the 404 (actually a 500 on the 404)
  res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
});

// RUN SERVER
let port = 8000;
app.listen(port, function () {
  console.log("Example app listening on port " + port + "!");
});
