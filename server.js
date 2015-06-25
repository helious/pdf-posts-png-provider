function setupRoutes() {
  app.use(function (req, res, next) {
    if (req.method === 'GET' && /^\/[\d\w]+(?=$|[\/?#])/.test(req.url)) {
      req.url = req.url.replace(/^\/([\d\w]+).*$/, "/$1.html");
    }

    if (req.url === '/') {
      req.url = '/index.html'
    }

    next();
  });

  app.use(multer({ dest: './tmp/' }));
  app.use(multerAutoReap);

  app.post('/upload', function postUpload(req, res) {
    console.log(req.files);

    res.redirect('/confirm');
  });

  app.use(express.static(__dirname + '/public'));
}

var express         = require('express'),
    app             = express(),
    multer          = require('multer'),
    multerAutoReap  = require('multer-autoreap'),
    http            = require('http'),
    httpserv        = http.createServer(app),
    port            = 8006,
    host            = '127.0.0.1';

httpserv.listen(port, host);

setupRoutes();
