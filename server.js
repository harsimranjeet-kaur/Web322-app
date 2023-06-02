/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: ______________________ Student ID: ______________ Date: ________________
*
*  Online (Cyclic) Link: ________________________________________________________
*
********************************************************************************/ 

var express = require("express");
const path = require ("path");
const data = require("./store-service");
var app = express();

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
    })
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



  