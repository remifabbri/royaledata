const LocalStategy = require('passport-local').Strategy; 
const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs'); 

const User = require('../models/User'); 

module.exports = function(passport){
    passport.use(
        new LocalStategy({usernameField: 'email'}, (email, password, done) => {
            User.findOne({email : email})
                .then(user => {
                    if(!user){
                        return done(null, false, {message: "Cet email n'existe pas :/ "})
                    }
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err
                        if(isMatch){
                            return done(null, user); 
                        }else{
                            return done(null, false, {message: "Le mot de passe n'est pas correct :/"})
                        }
                    })
                })
                .catch( err => console.log(err))
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}