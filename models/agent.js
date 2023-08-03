const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    Rdvtt: Number,
    Rdvann : Number,
    Rdvconf : Number,
    Rdvinst : Number,
    Ndvenc : Number,
    portable : String ,
    Email : String , 
    Password : String ,
    DateEM : Date 

});

const RDV = mongoose.model('agent', agentSchema);

module.exports = RDV;
