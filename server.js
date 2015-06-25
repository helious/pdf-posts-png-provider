function startExpress() {
  app.use(function (req, res, next) {
    if (req.method === 'GET' && /^\/[\d\w]+(?=$|[\/?#])/.test(req.url)) {
      req.url = req.url.replace(/^\/([\d\w]+).*$/, '/$1.html');
    }

    if (req.url === '/') {
      req.url = '/index.html'
    }

    next();
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

  app.listen(port, function() {});
}

var fs              = require('fs'),
    exec            = require('child_process').exec,
    express         = require('express'),
    app             = express(),
    multer          = require('multer'),
    multerAutoReap  = require('multer-autoreap'),
    port            = process.env.PORT || 5000;

startExpress();
