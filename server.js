var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/download', (req, res) => {
    //TODO: download file
});

var port = process.env.PORT || 8000;
app.listen(port, () => { console.log(`listening on ${port}`); });



// var fs = require('fs');
// var url = require('url');

// function handler (req, res) {
//     if (req.url.indexOf('/download') !== -1 && req.method === 'GET') {
//         createPdfFile(parseURL(req.url), res);
//     }
// }


// function parseURL(path) {
//     return url.parse(path, true).query;
// }