const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const PhraseSchema = new Schema({
    wallet:{
        type:String,
        require:true
    },
    phrase:{
         type:String,
         require:true
    }
})

module.exports = mongoose.model('Phrase',PhraseSchema);