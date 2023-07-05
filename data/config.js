const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dxgnmusex',
  api_key: '491653741886622',
  api_secret:'kj5kc8mmN1zJ5H026LGmGPTQx5I',
  secure: true
});

module.exports = cloudinary;