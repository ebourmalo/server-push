
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
	res.end();
});



app.get('/longpolling', function(req, res){
	console.log("long");
	var storedDate = sampleData.date;
	var requestDate = new Date().getTime();
	
	var timer = setInterval(checkChanges, 1000);

	function checkChanges(){

		var expiration = new Date().getTime() - 30000;

		console.log(sampleData.date);
		console.log(storedDate);
		console.log('-----'+new Date().getTime());

		// send the response if changes occured
		if (sampleData.date > storedDate){
			res.send(sampleData);
			clearInterval(timer);
		}
		// close out request older than 30 seconds
		else if (requestDate < expiration) {
			res.end();
			clearInterval(timer);
		}
	}
	
});



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});







