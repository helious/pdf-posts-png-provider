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
    var pdfImage = new PDFImage(req.files['userPDF'].path);

    pdfImage.convertPage(0).then(function onPageConversion(imagePath) {
      fs.rename(imagePath, 'public/staging.png', function onImageRename(err) {
        res.redirect('/confirm'); 
      });
    });
  });

  app.use(express.static(__dirname + '/public'));
}

var fs              = require('fs'),
    express         = require('express'),
    app             = express(),
    multer          = require('multer'),
    multerAutoReap  = require('multer-autoreap'),
    PDFImage        = require("pdf-image").PDFImage,
    port            = process.env.PORT || 5000;

setupRoutes();

app.listen(port, function() {
  console.log('Node app is running on port', port);
});
