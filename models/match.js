const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// user schema
const MatchSchema = mongoose.Schema({
  online: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  teamNameA: {
    type: String,
    required: true,
    trim: true,
    // unique: true
  },
  teamNameB: {
    type: String,
    required: true,
    trim: true,
  }
});

MatchSchema.statics.getMatchById = function(id, callback) {
  Match.findById(id, callback);
}

MatchSchema.statics.getMatchByMatchname = function(username, callback) {
  let query = {
    username: username
  };
  Match.findOne(query, callback);
}

MatchSchema.statics.getMatchs = () => {
  return Match.find({}, '-password');
}

MatchSchema.statics.addMatch = function(newMatch, callback) {
    newMatch.save(callback);
};

MatchSchema.statics.authenticate = function(username, password, callback) {
  Match.getMatchByMatchname(username, (err, user) => {
    if (err) return callback({
      msg: "There was an error on getting the user"
    });
    if (!user) {
      let error = {
        msg: "Wrong username or password"
      };
      return callback(error);
    } else {
      bcryptjs.compare(password, user.password, (err, result) => {
        if (result == true) {
          return callback(null, user);
        } else {
          let error = {
            msg: "Wrong username or password"
          };
          return callback(error);
        }
      });
    }
  });
};


const Match = mongoose.model('Match', MatchSchema);
module.exports = Match;
