/*********************************************************************************
*  WEB322 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: _Harsimranjeet kaur_____________________ Student ID: _174393215_____________ Date: __31 july 2023______________
*
*  Cyclic Web App URL: ______https://crowded-rose-beaver.cyclic.app__________________________________________________
*
*  GitHub Repository URL: _______https://github.com/harsimranjeet-kaur/Web322-app.git_______________________________________________
*
********************************************************************************/ 
const authData = require('./auth-service');
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
const express = require('express');
const storeData = require('./store-service');
const authData = require('./auth-service');
var app = express();
const clientSessions = require('client-sessions');


var HTTP_PORT = process.env.PORT || 8080;


app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.engine('hbs', exphbs.engine({ extname: '.hbs', helpers: handlebarsHelpers }));

app.use(clientSessions({
  cookieName: 'session',
  secret: 'week10example_web322',
  duration: 2 * 60 * 1000, 
  activeDuration: 1000 * 60 
}));

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
function ensureLogin(req, res, next) {
  if (!req.session || !req.session.userName) {
    res.redirect("/login");
  } else {
    next();
  }
}
app.get("/items", ensureLogin, function (req, res) {
  });

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});


app.post("/register", function (req, res) {
  authData.registerUser(req.body)
    .then(() => {
      res.render("register", { successMessage: "User created" });
    })
    .catch((err) => {
      res.render("register", { errorMessage: err, userName: req.body.userName });
    });
});


app.post("/login", function (req, res) {
  req.body.userAgent = req.get('User-Agent');
  authData.checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory
      };
      res.redirect('/items');
    })
    .catch((err) => {
      res.render("login", { errorMessage: err, userName: req.body.userName });
    });
});


app.get("/logout", function (req, res) {
  req.session.reset(); 
  res.redirect('/');
});


app.get("/userHistory", ensureLogin, function (req, res) {
  res.render("userHistory");
});

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
storeData.initialize()
  .then(authData.initialize) 
  .then(function () {
    app.listen(HTTP_PORT, function () {
      console.log("app listening on: " + HTTP_PORT);
    });
  }).catch(function (err) {
    console.log("unable to start server: " + err);
  });
