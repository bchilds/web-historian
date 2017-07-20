// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

// exports.readListOfUrls = (callback)
// exports.isUrlInList = function(url, callback)
// exports.isUrlArchived = function(url, callback)
// exports.downloadUrls = function(urls)

exports.fetcher = () => {
  archive.readListOfUrls( (dataArray) => {
    for (url of dataArray) {
      archive.isUrlArchived(url, (isArchived) => {
        if (!isArchived) {
          // notArchived.push(url);  
          archive.downloadUrls([url]);
        }
      });
    }
    // archive.downloadUrls(notArchived);
  });
};