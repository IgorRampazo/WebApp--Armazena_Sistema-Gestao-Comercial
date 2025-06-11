const form = document.querySelector('#form');
const API_URL = 'http://localhost:4000/categorias';

let lista_categoria = [];

// ____________________________________ //
// ********** Operações CRUD ********** //

function carregarCategorias()
{
   fetch(API_URL)
      .then(res => res.json())
      .then(data => lista_categoria = data)
      .catch(() => lista_categoria = [])
      .finally(() => showTable());
}

function removerCategoria(id, nome) 
{
   if (confirm(`Deseja realmente excluir a categoria: ${nome}?`))
      fetch(API_URL + '/' + id, { method: 'DELETE' })
         .then(() => carregarCategorias())
         .catch(error => console.error('Erro ao remover categoria:', error));
}

function registrarCategoria(categoria)
{
   fetch(API_URL,
   {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria)
   })
   .then(resp => resp.json())
   .then(data => console.log('Categoria registrada com sucesso:', data))
   .catch(error => console.log('Erro ao registrar a categoria:', error));
}

// _______________________________________________ //
// ********** Manipulação do Formulário ********** //

form.addEventListener('submit', function(e) 
{
   e.preventDefault();
   e.stopPropagation();

   const nome = form.nome.value;
   const descricao = form.descricao.value;
   const categoria = { nome, descricao };

   if 
   (
      !authList(lista_categoria, categoria, 'nome') &&
      form.checkValidity()
   )
   {
      lista_categoria.push(categoria);
      registrarCategoria(categoria);
      form.reset();
      showTable();
   }
   else if (form.checkValidity())
      alert('Categoria já cadastrada!');
   else 
      alert('Preencha todos os campos obrigatórios!');
});

function showTable() 
{
   const table = document.querySelector('#tabela');
   table.innerHTML = '';

   if (lista_categoria.length === 0) 
   {
      table.innerHTML = "<div class='alert alert-warning text-center'>Nenhuma categoria registrada!</div>";
      table.style.background = 'none';
   }
   else 
   {
      table.style.background = '#fff';
      const head = document.createElement('thead');
      const body = document.createElement('tbody');

      Object.keys(lista_categoria[0]).forEach(key =>
      {
         if (key !== 'id')
         {
            const th = document.createElement('th');
            th.innerText = key;
            head.appendChild(th);
         }
      });

      head.innerHTML += `<th>Ações</th>`;

      lista_categoria.forEach(cat => 
      {
         const tr = document.createElement('tr');

         Object.values(cat).forEach(value => 
         {
            if (value !== cat.id) 
            {
               const td = document.createElement('td');
               td.innerText = value;
               tr.appendChild(td);
            }
         });

         tr.innerHTML += `<td><button class="btn btn-danger" onclick="removerCategoria('${cat.id}', '${cat.nome}')">Excluir</button></td>`;
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

carregarCategorias();