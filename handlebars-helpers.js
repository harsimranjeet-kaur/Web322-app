// handlebars-helpers.js
module.exports = {
    formatDate: function(dateObj) {
      let year = dateObj.getFullYear();
      let month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      let day = dateObj.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  };
   app.engine(
    'hbs',
    exphbs({
        helpers: {
            formatDate: formatDate,
        },
    })
   );
