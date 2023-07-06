const mysql = require('mysql');
const express = require('express');
const app = express();

const connection = mysql.createConnection({
  host: '185.239.210.154',
  user: 'u625977176_apispaceapp',
  password: 'Ppp135198000',
  database: 'u625977176_apispaceapp',
  connectTimeout: 60000,
  charset: 'utf8mb4'
});

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar: ' + err.stack);
    return;
  }

  console.log('Conectado como id ' + connection.threadId);
});

let lastReceivedId = null;
let buffer = null;

setInterval(() => {
  //console.log('Verificando atualizações...');
  connection.query('SELECT * FROM spaceman ORDER BY ID DESC LIMIT 1', (err, rows) => {
    if(err) {
      console.error('Erro ao consultar o banco de dados: ', err);
      return;
    }

    //console.log('Dados recebidos do Banco de Dados.');

    // Se é a primeira execução ou se o ID mudou
    if(lastReceivedId === null || rows[0].id !== lastReceivedId) {
      //console.log('Novos dados recebidos:');
      
      let values = [];
      for (let key in rows[0]) {
        values.push(`"${rows[0][key]}"`);
      }
      
      // Atualizando a variável buffer com os novos dados
      buffer = values.join(', ');

      lastReceivedId = rows[0].id;
    } else {
      //console.log('Nenhum novo dado recebido.');
    }
  });
}, 3000);  // Executa a cada 3 segundos

app.get('/game-results', (req, res) => {
  res.json({ results: `[` + buffer + `]`});
});

app.listen(3005, () => {
  console.log('App ouvindo na porta 3005');
});
