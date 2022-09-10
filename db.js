const mongoose = require("mongoose");

const config = process.env

 module.exports.init = () => {
    const dbOptions = {
    };
    
    mongoose.connect('mongodb+srv://yousuf:41371755aa@cluster0.gu4me.mongodb.net/teamlog', dbOptions);
    mongoose.Promise = global.Promise;
    
    mongoose.connection.on('connected', async () =>{
      console.log('Mongoose has successfully connected!')
    });
    
    mongoose.connection.on('err', err => {
      console.error(`Mongoose connection error: \n${err.stack}`)
    });
    
    mongoose.connection.on('disconnected', () =>{
      console.warn('Mongoose connection lost')
    });
  }