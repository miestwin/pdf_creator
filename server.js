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
    createHtmlAndConvertToPdf(req.query.content, res);
});
//TODO readFileSync, writeFileSync, createPdf, remove all files in directory
function createHtmlAndConvertToPdf (content, res) {
    const bootstrap = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css";
    const options = {
        "format": "A4",
        "border": "10mm"
    };
    const min = 100;
    const max = 10000;
    const data = `<!doctype html><html><head><link rel="stylesheet" href="${bootstrap}"></head>
                <body>${content}</body></html>`;
    const pathToFile = `${__dirname}/temp/${Math.floor(Math.random() * (max - min + 1)) + min}`;
    const pathToHtmlFile = `${pathToFile}.html`;
    const pathToPdfFile = `${pathToFile}.pdf`; 

    createFile(pathToHtmlFile, pathToPdfFile, data, options, res);
}

function createFile (pathToHtmlFile, pathToPdfFile, data, options, res) {
    fs.writeFile(pathToHtmlFile, data, (err) => {
        if (err) console.log(err);
        readFile(pathToHtmlFile, pathToPdfFile, options, res);
    });
}

function readFile (pathToHtmlFile, pathToPdfFile, options, res) {
    fs.readFile(pathToHtmlFile, 'utf8', (err, data) => {
        if (err) console.log(err);
        createPdf(pathToHtmlFile, pathToPdfFile, data, options, res);
    });
}

function createPdf (pathToHtmlFile, pathToPdfFile, data, options, res) {
    pdf.create(data, options).toFile(pathToPdfFile, (err, data) => {
        if (err) console.log(err);
        downloadFile(pathToHtmlFile, data.filename, res);
    });
}

function downloadFile (pathToHtmlFile, pathToPdfFile, res) {
    res.download(pathToPdfFile, pathToPdfFile, err => {
        if (err) console.log(err);
        removeFile(pathToHtmlFile);
        removeFile(pathToPdfFile);
    });
}

function removeFile(pathToFile) {
    fs.unlink(pathToFile, err => { if (err) console.log(err); });
}

var port = process.env.PORT || 8000;
app.listen(port, () => { console.log(`listening on ${port}`); });