module.exports = {
    navLink: function (url, options) {
      return '<li' +
        ((url === app.locals.activeRoute) ? ' class="active"' : '') +
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equals: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  };
  
