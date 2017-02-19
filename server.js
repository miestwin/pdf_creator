var express = require('express');
var app = express();

var port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/temp'));

require('./app/routes')(app);

app.listen(port, () => { console.log(`listening on ${port}`); });