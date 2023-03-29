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
let port = process.env.PORT || 3000;

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
            .exec(function (error, result) {
                if (result !=undefined && !error) {
                    shorty = result.short +1
                } if (!error) {
                    url.findOneAndUpdate( 
                        {original: inputUrl},
                        {original: inputUrl, short: shorty},
                        {new: true, upsert: true},
                        function (error, saved) {
                            if (!error) {
                                resObj['short_url'] = saved.short
                                res.json(resObj)
                                console.log(resObj)
                            }
                        }
                    )
                }
            })


        })


app.get('/api/shorturl/:input', function(request, response) {
   let input = request.params.input
    console.log(input)
    url.findOne({short: input}, function (error, result) {
        if (result !=undefined && !error) {
            response.redirect(result.original)
        } else {
            response.json('error')
        }
    })
})
 