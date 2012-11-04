
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
  res.header('Access-Control-Allow-Credentials', 'true');

  res.header('Charset', 'utf-8');

  res.header('Content-Type', 'text/plain');
  res.header('Content-Type', 'multipart/x-mixed-replace;boundary="parisjs"');
  res.header('Connection', 'keep-alive');

  next();
});




app.post('/changes', function(req, res){
	sampleData.value = req.body.newValue;
	sampleData.date = req.body.newDate;


	responses.forEach(function(currentRes, index, array){
		currentRes.write('--parisjs\n');
		currentRes.write("Content-Type: application/json;charset=utf-8" + "\n\n");
		currentRes.write(JSON.stringify(sampleData)+'\n');
		currentRes.write('--parisjs\n');

		console.log('SENT OK');
	});

	res.end();
});


app.get('/httpStreaming', function(req, res){
	console.log("httpS");

	responses.push(res);

});



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
