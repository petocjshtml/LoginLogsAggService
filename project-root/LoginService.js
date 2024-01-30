const axios = require('axios');

// Funkcia na vytvorenie náhodného login objektu
const createRandomLoginObject = () => {
  return {
    ts: Math.floor(Date.now() / 1000),
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
  };
};

// Funkcia na vytvorenie požadovaného počtu náhodných login objektov
const createRandomLoginObjects = (objectsNum) => {
  return Array.from({ length: objectsNum }, () => createRandomLoginObject());
};

// Funkcia na odoslanie jedného login objektu na LoginLogsAggService
const SendLoginObjectToLoginLogsAggService = async (loginObject) => {
  try {
    const response = await axios.post('http://localhost:3000/login', loginObject);
    console.log('Údaje odoslané:', response.data);
  } catch (error) {
    console.error('Chyba pri odosielaní údajov:', error);
  }
};

// Funkcia na odoslanie viacerých login objektov na LoginLogsAggService
const SendLoginObjectsToLoginLogsAggService = async (loginObjects) => {
  try {
    const response = await axios.post('http://localhost:3000/logins', loginObjects);
    console.log('Údaje odoslané:', response.data);
  } catch (error) {
    console.error('Chyba pri odosielaní údajov:', error);
  }
};

const testSingleLogin = async () => {
  const loginObject = createRandomLoginObject();
  await SendLoginObjectToLoginLogsAggService(loginObject);
};

const testMultipleLogins = async (numberOfLogins) => {
  const loginObjects = createRandomLoginObjects(numberOfLogins); 
  await SendLoginObjectsToLoginLogsAggService(loginObjects);
};

module.exports = {
  createRandomLoginObject,
  createRandomLoginObjects,
  SendLoginObjectToLoginLogsAggService,
  SendLoginObjectsToLoginLogsAggService,
  testSingleLogin,
  testMultipleLogins
};