const db = require('./database'); // Import databázy

const getAllLogins = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM logins", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getLoginsCount = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) AS count FROM logins", (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count);
      }
    });
  });
};

const getLoginsByDate = (specificDate) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT date, country, COUNT(*) as logins
      FROM logins
      WHERE date = ?
      GROUP BY country
      ORDER BY logins DESC`;

    db.all(sql, [specificDate], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const statistics = rows.map((row, index) => ({
          date: row.date,
          order: index + 1,
          country: row.country,
          logins: row.logins
        }));

        resolve(statistics);
      }
    });
  });
};

module.exports = {
  getAllLogins,
  getLoginsCount,
  getLoginsByDate
};
