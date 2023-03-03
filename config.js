//----------------------------------------------------------START
// This will be used to sign JSON web token;
// 'mongoUrl' is to connect to mongodb server;
// Next, use this module in authenticate.js file;
// Then, in app.js file;
module.exports = {
    'secretKey': '12345-67890-09876-54321',
    'mongoUrl': 'mongodb://localhost:27017/nucampsite'
}
//----------------------------------------------------------END