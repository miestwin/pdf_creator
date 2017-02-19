var fs = require('fs');
var pdf = require('html-pdf');

module.exports = (content, res) => {
    
    const bootstrap = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css";
    const min = 100;
    const max = 10000;
    const pathToFile = `${__dirname}/${Math.floor(Math.random() * (max - min + 1)) + min}`;

    let data = {};
    data.converter_options = {
        "format": "A4",
        "border": "10mm"
    };
    data.file_content = `<!doctype html><html><head><link rel="stylesheet" href="${bootstrap}"></head>
                <body>${content}</body></html>`;
    data.path_to_html_file = `${pathToFile}.html`;
    data.path_to_pdf_file = `${pathToFile}.pdf`; 

    createFile(data, res);
}

function createFile (data, res) {
    fs.writeFile(data.path_to_html_file, data.file_content, (err) => {
        if (err) console.log(err);
        readFile(data, res);
    });
}

function readFile (data, res) {
    fs.readFile(data.path_to_html_file, 'utf8', (err, file) => {
        if (err) console.log(err);
        createPdf(data, file, res);
    });
}

function createPdf (data, file, res) {
    pdf.create(file, data.converter_options).toFile(data.path_to_pdf_file, (err, info) => {
        if (err) console.log(err);
        data.path_to_pdf_file = info.filename;
        downloadFile(data, res);
    });
}

function downloadFile (data, res) {
    res.download(data.path_to_pdf_file, data.path_to_pdf_file, err => {
        if (err) console.log(err);
        removeFile(data.path_to_html_file);
        removeFile(data.path_to_pdf_file);
    });
}

function removeFile(pathToFile) {
    fs.unlink(pathToFile, err => { if (err) console.log(err); });
}