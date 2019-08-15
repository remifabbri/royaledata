const express= require('express'); 
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http); 
const url = require("url");
const PORT = process.env.PORT || 3000;

var cron = require('node-cron');


const request = require('request');

const session = require('express-session'); 
const passport = require('passport'); 
const flash = require('connect-flash');

require('./config/passport')(passport); 


const mongoose = require('mongoose');
const db = require('./config/dbConfig').MongoURI; 

const User = require('./models/User'); 
const MsgGenerale = require('./models/msgGen'); 

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

let proxy = url.parse(process.env.QUOTAGUARDSTATIC_URL);
let target  = url.parse("https://api.clashroyale.com/v1");

let options = {
  hostname: proxy.hostname,
  port: proxy.port || 80,
  path: target.href,
  headers: {
    "Proxy-Authorization": "Basic " + (new Buffer(proxy.auth).toString("base64")),
    "Host" : target.hostname,
    'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdjMDYwOTEwLTFjOTYtNDU5My1hN2VkLWYwMTkzYTIyNDg4OCIsImlhdCI6MTU2NTg3NjIwNywic3ViIjoiZGV2ZWxvcGVyL2M5Mjg3NjNjLWJhMWEtNDFiMi01OWQ5LTcyNTE4ZmQ5Y2NhNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI1NC4xOTQuODYuMjA0Il0sInR5cGUiOiJjbGllbnQifV19.g5c2bzSTveUPDdouFwM3C5Y4v93sJGrjNfXgKkmZDwCHNWNY1u8HA51cHSvk7G3KOe-a50e1aeSA7kjsD3JBTA"
  }
};

// let options = {
//     headers: {
//         'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdjMDYwOTEwLTFjOTYtNDU5My1hN2VkLWYwMTkzYTIyNDg4OCIsImlhdCI6MTU2NTg3NjIwNywic3ViIjoiZGV2ZWxvcGVyL2M5Mjg3NjNjLWJhMWEtNDFiMi01OWQ5LTcyNTE4ZmQ5Y2NhNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI1NC4xOTQuODYuMjA0Il0sInR5cGUiOiJjbGllbnQifV19.g5c2bzSTveUPDdouFwM3C5Y4v93sJGrjNfXgKkmZDwCHNWNY1u8HA51cHSvk7G3KOe-a50e1aeSA7kjsD3JBTA"
//     }   
// };

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

// req and global variable 

app.use((req, res, next) => {
    res.locals.userName = req.username; 
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

        let date = Date.now(); 
        let name = msg.name; 

        const newMsgGenerale = new MsgGenerale({
            name, 
            msg : msg.message, 
            date
        }); 

        newMsgGenerale.save()
            .then( () => {
                console.log('message reçu : ' + msg); 
                io.emit('chatMessage', msg); 
            })
            .catch( err => {
                console.log(err); 
            })
    })
})

let taskCronDataMember = cron.schedule('*/1 * * * *', () => {

    let URLAPI = "https://api.clashroyale.com/v1/clans/%23RYYRLV"; 
    // let options = {
    //     headers: {
    //         'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdjMDYwOTEwLTFjOTYtNDU5My1hN2VkLWYwMTkzYTIyNDg4OCIsImlhdCI6MTU2NTg3NjIwNywic3ViIjoiZGV2ZWxvcGVyL2M5Mjg3NjNjLWJhMWEtNDFiMi01OWQ5LTcyNTE4ZmQ5Y2NhNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI1NC4xOTQuODYuMjA0Il0sInR5cGUiOiJjbGllbnQifV19.g5c2bzSTveUPDdouFwM3C5Y4v93sJGrjNfXgKkmZDwCHNWNY1u8HA51cHSvk7G3KOe-a50e1aeSA7kjsD3JBTA"
    //     }   
    // };

    request(URLAPI, options, (err, response, body) => {
        if (err || response.statusCode !== 200) {
            console.log(response.statusCode); 
        } 

        let dataCR = JSON.parse(body)

        let countItems = 0;
        let arrLength 
        if(dataCR.memberList != undefined){
            arrLength = dataCR.memberList.length; 
        }else{
            return
        }

        dataCR.memberList.forEach( member => {
            let memberChest = {}; 
            let memberGlobal = {}; 
            let param = member.tag.replace('#',"%23"); 
            let idMember = member.tag; 
            let urlMemberChest = `https://api.clashroyale.com/v1/players/${param}/upcomingchests`; 
            
            request(urlMemberChest, options, (err, response, body) => {
                if (err || response.statusCode !== 200) {
                    console.log(response.statusCode); 
                } 
                memberChest[idMember] = JSON.parse(body); 

                let urlMemberData = `https://api.clashroyale.com/v1/players/${param}`

                request(urlMemberData, options, (err, response, body) => {
                    if (err || response.statusCode !== 200) {
                        console.log(response.statusCode); 
                    } 

                    memberGlobal[idMember] = JSON.parse(body); 

                    let memberUpdate = dataCR.memberList.filter(member => member.tag === idMember); 

                    memberUpdate[0].chest = memberChest[idMember];

                    Object.assign(memberUpdate[0], memberGlobal[idMember]); 

                    dataCR.memberList[idMember] = memberUpdate[0];

                    countItems += 1; 
    
                    if(countItems === arrLength ){
                        fs.writeFile('./public/data/clanData.json', JSON.stringify(dataCR), (err) => {
                            if (err) throw err;
                            console.log('The file clanData.json has been saved!');
                        });
    
                        let dataCRFile = "let dataCRFile = " + JSON.stringify(dataCR) ; 
    
                        fs.writeFile('./public/data/clanData.js', dataCRFile, (err) => {
                            if (err) throw err;
                            console.log('The file clanData.js has been saved!');
                        });
                    }
                })
            });
        }); 
    });
});

let taskCronWarLog = cron.schedule('*/1 * * * *', () => {

    // let options = {
    //     headers: {
    //         'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdjMDYwOTEwLTFjOTYtNDU5My1hN2VkLWYwMTkzYTIyNDg4OCIsImlhdCI6MTU2NTg3NjIwNywic3ViIjoiZGV2ZWxvcGVyL2M5Mjg3NjNjLWJhMWEtNDFiMi01OWQ5LTcyNTE4ZmQ5Y2NhNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI1NC4xOTQuODYuMjA0Il0sInR5cGUiOiJjbGllbnQifV19.g5c2bzSTveUPDdouFwM3C5Y4v93sJGrjNfXgKkmZDwCHNWNY1u8HA51cHSvk7G3KOe-a50e1aeSA7kjsD3JBTA"
    //     }   
    // };

    let URLAPIWarlog = "https://api.clashroyale.com/v1/clans/%23RYYRLV/warlog"; 
    
    request(URLAPIWarlog, options, (err, response, body) => {
        if (err || response.statusCode !== 200) {
            console.log(response.statusCode); 
        } 
        
        dataWarlog = JSON.parse(body); 
        aggreClanWarlog = {}; 

        dataWarlog.items.forEach( warlog => {
            warlog.participants.forEach(memberWarlog => {

                if(!aggreClanWarlog.hasOwnProperty(`${memberWarlog.tag}`)){
                    aggreClanWarlog[memberWarlog.tag] = memberWarlog;
                }else{
                    aggreClanWarlog[memberWarlog.tag].wins += memberWarlog.wins;
                    aggreClanWarlog[memberWarlog.tag].cardsEarned += memberWarlog.cardsEarned;
                    aggreClanWarlog[memberWarlog.tag].battlesPlayed += memberWarlog.battlesPlayed;
                    aggreClanWarlog[memberWarlog.tag].collectionDayBattlesPlayed += memberWarlog.collectionDayBattlesPlayed;
                    aggreClanWarlog[memberWarlog.tag].numberOfBattles += memberWarlog.numberOfBattles;
                }
            }); 
        });

        Object.keys(aggreClanWarlog).forEach( participant => {
            aggreClanWarlog[participant].lost =  aggreClanWarlog[participant].numberOfBattles - aggreClanWarlog[participant].battlesPlayed; 
        })

        let dataWarlogCRFile = "let dataWarlogCRFile = " + JSON.stringify(aggreClanWarlog); 
    
        fs.writeFile('./public/data/dataWarlogCRFile.js', dataWarlogCRFile, (err) => {
            if (err) throw err;
            console.log('The file dataWarlogCRFile.js has been saved!');
        }); 
    }); 
});

taskCronDataMember.start(); 
taskCronWarLog.start(); 

http.listen(PORT, function(err){
    console.log(`royaledata lancé sur le port`);
}); 