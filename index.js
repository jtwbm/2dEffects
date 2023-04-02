const http = require('http');
const fs = require('fs');
const path = require('path');
const ext = /[\w\d_-]+\.[\w\d]+$/;

const hostname = '127.0.0.1';
const port = 3000;

// fs.readFile('./index.html', function (err, html) {
//   if (err) {
//       throw err; 
//   }

const server = http.createServer(function(req, res) {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream('index.html').pipe(res);
  } else if (ext.test(req.url)) {
    fs.exists(path.join(__dirname, req.url), function (exists) {
      if (exists) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('index.html').pipe(res);
      } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        fs.createReadStream('404.html').pipe(res);
      }
    });
  } else {
      //  add a RESTful service
  }

  // res.statusCode = 200;
  // res.writeHeader(200, {"Content-Type": "text/html"});  
  // res.write(html);  
  // res.end();  
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
// });
