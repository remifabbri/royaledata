const express= require('express'); 
const app = require('express')(); 
const httpsCall = require('https'); 
const http = require('http').Server(app);
const io = require('socket.io')(http); 
const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');
const db = require('./config/dbConfig').MongoURI; 

mongoose.connect(db, {useNewUrlParser:true})
    .then(() => {
        console.log("MongoDB OK"); 
    })
    .catch((err) => {
        console.log(err); 
    })

const request = require('request');
const bodyParser = require('body-parser'); 
const fs = require('fs');
const pug = require('pug'); 



var multer = require('multer');
var upload = multer({
	dest: __dirname + '/uploads'
}); 

app.use(express.urlencoded({ extended: false}));
app.use(bodyParser.json()) 
// app.use(upload.single('file')); 

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); 
app.use('/', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.set('view engine', 'pug');
app.set('views', './viewsPug');

let URLAPI = "https://api.clashroyale.com/v1/clans/%23RYYRLV"; 
let options = {
    headers: {
         'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijg1Y2QwNWM2LTE3OWYtNDZiYy04YzM3LWFjODU2OWU2ZTgzMyIsImlhdCI6MTU2MzgxNzc0MSwic3ViIjoiZGV2ZWxvcGVyL2M5Mjg3NjNjLWJhMWEtNDFiMi01OWQ5LTcyNTE4ZmQ5Y2NhNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI4OS44MC4xMDcuMjM2Il0sInR5cGUiOiJjbGllbnQifV19.7i1H1tnRzxQtFo-NXnIx6eTsQXVgEzqj-Y3-xmP7em99LPHwIxKDjiTr3bC25k7oWc3HroguNT6bVuk--ZTlMQ"
    }   
};

app.get('/', (req, res) => {
    request(URLAPI, options, function (err, response, body) {
        if (err || response.statusCode !== 200) {
          return res.sendStatus(500);
        }
        res.render('index.pug', {data: JSON.parse(body)});
      });	
});

app.post('/', (req, res) => {
    console.log(req.body);
    request(URLAPI, options, function (err, response, body) {
        if (err || response.statusCode !== 200) {
          return res.sendStatus(500);
        }
        res.render('index.pug', {data: JSON.parse(body)});
    }); 
})

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