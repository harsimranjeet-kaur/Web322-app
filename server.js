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
var app = express();

var HTTP_PORT = process.env.PORT || 8080;
// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
  });
  
  app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
  });
  
  
  app.listen(HTTP_PORT, onHttpStart);


  