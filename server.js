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
    let data = `<!doctype html><html><head><link rel="stylesheet" href="${bootstrap}"></head>
                <body>${req.query.content}</body></html>`;
    let options = {
        "format": "A4",
        "border": "10mm"
    };
    

    fs.writeFile('myFile.html', data, err => {
        if (err) { 
            console.log(err);
        } else {
            let html = fs.readFileSync('myFile.html', 'utf8');
            pdf.create(html, options).toFile('myFile.pdf', (err, info) => {
                if (err) { 
                    console.log(err);
                } else {
                    res.download(info.filename, info.filename, err => {
                        if (err) console.log(err);
                        fs.unlink(info.filename, err => {
                            if (err) console.log(err);
                        });
                        fs.unlink(__dirname + '/myFile.html', err => {
                            if (err) console.log(err);
                        });
                    });
                }
            });
        }
    });
});

var port = process.env.PORT || 8000;
app.listen(port, () => { console.log(`listening on ${port}`); });