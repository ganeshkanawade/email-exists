var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var app = express();

//View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false } ));

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    var title = 'Upload excel';
    res.render('index');
});

app.post('/upload', function(req,res){
    res.send('Uploading....');
});

app.listen(8080, function(){
    
    console.log('Server running at port 8080...');
});