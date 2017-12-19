var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var parseXlsx = require('excel');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');
const { URL } = require('url');
var emailExistence = require('email-existence');

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
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var oldpath = files.fileUpload.path;
        var newpath =  path.join(__dirname,"files/" + files.fileUpload.name);        
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            parseXlsx(newpath, function(err, data) {
                if(err) throw err;
                // data is an array of arrays
                var i = 0;
                data.forEach(row => {
                    if(i!=0)
                    {
                        var firstName = row[2].toLowerCase();
                        var lastName = row[3].toLowerCase();                        
                        var domain = getHostName(row[1]);
                        var emailCombinations = [
                            firstName+ '@'+ domain,
                            lastName+ '@'+  domain,
                            firstName+ '.' +lastName+ '@'+  domain,
                            lastName+ '.' +firstName+ '@'+  domain
                        ]
                        
                        
                        emailCombinations.forEach(email=> {
                            
                            emailExistence.check(email, function(err,res){
                                if(res)
                                {
                                    console.log(email);
                                }
                            });
                        });
                        
                    }
                    i += 1;
                });
            });

        });
    });
    res.send('Done!!!!');
});

function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }
}

app.listen(8080, function(){
    
    console.log('Server running at port 8080...');
});