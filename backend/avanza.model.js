const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let Avanza = new Schema({
    countryName: {
        type: String
    },
    countryHours: {
        type: Object
    }
});

//the schema needs to be exported
//so we in order to import it in our server.js file
module.exports = mongoose.model('Avanza', Avanza);   //we are creating our model based on our Schema which can be found in the 2nd argument Todo
//the module which is being returned from mongoose is being exported
