const express = require('express');
const router = express.Router();
const statistics = require('./Statistics');

router.get('/', async (req, res) => {
  try {
    const data = await statistics.getLoginsByDate('2024-01-30');
    console.log(data);
    const tableHtml = generateTableHtml(data);
    res.send(tableHtml);
  } catch (error) {
    console.error('Chyba pri načítavaní údajov pre tabuľku:', error);
    res.status(500).send('Chyba pri načítavaní údajov pre tabuľku');
  }
});
console.log(new Date(Date.now()).toISOString().split('T')[0]);
function generateTableHtml(data) {
  const tableHtml = `
    <html>
      <head>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }

          table, th, td {
            border: 1px solid black;
          }

          th, td {
            text-align: center;
            padding: 10px;
          }

          th {
            background-color: #f2f2f2;
          }

          tr:nth-child(odd) {
            background-color: #ffffff;
          }

          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <center><h1>Štatistický prehľad prihlásení pre dnešný deň. </h1></center>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Order</th>
              <th>Country</th>
              <th>Logins</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                <td>${item.date}</td>
                <td>${item.order}</td>
                <td>${item.country}</td>
                <td>${item.logins}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;
  return tableHtml;
}
module.exports = router;
