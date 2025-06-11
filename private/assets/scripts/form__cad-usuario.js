const form = document.querySelector('#form');
const API_URL = 'http://localhost:4000/usuarios';

let lista_usuario = [];

// ____________________________________ //
// ********** Operações CRUD ********** //

function carregarUsuarios()
{
   fetch(API_URL)
      .then(res => res.json())
      .then(data => lista_usuario = data)
      .catch(() => lista_usuario = [])
      .finally(() => showTable());
}

function removerUsuario(id, nome)
{
   if (confirm(`Deseja realmente excluir o usuário: ${nome}?`))
      fetch(API_URL + '/' + id, { method: 'DELETE' })
         .then(() => carregarUsuarios())
         .catch(error => console.error('Erro ao remover usuário:', error));
}

function registrarUsuario(usuario)
{
   fetch(API_URL,
   {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
   })
   .then(resp => resp.json())
   .then(data => console.log('Usuário registrado com sucesso:', data))
   .catch(error => console.log('Erro ao registrar o usuário:', error));
}

// _______________________________________________ //
// ********** Manipulação do Formulário ********** //

form.addEventListener('submit', (e) =>
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
      registrarUsuario(usuario);
      form.reset();
      showTable();
   }
   else
      if (form.checkValidity())
         alert('Usuário já cadastrado!');
      else
         alert('Preencha todos os campos obrigatórios!');
});

function showTable()
{
   const table = document.querySelector('#tabela');
   table.innerHTML = '';

   if (lista_usuario.length === 0)
   {
      table.innerHTML = "<div class='alert alert-warning text-center'>Nenhum usuário registrado!</div>";
      table.style.background = 'none';
   }
   else
   {
      table.style.background = '#fff';
      const head = document.createElement('thead');
      const body = document.createElement('tbody');

      Object.keys(lista_usuario[0]).forEach(key =>
      {
         if (key !== 'id')
         {
            const th = document.createElement('th');
            th.innerText = key;
            head.appendChild(th);
         }
      });

      head.innerHTML += `<th>Ações</th>`;

      lista_usuario.forEach(usuario =>
      {
         const tr = document.createElement('tr');

         Object.values(usuario).forEach(value =>
         {
            if (value !== usuario.id)
            {
               const td = document.createElement('td');
               td.innerText = value;
               tr.appendChild(td);
            }
         });

         tr.innerHTML += `<td><button class="btn btn-danger" onclick="removerUsuario('${usuario.id}', '${usuario.nome}')">Excluir</button></td>`;
         body.appendChild(tr);
      });

      table.appendChild(head);
      table.appendChild(body);
   }
}

function authList(lista, item, chave)
{
   const valido = lista.findIndex(i => i[chave] === item[chave]);
   return valido !== -1;
}

carregarUsuarios();