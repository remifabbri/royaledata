const express= require('express'); 
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http); 
const PORT = process.env.PORT || 3000;

const session = require('express-session'); 
const passport = require('passport'); 
const flash = require('connect-flash');

require('./config/passport')(passport); 


const mongoose = require('mongoose');
const db = require('./config/dbConfig').MongoURI; 

mongoose.connect(db, {useNewUrlParser:true})
    .then(() => {
        console.log("MongoDB OK"); 
    })
    .catch((err) => {
        console.log(err); 
    })


const bodyParser = require('body-parser'); 
const fs = require('fs');
const pug = require('pug'); 


var multer = require('multer');
var upload = multer({
	dest: __dirname + '/uploads'
}); 


app.use(express.urlencoded({ extended: false}));
app.use(bodyParser.json());  


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());


app.use(flash()); 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg'); 
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();  
})


app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); 
app.use('/static', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));


app.set('view engine', 'pug');
app.set('views', './viewsPug');


app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));

io.on('connection', function(socket){
    console.log('un utilisateur vient de se connecter'); 
    socket.on('disconnect', function(){
        console.log('un utilisateur vient de se déconnecter');
    })
    socket.on('chatMessage',function(msg){
        console.log('message reçu : ' + msg); 
        io.emit('chatMessage', msg); 
    })
})


http.listen(PORT, function(){
    console.log(`royaledata lancé sur le port ${PORT}`);
}); 