module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()){
            return next(); 
        }
        console.log('not auth redirect'); 
        res.redirect('/'); 
    }
}