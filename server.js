var connect = require('connect'),
    serveStatic = require('serve-static');
var http = require('http');
var fs = require('fs');
var url = require('url');


var serve = serveStatic("./");

var app = connect();
app.use(serve);

app.use(function middleware1(req, res, next) {
  // console.log("middle");
  // console.log(req.method);
  // console.log(req.url);
  // console.log(req.headers);
  // var url_parts = url.parse(req.url, true);
  // console.log(url_parts);

  if (req.url.split("/")[1] == "i") {
    var options = {
      host: 'gallery-paulmckellar.revoreio.dev',
      port: 80,
      method: req.method,
      path: req.url,
      headers: {},
    }

    if (req.headers["content-type"]) {
      options["headers"]["Content-Type"] = req.headers["content-type"]
    }

    var proxy_req = http.request(options, function(proxy_res) {
      res.writeHead(proxy_res.statusCode, proxy_res.headers);

      proxy_res.on('data', function (data) {
        res.write(data);
      });
      proxy_res.on('end', function (data) {
        res.end();
      });
    });

    req.on('data', function (data) {
      proxy_req.write(data);
    });
    req.on('end', function (data) {
      proxy_req.end();
    });

  }
  else {
    next();
  }
});

app.use(function middleware1(req, res, next) {
  // console.log("write index missing");
  // console.log(req.url);

  fs.readFile('./index.html', (err, data) => {
    if (err) throw err;
    res.write(data);
    res.end();
  });
});

http.createServer(app).listen(3000);
