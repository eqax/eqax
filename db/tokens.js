const mongoose = require("mongoose");

const token = new mongoose.Schema({
user_id: { type: String , required: true },
username: { type: String , required: true },
password: { type: String , required: true },
token: { type: String , required: true },
access_token: { type: String , required: true },
auth: { type: String , required: true },
refresh_token: { type: String , required: true },
type: { type: Number, default: 2 }
});

module.exports = mongoose.model('Tokens', token, 'tokens')