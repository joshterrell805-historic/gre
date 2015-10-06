/**
 * Download all word lists from majortests.com.
 */

var request = require('request-promise'),
    Promise = require('bluebird'),
    fs = require('fs'),
    config = require('./config');


function pDownloadList(num) {
  var path = 'wordlist_' + zeroPad2(num),
      url  = 'http://www.majortests.com/gre/' + path;
  return request(url)
  .then(function(data) {
    return Promise.promisify(fs.writeFile)('data/wordlist_' + num, data);
  });
}

function zeroPad2(num) {
  if (num / 10 >= 1) {
    return num + '';
  } else {
    return '0' + num;
  }
}

function main() {
  var promises = [];
  for (var i = config.minList; i <= config.maxList; ++i) {
    promises.push(pDownloadList(i));
  }
  Promise.all(promises).done();
}

if (!module.parent) {
  main();
}
