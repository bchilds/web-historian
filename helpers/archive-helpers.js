var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = (callback) => {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    // this pulls test list
    data = data.split('\n');
    callback(data);   
  });
};

exports.isUrlInList = function(url, callback) {
  var truthyCheck;
  
  exports.readListOfUrls( (data) => {
    
    truthyCheck = data.includes(url);
    // console.log(truthyCheck);
    callback(truthyCheck);
    
  });  
};

exports.addUrlToList = function(url, callback) {
  
  fs.appendFile(exports.paths.list, url + '\n', function(err) {
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  //  archivedSites: path.join(__dirname, '../archives/sites'),
  fs.readdir(exports.paths.archivedSites, (err, files) => {
    callback(files.includes(url));
  });
};

exports.downloadUrls = function(urls) {
  //takes in a URL array
  for (var url of urls) {
    request(url, (err, response, body) => {
      fs.writeFile(exports.paths.archivedSites + '/' + url, body);
    });
  }
  
};















