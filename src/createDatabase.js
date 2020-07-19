const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

// Create database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telephone VARCHAR(255),
      objective VARCHAR(255),
      origin VARCHAR(255),
      action VARCHAR(255),
      tag VARCHAR(255)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telephone VARCHAR(255),
      objective VARCHAR(255),
      origin VARCHAR(255),
      action VARCHAR(255),
      tag VARCHAR(255)
    );
  `);
});

module.exports = db;
