/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: _Harsimranjeet kaur_____________________ Student ID: _174393215_____________ Date: __21 july 2023______________
*
*  Cyclic Web App URL: _____https://crowded-rose-beaver.cyclic.app___________________________________________________
*
*  GitHub Repository URL: _______https://github.com/harsimranjeet-kaur/Web322-app.git_______________________________________________
*
********************************************************************************/ 

var express = require("express");
const path = require ("path");
const data = require("./store-service");
const cloudinary = require('./config');
const multer = require('multer');
const upload = multer();
const streamifier = require('streamifier');
const exphbs = require('express-handlebars');
const handlebarsHelpers = require('./handlebars-helpers');
const itemData = require("./store-service");

var app = express();

var HTTP_PORT = process.env.PORT || 8080;


app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.engine('hbs', exphbs.engine({ extname: '.hbs', helpers: handlebarsHelpers }));

app.use(express.static('public'));
function onHTTPSTART() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
  app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.)/, "") : route.replace(/\/(.)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});

  
  app.get("/about", function(req,res){
    res.render("about");
  });
  
  
  app.get('/items', function(req, res) {
    storeService.getAllItems()
      .then((items) => {
        if (items.length > 0) {
          res.render('items', { Items: items });
        } else {
          res.render('items', { message: 'No results' });
        }
      })
      .catch(() => {
        res.render('items', { message: 'Error retrieving items' });
      });
  });
  
  app.get('/categories', function(req, res) {
    storeService.getCategories()
      .then((categories) => {
        if (categories.length > 0) {
          res.render('categories', { Categories: categories });
        } else {
          res.render('categories', { message: 'No results' });
        }
      })
      .catch(() => {
        res.render('categories', { message: 'Error retrieving categories' });
      });
  });
  
  
  app.use((req,res)=>{
    res.status(404).send("Page does not exist, coming soon!!!");

  });

  app.get('/Items/add', function(req, res) {
    storeService.getCategories()
      .then((categories) => {
        res.render('addPost', { categories: categories });
      })
      .catch(() => {
        res.render('addPost', { categories: [] });
      });
  });
  

 
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
})

app.get("/shop", async (req, res) => {
 
  let viewData = {};

  try {
    
    let items = [];

    
    if (req.query.category) {
      
      items = await itemData.getPublishedItemsByCategory(req.query.category);
    } else {
     
      items = await itemData.getPublishedItems();
    }

    
    items.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

   
    let post = items[0];

   
    viewData.items = items;
    viewData.item = item;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    
    let categories = await itemData.getCategories();

    
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  
  res.render("shop", { data: viewData });
});
app.get('/shop/:id', async (req, res) => {

  let viewData = {};

  try{

      
      let items = [];

     
      if(req.query.category){
         
          items = await itemData.getPublishedItemsByCategory(req.query.category);
      }else{
         
          items = await itemData.getPublishedItems();
      }

     
      items.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      
      viewData.items = items;

  }catch(err){
      viewData.message = "no results";
  }

  try{
     
      viewData.item = await itemData.getItemById(req.params.id);
  }catch(err){
      viewData.message = "no results"; 
  }

  try{
     
      let categories = await itemData.getCategories();

     
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }


  res.render("shop", {data: viewData})
});
app.use(express.urlencoded({ extended: true }));

app.get('/categories/add', function(req, res) {
  res.render('addCategory');
});
app.post('/categories/add', function(req, res) {
  const categoryData = {
    category: req.body.category
  };

  storeService.addCategory(categoryData)
    .then(() => {
      res.redirect('/categories');
    })
    .catch(() => {
      res.status(500).send('Unable to create category');
    });
});


app.get('/categories/delete/:id', function(req, res) {
  const categoryId = req.params.id;

  storeService.deleteCategoryById(categoryId)
    .then(() => {
      res.redirect('/categories');
    })
    .catch(() => {
      res.status(500).send('Unable to remove category / Category not found');
    });
});


app.get('/items/delete/:id', function(req, res) {
  const itemId = req.params.id;

  storeService.deletePostById(itemId)
    .then(() => {
      res.redirect('/items');
    })
    .catch(() => {
      res.status(500).send('Unable to remove item / Item not found');
    });
});
app.get('/Items/delete/:id', function(req, res) {
  const postId = req.params.id;

  storeService.deletePostById(postId)
    .then(() => {
      res.redirect('/Items');
    })
    .catch(() => {
      res.status(500).send('Unable to remove post / Post not found');
    });
});
