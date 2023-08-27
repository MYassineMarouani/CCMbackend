const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: String,
    prenom : String,
    date: Date,
    Type : String ,
    superficie : String,
    Adresse : String ,
    Email : String ,
    dateEmail : String ,
    dateEmailFin : String , 
    Comble : String ,
    Ville : String ,
    CP : String ,
    NumFix : String , 
    NumPor : String ,
    TypeChauf : String , 
    Propriatire : String , 
    NombrePer : Number , 
    RevenuCli : String , 
    NumeroFisc : String ,
    ReferenceAvis : String , 
    Precarite : String ,
    CommentaireAg : String ,
    Status : String ,
    CommentaireAd : String ,
    Age : String, 
    PriseLe : Date ,
    idAgent : String 

});

const RDV = mongoose.model('RDV', eventSchema);

module.exports = RDV;
