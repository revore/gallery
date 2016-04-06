var connect = require('connect'),
    serveStatic = require('serve-static');
var http = require('http');

var serve = serveStatic("./");

var app = connect();
app.use(function static(req, res, next) {
  serve(req, res, next);
});

app.use(function middleware1(req, res, next) {
  if (req.url.split("/")[1] == "i") {
    console.log("internal");
  }
  next();
});

http.createServer(app).listen(3000);
