var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(hendler);

app.listen(8000, () => { console.log('listening on 8000') });

function handler (req, res) {
    
    if (req.url === '/' && req.method === 'GET') {
        sendFile(__dirname + '/public/index.html', res);
    }

    if ((req.url.indexOf('.js') !== -1 || req.url.indexOf('.css') !== -1) && req.method === 'GET') {
        sendFile(__dirname + '/public' + req.url, res);
    }

    if (req.url.indexOf('/download') !== -1 && req.method === 'GET') {

    }
}

function sendFile (path, res) {
    fs.readFile (path, (err, data) => {
        
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
        }

        res.writeHead(200);
        res.end(data);
    });
}