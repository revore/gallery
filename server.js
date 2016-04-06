var connect = require('connect'),
    serveStatic = require('serve-static');
var http = require('http');
var fs = require('fs');

var serve = serveStatic("./");

var app = connect();
app.use(function static(req, res, next) {
  console.log("======");
  serve(req, res, next);
});

app.use(function middleware1(req, res, next) {
  console.log("middle");
  console.log(req.method);
  console.log(req.url);

  if (req.url.split("/")[1] == "i") {
    var proxy_req = http.request({
        host: 'hello-paulmckellar.revoreio.dev',
        port: 80,
        method: 'GET',
        path: "/i",
    }, function (proxy_res) {
      proxy_res.on('data', function (data) {
        res.write(data);
      });
      proxy_res.on('end', function (data) {
        res.end();
      });
    });
    proxy_req.end();

  }
  else {
    next();
  }
});

app.use(function middleware1(req, res, next) {
  console.log("write index missing");
  console.log(req.url);

  fs.readFile('./index.html', (err, data) => {
    if (err) throw err;
    res.write(data);
    res.end();
  });

  // next();
});

http.createServer(app).listen(3000);
