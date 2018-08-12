var router = require('express').Router();
const jwt = require('jsonwebtoken'); 
/*const expressJwt = require('express-jwt');

const secret = 'ZoYM9ngXUDP9aQplZLsBcUvWhm7qNZ4vbdqUzzlvqnRJnbWEMQ0PFftRvLzr6eJ';*/ 


var EventSociety = require('./../models/Carte'); 
var Rarity = require('./../models/Rarity'); 

router.get('/', (req, res) => {
	Rarity.find({}).then(raritys =>{
		EventSociety.find({}).populate('raritys').then(eventSociety => {
			res.render('cartes/index.html', {eventSociety: eventSociety, raritys: raritys,});
		}); 
	}); 
});


router.get('/new', (req, res) =>{
	Rarity.find({}).then(raritys =>{
		var eventSociety = new EventSociety(); 
		res.render('cartes/edit.html', {eventSociety: eventSociety, raritys: raritys, endpoint: '/'}); 
	});
});

router.get('/edit/:id', (req, res) =>{
	Rarity.find({}).then(raritys => {
		EventSociety.findById(req.params.id).then(eventSociety => {
			res.render('cartes/edit.html' , {eventSociety: eventSociety, raritys: raritys, endpoint: '/' + eventSociety._id.toString() });
		});
	});
}); 

router.get('/delete/:id', (req, res) => {
	EventSociety.findOneAndRemove({ _id: req.params.id}).then(() => {
		res.redirect('/');
	})
}); 

router.get('/:id', (req, res) =>{
	EventSociety.findById(req.params.id).populate('raritys').then(eventSociety => {
		res.render('cartes/show.html', {eventSociety: eventSociety}); 
	}, 
	err => res.status(500).send(err)); 
});



router.post('/:id?', (req, res) => {
	new Promise ((resolve, reject) =>{
		if(req.params.id){
			EventSociety.findById(req.params.id).then(resolve, reject);
		} 
		else {
			resolve(new EventSociety())
		}
	}).then(eventSociety => {
		eventSociety.name = req.body.name; 
		eventSociety.description = req.body.description; 
		eventSociety.raritys = req.body.raritys;
		eventSociety.type = req.body.type;
		

		if (req.file) eventSociety.picture = req.file.filename; 

		return eventSociety.save(); 
	}).then(() =>{
		res.redirect('/'); 
	}, err => console.log(err));
}); 



module.exports = router; 

