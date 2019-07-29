const express= require('express'); 
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http); 
const PORT = process.env.PORT || 3000;

const request = require('request');

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



let URLAPI = "https://api.clashroyale.com/v1/clans/%23RYYRLV"; 
let options = {
    headers: {
         'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijg1Y2QwNWM2LTE3OWYtNDZiYy04YzM3LWFjODU2OWU2ZTgzMyIsImlhdCI6MTU2MzgxNzc0MSwic3ViIjoiZGV2ZWxvcGVyL2M5Mjg3NjNjLWJhMWEtNDFiMi01OWQ5LTcyNTE4ZmQ5Y2NhNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI4OS44MC4xMDcuMjM2Il0sInR5cGUiOiJjbGllbnQifV19.7i1H1tnRzxQtFo-NXnIx6eTsQXVgEzqj-Y3-xmP7em99LPHwIxKDjiTr3bC25k7oWc3HroguNT6bVuk--ZTlMQ"
    }   
};


io.on('connection', function(socket){
    console.log('un utilisateur vient de se connecter'); 

    request(URLAPI, options, function (err, res, body) {
        if (err || res.statusCode !== 200) {
          return res.sendStatus(500);
        } 
        // console.log(body);
        let dataCR = JSON.parse(body)
        dataCR.memberList.forEach( member => {
            let memberChest = {}; 
            let param = member.tag.replace('#',"%23"); 
            let idMember = member.tag; 
            let urlMemberChest = `https://api.clashroyale.com/v1/players/${param}/upcomingchests`; 
            
            request(urlMemberChest, options, function (err, res, body) {
                if (err || res.statusCode !== 200) {
                    return res.sendStatus(500);
                } 
                memberChest[idMember] = JSON.parse(body); 
                // console.log(memberChest); 
                io.emit('dataMemberList', memberChest);
            });
        }); 
        
    });

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