// ***** Bibliotecas Importadas ***** //
import express from 'express';

// ***** Vars. de Config. ***** //
const app = express();
const port = 3000;
const host = 'localhost';


app.listen(port, host, () =>
{
   console.log(`Servidor rodando em http://${host}:${port}`);
});

app.get('/', (req, res) =>
{
   res.send('Hello World!');
});