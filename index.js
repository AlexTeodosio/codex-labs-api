require('dotenv').config(); 
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3001; 


app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());


app.get('/', (req, res) => {
  res.send('API da CODEX LABS está no ar! Pronta para enviar e-mails.');
});


app.post('/enviar-email', async (req, res) => {
  const { nome, email, mensagem } = req.body;


  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }


  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

 
  try {
    const info = await transporter.sendMail({
      from: `"Formulário CODEX LABS" <${email}>`,
      to: "time@codexlabs.com", 
      subject: `Nova mensagem de contato de ${nome}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #1e40af;">Nova mensagem recebida pelo site CODEX LABS</h2>
          <p>Você recebeu uma nova mensagem através do formulário de contato.</p>
          <hr>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensagem:</strong></p>
          <p style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">${mensagem}</p>
        </div>
      `,
    });

    console.log('E-mail enviado com sucesso! Message ID: %s', info.messageId);
    
    console.log('URL de Pré-visualização: %s', nodemailer.getTestMessageUrl(info));

 
    res.status(200).json({ success: 'E-mail enviado com sucesso!' });

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
   
    res.status(500).json({ error: 'Falha ao enviar o e-mail.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor da API rodando em http://localhost:${PORT}`);
});