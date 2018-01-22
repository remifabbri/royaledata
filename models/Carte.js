var mongoose = require('mongoose'); 

var carteSchema = new mongoose.Schema({
	name: String, 
	description: String,
	picture: String,
	raritys: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Rarity'
		}
	] 

}); 

var Carte = mongoose.model('Carte', carteSchema);

module.exports  = Carte; 