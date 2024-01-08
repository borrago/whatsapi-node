const express = require('express');
const venom = require('venom-bot');
const axios = require('axios');

const app = express();

app.use(express.json());

let client;

function start(client) {
   client.onMessage((message) => {
      try {
         const webhookUrl = 'https://webhook.site/d3b4596a-c8d7-457a-8d99-56ee9582f302'; // A URL do webhook para o qual você deseja enviar as mensagens

         console.log({
            message: message.body,
            from: message.from,
         });

         axios.post(webhookUrl, {
            message: message.body,
            from: message.from,
         })
         .then((response) => {
            console.log('Webhook response: ', response);
         });
      } catch (error) {
         console.error('Error when sending to webhook: ', error);
      }
   });
}

app.post('/login/:id', async (req, res) => {
   try {
      const sessionId = req.params.id;

      await venom
         .create(
            //session
            `sessionName_${sessionId}`,
            //catchQR
            (base64Qr) => {
               res.status(200).json({ qrCode: base64Qr });
            },
            // statusFind
            undefined,
            // options
            { 
               logQR: false, 
               //browserArgs: ['--no-sandbox', '--disable-setuid-sandbox', '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'] 
            })
            .then((c) => {
               client = c;
               start(client);
            });
            
      res.status(200).json({ qrCode: '' });
   } catch (error) {
      res.status(500).json({ error: 'Erro ao criar o bot -> ' + error });
   }
});

app.post('/send', async (req, res) => {
   const { phone, message } = req.body;

   try {
      await client
         .sendText(phone, message)
         .then((result) => {
            console.log('Result: ', result); //return object success
         });

      res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
   } catch (error) {
      res.status(500).json({ error: 'Erro ao enviar a mensagem' });
   }
});

app.listen(3000, () => {
 console.log('Servidor rodando na porta 3000');
});