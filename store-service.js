var express = require("express");
const path = require ("path");
const data = require("./store-service");
const cloudinary = require('./config');
const multer = require('multer');
const upload = multer();
const streamifier = require('streamifier');
const exphbs = require('express-handlebars');
const helpers = require('./helpers');

var app = express();

var HTTP_PORT = process.env.PORT || 8080;
// call this function after the http server starts listening for requests
app.use(express.static('public'));
function onHTTPSTART() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }

app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
    
app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

  app.get("/about", function(req,res){
    res.render("about");
  });
  
  
  app.get('/items', function(req, res) {
    // Assuming you have a "getItems" function that returns a promise
    getItems()
      .then(function(data) {
        res.render('items', { items: data });
      })
      .catch(function(error) {
        res.render('items', { message: 'no results' });
      });
  });

 

  app.get("/items/add", function(req,res){
    res.render("addItem");
  })  

 // app.listen(HTTP_PORT, onHTTPSTART);
 data.initialize().then(function(){
  app.listen(HTTP_PORT, onHTTPSTART);
 }).catch(function(err){
  console.log("Unable to start server:"   + err);
 })
 app.post('/items/add', upload.single('featureImage'), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      try {
        let result = await streamUpload(req);
        console.log(result);
        return result;
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    upload(req)
      .then((uploaded) => {
        processItem(uploaded.url);
      })
      .catch((error) => {
        console.error(error);
        processItem("");
      });
  } else {
    processItem("");
  }
  function addItem(itemData) {
    return new Promise((resolve, reject) => {
      if (itemData.published === undefined) {
        itemData.published = false;
      } else {
        itemData.published = true;
      }
  
      itemData.id = items.length + 1;
      items.push(itemData);
  
      resolve(itemData);
    });
  }
})
app.get("/categories", (req, res) => {
  store.getAllCategories()
      .then((data) => {
          res.render("categories", { categories: data });
      })
      .catch((err) => {
          res.render("categories", { message: "no results" });
      });
});

app.get("/shop", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};

  try {
    // declare empty array to hold "post" objects
    let items = [];

    // if there's a "category" query, filter the returned posts by category
    if (req.query.category) {
      // Obtain the published "posts" by category
      items = await itemData.getPublishedItemsByCategory(req.query.category);
    } else {
      // Obtain the published "items"
      items = await itemData.getPublishedItems();
    }

    // sort the published items by postDate
    items.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

    // get the latest post from the front of the list (element 0)
    let post = items[0];

    // store the "items" and "post" data in the viewData object (to be passed to the view)
    viewData.items = items;
    viewData.item = item;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories = await itemData.getCategories();

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  // render the "shop" view with all of the data (viewData)
  res.render("shop", { data: viewData });
});

app.get('/shop/:id', async (req, res) => {

  // Declare an object to store properties for the view
  let viewData = {};

  try{

      // declare empty array to hold "item" objects
      let items = [];

      // if there's a "category" query, filter the returned posts by category
      if(req.query.category){
          // Obtain the published "posts" by category
          items = await itemData.getPublishedItemsByCategory(req.query.category);
      }else{
          // Obtain the published "posts"
          items = await itemData.getPublishedItems();
      }

      // sort the published items by postDate
      items.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      // store the "items" and "item" data in the viewData object (to be passed to the view)
      viewData.items = items;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      // Obtain the item by "id"
      viewData.item = await itemData.getItemById(req.params.id);
  }catch(err){
      viewData.message = "no results"; 
  }

  try{
      // Obtain the full list of "categories"
      let categories = await itemData.getCategories();

      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }

  // render the "shop" view with all of the data (viewData)
  res.render("shop", {data: viewData})
});
app.get("/", (req, res) => {
  res.redirect("/shop");
});
