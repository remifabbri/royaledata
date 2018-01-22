var router = require('express').Router();

var Carte = require('./../models/Carte'); 
var Rarity = require('./../models/Rarity'); 

router.get('/', (req, res) => {
	Carte.find({}).populate('raritys').then(cartes => {
		res.render('cartes/index.html', {cartes: cartes}); 
	}); 
}); 


router.get('/new', (req, res) =>{
	Rarity.find({}).then(raritys =>{
		var carte = new Carte(); 
		res.render('cartes/edit.html', {carte: carte, raritys: raritys}); 
	});
});


router.get('/edit/:id', (req, res) =>{
	Rarity.find({}).then(raritys =>{
		Carte.findById(req.params.id).then(carte => {
			res.render('cartes/edit.html' , {carte: carte, raritys: raritys});
		});
	});
	
}); 


router.get('/:id', (req, res) =>{
	Carte.findById(req.params.id).populate('raritys').then(carte => {
		res.render('cartes/show.html', {carte: carte}); 
	},
	err => res.status(500).send(err)); 
});



module.exports = router; 