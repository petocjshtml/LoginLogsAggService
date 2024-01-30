const loginService = require('./LoginService');
const statistics = require('./Statistics');
const statisticsRouter = require('./ShowStatisticsInWeb');

const geoip = require('geoip-lite'); 
const express = require('express');

const db = require('./database'); 

const app = express();
app.use(express.json());
app.use('/', statisticsRouter);

// Funkcia pre konverziu IP na kód krajiny
const ipToCountryCode = (ip) => {
  const geo = geoip.lookup(ip);
  return geo ? geo.country : 'Neznáma';
};

// Funkcia na konverziu Unixového časového údaja na dátum
const convertTimestampToDate = (timestamp) => {
  return new Date(timestamp * 1000).toISOString().split('T')[0];
};

// Funkcia pre vytvorenie upraveného objektu 
const createModifiedLoginObject = (loginObject) => {
  return {
    date: convertTimestampToDate(loginObject.ts),
    country: ipToCountryCode(loginObject.ip)
  };
};

const insertLogin = (loginObject) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO logins (date, country) VALUES (?, ?)', 
      [loginObject.date, loginObject.country], 
      function(err) {
        if (err) {
          console.error('Error inserting data', err);
          reject(err);
        } else {
          //console.log('Login objekt bol úspešne vložený do databázy.');
          resolve();
        }
    });
  });
};

const deleteAllLogins = () => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM logins", function(err) {
      if (err) {
        console.error('Error deleting data', err);
        reject(err);
      } else {
        console.log(`Bolo vymazaných ${this.changes} záznamov z tabuľky logins.`);
        resolve(this.changes);
      }
    });
  });
};

//endpointy
app.post('/login', async (req, res) => {
  const modifiedLoginObject = createModifiedLoginObject(req.body);
  try {
    await insertLogin(modifiedLoginObject);
    res.status(200).send('Do tabuľky login bol vložený 1 objekt.');
  } catch (err) {
    res.status(500).send('Chyba pri vkladaní údajov do databázy.');
  }
});

app.post('/logins', async (req, res) => {
  const modifiedLoginObjects = req.body.map(obj => createModifiedLoginObject(obj));
  try {
    for (const obj of modifiedLoginObjects) {
      await insertLogin(obj);
    }
    res.status(200).send(`Do tabuľky login bolo vložené pole objektov o veľkosti: ${modifiedLoginObjects.length}`);
  } catch (err) {
    res.status(500).send('Chyba pri vkladaní údajov do databázy.');
  }
});


 /*
//asynchrónne volania a komunikácia s databázou
loginService.testSingleLogin();
loginService.testMultipleLogins(2);
console.log("Asynchrónne volania:");
statistics.getLoginsCount()
  .then(count => {
    console.log('V tabuľke logins je aktuálne', count ,'objektov.');
  })
  .catch(err => {
    console.error('Chyba pri získavaní počtu loginov:', err);
  });

  statistics.getAllLogins()
  .then(rows => {
    console.log('Všetky loginy:', rows);
  })
  .catch(err => {
    console.error('Chyba pri získavaní všetkých loginov:', err);
  });

  const specificDate = '2024-01-30'; 
  statistics.getLoginsByDate(specificDate)
  .then(statistics => {
    console.log(`Štatistiky pre dátum ${specificDate}:`, statistics);
  })
  .catch(err => {
    console.error(`Chyba pri získavaní štatistík pre dátum ${specificDate}:`, err);
  });
  */


  /*
  deleteAllLogins()
    .then(changes => {
      console.log(`Úspešne vymazaných ${changes} záznamov.`);
    })
    .catch(err => {
      console.error('Chyba pri vymazávaní záznamov:', err);
    });
  */
 //deleteAllLogins();

 //pozor! ak chcete, aby sa curl request data zovrazovali v tabulke, nastavte dnešný timestamp do objektu !!!
//curl 1 objekt
//curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "{\"ts\": 1706633516, \"ip\": \"87.244.221.47\"}"

// 2 objekty
//curl -X POST http://localhost:3000/logins -H "Content-Type: application/json" -d "[{\"ts\": 1706633516, \"ip\": \"87.244.221.47\"}, {\"ts\": 1706633516, \"ip\": \"192.168.1.1\"}]"

statistics.getAllLogins()
.then(rows => {
  console.log('Všetky loginy:', rows);
})
.catch(err => {
  console.error('Chyba pri získavaní všetkých loginov:', err);
});


const current_date = new Date(Date.now()).toISOString().split('T')[0]; 
statistics.getLoginsByDate(new Date(Date.now()).toISOString().split('T')[0])
.then(statistics => {
  console.log(`Štatistiky pre dátum ${current_date}:`, statistics);
})
.catch(err => {
  console.error(`Chyba pri získavaní štatistík pre dátum ${current_date}:`, err);
});

//vygeneruje náhodných 50 login objektov
loginService.testMultipleLogins(50);

//deleteAllLogins();

const PORT = 3000;
app.listen(PORT, () => {
 // console.log(`LoginLogsAggService beží na porte ${PORT}`);
});


