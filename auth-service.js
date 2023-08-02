const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, unique: true },
  password: String,
  email: String,
  loginHistory: [{
    dateTime: Date,
    userAgent: String
  }]
});

let User; 

module.exports.initialize = function (connectionString) {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(connectionString);

    db.on('error', (err) => {
      reject(err); 
    });

    db.once('open', () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = function (userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
    } else {
      bcrypt.hash(userData.password, 10)
        .then((hash) => {
          userData.password = hash; 
          let newUser = new User(userData);
          newUser.save((err) => {
            if (err) {
              if (err.code === 11000) {
                reject("User Name already taken");
              } else {
                reject("There was an error creating the user: " + err);
              }
            } else {
              resolve();
            }
          });
        })
        .catch((err) => {
          reject("There was an error encrypting the password");
        });
    }
  });
};

module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.find({ userName: userData.userName }, (err, users) => {
      if (err) {
        reject("Unable to find user: " + userData.userName);
      } else {
        if (users.length === 0) {
          reject("Unable to find user: " + userData.userName);
        } else {
          bcrypt.compare(userData.password, users[0].password)
            .then((result) => {
              if (result) {
               
                users[0].loginHistory.push({ dateTime: new Date().toString(), userAgent: userData.userAgent });
                User.updateOne({ userName: users[0].userName }, { $set: { loginHistory: users[0].loginHistory } }, (err) => {
                  if (err) {
                    reject("There was an error verifying the user: " + err);
                  } else {
                    resolve(users[0]);
                  }
                });
              } else {
                reject("Incorrect Password for user: " + userData.userName);
              }
            })
            .catch((err) => {
              reject("There was an error verifying the password");
            });
        }
      }
    });
  });
};

