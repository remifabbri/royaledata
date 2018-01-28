var router = require('express').Router();

var Rarity = require('./../models/Rarity'); 

router.get('/:rarity', (req, res) =>{
	Rarity.findOne({ name: req.params.rarity}).populate('cartes').then(rarity =>{
		if (!rarity) return res.status(404).send('oups'); 
		
		res.render('raritys/show.html', {
			rarity: rarity,
			cartes: rarity.cartes 

		}); 
	}); 
}); 

module.exports = router; 