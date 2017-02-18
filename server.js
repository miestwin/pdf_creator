'use strict';

var fs = require('fs');
var pdf = require('html-pdf');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/download', (req, res) => {

    const bootstrap = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css";
    const options = {
        "format": "A4",
        "border": "10mm"
    };

    const min = 100;
    const max = 10000;

    const data = `<!doctype html><html><head><link rel="stylesheet" href="${bootstrap}"></head>
                <body>${req.query.content}</body></html>`;

    const pathToFile = `${__dirname}/temp/${Math.floor(Math.random() * (max - min + 1)) + min}`;
    const pathToHtmlFile = `${pathToFile}.html`;
    const pathToPdfFile = `${pathToFile}.pdf`; 

    createHtmlAndConvertToPdf(pathToHtmlFile, pathToPdfFile, data, options, res);
});

//pyramid of doom
function createHtmlAndConvertToPdf(pathToHtmlFile, pathToPdfFile, content, options, res) {
    
    fs.writeFile(pathToHtmlFile, content, (err) => {
        if (err) {
            console.log(err);
        } else {

            fs.readFile(pathToHtmlFile, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {

                    pdf.create(data,options).toFile(pathToPdfFile, (err, info) => {
                        if (err) {
                            console.log(err);
                        } else {

                            res.download(info.filename, info.filename, err => {
                                if (err) {
                                    console.log(err);
                                } else {

                                    removeFile(info.filename);
                                    removeFile(pathToHtmlFile);
                                }
                            });
                        }
                    });
                }
            });
        }
    });

}

function removeFile(pathToFile) {
    fs.unlink(pathToFile, err => { if (err) console.log(err); });
}

var port = process.env.PORT || 8000;
app.listen(port, () => { console.log(`listening on ${port}`); });