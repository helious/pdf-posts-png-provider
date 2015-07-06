function startExpress() {
  app.use(function (req, res, next) {
    if (req.method === 'GET' && /^\/[\d\w]+(?=$|[\/?#])/.test(req.url)) {
      function authenticate() {
        var credentials = basicAuth(req);

        if (!credentials || credentials.name !== process.env.CDN_USER || credentials.pass !== process.env.CDN_PASS) {
          res.setHeader('WWW-Authenticate', 'Basic');
          res.statusCode = 401;
          res.end();
        }
      }

      if (req.url.indexOf('/images') < 0 && req.url.indexOf('/fonts') < 0) {
        authenticate();

        req.url = req.url.replace(/^\/([\d\w]+).*$/, '/$1.html');
      } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
    }

    if (req.url === '/') {
      authenticate();

      req.url = '/index.html';
    }

    if (res.statusCode !== 401) {
      next();
    }
  });

  app.use(multer({ dest: './tmp/' }));
  app.use(multerAutoReap);

  app.post('/deploy', function getDeploy(req, res) {
    fs.rename('public/staging.png', 'public/pdf.png', function afterRename() {
      res.redirect('/success');
    });
  });

  app.post('/upload', function postUpload(req, res) {
    exec('convert -density 400 ' + req.files['userPDF'].path + ' -quality 100 public/staging.png', function afterConvert(error, stdout, stderr) {
      res.redirect('/confirm');
    });
  });

  app.use(express.static(__dirname + '/public'));

  app.listen(port, function () {});
}

var fs              = require('fs'),
    exec            = require('child_process').exec,
    express         = require('express'),
    app             = express(),
    multer          = require('multer'),
    multerAutoReap  = require('multer-autoreap'),
    basicAuth       = require('basic-auth'),
    port            = process.env.PORT || 5000;

startExpress();
