const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/CCM').then(

    ()=>{
        console.log('connected succefully');
    }


).catch(    ()=>{
    console.log('problem in DB connection');
});


module.exports = mongoose;