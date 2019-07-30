const express = require("express"); 
const router = express.Router(); 
const request = require('request');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { ensureAuthenticated } = require('../config/auth'); 

const User = require('../models/User'); 

let URLAPI = "https://api.clashroyale.com/v1/clans/%23RYYRLV"; 
let options = {
    headers: {
         'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjEzYjBmMGNmLWViZDUtNDA4Yi1hYmMzLTU2N2Q2NWY1MzY4MiIsImlhdCI6MTU2NDQzNjI4Niwic3ViIjoiZGV2ZWxvcGVyL2M5Mjg3NjNjLWJhMWEtNDFiMi01OWQ5LTcyNTE4ZmQ5Y2NhNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI4OS45My4xMzIuMjA4Il0sInR5cGUiOiJjbGllbnQifV19.gv_Sao42fg69WwIXAnBYdB_mODsXg_6Dkh5oCWC8l7_9aDr5cn1lOSetv_sTkuZj3UxVmz-tmAUewTMfcnms1w"
    }   
};


router.get('/', (req, res) => {

  fs.readFile('./public/data/clanData.json', (err, data) => {
    if (err) throw err;

    res.render('index.pug', {
        data: JSON.parse(data), 
    });

  });
});


router.get('/auth', ensureAuthenticated, (req, res) => {
  fs.readFile('./public/data/clanData.json', (err, data) => {
    if (err) throw err;

    res.render('index.pug', {
        data: JSON.parse(data),
        userName : req.user.name 
    });

  });  
});


module.exports = router; 