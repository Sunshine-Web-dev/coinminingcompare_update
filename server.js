// ===========================================================================================
// File Name: server.js
// Description: This is the main server file for CoinMiningCompare.com
// Platform: Node.js/Express.js
// ===========================================================================================

// ===========================================================================================
// Load required modules
// ===========================================================================================
var express = require("express"); // This is required for running the server
var path = require("path"); // This gets required files from file system
var bodyParser = require("body-parser"); // This is used for JSON limits
var mongodb = require("mongodb"); // MongoDB is the database we use
var sha1 = require('sha1'); // This is used for password hashing
var cors = require('cors'); // This is used for cross-platform communication
var nodemailer = require('nodemailer'); // Nodemailer sends emails via SMTP
var prettydate = require("pretty-date"); // This module beautifies the dates
var ObjectID = mongodb.ObjectID;
var requestify = require('requestify'); // This is used for API requests to external APIs
var fetch = require('node-fetch'); // This is used for API requests to external APIs
var uglifycss = require('uglifycss'); // This minifies CSS
var cron = require('cron-scheduler'); // This schedules tasks
var feed = require('rss-to-json'); // This converts RSS to JSON so that we can add it to our Mongo Database
const fileupload = require('express-fileupload'); // Handles file uploads
var multer  = require('multer'); // handles file uploads
var uploadFn = multer({ dest: __dirname + '/bucket/' })

// ===========================================================================================
// Run Express, Setup CORS and set JSON limits for security
// ===========================================================================================
var app = express();
app.use(cors())
app.use(fileupload()); // for file uploads
app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// ===========================================================================================
// Connect to the database before starting the application server
// ===========================================================================================
var db;
var slider = 0;
// The current database is stored on Heroku. You can install MongoDB on your own server and replace the URI
// or you can make a Heroku instance, add mLab and use the URI you get from there.
mongodb.MongoClient.connect("mongodb+srv://heroku_61sp4w6g:WnLU40VXYhtf7ZA2@cluster-61sp4w6g.5hmpf.mongodb.net/heroku_61sp4w6g?retryWrites=true&w=majority", function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  db = database; // Save database object from the callback for reuse.
  console.log("Database connection ready");
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port; // Initialize the app.
    console.log("App now running on port", port);
  });
});

//===========================================================================================
// SITEMAP
//===========================================================================================

app.get('/sitemap.xml', function(req, res) {
    res.sendFile("sitemap.xml",{root:__dirname+'/public'});
});


//===========================================================================================
// CSS MINIFICATION ON SERVERSIDE: Disabled
//===========================================================================================


// app.get('/css/style.min.css', function(req, res) {
//     var css = __dirname + '/public/css/style.css';
//     var uglified = uglifycss.processFiles([css], { maxLineLen: 0, expandVars: true });

//     res.writeHead(200, {'Content-Type': 'text/css'});
//     res.end(uglified);
// });


//===========================================================================================
// CRON JOB: THis Scheduler runs at 9am to fetch news and process contracts data
//===========================================================================================

// runs at 9am
cron({ on: '0 9 * * *' }, function () {
  console.log('9:00am news fetched');
  getNews();
  getConz(slider);
})


// News Variables
var NEWS_COLLECTION = "news";
var news;
var newsdb = [];
var newsdb_fixed = [];
var noErr = 1;


// Loop through news items and add to News Collection
function newzzz(news) {
  for(var j=0; j<news.items.length; j++) {
      var myjson = news.items[j];
      // create a URL slug from title
      myjson.slug = myjson.title.replace(/[^a-zA-Z ]/g, "");
      myjson.slug = myjson.slug.replace(/\s+/g, '-').toLowerCase();
      myjson.createDate = new Date(); // get current timestamp 
      db.collection(NEWS_COLLECTION).update({title: myjson.title}, myjson, {upsert: true});
    }

}

// Get news from CryptocurrencyNews.com
// Convert RSS into JSON using rss2json API
function getNews() {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fcryptocurrencynews.com%2Ffeed%2F')
    .then(res => res.json())
    .then(json => newzzz(json));
}




//===========================================================================================
// GET EARNINGS
//===========================================================================================

var answerzzz = {};
var CONTRACTS_COLLECTION = "contractzz";
var contractoz = [];

// This is a recursive function
function getConz(i) {
  console.log(i)
  db.collection(CONTRACTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contracts.");
    } else {
      contractoz = docs;
        if(docs[i]) {

        // Promise based Earnings calculator
        earnings(docs[i].hashrate, docs[i].hashrateUnits, docs[i].priceUSD, docs[i].coin, i).then(function(result) {
        
          // console.log(result);

          contractoz[result.i].earnings = result;
          // console.log(contractoz[result.i]);

          // update single doc
          var myid = contractoz[result.i]._id
          var updateDoc = contractoz[result.i];
            delete updateDoc._id;

            // update earnings and add to database
            db.collection(CONTRACTS_COLLECTION).updateOne({_id: new ObjectID(myid)}, updateDoc, function(err, doc) {
              if (err) {
                handleError(res, err.message, "Failed to update contract");
              } else {
                // res.status(204).end();
                console.log("done")
                if(i<contractoz.length) {
                  getConz(i+1);
                } else {
                  console.log('the end');
                  return [];
                }
                

              }
            });

        });
      
      }
      // wait(20000);
      // console.log(contractoz[30])
    }
  });
}
function wait(ms){
   var start = new Date().getTime(); // get current time 
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

// Calculate earnings data from variables provided
function earnings(hashrate, hashrateUnits, priceUSD, coin, i) {

  return new Promise(function (resolve, reject) {

  answerzzz.priceUSD = priceUSD;
  var shortForm;

  // Units conversion
  if (hashrateUnits == "KH/s") {
    answerzzz.hashrate = hashrate * 1000;
    hashrateUnits = "H/s";
  } else if (hashrateUnits == "MH/s") {
    answerzzz.hashrate = hashrate * 1000000;
    hashrateUnits = "H/s";
  } else if (hashrateUnits == "GH/s") {
    answerzzz.hashrate = hashrate * 1000000000;
    hashrateUnits = "H/s";
  } else if (hashrateUnits == "TH/s") {
    answerzzz.hashrate = hashrate * 1000000000000;
    hashrateUnits = "H/s";
  } else if (hashrateUnits == "PH/s") {
    answerzzz.hashrate = hashrate * 1000000000000000;
    hashrateUnits = "H/s";
  } else if (hashrateUnits == "H/s") {
    answerzzz.hashrate = hashrate * 1;
    hashrateUnits = "H/s";
  }

  // Short form
  if (coin == "Bitcoin") {
    shortForm = "btc";
  } else if (coin == "Ethereum" || coin == "Ethereum Classic") {
    shortForm = "eth";
  } else if (coin == "Litecoin") {
    shortForm = "ltc";
  } else if (coin == "Dash") {
    shortForm = "dash";
  } else if (coin == "Zcash") {
    shortForm = "zec";
  } else if (coin == "Monero") {
    shortForm = "xmr";
  }
  if (coin == "Ethereum Classic") {
    coin = "Ethereum";
  }

if(shortForm) {
    // call CMC API to get Difficulty, Block Reward and Coin to Dollar Rate for each coin
    fetch('https://coinminingcompare.com/api/coins/'+shortForm)
    .then(res => res.json())
    .then(function(myanswerzzz) {


          answerzzz.difficulty = Number(myanswerzzz.difficulty);
          answerzzz.blockReward = Number(myanswerzzz.reward);
          answerzzz.coinToDollar = Number(myanswerzzz.coinToDollar);
		  
		  //Modified by Varun - Added answer.constant defintion
		  if(shortForm=="btc") {
				answerzzz.constant = Math.pow(2,32);
			} else if (shortForm=="eth") {
				answerzzz.constant = 1;
			} else if (shortForm=="ltc") {
				answerzzz.constant = Math.pow(2,32);
			} else if (shortForm=="xmr") {
				answerzzz.constant = 2;
			} else if (shortForm=="dash") {
				answerzzz.constant = Math.pow(2,32);
			} else if (shortForm=="zec") {
				answerzzz.constant = Math.pow(2,13);
			}
			
			console.log("server 276 - "+answerzzz.constant)

          // Calculate Hashtime
          answerzzz.hashtime = (answerzzz.difficulty * answerzzz.constant) / Number(answerzzz.hashrate); //Modified by Varun - Added answer.constant
          // Calculate Blocks Mined per Year from Difficulty, Constant and Hashrate
          answerzzz.blocksMinedPerYear = ((365.25 * 24 * 3600) / ((answerzzz.difficulty * answerzzz.constant) / answerzzz.hashrate));
          // Calculate Coins Rewarded per Year
          answerzzz.coinsRewardedPerYear = answerzzz.blockReward * answerzzz.blocksMinedPerYear;
          // Calculate Revenue per Year in USD
          answerzzz.revenuePerYear = answerzzz.coinsRewardedPerYear * answerzzz.coinToDollar;
          // Calculate Earnings in USD
          answerzzz.earnings = Number(answerzzz.revenuePerYear) - Number(answerzzz.priceUSD);
          answerzzz.i = i;
          // Return Answer
          resolve(answerzzz)


    });
} else {
  answerzzz.i = i;
  resolve(answerzzz)
}

});

}


//===========================================================================================
// Google Site Verification
//===========================================================================================

app.get("/google6827bad525b59c82.html", function(req, res) {
    res.sendFile("cert.html",{root:__dirname+'/public'}); 
});

//===========================================================================================
// UPLOAD FILES
//===========================================================================================


app.post('/api/fileupload/secure', function(req, res) {


  const image = req.files.myfile
  const path = __dirname + '/public/uploads/' + image.name


  image.mv(path, (error) => {
    if (error) {
      console.error(error)
      res.writeHead(500, {
        'Content-Type': 'application/json'
      })
      res.end(JSON.stringify({ status: 'error', message: error }))
      return
    }

    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify({ status: 'success', secure_url: 'https://coinminingcompare.com/uploads/' + image.name }))
  })


})

//===========================================================================================
// GET BLOCK REWARD AND DIFFICULTY
//===========================================================================================


//===========================================================================================
// FETCH BITCOIN: DIFFICULTY AND REWARD AND COIN TO DOLLAR RATE
//===========================================================================================

app.get("/api/coins/btc", function(req, res) {
  var answer = {};
  answer.name = "Bitcoin";
  answer.symbol = "BTC";

  btcDifficulty(); // call the chained function 

// Get Bitcoin difficulty from Blockchain.info
  function btcDifficulty() {
    coin = {}
    coin.coinName = "bitcoin";
    requestify.get('https://blockchain.info/q/getdifficulty')
      .then(function(response) {
          answer.difficulty = response.getBody();
          answer.difficulty = Number(answer.difficulty);
          btcReward();
      });
  }

// Get Bitcoin reward from Blockchain.info
  function btcReward() {
    requestify.get('https://blockchain.info/q/bcperblock')
      .then(function(response) {
          answer.reward = response.getBody();
          // answer.reward = Number(answer.reward) / 100000000;
          answer.reward = Number(answer.reward);
          btcDollar();
      }
    );
  }

// Get Bitcoin Coin to Dollar Rate from Coin Market Cap
  function btcDollar() {
    requestify.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')
      .then(function(response) {
          var dol = response.getBody();
          answer.coinToDollar = dol.USD;
          done();
      }
    );
  }
// All done, send response
  function done() {
    res.status(200).json(answer);
  }

});



//===========================================================================================
// FETCH ETHEREUM: DIFFICULTY AND REWARD AND COIN TO DOLLAR RATE
//===========================================================================================


app.get("/api/coins/ltc", function(req, res) {
  var answer = {};
  answer.name = "Litecoin";
  answer.symbol = "LTC";
  var blocknumber, ltcReward;

  ltcDifficulty(); // call the chained function 


// Get LTC Difficulty from Litecoin.net.
  function ltcDifficulty() {
    requestify.get('http://explorer.litecoin.net/chain/Litecoin/q/getdifficulty')
      .then(function(response) {
          answer.difficulty = response.getBody();
          ltcReward();
      }).fail(function(response) {
        response.getCode(); // Some error code such as, for example, 404
      });
  }

// Get LTC Block Number from Litecoin.net. Block number gives us the reward.
  function ltcReward() {
    requestify.get('http://explorer.litecoin.net/chain/Litecoin/q/getblockcount')
      .then(function(response) {
        blocknumber = response.getBody();
        ltcReward = ltcRewardClc(blocknumber);
        answer.reward = ltcReward;
        console.log(answer)
        ltcDollar();
      }
    );
  }


// Get LTC Reward from Block Number
  function ltcRewardClc(blocknumber){
    return 50.0 / (2 * parseInt((parseInt(blocknumber) + 1) / 840000));
  }


// Get LTC Coin to Dollar Rate from Coin Market Cap
  function ltcDollar() {
    requestify.get('https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=USD')
      .then(function(response) {
          var dol = response.getBody();
          answer.coinToDollar = dol.USD;
          done();
      }
    );
  }

// All done, send response
  function done() {
    res.status(200).json(answer);
  }

});



//===========================================================================================
// FETCH ETHEREUM: DIFFICULTY AND REWARD AND COIN TO DOLLAR RATE
//===========================================================================================


app.get("/api/coins/eth", function(req, res) {
  var answer = {};
  answer.name = "Ethereum";
  answer.symbol = "ETH";
  var blocknumber;
  ethCalc();

  // Get data from Etherchain and pass it to another function
  function ethCalc() {
    fetch('https://etherchain.org/api/basic_stats')
    .then(res => res.json())
    .then(json => ethCalc2(json));
  }
  // get block number and difficulty from Etherchain data
  function ethCalc2(x) {
    answer.difficulty = x.currentStats.difficulty;
    blocknumber = x.blocks[0].number;
    // from the above block number, we will get reward using Etherscan website and our API key
    fetch('https://api.etherscan.io/api?module=block&action=getblockreward&blockno='+blocknumber+'&apikey=7JZP6DHZPE8ZW8Y2YEB346UCQP4URZ1C35')
    .then(res => res.json())
    .then(json => ethCalc3(json));
  }

  // Get reward for Ethereum
  function ethCalc3(y) {
      // console.log(y.result.blockReward)
      answer.reward = y.result.blockReward;
      answer.reward = Number(answer.reward) / 1000000000000000000;
      ethDollar();
  }

// Get Coin to Dollar Rate for Ethereum
  function ethDollar() {
    requestify.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
      .then(function(response) {
          var dol = response.getBody();
          answer.coinToDollar = dol.USD;
          done();
      }
    );
  }

// All done, send response
  function done() {
    res.status(200).json(answer);
  }

});


//===========================================================================================
// FETCH DASH: DIFFICULTY AND REWARD AND COIN TO DOLLAR RATE
//===========================================================================================


app.get("/api/coins/dash", function(req, res) {
  var answer = {};
  answer.name = "Dash";
  answer.symbol = "DASH";
  var resp;


// Call Dash Difficulty Function
  dashCalc();

// Get Difficulty for Dash
  function dashCalc() {
    requestify.get('https://www.coinexplorer.net/api/v1/DASH/block/latest')
      .then(function(response) {

        resp = response.getBody();
        console.log(resp.result)
        answer.difficulty = resp.result.difficulty;
        dashReward();
        // res.status(200).json({"difficulty": resp});

      }).fail(function(response) {
        response.getCode(); // Some error code such as, for example, 404
      });
  }

// Get Block Reward for Dash
  function dashReward() {
    requestify.get('https://whattomine.com/coins/34.json')
      .then(function(response) {
        resp = response.getBody();
        // console.log(resp);
        answer.reward = resp.block_reward;
        dashDollar();

      }).fail(function(response) {
        response.getCode(); // Some error code such as, for example, 404
      });
  }

// Get Coin to Dollar Rate for Dash
  function dashDollar() {
    requestify.get('https://min-api.cryptocompare.com/data/price?fsym=DASH&tsyms=USD')
      .then(function(response) {
          var dol = response.getBody();
          answer.coinToDollar = dol.USD;
          done();
      }
    );
  }

// All done, send response
  function done() {
        res.status(200).json(answer);
  }

});


//===========================================================================================
// FETCH ZCASH: DIFFICULTY AND REWARD AND COIN TO DOLLAR RATE
//===========================================================================================

app.get("/api/coins/zec", function(req, res) {
  var answer = {};
  answer.name = "Zcash";
  answer.symbol = "ZEC";
  var resp;

  zCalc();

// Get Zcash Difficulty
  function zCalc() {
    requestify.get('https://api.zcha.in/v2/mainnet/network')
      .then(function(response) {

        resp = response.getBody();
        answer.difficulty = resp.difficulty; // Zcash Difficulty
        zCalc2()
        // res.status(200).json({"difficulty": resp.difficulty});

      }).fail(function(response) {
        response.getCode(); // Some error code such as, for example, 404
      });
  }

// Get Zcash Reward
  function zCalc2() {

    requestify.get('https://api.zcha.in/v2/mainnet/transactions?sort=blockHeight&direction=descending&limit=1&offset=0')
      .then(function(response) {

        resp = response.getBody();
        answer.reward = resp[0].value; // Zcash Reward
        zDollar();

      }).fail(function(response) {
        response.getCode(); // Some error code such as, for example, 404
      });
  }

// Get Zcash Coin to Dollar Rate
  function zDollar() {
    requestify.get('https://min-api.cryptocompare.com/data/price?fsym=ZEC&tsyms=USD')
      .then(function(response) {
          var dol = response.getBody();
          answer.coinToDollar = dol.USD; // Zcash Coin to Dollar Rate
          done();
      }
    );
  }

// All done, send response
  function done() {
    res.status(200).json(answer);
  }

});


//===========================================================================================
// FETCH MONERO: DIFFICULTY AND REWARD AND COIN TO DOLLAR RATE
//===========================================================================================

app.get("/api/coins/xmr", function(req, res) {
  var answer = {};
  answer.name = "Monero";
  answer.symbol = "XMR";
  var resp, parsed;

  xCalc(); // call first function

  // Fetch Monero Data
  function xCalc() {
    fetch('http://moneroblocks.info/api/get_stats/')
        .then(res => res.text())
        .then(body => xCalc2(body));
  }

  // Calculate difficulty
  function xCalc2(x) {
    // console.log(x);
    parsed = JSON.parse(x);
    answer.difficulty = parsed.difficulty; // note down Monero difficulty
    xCalc3();
  }

  // Get Monero Reward
  function xCalc3() {
    // https://whattomine.com/coins/101.json
    requestify.get('https://whattomine.com/coins/101.json')
      .then(function(response) {
          resp = response.getBody();
          console.log(resp);
          answer.reward = resp.block_reward;
          xDollar();
      });
  }

// Get Monero: Coin to Dollar Rate
  function xDollar() {
    requestify.get('https://min-api.cryptocompare.com/data/price?fsym=XMR&tsyms=USD')
      .then(function(response) {
          var dol = response.getBody();
          answer.coinToDollar = dol.USD;
          done();
      }
    );
  }
// All done, send response
  function done() {
    res.status(200).json(answer);
  }

});


//===========================================================================================
// FETCH BITCOIN/LITECOIN: DIFFICULTY AND REWARD
//===========================================================================================


app.get("/api/coins/data", function(req, res) {
  var answer = {}
  answer.data = [] // collect all data in array
  answer.errors = [] // note down errors
  var coin = {} //btc
  var coin2 = {} //ltc
  var coin3 = {} //monero - cryptonight

  btcDifficulty(); // call BTC Difficulty function

// BTC Difficulty function
  function btcDifficulty() {
    coin = {}
    coin.coinName = "bitcoin";
    requestify.get('https://blockchain.info/q/getdifficulty')
      .then(function(response) {
          coin.difficulty = response.getBody();
          btcReward(); // call BTC Reward function
      });
  }

// BTC Reward function
  function btcReward() {
    requestify.get('https://blockchain.info/q/bcperblock')
      .then(function(response) {
          coin.reward = response.getBody();
          answer.data.push(coin);
          ltcDifficulty(); // call LTC Difficulty function
      }
    );
  }

// LTC Difficulty function
  function ltcDifficulty() {
    coin2.coinName = "litecoin";
    coin2.reward = 0;
    requestify.get('http://explorer.litecoin.net/chain/Litecoin/q/getdifficulty')
      .then(function(response) {
          coin2.difficulty = response.getBody();
          ltcReward(); // call LTC Reward function
      }).fail(function(response) {
        response.getCode(); // Some error code such as, for example, 404
      });
  }

// call LTC Reward function
  function ltcReward() {
    requestify.get('http://explorer.litecoin.net/chain/Litecoin/q/getblockcount')
      .then(function(response) {
        var blocknumber = response.getBody();
        var ltcReward = ltcRewardClc(blocknumber);
        coin2.reward = ltcReward;
        answer.data.push(coin2);
        done(); // All done, send response
      }
    );
  }

// Used by LTC Reward Function to calculate reward from block number
  function ltcRewardClc(blocknumber){
    return 50.0 / (2 * parseInt((parseInt(blocknumber) + 1) / 840000));
  }




// All done, send response
  function done() {
    res.status(200).json(answer);
  }

});

//===========================================================================================
// COMPANIES API ROUTES BELOW
//===========================================================================================


var COMPANIES_COLLECTION = "companies";

// CREATE: A new company
app.post("/companies/create", function(req, res) {
  var error = 0
  var newAdmin = req.body;
  newAdmin.createDate = new Date(); // get current timestamp
            db.collection(COMPANIES_COLLECTION).insertOne(newAdmin, function(err, doc) {
              if (err) {
                handleError(res, err.message, "Failed to create new company."); // Error Handler: If there is an error, send response as error
              } else {
                res.status(201).json(doc.ops[0]); // Success Response: On success, send response to browser
              }
            });
});

// GET: All companies from the database
app.get("/companies/all", function(req, res) {
  db.collection(COMPANIES_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get companies."); // Error Handler: If there is an error, send response as error
    } else {
      res.status(200).json(docs);   // Success Response: On success, send response to browser
    }
  });
});


// GET: Company by ID
app.get("/companies/:id", function(req, res) {
  db.collection(COMPANIES_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get company."); // Error Handler: If there is an error, send response as error
    } else {
      res.status(200).json(doc);   // Success Response: On success, send response to browser
    }
  });
});



// DELETE: Find company by ID and remove it
app.delete("/companies/delete/:id", function(req, res) {
  db.collection(COMPANIES_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete companies"); // Error Handler: If there is an error, send response as error
    } else {
      res.status(204).end(); // Success Response: On success, send response to browser
    }
  });
});

//===========================================================================================
// CONTRACTS API ROUTES 
//===========================================================================================

// CREATE: Add a new contract
app.post("/contracts/create", function(req, res) {
  var error = 0
  var newAdmin = req.body;
  // create a URL slug from name
  newAdmin.slug = newAdmin.name.replace(/[^a-zA-Z ]/g, "") + newAdmin.company.name.replace(/[^a-zA-Z ]/g, "");
  newAdmin.slug = newAdmin.slug.replace(/\s+/g, '-').toLowerCase() + "-" + makeid();

  newAdmin.createDate = new Date(); // get current timestamp 
            db.collection(CONTRACTS_COLLECTION).insertOne(newAdmin, function(err, doc) {
              if (err) {
                handleError(res, err.message, "Failed to create new contract."); // Error Handler: If there is an error, send response as error
              } else {
                res.status(201).json(doc.ops[0]); // Success Response: On success, send response to browser
              }
            });
});



// DELETE: Delete all contracts from the database
app.delete("/contracts/massdelete", function(req, res) {
    db.collection(CONTRACTS_COLLECTION).deleteMany({});
    res.status(200).json();
  });

// CREATE: Mass upload contracts. The frontend converts CSVs to JSON.
// This API deletes all previous contracts and adds new ones
app.post("/contracts/massupload", function(req, res) {
  var newData = req.body;

  db.collection(CONTRACTS_COLLECTION).deleteMany({});

  db.collection(CONTRACTS_COLLECTION).insertMany(newData, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contract."); // Error Handler: If there is an error, send response as error
    } else {
      res.status(201).json(doc); // Success Response: On success, send response to browser
    }
  });


});


// GET: Contract by URL Slug
app.get("/contracts/slug/:slug", function(req, res) {
  db.collection(CONTRACTS_COLLECTION).findOne({slug: req.params.slug}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get contract."); // Error Handler: If there is an error, send response as error
    } else {
      res.status(200).json(doc); // Success Response: On success, send response to browser
    }
  });
});


// GET: All contracts from Database
app.get("/contracts/all", function(req, res) {
  db.collection(CONTRACTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contracts."); // Error Handler: If there is an error, send response as error
    } else {
      res.status(200).json(docs);   // Success Response: On success, send response to browser
    }
  });
});

// GET: Contract by ID
app.get("/contracts/:id", function(req, res) {
  db.collection(CONTRACTS_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get contract."); // Error Handler: If there is an error, send response as error
    } else {
      res.status(200).json(doc);   // Success Response: On success, send response to browser
    }
  });
});


// GET: Contract by Company ID
app.get("/contracts/company/:company", function(req, res) {
  db.collection(CONTRACTS_COLLECTION).find({companies: req.params.company}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contract."); // Error Handler: If there is an error, send response as error
    } else {
      res.status(200).json(docs);   // Success Response: On success, send response to browser
    }
  });
});


// DELETE: Find contract by ID and remove it
app.delete("/contracts/delete/:id", function(req, res) {
  db.collection(CONTRACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete contract"); // Error Handler: If there is an error, send response as error
    } else {
      res.status(204).end(); // Success Response: On success, send response to browser
    }
  });
});


// EDIT: Find contract by ID and update it
app.post("/contracts/update/:id", function(req, res) {
var updateDoc = req.body;
  delete updateDoc._id;
  db.collection(CONTRACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contract"); // Error Handler: If there is an error, send response as error
    } else {
      res.status(204).end(); // Success Response: On success, send response to browser
    }
  });
});

//===========================================================================================
// USERS API ROUTES 
//===========================================================================================

var USERS_COLLECTION = "users";

// CREATE: New User
app.post("/users/create", function(req, res) {
  var error = 0
  var newAdmin = req.body;
  newAdmin.createDate = new Date(); // get current timestamp 
            db.collection(USERS_COLLECTION).insertOne(newAdmin, function(err, doc) {
              if (err) {
                handleError(res, err.message, "Failed to create new user."); // Error Handler: If there is an error, send response as error
              } else {
                res.status(201).json(doc.ops[0]); // Success Response: On success, send response to browser
              }
            });
});

// GET: All users from the database
app.get("/users/all", function(req, res) {
  db.collection(USERS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get users."); // Error Handler: If there is an error, send response as error
    } else {
      res.status(200).json(docs);   // Success Response: On success, send response to browser
    }
  });
});

// GET: Find user by ID and send data to frontend
app.get("/users/:id", function(req, res) {
  db.collection(USERS_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get user."); // Error Handler: If there is an error, send response as error
    } else {
      res.status(200).json(doc);   // Success Response: On success, send response to browser
    }
  });
});


// DELETE: Find user by ID and delete it
app.delete("/users/delete/:id", function(req, res) {
  db.collection(USERS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete user"); // Error Handler: If there is an error, send response as error
    } else {
      res.status(204).end(); // Success Response: On success, send response to browser
    }
  });
});



//===========================================================================================
// REVIEWS API ROUTES BELOW
//===========================================================================================


var REVIEWS_COLLECTION = "reviews";

// CREATE: New Review for a contract
app.post("/reviews/create", function(req, res) {
  var error = 0
  var newAdmin = req.body;
  newAdmin.createDate = new Date(); // get current timestamp 
            db.collection(REVIEWS_COLLECTION).insertOne(newAdmin, function(err, doc) {
              if (err) {
                handleError(res, err.message, "Failed to create new review."); // Error Handler: If there is an error, send response as error
              } else {
                res.status(201).json(doc.ops[0]); // Success Response: On success, send response to browser
              }
            });
});

// GET: All reviews
app.get("/reviews/all", function(req, res) {
  db.collection(REVIEWS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get reviews."); // Error Handler: If there is an error, send response as error
    } else {
      res.status(200).json(docs);   // Success Response: On success, send response to browser
    }
  });
});

// GET: Reviews by Contract ID. Sends all reviews for a particular contract.
app.get("/reviews/contract/:id", function(req, res) {
  db.collection(REVIEWS_COLLECTION).find({contract: req.params.id}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get reviews."); // Error Handler: If there is an error, send response as error
    } else {
      res.status(200).json(docs);   // Success Response: On success, send response to browser
    }
  });
});



// DELETE: Find review by ID and delete it 
app.delete("/reviews/delete/:id", function(req, res) {
  db.collection(REVIEWS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete review"); // Error Handler: If there is an error, send response as error
    } else {
      res.status(204).end(); // Success Response: On success, send response to browser
    }
  });
});




//===========================================================================================
// AUTHORS API ROUTES BELOW
//===========================================================================================

var AUTHORS_COLLECTION = "authors";

// CREATE: New Blog Author
app.post("/authors/create", function(req, res) {
  var error = 0
  var newAdmin = req.body;
  newAdmin.createDate = new Date(); // get timestamp
            db.collection(AUTHORS_COLLECTION).insertOne(newAdmin, function(err, doc) {
              if (err) {
                handleError(res, err.message, "Failed to create new author."); // Error Handler: If there is an error, send response as error
              } else {
                res.status(201).json(doc.ops[0]); // Success Response: On success, send response to browser
              }
            });
});

// GET: All Blog Authors from Database
app.get("/authors/all", function(req, res) {
  db.collection(AUTHORS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get authors."); // Error Handler: If there is an error, send response as error
    } else {
      res.status(200).json(docs); // Success Response: On success, send response to browser
    }
  });
});


// GET: Blog Author by ID
app.get("/authors/:id", function(req, res) {
  db.collection(AUTHORS_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get author."); // Error Handler: If there is an error, send response as error
    } else {
      res.status(200).json(doc); // Success Response: On success, send response to browser
    }
  });
});

//DELETE: Blog Author by ID
app.delete("/authors/delete/:id", function(req, res) {
  db.collection(AUTHORS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete author"); // Error Handler: If there is an error, send response as error
    } else {
      res.status(204).end(); // Success Response: On success, send response to browser
    }
  });
});

//===========================================================================================
// BLOGS API ROUTES
//===========================================================================================

var BLOGS_COLLECTION = "blogs";

// CREATE: A new blog post
app.post("/blogs/create", function(req, res) {
  var error = 0
  var newAdmin = req.body;
  // create a URL slug from title
  newAdmin.slug = newAdmin.title.replace(/[^a-zA-Z ]/g, "");
  newAdmin.slug = newAdmin.slug.replace(/\s+/g, '-').toLowerCase();

  newAdmin.createDate = new Date(); // get current timestamp 
            db.collection(BLOGS_COLLECTION).insertOne(newAdmin, function(err, doc) {
              if (err) {
                handleError(res, err.message, "Failed to create new blog."); // Error Handler: If there is an error, send response as error
              } else {
                res.status(201).json(doc.ops[0]); // Success Response: On success, send response to browser
              }
            });
});

// CREATE: All Blogs from Database
app.get("/blogs/all", function(req, res) {
  db.collection(BLOGS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get blogs."); // Error Handler: If there is an error, send response as error
    } else { 

            var y = docs.length
             for (var x=0; x<docs.length; x++) {
              docs[x].createTimestamp = docs[x].createDate;
              // Convert date to human readable format
              docs[x].createDate = prettydate.format(docs[x].createDate);
              y--;
              if(y==0) {
              res.status(200).json(docs);  // Success Response: On success, send response to browser
            }
          }
    }
  });
});


// GET: Blog by ID
app.get("/blogs/:id", function(req, res) {
  db.collection(BLOGS_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get blog."); // Error Handler: If there is an error, send response as error
    } else {
      doc.createTimestamp = doc.createDate;
      // Convert date to human readable format
      doc.createDate = prettydate.format(doc.createDate);
      res.status(200).json(doc);   // Success Response: On success, send response to browser
    }
  });
});

// GET: Blog by URL Slug
app.get("/blogs/slug/:slug", function(req, res) {
  db.collection(BLOGS_COLLECTION).findOne({slug: req.params.slug}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get blog."); // Error Handler: If there is an error, send response as error
    } else {
      doc.createTimestamp = doc.createDate;
      // Convert date to human readable format
      doc.createDate = prettydate.format(doc.createDate);
      res.status(200).json(doc); // Success Response: On success, send response to browser
    }
  });
});

// DELETE: Blog by ID
app.delete("/blogs/delete/:id", function(req, res) {
  db.collection(BLOGS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete blog"); // Error Handler: If there is an error, send response as error
    } else {
      res.status(204).end(); // Success Response: On success, send response to browser
    }
  });
});

// UPDATE: Blog by ID
app.post("/blogs/update/:id", function(req, res) {
var updateDoc = req.body;
  delete updateDoc._id;
  updateDoc.createDate = new Date(); // get current timestamp 
  db.collection(BLOGS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update blog"); // Error Handler: If there is an error, send response as error
    } else {
      res.status(204).end(); // Success Response: On success, send response to browser
    }
  });
});

//===========================================================================================
// NEWS API ROUTES
//===========================================================================================

// Create a new News item
app.post("/news/create", function(req, res) {
  var error = 0
  var newAdmin = req.body;
  // create a URL slug from title
  newAdmin.slug = newAdmin.title.replace(/[^a-zA-Z ]/g, "");
  newAdmin.slug = newAdmin.slug.replace(/\s+/g, '-').toLowerCase();

  newAdmin.createDate = new Date(); // get current timestamp 
  // add to database
            db.collection(NEWS_COLLECTION).insertOne(newAdmin, function(err, doc) {
              if (err) {
                handleError(res, err.message, "Failed to create new blog."); // Error Handler: If there is an error, send response as error
              } else {
                res.status(201).json(doc.ops[0]); // Success Response: On success, send response to browser
              }
            });
});

// get all news
app.get("/news/all", function(req, res) {
  db.collection(NEWS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get news."); // Error Handler: If there is an error, send response as error
    } else { 
      // get all news items
            var y = docs.length
             for (var x=0; x<docs.length; x++) {
              docs[x].createTimestamp = docs[x].createDate;
               // Convert date to human readable format
              docs[x].createDate = prettydate.format(docs[x].createDate);
              y--;
              if(y==0) {
              res.status(200).json(docs);  // Success Response: On success, send response to browser
            }
          }
    }
  });
});

// GET: Find news item by ID
app.get("/news/:id", function(req, res) {
  db.collection(NEWS_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get news."); // Error Handler: If there is an error, send response as error
    } else {
      doc.createTimestamp = doc.createDate;
      // Convert date to human readable format
      doc.createDate = prettydate.format(doc.createDate);
      res.status(200).json(doc);  // Success Response: On success, send response to browser
    }
  });
});

// GET: Find news item by URL slug
app.get("/news/slug/:slug", function(req, res) {
  db.collection(NEWS_COLLECTION).findOne({slug: req.params.slug}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get blog."); // Error Handler: If there is an error, send response as error
    } else {
      doc.createTimestamp = doc.createDate;
      // Convert date to human readable format
      doc.createDate = prettydate.format(doc.createDate);
      res.status(200).json(doc); // Success Response: On success, send response to browser
    }
  });
});

// DELETE: Find News Item by ID and delete it
app.delete("/news/delete/:id", function(req, res) {
  db.collection(NEWS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete blog"); // Error Handler: If there is an error, send response as error
    } else {
      res.status(204).end(); // Success Response: On success, send response to browser
    }
  });
});

// UPDATE: Edit news, and create a new ID
app.post("/news/update/:id", function(req, res) {
var updateDoc = req.body;
  delete updateDoc._id;
  updateDoc.createDate = new Date(); // get current timestamp 
  db.collection(NEWS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update news"); // Error Handler: If there is an error, send response as error
    } else {
      res.status(204).end(); // Success Response: On success, send response to browser
    }
  });
});


//===========================================================================================
// ADMIN API ROUTES
//===========================================================================================


var ADMINS_COLLECTION = "admins"; // collection name

// Get count of the total number of companies in the database
app.get("/companiesTotal", function(req, res) {
  db.collection(COMPANIES_COLLECTION).count(function(err, docs) {
      if (err) { handleError(res, err.message, "Failed to get.");
      } else {
        res.status(200).json(docs); } // Success Response: On success, send response to browser
  })
});

// Get count of the total number of contracts in the database
app.get("/contractsTotal", function(req, res) {
  db.collection(CONTRACTS_COLLECTION).count(function(err, docs) {
      if (err) { handleError(res, err.message, "Failed to get.");
      } else { res.status(200).json(docs); } // Success Response: On success, send response to browser
  })
});

// Get count of the total number of users in the database
app.get("/usersTotal", function(req, res) {
  db.collection(USERS_COLLECTION).count(function(err, docs) {
      if (err) { handleError(res, err.message, "Failed to get.");
      } else { res.status(200).json(docs); } // Success Response: On success, send response to browser
  })
});

// Get count of the total number of reviews in the database
app.get("/reviewsTotal", function(req, res) {
  db.collection(REVIEWS_COLLECTION).count(function(err, docs) {
      if (err) { handleError(res, err.message, "Failed to get.");
      } else { res.status(200).json(docs); } // Success Response: On success, send response to browser
  })
});

// Get count of the total number of blog authors in the database
app.get("/authorsTotal", function(req, res) {
  db.collection(AUTHORS_COLLECTION).count(function(err, docs) {
      if (err) { handleError(res, err.message, "Failed to get.");
      } else { res.status(200).json(docs); } // Success Response: On success, send response to browser
  })
});

// Get count of the total number of blog articles in the database
app.get("/blogsTotal", function(req, res) {
  db.collection(BLOGS_COLLECTION).count(function(err, docs) {
      if (err) { handleError(res, err.message, "Failed to get.");
      } else { res.status(200).json(docs); } // Success Response: On success, send response to browser
  })
});

// Get count of the total number of admins in the database
app.get("/adminsTotal", function(req, res) {
  db.collection(ADMINS_COLLECTION).count(function(err, docs) {
      if (err) { handleError(res, err.message, "Failed to get.");
      } else { res.status(200).json(docs); } // Success Response: On success, send response to browser
  })
});


// CREATE: A new admin. This can be done from the admin panel.
app.post("/admins/create", function(req, res) {
  var error = 0
  var newAdmin = req.body;
  newAdmin.createDate = new Date(); // get timestamp

  // if name or email isn't provided, send an error
  if (!(req.body.name || req.body.email)) {
    handleError(res, "Invalid user input", "Must provide a name and email.", 400);
  }
  // hash password
  newAdmin.password = sha1(newAdmin.password);
  // check if admin already exists
  db.collection(ADMINS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get admins."); // Success Response: On success, send response to browser
    } else {

      for(var i = 0; i < docs.length; i++) {
        if(docs[i].email==newAdmin.email) {
          // if admin exists, increment error counter to note it down
         error++
        }
      }
      // if there is an error, send response
      if(error>0){
        res.status(500).json("Admin already exists"); // Error Handler: If there is an error, send response as error
      }
       else {
        // if there is no error, SIGN UP admin.
            db.collection(ADMINS_COLLECTION).insertOne(newAdmin, function(err, doc) {
              if (err) {
                handleError(res, err.message, "Failed to create new admins."); // Error Handler: If there is an error, send response as error
              } else {
                res.status(201).json(doc.ops[0]); // send success response to browser
              }
            });
        }
    }
  });  
});

// LOGIN: Get email and password and login admin
app.post("/admin/login", function(req, res) {
  var admin = req.body;
  var error = 0
  // hash password so that we can match it with the hash stored in database
  admin.password = sha1(admin.password);
  db.collection(ADMINS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get admins.");
    } else {
      for(var i = 0; i < docs.length; i++) {
        // check if it's a match
        if(docs[i].email==admin.email && docs[i].password==admin.password) {
          res.status(201).json(docs[0]); // Success Response: On success, send response to browser
          error++
        }
      }
      if(error==0) {
        res.status(403).json("Login invalid"); // Error Handler: If there is an error, send response as error
      }
    }
  });
});

// GET: All admins from the database
app.get("/admins/all", function(req, res) {
  db.collection(ADMINS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get admins.");
    } else {
      res.status(200).json(docs);  // Success Response: On success, send response to browser
    }
  });
});

// DELETE: Find Admin by ID and delete it
app.delete("/admins/delete/:id", function(req, res) {
  db.collection(ADMINS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete admin");
    } else {
      res.status(204).end(); // Success Response: On success, send response to browser
    }
  });
});

//===========================================================================================
// CONTRACT FORM: This API sends email to admin@coinminingcompare.com
//===========================================================================================
app.post("/api/contact", function(req, res) {
  var email = req.body.email;
  var name = req.body.name;
  var msg = req.body.message;
  var compiled = 'Name: ' + name + '<br/>Email: ' + email + '<br/>Message: ' + msg;
  cmc_mailer('Contact Message', 'admin@coinminingcompare.com', compiled); // fire email function
  res.status(201).json("Done");
});

//===========================================================================================
// If it's not an API call, send the Angular Starter Page i.e. index.html
//===========================================================================================
app.get('/*', function(req, res) {
  // load the single view file (angular will handle the page changes on the front-end)
  res.sendFile("index.html",{root:__dirname+'/public'});  
});

//===========================================================================================
// GENERATE A RANDOM ID
//===========================================================================================
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 12; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

//===========================================================================================
// EMAIL SENDER: This uses nodemailer to send SMTP emails
//===========================================================================================
function cmc_mailer(subject, email, body) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thesteadymailer@gmail.com',
        pass: 'SteadyMailer123'
    }
  });

  var html_body = "<b>Email Sender</b><br/><br/>" + body + "<br/><br/><b> - From CoinMiningCompare.com</b>"

  let mailOptions = {
      from: '"Email Sender" <thesteadymailer@gmail.com>', // Sender's address
      to: email, // Reciever's Email
      subject: subject, // Subject line
      text: body, // plain text body
      html: html_body // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      return;
  });
}

//===========================================================================================
// You can define your error handler here
//===========================================================================================
function handleError() {}

//===========================================================================================
// END OF SERVER CODE
//===========================================================================================

//===========================================================================================
// USEFUL APIS
//===========================================================================================

// ETHEREUM
// https://etherchain.org/api/basic_stats
// We're using this

// MONERO
// http://moneroblocks.info/api/get_stats/
// Block reward formula not available

// DASH
// https://dash.holytransaction.com/api/getdifficulty
// Block reward formula not available

// Z CASH
// https://api.zcha.in/v2/mainnet/network
// Block reward formula not available

