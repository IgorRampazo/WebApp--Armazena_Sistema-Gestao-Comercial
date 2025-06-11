const form = document.querySelector('#form');
const API_URL = 'http://localhost:4000/clientes';

let lista_cliente = [];

// ____________________________________ //
// ********** Operações CRUD ********** //

function carregarClientes()
{
   fetch(API_URL)
      .then(res => res.json())
      .then(data => lista_cliente = data)
      .catch(() => lista_cliente = [])
      .finally(() => showTable());
}

function removerCliente(id, nome)
{
   if (confirm(`Deseja realmente excluir o cliente: ${nome}?`))
      fetch(API_URL + '/' + id, { method: 'DELETE' })
         .then(() => carregarClientes())
         .catch(error => console.error('Erro ao remover cliente:', error));
}

function registrarCliente(cliente)
{
   fetch(API_URL,
   {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
   })
   .then(resp => resp.json())
   .then(data => console.log('Cliente registrado com sucesso:', data))
   .catch(error => console.log('Erro ao registrar o cliente:', error));
}

// _______________________________________________ //
// ********** Manipulação do Formulário ********** //

form.addEventListener('submit', (e) =>
{
   e.preventDefault();
   e.stopPropagation();

   const nome = form.nome.value;
   const cpf = form.cpf.value;
   const email = form.email.value;
   const telefone = form.telefone.value;
   const cidade = form.cidade.value;
   const uf = form.uf.value;
   const cep = form.cep.value;

   const cliente = { nome, cpf, email, telefone, cidade, uf, cep };

   if
   (
      !authList(lista_cliente, cliente, 'cpf') &&
      form.checkValidity()
   )
   {
      lista_cliente.push(cliente);
      registrarCliente(cliente);
      form.reset();
      showTable();
   }
   else
      if (form.checkValidity())
         alert('Cliente já cadastrado!');
      else
         alert('Preencha todos os campos obrigatórios!');
});

function showTable()
{
   const table = document.querySelector('#tabela');
   table.innerHTML = '';

   if (lista_cliente.length === 0)
   {
      table.innerHTML = "<div class='alert alert-warning text-center'>Nenhum cliente registrado!</div>";
      table.style.background = 'none';
   }
   else
   {
      table.style.background = '#fff';
      const head = document.createElement('thead');
      const body = document.createElement('tbody');

      Object.keys(lista_cliente[0]).forEach(key =>
      {
         if (key !== 'id')
         {
            const th = document.createElement('th');
            th.innerText = key;
            head.appendChild(th);
         }
      });

      head.innerHTML += `<th>Ações</th>`;

      lista_cliente.forEach(client =>
      {
         const tr = document.createElement('tr');

         Object.values(client).forEach(value =>
         {
            if (value !== client.id)
            {
               const td = document.createElement('td');
               td.innerText = value;
               tr.appendChild(td);
            }
         });

         tr.innerHTML += `<td><button class="btn btn-danger" onclick="removerCliente('${client.id}', '${client.nome}')">Excluir</button></td>`;
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

carregarClientes();