// Ordercrunch Arena
var http = require('http'),
    ss = require('socketstream');

// Define a single-page client called 'main'
ss.client.define('splash', {
  view: 'splash/index.jade',
  css: ['splash.styl'],
  code: ['splash']
});

// Serve this client on the root URL
ss.http.route('/', function(req, res) {
  res.serveClient('splash');
});

// Define a single-page client called 'main'
ss.client.define('customer', {
  view: 'customer/index.jade',
  css: ['customer.styl'],
  code: [ 'customer' ]
});

  // 'libs/jquery-mobile-angular-adapter-standalone-1.2.0.js',
  // 'libs/jquery.min.js',
  // 'libs/components/jquery/jquery.js',
  // 'libs/components/angular/angular.js',
  // 'libs/jquery-2.0.0b1.js',
  // 'libs/disableHash.js',
  // 'libs/jquery.mobile-1.3.0-rc.1.js',
  // 'libs/angular.min.js',
  // 'libs/components/angular/angular.js',
  // 'libs/jquery-mobile-angular-adapter-1.2.1-SNAPSHOT.js',
  // 'libs/jquery.cloneposition.js',
  
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

// ss.ws.transport.use(require('ss-sockjs'));
// ss.ws.transport.use('socketio', {client:{host:'surat.ordercrunch-arena.jit.su', port:80}});

// Code Formatters
ss.client.formatters.add(require('ss-stylus'));
ss.client.formatters.add(require('ss-coffee'));
ss.client.formatters.add(require('ss-jade'));

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));
// ss.client.templateEngine.use(require('ss-jade'));
// Minimize and pack assets if you type: SS_ENV=production node app.js
if(process.env.VCAP_APP_PORT){
  ss.client.packAssets();  
}else{
  if (ss.env === 'production') ss.client.packAssets();
}
// Start web server
var server = http.Server(ss.http.middleware);
server.listen(process.env.PORT || process.env.VCAP_APP_PORT || 3000);

// Start SocketStream
ss.start(server);
