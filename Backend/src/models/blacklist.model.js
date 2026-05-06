const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
    token:{
        required:true,
        type:String,
        unique:true
    },    
},
{
    timestamps:true
}
);

const tokenBlacklistModel = mongoose.model("blacklisttokens",blacklistTokenSchema);

module.exports = tokenBlacklistModel;