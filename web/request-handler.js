var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!

// reading and displaying index.html if path is just '/'
var readIndex = (res) => {
  //console.log('--------->  ' + archive.paths.siteAssets + '/index.html');
  fs.readFile(archive.paths.siteAssets + '/index.html', 'utf8', function(err, data) {
    // console.log('data------->', data);
    if (err) {
      throw err;
    }
    
    res.end(data);
  } );
};

var routes = {
  '/': readIndex
};

exports.handleRequest = function (req, res) {
  
  routes[req.url](res);

};


