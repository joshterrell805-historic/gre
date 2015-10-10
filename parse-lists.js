var cheerio = require('cheerio'),
    fs = require('fs'),
    Promise = require('bluebird'),
    config = require('./config');

function pReadListFile(num) {
  return Promise.promisify(fs.readFile)('data/wordlist_' + num);
}

function parseListData(data) {
  var $ = cheerio.load(data);
  var arr = $('table.wordlist > tr');
  if (arr.length < 99 || arr.length > 101) {
    throw new Error('unexpected length ' + arr.length)
  }
  var groups = [];
  arr.map(function(i, elm) {
    var group = Math.floor(i/10);
    if (group == 10) group = 9;
    if (i % 10 == 0) {
      groups.push([]);
    }
    var word = {
      'word': $(elm).children().eq(0).text(),
      'definition': $(elm).children().eq(1).text(),
    };
    groups[group].push(word);
  });
  return groups;
}

function main() {
  var lists = [];
  var promises = [];

  for (var i = config.minList; i <= config.maxList; ++i) {
    var p = pReadListFile(i)
    .then(parseListData)
    .then(function(list) {
      lists.push(list);
    });
    promises.push(p);
  }

  Promise.all(promises)
  .then(function() {
    var listsStr = JSON.stringify(lists);
    return Promise.promisify(fs.writeFile)('data/lists.json', listsStr)
    .then(function() {
      return Promise.promisify(fs.writeFile)('data/lists.js',
          'window.wordLists = ' + listsStr + ';');
    })
  })
  .done();
}

if (!module.parent) {
  main();
}
