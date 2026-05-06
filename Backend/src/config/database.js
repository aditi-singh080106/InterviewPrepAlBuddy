const mongoose = require('mongoose');

async function connectToDB(){
  try{
      await  mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully!");
  }
  catch(e){
    console.log('Error Message :',e.message);
    console.log('Error code :',e.code);
    console.log('Error reason :',e.reason);
  }
}



module.exports = connectToDB;