// __________________________________ //
// ***** Bibliotecas Importadas ***** //
import express from 'express';
import session from 'express-session';
import auth from './security/auth.js';

/* ____________________________ */
// ***** Vars. de Config. ***** //
const app = express();
const port = 3000;
const host = 'localhost';
const API_URL = 'http://localhost:4000/usuarios';

let usuarios = [];

app.use(session(
{
   secret: '1re5gerg5g16rg9e',   // ? Chave p/ assinar o cookie
   resave: true,                 // ? Força a sessão a ser salva mesmo que não tenha havido alterações
   saveUninitialized: false,     // ? Não salva a sessão se não houver alterações

   cookie:
   {
      maxAge: 1000 * 60 * 30,    // ? Tempo de expiração do cookie (15 minutos)
      httpOnly: true,            // ? Não permite acesso ao cookie via JavaScript
   }
}));

// ***** Configuração do Express ***** //
app.use(express.urlencoded({ extended: true })); // ? Permite o middleware para decodificar o corpo da requisição
app.use('/database', express.static('database'));
app.use(express.static('public')); // ? Compartilhando a pasta public

// ________________________________ //
// ** Rotas - Caminhos de Acesso ** //


function getUserAuth()
{
   fetch(API_URL)
      .then(resp => resp.json())
      .then(data => usuarios = data)
      .catch(error => console.error('Erro ao buscar usuários:', error));
}

getUserAuth(); // ? Carrega os usuários do banco de dados

app.post('/login', async (req, res) =>
{
   const { lUsuario, lSenha } = req.body;

   if (usuarios.filter(u => u.email === lUsuario && u.senha === lSenha).length > 0)
   {
      req.session.auth = true;
      res.redirect('/main.html');
   }
   else
   {
      console.log('Login inválido');
      res.send(`<script>alert("Usuário ou senha inválidos!"); window.location.href = "/login.html";</script>`);
   }
});

// ____________________________________________________________________ //
// ** Conteúdo Privado - Compartilhando apenas mediante autenticação ** //

app.use(auth, express.static("private/pages"));
app.use(auth, express.static('private/assets'));

app.get('/logout', (req, res) =>
{
   req.session.destroy();        // ? Destroi a sessão
   res.redirect('/login.html');  // ? Redireciona para a página de login
   res.end();                    // ? Encerra a resposta
});

app.listen(port, host, () =>
{
   console.log(`Servidor rodando em http://${host}:${port}`);
});