/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _Harsimranjeet kaur_____________________ Student ID: _174393215_____________ Date: _____15 june 2023___________
*
*  Online (Cyclic) Link: ______https://crowded-rose-beaver.cyclic.app__________________________________________________
*
********************************************************************************/ 

var express = require("express");
const path = require ("path");
const data = require("./store-service");
var app = express();
const multer=require("multer");
const cloudinary=require('cloudinary').v2
const streamifier=require('streamifier')
const upload = multer();
const exphbs = require('express-handlebars');


var HTTP_PORT = process.env.PORT || 8080;
// call this function after the http server starts listening for requests

app.use(express.static('public'));

function onHTTPSTART() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
  });
  
  app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
  });
  
  app.get("/items",(req,res)=>{
    store.getAllItems().then((data)=>{
      res.json(data);
    });

  app.get('/items/add', (req, res) => {
   res.sendFile(path.join(__dirname, 'views', 'addItem.html'));
      });

  })
  
  app.use((req, res)=>{
    res.status(404).send("Page does not exist, coming soon!!!");
 });

 //app.listen(HTTP_PORT, onHTTPSTART);
data.initialize().then(function(){
   app.listen(HTTP_PORT, onHTTPSTART);
}).catch(function(err){
  console.log("Unable to start server:"  + err);
})
  
  if(req.file){
  let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
              (error, result) => {
                  if (result) {
                      resolve(result);
                  } else {
                      reject(error);
                  }
              }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
  };

  async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
  }

  upload(req).then((uploaded)=>{
      processItem(uploaded.url);
  });
}else{
  processItem("");
}

function processItem(imageUrl){
  req.body.featureImage = imageUrl;

  // TODO: Process the req.body and add it as a new Item before redirecting to /items
} 
app.get('/items', (req, res) => {
  const category = req.query.category;
  const minDate = req.query.minDate;

  if (category) {
    // Call the getItemsByCategory function from store-service.js
    storeService.getItemsByCategory(category)
      .then((items) => {
        res.json(items);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error retrieving items by category.' });
      });
  } else if (minDate) {
    // Call the getItemsByMinDate function from store-service.js
    storeService.getItemsByMinDate(minDate)
      .then((items) => {
        res.json(items);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error retrieving items by min date.' });
      });
  } else {
    // Call the getAllItems function from store-service.js
    storeService.getAllItems()
      .then((items) => {
        res.json(items);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error retrieving items.' });
      });
  }
});
app.get('/item/:value', (req, res) => {
  const itemId = parseInt(req.params.value);

  // Call the getItemById function from store-service.js
  storeService.getItemById(itemId)
    .then((item) => {
      res.json(item);
    })
    .catch((error) => {
      res.status(404).json({ error: 'Item not found.' });
    });
});

const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'dxgnmusex'
  api_key: '491653741886622'
  api_secret:'kj5kc8mmN1zJ5H026LGmGPTQx5I'
  secure: true
});
// Configure Express-Handlebars
app.engine('hbs', exphbs({
  extname: '.hbs'
}));
app.set('view engine', 'hbs');


  