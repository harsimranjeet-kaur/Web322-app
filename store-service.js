const Sequelize = require('sequelize');
const sequelize = new Sequelize('huookmow', 'huookmow', 'RPLz_RqFuuFkQsW1WvOL3yp1Xclmk8vn', {
    host: 'mahmud.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

const Item = sequelize.define('Item', {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
  price: Sequelize.DOUBLE
});

const Category = sequelize.define('Category', {
  category: Sequelize.STRING
});
Item.belongsTo(Category, { foreignKey: 'category' });



module.exports.initialize = function() {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getAllItems = function() {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getItemsByCategory = function(category) {
  return new Promise((resolve, reject) => {
    reject();
  });
};
module.exports.getItemsByMinDate = function(minDateStr) {
  const { Op } = Sequelize;
  return Item.findAll({
    where: {
      postDate: {
        [Op.gte]: new Date(minDateStr)
      }
    }
  })
    .then((items) => {
      return Promise.resolve(items);
    })
    .catch(() => {
      return Promise.reject('No results returned');
    });
};

module.exports.getItemById = function(id) {
  return Item.findAll({ where: { id: id } })
    .then((items) => {
      if (items.length > 0) {
        return Promise.resolve(items[0]);
      } else {
        return Promise.reject('No results returned');
      }
    })
    .catch(() => {
      return Promise.reject('No results returned');
    });
};

module.exports.addItem = function(itemData) {
  itemData.published = itemData.published ? true : false;

  for (let prop in itemData) {
    if (itemData[prop] === '') {
      itemData[prop] = null;
    }
  }

  itemData.postDate = new Date();

  return Item.create(itemData)
    .then(() => {
      return Promise.resolve();
    })
    .catch(() => {
      return Promise.reject('Unable to create post');
    });
};


module.exports.getPublishedItems = function() {
  return Item.findAll({ where: { published: true } })
    .then((items) => {
      return Promise.resolve(items);
    })
    .catch(() => {
      return Promise.reject('No results returned');
    });
};


module.exports.getPublishedItemsByCategory = function(category) {
  return Item.findAll({ where: { published: true, category: category } })
    .then((items) => {
      return Promise.resolve(items);
    })
    .catch(() => {
      return Promise.reject('No results returned');
    });
};

module.exports.getCategories = function() {
  return Category.findAll()
    .then((categories) => {
      return Promise.resolve(categories);
    })
    .catch(() => {
      return Promise.reject('No results returned');
    });
};
module.exports.addCategory = function(categoryData) {
  for (let prop in categoryData) {
    if (categoryData[prop] === '') {
      categoryData[prop] = null;
    }
  }

  return Category.create(categoryData)
    .then(() => {
      return Promise.resolve();
    })
    .catch(() => {
      return Promise.reject('Unable to create category');
    });
};
module.exports.deleteCategoryById = function(id) {
  return Category.destroy({ where: { id: id } })
    .then((rowsDeleted) => {
      if (rowsDeleted > 0) {
        return Promise.resolve();
      } else {
        return Promise.reject('Category not found');
      }
    })
    .catch(() => {
      return Promise.reject('Unable to delete category');
    });
};
module.exports.deletePostById = function(id) {
  return Post.destroy({ where: { id: id } })
    .then((rowsDeleted) => {
      if (rowsDeleted > 0) {
        return Promise.resolve();
      } else {
        return Promise.reject('Post not found');
      }
    })
    .catch(() => {
      return Promise.reject('Unable to delete post');
    });
};
function deletePostById(id) {
  return Post.destroy({
    where: {
      id: id
    }
  });
}

module.exports = {
  
  deletePostById
};
