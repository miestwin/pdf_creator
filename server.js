var fs = require('fs');
var pdf = require('html-pdf');
var express = require('express');
var app = express();

var port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));


//routes
app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/download', (req, res) => {
    createFile(generateData(req.query.content))
        .then(readFile)
        .then(createPdf)
        .then(response => {
            res.status(201);
            res.download(response.path_to_pdf_file, response.path_to_pdf_file, (err) => {
                if (err) Promise.reject(err);
                if (removeFile(response.path_to_html_file)) Promise.reject(new Error(`Unable to remove ${response.path_to_html_file}`));
                if (removeFile(response.path_to_pdf_file)) Promise.reject(new Error(`Unable to remove ${response.path_to_html_file}`));
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: 'Internal server error happened'});
        });
});

function generateData (content) {
    
    const bootstrap = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css";
    const min = 100;
    const max = 10000;
    const pathToFile = `${__dirname}/temp/${Math.floor(Math.random() * (max - min + 1)) + min}`;

    let data = {};
    data.converter_options = {
        "format": "A4",
        "border": "10mm"
    };
    
    data.file_content = `<!doctype html><html><head><link rel="stylesheet" href="${bootstrap}"></head>
                <body>${content}</body></html>`;
    data.path_to_html_file = `${pathToFile}.html`;
    data.path_to_pdf_file = `${pathToFile}.pdf`; 

    return data;
}

function createFile (response) {
    return new Promise((resolve, reject) => {
        fs.writeFile(response.path_to_html_file, response.file_content, (err) => {
            if (err) reject(err);
            resolve(response);
        });
    });
}

function readFile (response) {
    return new Promise((resolve, reject) => {
        fs.readFile(response.path_to_html_file, 'utf8', (err, data) => {
            if (err) reject(err);
            response.readed_html_file = data;
            resolve(response);
        });
    });
}

function createPdf (response) {
    return new Promise((resolve, reject) => {
        pdf.create(response.readed_html_file, response.converter_options).toFile(response.path_to_pdf_file, (err, data) => {
            if (err) reject(err);
            response.path_to_pdf_file = data.filename;
            resolve(response);
        });
    });
}

function removeFile(pathToFile) {
    fs.unlink(pathToFile, err => { 
        if (err) return err;
        return null; 
    });
}

app.listen(port, () => { console.log(`listening on ${port}`); });