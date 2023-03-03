const express = require('express');
const User = require('../models/user');
const passport = require('passport');


//----------------------------------------------------------START
const authenticate = require('../authenticate');
//----------------------------------------------------------END


const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    err => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      } else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful!' });
        });
      }
    }
  );
});


//----------------------------------------------------------START
// 'passport.authenticate('local')' to authenticate the user;
// Once the user has been authenticated, we issue the token to the user;
// To issue the token, 'authenticate.getToken()';
// Then pass in the object, '_id' that contains the payload like this, 'authenticate.getToken({ _id: req.user._id })'. From the payload we just include the user ID from the request object;
// Once we receive the token, response to the client, by adding the 'token' property to the response object, 'res.json({ token: token })';
// After the response above, all the requests from this client will carry the token in the header;
// The token is then used to verify that the user has already logged in;
// Next, move on to app.js file;
router.post('/login', passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});
//----------------------------------------------------------END


router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    const err = new Error('You are not logged in!');
    err.status = 401;
    return next(err);
  }
});

module.exports = router;