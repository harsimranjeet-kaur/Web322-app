const fs = require("fs");
let items = [];
let categories = [];

module.exports.intialize = function(){
    return new Promise((resolve,reject))=>{
        fs.readFile('./data/items.json',(err, itemsData)=>{
            if (err){
                reject(err);
            }else{
                items = JSON.parse(data);
                resolve();
            }

        })
    })

}

module.exports.getAllItems = function(){
    return new Promise((resolve, reject)=>{
        if(items.length==0){
           reject("NO Items to show")
        }else{
             resolve(items);
        }      
    })
}

module.exports.getPublishedItems = function(){
    return new Promise((resolve,reject)=>{
        let publishedItems = [];
        for(let i = 0; i< items.length; i++){
            if(items[i].isPublishedItems==true){
                publishedItems.push(items[i]);
            }
        }
        if(publishedItems.length==0){
            reject("No PublishedItems to be displayed");
        }else{
            resolve(publishedItems);
        }
    })
}
function getItemsByCategory(category) {
    return new Promise((resolve, reject) => {
      const filteredItems = items.filter((item) => item.category === category);
      if (filteredItems.length > 0) {
        resolve(filteredItems);
      } else {
        reject('No results returned.');
      }
    });
  }
  
  function getItemsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
      const minDate = new Date(minDateStr);
      const filteredItems = items.filter((item) => new Date(item.postDate) >= minDate);
      if (filteredItems.length > 0) {
        resolve(filteredItems);
      } else {
        reject('No results returned.');
      }
    });
  }
  
  function getItemById(id) {
    return new Promise((resolve, reject) => {
      const item = items.find((item) => item.id === id);
      if (item) {
        resolve(item);
      } else {
        reject('No result returned.');
      }
    });
  }
  
  module.exports = {
    // Existing functions
    addItem,
    // New functions
    getItemsByCategory,
    getItemsByMinDate,
    getItemById
  };
  