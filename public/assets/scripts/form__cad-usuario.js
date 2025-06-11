const form = document.querySelector('#form-register');

const pathUser = 'http://localhost:4000/usuarios';
let lista_usuario = [];

function getDataUser() 
{
   fetch(pathUser, { method: 'GET' })
      .then(resp => resp.ok ? resp.json() : null)
      .then(data => lista_usuario = data)
      .catch(error => console.log('Erro ao carregar os dados do cliente:', error));
}

function registerUser(usuario)
{
   fetch(pathUser, 
      {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(usuario)
      })
      .then(response => response.json())
      .then(data => console.log('Usuário registrado com sucesso:', data))
      .catch(error => console.log('Erro ao registrar o usuário:', error));
}

form.addEventListener('submit', async (e) => 
{
   e.preventDefault();
   e.stopPropagation();

   const nome = form.nome.value;
   const email = form.email.value;
   const senha = form.senha.value;

   const usuario = { nome, email, senha };

   if
   (
      !authList(lista_usuario, usuario, 'email') &&
      form.checkValidity()
   ) 
   {
      lista_usuario.push(usuario);
      registerUser(usuario);
      form.reset();
      alert('Usuário cadastrado com sucesso!');
   }
   else if (form.checkValidity())
      alert('Usuário já cadastrado!');
   else
      alert('Preencha todos os campos obrigatórios!');
});

function authList(lista, item, chave) 
{
   const valido = lista.findIndex(i => i[chave] === item[chave]);
   return valido !== -1;
}

getDataUser();