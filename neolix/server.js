var http = require('http');
var express = require('express');
var fs = require('fs');
var file = 'index.html'
var index = fs.readFileSync(file);
var app = express();
app.use('/public', express.static('public'));


app.get('/', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
  // res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});


// http.createServer(function (req, res) {
//
// }).listen(8000);
