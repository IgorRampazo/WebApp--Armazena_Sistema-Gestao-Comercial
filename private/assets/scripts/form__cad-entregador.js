const form = document.querySelector('#form');
const API_URL = 'http://localhost:4000/entregadores';

let lista_entregador = [];

// ____________________________________ //
// ********** Operações CRUD ********** //

function carregarEntregadores()
{
   fetch(API_URL)
      .then(resp => resp.json())
      .then(data => lista_entregador = data)
      .catch(() => lista_entregador = [])
      .finally(() => showTable());
}

function removerEntregador(id, nome)
{
   if (confirm(`Deseja realmente excluir o entregador: ${nome}?`))
      fetch(API_URL + `/${id}`, { method: 'DELETE' })
         .then(resp => resp.json())
         .then(() => carregarEntregadores())
         .catch(error => console.error('Erro ao remover entregador:', error));
}

function registrarEntregador(entregador)
{
   fetch(API_URL,
   {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify(entregador)
   })
   .then(resp => resp.json())
   .then(data => console.log('Entregador registrado com sucesso:', data))
   .catch(error => console.log('Erro ao registrar o entregador:', error));
}

// _______________________________________________ //
// ********** Manipulação do Formulário ********** //

form.addEventListener('submit', (e) =>
{
   e.preventDefault();
   e.stopPropagation();

   const nome = form.nome.value;
   const cpf = form.cpf.value;
   const telefone = form.telefone.value;
   const veiculo = form.veiculo.value;

   const entregador = { nome, telefone, cpf, veiculo };

   if
   (
      !authList(lista_entregador, entregador, 'cpf') &&
      form.checkValidity()
   )
   {
      lista_entregador.push(entregador);
      registrarEntregador(entregador)
      form.reset();
      showTable();
   }
   else
      if (form.checkValidity())
         alert('Entregador já cadastrado!');
      else
         alert('Preencha todos os campos obrigatórios!');
});

function showTable()
{
   const table = document.querySelector('#tabela');
   table.innerHTML = '';

   if (lista_entregador.length === 0)
   {
      table.innerHTML = "<div class='alert alert-warning text-center'>Nenhum entregador registrado!</div>";
      table.style.background = 'none';
   }
   else
   {
      table.style.background = '#fff';
      const head = document.createElement('thead');
      const body = document.createElement('tbody');

      Object.keys(lista_entregador[0]).forEach(key =>
      {
         if (key !== 'id')
         {
            const th = document.createElement('th');
            th.innerText = key;
            head.appendChild(th);
         }
      });

      head.innerHTML += `<th>Ações</th>`;

      lista_entregador.forEach(entregador =>
      {
         const tr = document.createElement('tr');

         Object.values(entregador).forEach(value =>
         {
            if (value !== entregador.id)
            {
               const td = document.createElement('td');
               td.innerText = value;
               tr.appendChild(td);
            }
         });

         tr.innerHTML += `<td><button class="btn btn-danger" onclick="removerEntregador('${entregador.cpf}')">Excluir</button></td>`;
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

carregarEntregadores();