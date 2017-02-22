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
//TODO: remove file, prepare for heroku
app.get('/download', (req, res) => {
    createFile(generateData(req.query))
    .then(createPdf)
    .then(response => {
        res.status(201);
        res.download(response.path_to_pdf_file, response.path_to_pdf_file, (err) => {
            if (err) Promise.reject(err);
            if (removeFile(response.path)) Promise.reject(new Error(`Unable to remove ${response.path_to_markdown_file}`));
            if (removeFile(`${response.path.slice(0, response.path.lastIndexOf('.'))}.pdf`)) Promise.reject(new Error(`Unable to remove ${response.path_to_markdown_file}`));
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({error: 'Internal server error happened'});
    });
});

/*
    Generate data based on query
*/
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

/*
    Create any file
    Return Promise
*/
const createFile = response => {
    return new Promise((resolve, reject) => {
        fs.writeFile(response.path, response.content, (err) => {
            if (err) reject(err);
            resolve(response);
        });
    });
}

/*
    Create PDF file based on Markdown file
    Return Promise
    pdf([options to convert]).from([path to md file]).to([path to pdf file], callback)
*/
const createPdf = response => {
    return new Promise((resolve, reject) => {
        pdf(response.options).from(response.path).to(`${response.path.slice(0, response.path.lastIndexOf('.'))}.pdf`, () => {
            resolve(response);
        });
    });
}

/*
    Remove file
*/
const removeFile = path => {
    fs.unlink(path, err => { 
        if (err) return err;
        return null; 
    });
}

//const changePath = path => `${path.slice(0, path.lastIndexOf('.'))}.pdf`

app.listen(port, () => { console.log(`listening on ${port}`); });