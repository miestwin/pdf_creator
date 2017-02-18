var fs = require('fs');
var pdf = require('html-pdf');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/download', (req, res) => {
    let bootstrap = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css";
    let data = `<!doctype html>
                <html>
                <head><link rel="stylesheet" href="${bootstrap}"</head>
                <body>${req.query.content}</body>
                </html>`;
    //TODO: file name date time
    fs.writeFile('myFile.html', data, err => {
        if (err)  throw err;
        console.log('Is\'s saved!');

        let html = fs.readFileSync('myFile.html', 'utf8');
        pdf.create(html).toFile('myFile.pdf', (err, res) => {
            if (err) console.log(err);
            console.log(res);


        })
    });
});

var port = process.env.PORT || 8000;
app.listen(port, () => { console.log(`listening on ${port}`); });

// var url = require('url');
// function handler (req, res) {
//     if (req.url.indexOf('/download') !== -1 && req.method === 'GET') {
//        console.log(url.parse(req.url, true).query);
//     }
// }