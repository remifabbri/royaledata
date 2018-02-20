var router = require('express').Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false}); 

const jwt = require('jsonwebtoken');
const secret = 'ZoYM9ngXUDP9aQplZLsBcUvWhm7qNZ4vbdqUzzlvqnRJnbWEMQ0PFftRvLzr6eJ';  
 
const fakeUser = { email: 'testuser@email.fr', password: 'qsd'}; 

router.get('/login', (req, res) => {
	res.render('login.html');  
});

router.post('/login', urlencodedParser, (req, res) =>{
	console.log('login post', req.body); 
	if(!req.body) {
		res.sendStatus(500); 
	} else {
		if(fakeUser.email === req.body.email && fakeUser.password === req.body.password) {
			const myToken = jwt.sign({iss: 'http://royalemetadata.fr', user: 'sam', scope: 'admin'}, secret); 
			res.json(myToken);
			
		} else {
			res.sendStatus(401); 
		}
	}
}); 

router.get('/member-only', (req, res) => {
	console.log('req.user', req.user);
	res.send(req.user)
}); 


module.exports = router; 