var express = require('express');
var app = express();

var mongoose = require('mongoose'); 
var nunjucks = require('nunjucks'); 

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false});

var multer = require('multer');
var upload = multer({
	dest: __dirname + '/uploads'
}); 

/*
const jwt = require('jsonwebtoken'); 
const expressJwt = require('express-jwt');
const secret = 'ZoYM9ngXUDP9aQplZLsBcUvWhm7qNZ4vbdqUzzlvqnRJnbWEMQ0PFftRvLzr6eJ'; 

const fakeUser = { email: 'testuser@email.fr', password: 'qsd'};*/ 


//connect to the local BD
mongoose.connect('mongodb://localhost:27017/royaledata');
mongoose.set('debug', true);


// connect to online DB
//mongoose.connect('mongodb://krashgram:7blabla!@ds247058.mlab.com:47058/royaledata'); 
//const db = mongoose.connection; 
//db.on('error', console.error.bind(console, 'connection error: cannot connect to my DB'));
//db.once('open',() => {
	//console.log('connected to the DB :)');
//});

require('./models/Carte'); 
require('./models/Rarity');


app.use(bodyParser.urlencoded()); 
app.use(upload.single('file')); 

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); 
app.use('/', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));


//app.use(expressJwt({secret: secret}).unless({path: ['/', '/login', new RegExp('/edit.*/', 'i')]}));



app.use('/', require('./routes/communs')); 
app.use('/', require('./routes/cartes')); 
app.use('/raritys', require('./routes/raritys')); 




nunjucks.configure('views', {
    autoescape: true,
    express: app
});

console.log('royaledata lancé sur le port 3000');
app.listen(3000); 