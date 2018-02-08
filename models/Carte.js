var mongoose = require('mongoose'); 

var carteSchema = new mongoose.Schema({
	name: String, 
	description: String,
	picture: String,
	elixircost: Number,
	damage: Number,
	crowntowerdamage: Number,
	dps: Number, 
	hitpoints: Number, 
	hitspeed: Number,	
	speed: String, 
	range: Number, 
	targets: String, 
	deploy: Number, 

	areadamage: Number,
	radius: Number, 
	freezeduration: Number,
	stunduration: Number,
	healing: Number,
	duration: Number, 

	howmuch: Number, 
	spawnspeed: Number,
	lifetime: Number,

	boost: Number, 
	shieldhitpoints: Number,
	deathdamage: Number,
	dashrange: Number, 
	dashdamage: Number, 

	cmlvlcommon: Number, 
	cmlvlrare: Number, 
	cmlvlepic: Number, 
	cmlvllegend: Number,


	raritys:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Rarity'
		}
	]

}); 

var Carte = mongoose.model('Carte', carteSchema);

module.exports  = Carte; 