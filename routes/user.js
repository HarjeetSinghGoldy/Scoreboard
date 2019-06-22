const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Match = require('../models/match');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const log = require('../log');

// register
router.post('/register', (req, res, next) => {
  let response = { success: false };
  if (!(req.body.password == req.body.confirmPass)) {
    let err = "The passwords don't match";
    return next(err);
  } else {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });

    User.addUser(newUser, (err, user) => {
      if (err) {
        response.msg = err.msg || 'Failed to register user';
        res.json(response);
      } else {
        response.success = true;
        response.msg = 'User registered successfuly';
        response.user = {
          id: user._id,
          username: user.username,
        };
        console.log('[%s] registered successfuly', user.username);
        res.json(response);
      }
    });
  }
});

router.post('/addNewMatch', (req, res, next) => {
  let response = { success: false };
  console.log("req",req.body);
    let newMatch = new Match({
      teamNameA: req.body.teamNameA,
      teamNameB: req.body.teamNameB,
      title: req.body.title,
      online:false
    });

    console.log("newMatch newMatch@@@@",newMatch);
    Match.addMatch(newMatch, (err, match) => {
      if (err) {
        response.msg = err.msg || 'Failed to register match';
        res.json(response);
      } else {
        response.success = true;
        response.msg = 'Match registered successfuly';
        response.match = {
          id: match._id,
          teamNameA: match.teamNameA,
          teamNameB: match.teamNameB,
        };
        console.log('[%s] registered successfuly', response.match );
        res.json(response);
      }
    });
});

router.post('/authenticate', (req, res, next) => {
  let body = req.body;
  let response = { success: false };

  User.authenticate(body.username.trim(), body.password.trim(), (err, user) => {
    if (err) {
      response.msg = err.msg;
      res.json(response);
    } else {
      // create the unique token for the user
      let signData = {
        id: user._id,
        username: user.username,
      };
      let token = jwt.sign(signData, config.secret, {
        expiresIn: 604800,
      });

      response.token = 'JWT ' + token;
      response.user = signData;
      response.success = true;
      response.msg = 'User authenticated successfuly';

      console.log('[%s] authenticated successfuly', user.username);
      res.json(response);
    }
  });
});

// profile
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    let response = { success: true };
    response.msg = 'Profile retrieved successfuly';
    response.user = req.user;
    res.json(response);
  }
);

// user list
router.get('/', (req, res, next) => {
  User.getUsers()
    .then(users => {
      let response = {
        success: true,
        users: users,
      };
      return res.json(response);
    })
    .catch(err => {
      log.err('mongo', 'failed to get users', err.message || err);
      return next(new Error('Failed to get users'));
    });
});

router.get('/getMatchList', (req, res, next) => {
  Match.getMatchs()
    .then(matches => {
      let response = {
        success: true,
        matches: matches,
      };
      return res.json(response);
    })
    .catch(err => {
      log.err('mongo', 'failed to get users', err.message || err);
      return next(new Error('Failed to get users'));
    });
});

module.exports = router;
