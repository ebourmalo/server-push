
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

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

/* Global vars used */
var sampleData = {
	'value' : 'azerty',
	'date' : new Date().getTime()
};

var responses = [];




// config for cross domain request
app.all('*', function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Content-Type', 'application/json');
  res.header('Charset', 'utf-8');



  next();
});




app.post('/changes', function(req, res){
	sampleData.value = req.body.newValue;
	sampleData.date = req.body.newDate;

	var m;

	while (m = responses.shift()){
		
		try{
			m.send(sampleData);	
		} catch(e){
			console.log('response already sent (connexion closed)');
		}
		


		console.log('SENT OK');
	}

	res.end();
});




app.get('/longpolling', function(req, res){
	console.log("long");

	responses.push(res);

	var requestDate = new Date().getTime();
	
	var timer = setInterval(checkExpired, 1000);

	function checkExpired(){

		var expiration = new Date().getTime() - 30000;

		// close out request older than 30 seconds
		if (requestDate < expiration) {
			//responses.shift();
			res.end();
			clearInterval(timer);
		}
	}
	
	
});






http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});







