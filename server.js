var express = require('express');
var app = express();
var validUrl = require('valid-url');
var myMongo = require('./myMongo');

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/:id", (req, res) => {
  var gotId = req.params.id;
  
  myMongo.findUrlById(gotId, (err, data) => {
    if(err) throw err;
    
    if(typeof data === 'string'){
      res.send(data);
    }
    else{
      res.redirect(data["original_url"]);
    }
  })
})

app.get("/new/:url(*)", (req, res) => {
  var gotUrl = req.params.url;
  var obj = {};
  if(validUrl.isUri(gotUrl)){
    
    myMongo.addNewUrl(gotUrl, (err, data) => {
      if(err) throw err;
      
      obj["original_url"] = gotUrl;
      obj["short_url"] = "https://" + req.get('Host') + "/" + data["id"];
      res.send(obj);
    })
  }
  else{
    obj["error"] = "Please enter a valid URL.";
    res.send(obj);
  }
  
  
})


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
