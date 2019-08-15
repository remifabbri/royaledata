const express = require("express"); 
const router = express.Router(); 
const request = require('request');
const bcrypt = require('bcryptjs');
const passport = require('passport');  
const fs = require('fs');


const User = require('../models/User'); 

let URLAPI = "https://api.clashroyale.com/v1/clans/%23RYYRLV"; 
let options = {
    headers: {
         'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImVkMDk4ODdiLTZhMTEtNDhjMy1iNTZhLWQyZWFkODlkYThhMiIsImlhdCI6MTU2NTQ0NjcxNSwic3ViIjoiZGV2ZWxvcGVyL2M5Mjg3NjNjLWJhMWEtNDFiMi01OWQ5LTcyNTE4ZmQ5Y2NhNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI4OS44MC4xMDcuMjM2Il0sInR5cGUiOiJjbGllbnQifV19.gh8bjswKOxNhHcXoo4wZwBXdYht5mXoRgWubm3LQDy1Gv0VNX43DFxA-lF2UShzgqHhaToq8xrDPQtsZETxY8A"
    }   
};


router.post('/register', (req, res) => {
    const { name, email, password, password2} = req.body;
    let errors = [];
    let messageValid = "Votre Compte à bien été créé :)"

    if(!name || !email || !password || !password2){ 
        errors.push({msg: "Tous les champs doivent être rempli !"}); 
    }

    if(password !== password2){
        errors.push({msg: "Les champs Mot de passe ne correspondent pas !"}); 
    }

    if(errors.length > 0){
        fs.readFile('./public/data/clanData.json', (err, data) => {
            if (err) throw err;
            res.render('index.pug', {
                data: JSON.parse(data),
                errors 
            });
        });
    }else{
        User.findOne({email : email})
            .then(user => {
                if(user){
                    errors.push({msg: "Cet email et déjà pris !"}); 
                    fs.readFile('./public/data/clanData.json', (err, data) => {
                        if (err) throw err;
                        res.render('index.pug', {
                            data: JSON.parse(data),
                            errors 
                        });
                    });
                }else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) =>{
                            if(err) throw err

                            newUser.password = hash; 
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'La création de votre compte à été un succées vous pouvez maintenant vous identifiez :)')
                                    fs.readFile('./public/data/clanData.json', (err, data) => {
                                        if (err) throw err;
                                        res.render('index.pug', {
                                            data: JSON.parse(data),
                                            messageValid 
                                        });
                                    });
                                })
                                .catch(err =>{
                                    console.log(err); 
                                })
                        })
                    })  
                }
            }) 
    }
})

router.post('/login', (req, res, next) => {
    console.log(req.body); 
    passport.authenticate('local', {
        successRedirect: '/auth', 
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next); 
})

router.post('/logout', (req, res, next) => {
    req.logout(); 
    res.redirect('/'); 
})

module.exports = router; 