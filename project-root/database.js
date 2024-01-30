const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Určenie cesty pre databázový súbor
const DB_PATH = path.join(__dirname, 'db', 'logins_database.sqlite');

// Vytvorenie a pripojenie k databáze
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
   // console.log('Connected to SQLite database.');
    // Vytvorenie tabuľky logins, ak ešte neexistuje
    db.run(`CREATE TABLE IF NOT EXISTS logins (
      date TEXT,
      country TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err);
      }
    });
  }
});

module.exports = db;
