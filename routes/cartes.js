var router = require('express').Router();

var Carte = require('./../models/Carte'); 
var Rarity = require('./../models/Rarity'); 

router.get('/', (req, res) => {
	Rarity.find({}).then(raritys =>{
		Carte.find({}).populate('raritys').then(cartes => {
			res.render('cartes/index.html', {cartes: cartes, raritys: raritys,});
		}); 
	}); 
});


router.get('/new', (req, res) =>{
	Rarity.find({}).then(raritys =>{
		var carte = new Carte(); 
		res.render('cartes/edit.html', {carte: carte, raritys: raritys, endpoint: '/'}); 
	});
});

router.get('/edit/:id', (req, res) =>{
	Rarity.find({}).then(raritys =>{
		Carte.findById(req.params.id).then(carte => {
			res.render('cartes/edit.html' , {carte: carte, raritys: raritys, endpoint: '/' + carte._id.toString() });
		});
	});
	
}); 

router.get('/delete/:id', (req, res) => {
	Carte.findOneAndRemove({ _id: req.params.id}).then(() => {
		res.redirect('/');
	})
}); 

router.get('/:id', (req, res) =>{
	Carte.findById(req.params.id).populate('raritys').then(carte => {
		res.render('cartes/show.html', {carte: carte}); 
	},
	err => res.status(500).send(err)); 
});



router.post('/:id?', (req, res) => {
	new Promise ((resolve, reject) =>{
		if(req.params.id){
			Carte.findById(req.params.id).then(resolve, reject);
		} 
		else {
			resolve(new Carte())
		}
	}).then(carte => {
		carte.name = req.body.name; 
		carte.description = req.body.description; 
		carte.raritys = req.body.raritys;
		carte.type = req.body.type;
		carte.elixircost = req.body.elixircost;
		carte.damage = req.body.damage;
		carte.dps = req.body.dps;
		carte.hitpoints = req.body.hitpoints;
		carte.hitspeed = req.body.hitspeed;
		carte.crowntowerdamage = req.body.crowntowerdamage;
		carte.speed = req.body.speed;
		carte.range = req.body.range;
		carte.targets = req.body.targets;
		carte.deploy = req.body.deploy;
		carte.areadamage = req.body.areadamage;
		carte.radius = req.body.radius;
		carte.freezeduration = req.body.freezeduration;
		carte.stunduration = req.body.stunduration;
		carte.healing = req.body.healing;
		carte.duration = req.body.duration;
		carte.howmuch = req.body.howmuch;
		carte.spawnspeed = req.body.spawnspeed;
		carte.lifetime = req.body.lifetime;
		carte.boost = req.body.boost;
		carte.shieldhitpoints = req.body.shieldhitpoints;
		carte.deathdamage = req.body.deathdamage;
		carte.dashrange = req.body.dashrange;
		carte.dashdamage = req.body.dashdamage;
		carte.cmlvlcommon = req.body.cmlvlcommon;
		carte.cmlvlrare = req.body.cmlvlrare;
		carte.cmlvlepic = req.body.cmlvlepic;
		carte.cmlvllegend = req.body.cmlvllegend;

		if (req.file) carte.picture = req.file.filename; 

		return carte.save(); 
	}).then(() =>{
		res.redirect('/'); 
	}, err => console.log(err));
}); 



module.exports = router; 

