var PdfCreator = require('./modules/PdfCreator.js');

module.exports = function(app) {
    
    app.get('/', (req, res) => {
        res.render('index.html');
    });

    app.get('/download', (req, res) => {
        PdfCreator(req.query.content, res);
    });
};