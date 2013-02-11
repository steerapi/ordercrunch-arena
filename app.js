// Ordercrunch Arena
var http = require('http'),
    ss = require('socketstream');

// Define a single-page client called 'main'
ss.client.define('splash', {
  view: 'splash.html',
  css: [],
  code: ['libs/components/jquery/jquery.js', 'libs/components/angular/angular.js', 'splash']
});

// Serve this client on the root URL
ss.http.route('/', function(req, res) {
  res.serveClient('splash');
});

// Define a single-page client called 'main'
ss.client.define('customer', {
  view: 'customer.html',
  css: ['libs/reset.css', 'app.styl'],
  code: ['libs/components/jquery/jquery.js', 'libs/components/angular/angular.js', 'libs/jquery.cloneposition.js', 'customer']
});

// Serve this client on the root URL
ss.http.route('/customer', function(req, res) {
  res.serveClient('customer');
});
// 
// // Define a single-page client called 'main'
// ss.client.define('business', {
//   view: 'business.html',
//   css:  ['libs/reset.css', 'app.styl'],
//   code: ['libs/components/jquery/jquery.js', 'app']
// });
// 
// // Serve this client on the root URL
// ss.http.route('/business', function(req, res){
//   res.serveClient('business');
// });
// Code Formatters
ss.client.formatters.add(require('ss-stylus'));
ss.client.formatters.add(require('ss-coffee'));

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));
// ss.client.templateEngine.use(require('ss-jade'));
// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();

// Start web server
var server = http.Server(ss.http.middleware);
server.listen(process.env.PORT || process.env.VCAP_APP_PORT || 3000);

// Start SocketStream
ss.start(server);
