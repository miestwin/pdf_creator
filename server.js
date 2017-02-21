var fs = require('fs');
var pdf = require('markdown-pdf');
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
                if (removeFile(response.path_to_markdown_file)) Promise.reject(new Error(`Unable to remove ${response.path_to_markdown_file}`));
                if (removeFile(response.path_to_pdf_file)) Promise.reject(new Error(`Unable to remove ${response.path_to_markdown_file}`));
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: 'Internal server error happened'});
        });
});

function generateData (content) {
    
    const min = 100;
    const max = 10000;
    const pathToFile = `${__dirname}/temp/${Math.floor(Math.random() * (max - min + 1)) + min}`;

    let data = {};
    data.path_to_css = __dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css';
    data.file_content = content;
    data.path_to_markdown_file = `${pathToFile}.md`;
    data.path_to_pdf_file = `${pathToFile}.pdf`; 

    return data;
}

function createFile (response) {
    return new Promise((resolve, reject) => {
        fs.writeFile(response.path_to_markdown_file, response.file_content, (err) => {
            if (err) reject(err);
            resolve(response);
        });
    });
}

function readFile (response) {
    return new Promise((resolve, reject) => {
        fs.readFile(response.path_to_markdown_file, 'utf8', (err, data) => {
            if (err) reject(err);
            response.readed_html_file = data;
            resolve(response);
        });
    });
}

function createPdf (response) {
    return new Promise((resolve, reject) => {
        pdf({ cssPath: response.path_to_css}).from(response.path_to_markdown_file).to(response.path_to_pdf_file, () => {
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