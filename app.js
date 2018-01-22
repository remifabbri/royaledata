var express = require('express'); 
var mongoose = require('mongoose'); 
var nunjucks = require('nunjucks'); 

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/royaledata', { useMongoClient: true });
mongoose.Promise = global.Promise;

require('./models/Carte'); 
require('./models/Rarity');

var app = express();

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); 

app.use('/', require('./routes/cartes')); 
app.use('/raritys', require('./routes/raritys')); 

/* app.get('/',(req, res) => {
	res.send('salut')
}) */

nunjucks.configure('views', {
    autoescape: true,
    express: app
});


console.log('royaledata lancé sur le port 3000');
app.listen(3000); 