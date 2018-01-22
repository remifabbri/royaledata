var mongoose = require('mongoose'); 

var raritySchema = new mongoose.Schema({
	name: String,
	color: {
		type: String, 
		default: 'red'
	}
});

raritySchema.virtual('cartes', {
	ref: 'Carte',
	localField: '_id', 
	foreignField: 'raritys'
});

var Rarity = mongoose.model('Rarity', raritySchema); 

module.exports = Rarity; 

