var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var htmlFetcher = require('../workers/htmlfetcher.js');
// require more modules/folders here!

// reading and displaying index.html if path is just '/'





// INDEX PAGE ----->

var readIndex = (req, res) => {
  //console.log('--------->  ' + archive.paths.siteAssets + '/index.html');
  fs.readFile(archive.paths.siteAssets + '/index.html', 'utf8', function(err, data) {
    // console.log('data------->', data);
    if (err) {
      throw err;
    }
    
    res.end(data);
  } );
};

// RESPONSES ------->

var handleResponse = (statusCode, res, data) => {
  headers = httpHelpers.headers;
  
  res.writeHead(statusCode, httpHelpers.headers);
  if (data) { 
    res.end(data); 
  } else {
    res.end();
  }
  
};


var submitSite = (req, res) => {
  //goal: append submitted sites to sites.txt
  // console.log('--------> DATA: ', req);
  var body = '';
  
  req.on('data', function(data) {
    body += data;
  });
  
  req.on('end', function() {
    // this takes JSON, not form data. Account for l8R
    var data = JSON.parse(body);
    
    //first, is the url archived?
    //exports.isUrlArchived = function(url, callback) {
    archive.isUrlArchived(data, (isArchived) => {
      //if yes, display that page
      if (isArchived) {
        //I don't know how to display a page yet
      } else {
      //if no,
        //is the url in our list?
        archive.isUrlInList(data, (isInList) =>{
        //if yes, display loading
          if (isInList) {
            //display loading to screen            
          } else {
            //if no, do below
            //this is the "is not archived, not in list"
            archive.addUrlToList(data.url, () => { 
              handleResponse(302, res);
            }); 
          }
        });
      }
    }); 
  });
};




// ROUTING ----->
var calls = {
  'GET': readIndex,
  'POST': submitSite,
};

var getIndexPageCall = (req, res) => {
  calls[req.method](req, res);
};

var routes = {
  '/': getIndexPageCall //is going to have a function to determine the call
};


exports.handleRequest = function (req, res) {
  //console.log('----------->   ', req);
  if (routes[req.url]) { 
    routes[req.url](req, res);
    // htmlFetcher.fetcher();
  } else {
    var url = req.url.substring(1);
    archive.isUrlArchived(url, (urlPresent) => {
      //if urlPresent is true...
      if (urlPresent) {
        //readFile using url
        fs.readFile(archive.paths.archivedSites + req.url, 'utf8', (err, data) => {
          //console.log(data);
          handleResponse(200, res, data);
        });
      } else {
      //if urlPresent is false...
        //we want to 404
        handleResponse(404, res);
      }
    });
  }
  

};


