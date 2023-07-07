const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const store = require("./store-service");

const app = express();
const PORT = process.env.PORT || 8080;

// Set up Handlebars as the view engine
app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
  })
);
app.set("view engine", "hbs");

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to set active route and viewing category
app.use((req, res, next) => {
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split("/")[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("about");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/items", (req, res) => {
  store.getAllItems()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.render("items", { message: "no results" });
    });
});

app.get("/items/add", (req, res) => {
  res.render("addPost");
});

app.post("/items/add", (req, res) => {
  // Handle file upload and processing
  // ...

  res.redirect("/items");
});

app.get("/shop", async (req, res) => {
  let viewData = {};

  try {
    let items = [];

    if (req.query.category) {
      items = await store.getPublishedItemsByCategory(req.query.category);
    } else {
      items = await store.getPublishedItems();
    }

    items.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
    let post = items[0];

    viewData.items = items;
    viewData.post = post;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    let categories = await store.getCategories();
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  res.render("shop", { data: viewData });
});

app.get("/shop/:id", async (req, res) => {
  let viewData = {};

  try {
    let items = [];

    if (req.query.category) {
      items = await store.getPublishedItemsByCategory(req.query.category);
    } else {
      items = await store.getPublishedItems();
    }

    items.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
    viewData.items = items;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    viewData.item = await store.getItemById(req.params.id);
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    let categories = await store.getCategories();
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  res.render("shop", { data: viewData });
});

app.get("/categories", async (req, res) => {
  try {
    let categories = await store.getCategories();
    res.render("categories", { categories: categories });
  } catch (err) {
    res.render("categories", { message: "no results" });
  }
});

app.use((req, res) => {
  res.status(404).render("404");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
