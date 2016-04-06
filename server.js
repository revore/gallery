var http = require('http');

http.createServer(onRequest).listen(3000);

function onRequest(client_req, client_res) {
  console.log('serve: ' + client_req.url);
  // console.log(client_req.url.split("/"))

  if (client_req.url.split("/")[1] == "i") {
    var options = {
      hostname: 'hello-paulmckellar.revoreio.dev',
      port: 80,
      path: client_req.url,
      method: 'GET'
    };

    var proxy = http.request(options, function (res) {
      res.pipe(client_res, {
        end: true
      });
    });

    client_req.pipe(proxy, {
      end: true
    });
  }
  else {

  }
}
