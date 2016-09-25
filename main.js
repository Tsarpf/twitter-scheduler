const fs = require('fs')
const Twitter = require('twitter')
const CronJob = require('cron').CronJob

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./resources/db.sqlite', (err) => {
  if (err) {
    console.log('could not open database file:', err)
  }
})

const createTable = 'CREATE TABLE IF NOT EXISTS poems \
                    (submit_time INT NOT NULL, \
                    submitter_nick VARCHAR(40) NOT NULL, \
                    poem VARCHAR(500) NOT NULL, \
                    posted BOOLEAN DEFAULT 0 NOT NULL)'

db.serialize(() => {
  db.run(createTable)
})

const oldestPoemQuery = 'SELECT rowid as id, submit_time, submitter_nick, poem, posted FROM poems WHERE posted = 0 ORDER BY date(submit_time) ASC Limit 1'
function getOldestPoem(cb) {
  db.get(oldestPoemQuery, (err, row) => {
    cb(err, row)
  })
}

const insertPoemQuery = 'INSERT INTO poems \
                         (submit_time, submitter_nick, poem) \
                         VALUES (?, ?, ?)'
function insertPoem(submitter_nick, poem, cb) {
  db.run(insertPoemQuery, Date.now(), submitter_nick, poem, (err) => {
    cb(err)
  })
}

const setPoemToPostedQuery = 'UPDATE poems SET posted = 1 WHERE rowid = ?'
function setPoemToPosted(row) {
  db.run(setPoemToPostedQuery, row.id, (err) => {
    if (err) {
      console.log('Setting poem to posted failed: ', err)
    }
  })
}

const secretObj = JSON.parse(fs.readFileSync('./secrets/settings.json', 'utf8'))
const client = new Twitter({
  consumer_key: secretObj.consumer_key,
  consumer_secret: secretObj.consumer_secret,
  access_token_key: secretObj.access_token_key,
  access_token_secret: secretObj.access_token_secret
})

function postTweet(tweet) {
  client.post('statuses/update', {status: tweet}, function(error, tweet, response) {
    if (error) {
      console.log('error posting tweet!')
      console.log(error)
    }
    console.log(tweet)  // Tweet body.
  })
}

function getPoemAndPost() {
  getOldestPoem((err, row) => {
    if (err) {
      console.log('error fetching oldest poem: ', err)
      return
    }

    if (!row) {
      console.log('out of rows!')
      return
    }

    console.log('fetched:')
    console.log(row)
    setPoemToPosted(row)
    postTweet(row.poem)
  })
}

const cronTasks = [
  '00 00 9 * * 1-5', // every weekday at 09:00
  '00 00 15 * * 1-5', // every weekday at 15:00
  //'* * * * * *' // every second
]

cronTasks.forEach((cronString) => {
  new CronJob(cronString, () => {
    getPoemAndPost()
  }, () => {
    console.log('Warning! cron task stopped for string: ', cronString)
  }, true, 'Europe/Helsinki')
})

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.post('/poem', function (req, res) {
  res.send('Got a POST request')
  console.log(req.body)
})
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})
app.use(express.static(__dirname + '/public'))
const port = 9876
app.listen(port), () => console.log('Listening on port ', port)

/*
insertPoem('tsurba', 'Nyt on alla itse tehty softa\nSen avulla postataan kohta', (err) => {
  if (!err) {
    console.log('inserted')
  } else {
    console.log('insert fail: ', err)
  }
})

*/
