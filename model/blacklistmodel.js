const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema({
  token: String,
});

const BlacklistModel = mongoose.model("blacklistedtoken", blacklistSchema);

module.exports = {
  BlacklistModel,
};
