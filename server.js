const fs = require('fs');
const pdf = require('markdown-pdf');
const winston = require('winston');
const express = require('express');
const app = express();

const port = process.env.PORT || 8000;
winston.level = process.env.LOG_LEVEL || 'debug';

winston.configure({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            name: 'info-file',
            filename: 'filelog-info.log',
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: 'filelog-error.log',
            level: 'error'
        })
    ]
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/download', (req, res) => {
    createFile(generateData(req.query))
    .then(createPdf)
    .then(response => {
        res.download(response.pathToPdf, response.pathToPdf, (err) => {
            if (err) winston.log('error', err);
            removeFile(response.path);
            removeFile(response.pathToPdf);
        });
    })
    .catch(err => {
        winston.log('error', err);
        //202 The request has been accepted for processing, but the processing has not been completed.
        res.status(202).send({error: err});
    });
});

app.get('*', (req, res) => {
    res.status(404).send({message: 'Not Found'});
});

const generateData = query => {
    const min = 100;
    const max = 10000;
    let data = {};
    data.options = {
        cssPath: __dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css',
        paperFormat: 'A4',
        paperBorder: '1cm'
    }; //options for markdown-pdf
    data.content = query.content; //file content
    data.path = `${__dirname}/temp/${Math.floor(Math.random() * (max - min + 1)) + min}.md`; //path to md file with random name
    data.pathToPdf = changeFormat(data.path, 'pdf');
    return data;
}

const createFile = response => {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFileSync(response.path, response.content);
            winston.log('info', `Create new file ${response.path}`);
            resolve(response);
        } catch(e) {
            reject(e);
        }
    });
}

/*
    Create PDF file based on Markdown file
    Return Promise
    pdf([options to convert]).from([path to md file]).to([path to pdf file], callback)
*/
const createPdf = response => {
    return new Promise((resolve, reject) => {
        pdf(response.options).from(response.path).to(response.pathToPdf, () => {
            winston.log('info', `Create new file ${response.pathToPdf}`);
            resolve(response);
        });
    });
}

const removeFile = path => {
    fs.unlink(path, (err) => { 
        if (err) {
            winston.log('error', err);
        } else {
            winston.log('info', `Remove file ${path}`);
        }
    });
}

const changeFormat = (path, format) => `${path.slice(0, path.lastIndexOf('.'))}.${format}`

app.listen(port, () => { winston.log('info', `listening on ${port}`); });