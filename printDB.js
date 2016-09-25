const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./resources/db.sqlite', (err) => {
  if (err) {
    console.log('could not open database file:', err)
  }
})
db.each('SELECT rowid as id, submit_time, submitter_nick, poem, posted FROM poems', function(err, row) {
  console.log(row)
})

/*
  table for reference

const createTable = 'CREATE TABLE IF NOT EXISTS poems \
                    (submit_time INT NOT NULL, \
                    submitter_nick VARCHAR(40) NOT NULL, \
                    poem VARCHAR(500) NOT NULL, \
                    posted BOOLEAN DEFAULT 0 NOT NULL)'
*/
