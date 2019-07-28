const express = require("express"); 
const router = express.Router(); 
const request = require('request');
const bcrypt = require('bcryptjs');
const { ensureAuthenticated } = require('../config/auth'); 

const User = require('../models/User'); 

let URLAPI = "https://api.clashroyale.com/v1/clans/%23RYYRLV"; 
let options = {
    headers: {
         'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijg1Y2QwNWM2LTE3OWYtNDZiYy04YzM3LWFjODU2OWU2ZTgzMyIsImlhdCI6MTU2MzgxNzc0MSwic3ViIjoiZGV2ZWxvcGVyL2M5Mjg3NjNjLWJhMWEtNDFiMi01OWQ5LTcyNTE4ZmQ5Y2NhNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI4OS44MC4xMDcuMjM2Il0sInR5cGUiOiJjbGllbnQifV19.7i1H1tnRzxQtFo-NXnIx6eTsQXVgEzqj-Y3-xmP7em99LPHwIxKDjiTr3bC25k7oWc3HroguNT6bVuk--ZTlMQ"
    }   
};


router.get('/', (req, res) => {
    request(URLAPI, options, function (err, response, body) {
        if (err || response.statusCode !== 200) {
          return res.sendStatus(500);
        }
        console.log('init'); 
        let data = JSON.parse(body);
        let dataJSON = data; 
        res.render('index.pug', {data, dataJSON });
      });	
});


router.get('/auth', ensureAuthenticated, (req, res) => {
    request(URLAPI, options, function (err, response, body) {
        if (err || response.statusCode !== 200) {
          return res.sendStatus(500);
        }
        console.log('init'); 
        let data = JSON.parse(body);
        let dataJSON = data; 
        res.render('authIndex.pug', {data, dataJSON, userName : req.user.name });
      });	
});


module.exports = router; 