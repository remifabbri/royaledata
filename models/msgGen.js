const mongoose = require('mongoose'); 

const MsgGeneralShema = new mongoose.Schema({
    msg : {
        type: String,
        required: true 
    },
    date : {
        type: Date, 
    }, 
    user: {
        type: String,
        require: true
    }
}); 

const MsgGenerale = mongoose.model('MsgGenerale', MsgGeneralShema); 

module.exports = MsgGenerale; 