var mongoose = require('mongoose'); 

var eventSocietySchema = new mongoose.Schema({
	name: String, 
	description: String,
	picture: String,
	type: String,
	faits: [],



	raritys:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Rarity'
		}
	]

}); 

var EventSociety = mongoose.model('EventSociety', eventSocietySchema);

module.exports = EventSociety; 