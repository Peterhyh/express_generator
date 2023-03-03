const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');


//----------------------------------------------------------START
// Import jwt strategy constructor
const JwtStrategy = require('passport-jwt').Strategy;
// This is an object that will provide several helper methods
const ExtractJwt = require('passport-jwt').ExtractJwt;
// Create, sign, and verify tokens
const jwt = require('jsonwebtoken');
//import the config file I created
const config = require('./config.js');
//----------------------------------------------------------END


exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//----------------------------------------------------------START
// 'getToken' is a function that RECEIVES an object, 'user';
// 'user' will contain an ID for a user document;
// return a token created with 'jwt.sign()' method;
// 'jwt.sign()' will take 3 arguements;
// First argument, 'user' object; 
// Second argument, 'secretKey' string in 'config' file;
// Third argument, '{ expiresIn: 3600 }' sets the token to expire, {expiresIn: 3600} (equivilant to an hour). If you leave this blank, the token will never expire (NOT RECOMMENDED)
exports.getToken = user => {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};
//----------------------------------------------------------END


//----------------------------------------------------------START
// Configuring json web token strategy for passport;
// Declare 'opts' to contain the options for the jwt strategy;
// Initialize it as an empty object;
// Set 2 properties on this object to configure the jwt strategy, 'opts.jwtFromRequest' & 'opts.secretOrKey';
// '.fromAuthHeaderAsBearerToken()'  specifies how the json web token should be extracted from the incoming request message. This expects the token to be sent to the server in an authorization header
// 'opts.secretOrKey' lets use apply the jwt strategy with the key with which we'll assign this token, and reset to the config secret key property in config.js
// Export the JWT strategy as, as 'jwtPassport';
// Assign Jwt Strategy as an arguement using, 'passport.use()';
// 'passport.use()' creates JWT strategy as an argument with JWT constructor, 'new JwtStrategy()';
// 'new JwtStrategy()' requires 2 argument itself.
// 1st arguement is an object with configuration options, 'opts';
// 2nd arguement will be verify callback function;
// We will create the callback function by passing in, '(jwt_payload, done)'. NOTE: jwt_payload is an object literal containing the decoded JWT payload AND 'done' is a passport is error first callback accepting arguments done(error, user, info);
// In the function body, 'User.findOne()' will access the 'User' collection;
// To find a user with the same ID as what's in the token, 'User.findOne({ _id: jwt_payload._id })';
// Setting up the error callback, 
// 'User.findOne({ _id: jwt_payload._id }, (err, user) => {  })'
// If there is an error, we send the error to the 'done' callback and indicate 'false' in the second argument to represent no users was found;
// If there are no errors, check to see if the user was found. If user is found, return the 'done' callback w/ 1st argument as, 'null' to represent no error, and the 2nd argument will be 'user';
// Passport will be using this callback to access user document to load information from it to the request object;
// If no errors and no users were found what's matched in the token, return BOTH 'null' to repressent no errors occured and 'false' to represent no users were found
// Lastly, export the function, 'verifyUser' to verify an incoming request is from an authenticated user with, 'passport.authenticate()';
// 'passport.authenticate()' 1st arguement is 'jwt' to specify that we want to use the json web token strategy. 2nd argument is an option, '{ session: false }' to specify that we are not using sessions;
// This export is a shortcut we can use in other modules if we want to authenticate with JWT Strategy;
// Next, use the JWT strategy for the routers in the routes folder;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;
exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({ _id: jwt_payload._id }, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', { session: false });
//----------------------------------------------------------END
