require('dotenv').config();
let express = require('express');
let cors = require('cors');
let app = express();
let mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })


/* try {
  mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true }, function () {
    console.log("Connected!")   }  );
} catch (err) {
  console.log
    ("Not connected!");
} */



// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


let theSchema = new mongoose.Schema({
  original: {type: String, required: true},
  short: {type: Number}
})


let url = mongoose.model('url', theSchema)
let bodyParser = require('body-parser')
let resObj = {}

app.post('/api/shorturl', bodyParser.urlencoded({ extended: false }), function(req, res) {
  console.log(req.body)
  let inputUrl = req.body['url']
  let regex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)

  let regex2 = new RegExp(/[h]/gi)

  let regex3 = new RegExp(/^[http://www.]/gi)

  if (!inputUrl.match(regex3)) {
    res.json({error: 'invalid url'})
    return
  }
  resObj['original_url'] = inputUrl;








  
  
  let shorty = 1;
  url.findOne({})
      .sort({short: 'desc'})
      .then(function (result) { 
          if (result !=undefined && !error) {
              shorty = result.short + 1
          } if (shorty) {
              url.findOneAndUpdate(
                    {original: inputUrl},
                    {original: inputUrl, short: shorty},
                    {new: true, upsert: true})
                    .then (function (saved) {
                        if (saved) {
                          resObj['short_url'] = saved.short
                           res.json(resObj)
                           console.log(resObj)
   
                        }
                    })
              
          }
      }) .catch( function (error) {
        console.log(resObj)
        console.log(shorty)
        res.json('findOne error!')
      })


  //res.json(resObj)

})

/* app.get('/api/shorturl:input', function (req, res) {
  let resObj = {}
  let input = req.params.input;
  console.log(input)
  res.json({input})
  resObj.input
  url.findOne({short: input})
  console.log(short)
  console.log(input)
})
 */
 
app.get('/api/shorturl/:input', function (request, response) {
  let input = request.params.input;
  url.findOne({short: input}).then (function (result) {

    console.log(short) 

    console.log("req params: ")
    console.log(request.params)
    console.log(input)
    console.log('hello')

    if(!error && result != undefined) {
      response.redirect(result.original)
    } else {
      response.json('url not found')
    }
  }).catch( function (error) {
    response.json('error!')
  })
})


/* app.get('/api/shorturl/:input', (request, response) => {
  let input = request.params.input
  
  url.findOne({short: input}).then((result) => {
    if(!error && result != undefined){
      response.redirect(result.original)
    }else{
      response.json('URL not Found')
    }
})

) */