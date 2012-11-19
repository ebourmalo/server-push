
/**
 * Module dependencies.
 */


var express = require('express')
  , http = require('http')
  , path = require('path')
  , WebSocketServer = require('ws').Server;



var app = express()
  , server = http.createServer(app)
  , wss = new WebSocketServer({server: server});

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/* Global var used as a sample data */
var sampleData = {
	'value' : 'azerty',
	'date' : new Date().getTime()
};

// array containing the responses for the web clients
var sockets = [];




// config for cross domain request
app.all('*', function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Charset', 'utf-8');
  res.header('Content-Type', 'application/json');
  res.header('Cache-Control', 'no-cache');
  res.header('Connection', 'keep-alive');

  next();
});



wss.on('connection', function(ws) {

  console.log("new connection");

  sockets.push(ws);

  ws.on('message', function(message) {
      console.log('received new data: %s', message);

      var newData = JSON.parse(message);

      sampleData.value = newData.value;
      sampleData.date = newData.date;

      sockets.forEach(function(currentWS, index, array){
          currentWS.send(message);
      });

      console.log("New information sent through the channel");

  });
    
});



server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


