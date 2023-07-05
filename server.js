var express = require("express");
const path = require ("path");
const data = require("./store-service");
const cloudinary = require('./config');
const multer = require('multer');
const upload = multer();
const streamifier = require('streamifier');
const exphbs = require('express-handlebars');


var app = express();

var HTTP_PORT = process.env.PORT || 8080;
// call this function after the http server starts listening for requests
app.use(express.static('public'));
function onHTTPSTART() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }

app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
  
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
  });
  
  app.get("/about", function(req,res){
    res.render(path.join(__dirname,"/views/about.html"));
  });
  
  
  app.get("/items",(req,res)=>{
         store.getAllItems().then((data)=>{
          res.json(data);
         })
  })
  app.use((req,res)=>{
    res.status(404).send("Page does not exist, coming soon!!!");

  });

  app.get("/items/add", function(req,res){
    res.render(path.join(__dirname,"/views/addItem.html"));
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
  
app.get('/items', (req, res) => {
  const category = req.query.category;
  const minDate = req.query.minDate;

  if (category) {
    // Filter items by category
    const itemsByCategory = getItemsByCategory(category);
    res.json(itemsByCategory);
  } else if (minDate) {
    // Filter items by minimum date
    const itemsByMinDate = getItemsByMinDate(minDate);
    res.json(itemsByMinDate);
  } else {
    // Return all items without any filter
    res.json(getAllItems());
  }
});
app.get('/item/:id', (req, res) => {
  const itemId = req.params.id;
  const item = getItemById(itemId);

  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});
 })