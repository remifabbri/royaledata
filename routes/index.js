const express = require("express"); 
const router = express.Router(); 
const request = require('request');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { ensureAuthenticated } = require('../config/auth'); 

const User = require('../models/User'); 


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