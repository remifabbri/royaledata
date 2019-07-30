const express= require('express'); 
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http); 
const PORT = process.env.PORT || 3000;

var cron = require('node-cron');


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
         'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjhhM2UzMDVlLTU0MTYtNGZlZS05ODliLTZmODdiZTVjOTUxYyIsImlhdCI6MTU2NDQ3ODQ1Nywic3ViIjoiZGV2ZWxvcGVyL2M5Mjg3NjNjLWJhMWEtNDFiMi01OWQ5LTcyNTE4ZmQ5Y2NhNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI3Ny4xNTQuMTkzLjE4MCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.EIS-4fvnPguFh5ICsIcCo47ObC0erc25AYtvMiQuX_782x4RpqxXtnlt2L5ldcbP1CaUExMPAhOIiC2CvLws1Q"
    }   
};


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

let taskCron = cron.schedule('*/1 * * * *', () => {

    request(URLAPI, options, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          console.log(response.statusCode); 
        } 

        let dataCR = JSON.parse(body)

        let countItems = 0;
        console.log(dataCR.memberList); 
        let arrLength = dataCR.memberList.length; 

        dataCR.memberList.forEach( member => {
            let memberChest = {}; 
            let param = member.tag.replace('#',"%23"); 
            let idMember = member.tag; 
            let urlMemberChest = `https://api.clashroyale.com/v1/players/${param}/upcomingchests`; 
            
            request(urlMemberChest, options, (err, response, body) => {
                if (err || response.statusCode !== 200) {
                    return res.sendStatus(500);
                } 
                memberChest[idMember] = JSON.parse(body); 

                let memberUpdate = dataCR.memberList.filter(member => member.tag === idMember); 

                memberUpdate[0].chest = memberChest[idMember];

                dataCR.memberList[idMember] = memberUpdate[0]; 

                countItems += 1; 

                if(countItems === arrLength ){
                    fs.writeFile('./public/data/clanData.json', JSON.stringify(dataCR), (err) => {
                        if (err) throw err;
                        console.log('The file has been saved!');
                    });

                    let dataCRFile = "let dataCRFile = " + JSON.stringify(dataCR) ; 

                    fs.writeFile('./public/data/clanData.js', dataCRFile, (err) => {
                        if (err) throw err;
                        console.log('The file has been saved!');
                    });
                }
            });
        }); 
    });
});

taskCron.start(); 

http.listen(PORT, function(err){
    console.log(`royaledata lancé sur le port`);
}); 