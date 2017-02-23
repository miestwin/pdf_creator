var fs = require('fs');
var pdf = require('markdown-pdf');
var express = require('express');
var app = express();

var port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/download', (req, res) => {
    createFile(generateData(req.query))
    .then(createPdf)
    .then(response => {
        res.download(changeFormat(response.path, 'pdf'), changeFormat(response.path, 'pdf'), (err) => {
            if (err) Promise.reject(err);
            err = removeFile(response.path);
            if (err) console.log(err);
            err = removeFile(changeFormat(response.path, 'pdf'));
            if (err) console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
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

    return data;
}

const createFile = response => {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFileSync(response.path, response.content);
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
        pdf(response.options).from(response.path).to(changeFormat(response.path, 'pdf'), () => {
            resolve(response);
        });
    });
}

const removeFile = path => {
    fs.unlink(path, (err) => { 
        if (err) return err;
        console.log(`Remove file ${path}`);
        return null;
    });
}

const changeFormat = (path, format) => `${path.slice(0, path.lastIndexOf('.'))}.${format}`

app.listen(port, () => { console.log(`listening on ${port}`); });