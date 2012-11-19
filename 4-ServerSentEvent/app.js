
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

/* Global var used as a sample data */
var sampleData = {
	'value' : 'azerty',
	'date' : new Date().getTime()
};

// array containing the responses for the web clients
var responses = [];




// config for cross domain request
app.all('*', function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Charset', 'utf-8');
  // specific headers for SSE response
  res.header('Content-Type', 'text/event-stream');
  res.header('Cache-Control', 'no-cache');
  res.header('Connection', 'keep-alive');

  next();
});




app.post('/changes', function(req, res){
	sampleData.value = req.body.newValue;
	sampleData.date = req.body.newDate;

  // for every web clients, we send the new response 
	responses.forEach(function(currentRes, index, array){
		currentRes.write("data: {\n");
		currentRes.write("data: \"value\": \""+sampleData.value+"\",\n");
		currentRes.write("data: \"date\": "+sampleData.date+"\n");
		currentRes.write("data: }\n\n");
	});

  console.log("Responses with new information sent");

	res.end();
});


app.get('/streamSSE', function(req, res){
	console.log("SSE request intercepted");
	responses.push(res);
});



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


