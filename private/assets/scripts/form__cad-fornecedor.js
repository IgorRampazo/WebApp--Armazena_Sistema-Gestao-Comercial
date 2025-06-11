const form = document.querySelector('#form');
const API_URL = 'http://localhost:4000/fornecedores';

let lista_fornecedor = [];

// ____________________________________ //
// ********** Operações CRUD ********** //

function carregarFornecedores()
{
   fetch(API_URL)
      .then(resp => resp.json())
      .then(data => lista_fornecedor = data)
      .catch(() => lista_fornecedor = [])
      .finally(() => showTable());
}

function removerFornecedor(id, nome)
{
   if (confirm(`Deseja realmente excluir o fornecedor: ${nome}?`))
   {
      fetch(API_URL + '/' + id, { method: 'DELETE' })
         .then(() => carregarFornecedores())
         .catch(error => console.error('Erro ao remover fornecedor:', error));
   }
}

function registrarFornecedor(fornecedor)
{
   fetch(API_URL,
   {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fornecedor)
   })
   .then(resp => resp.json())
   .then(data => console.log('Fornecedor registrado com sucesso:', data))
   .catch(error => console.log('Erro ao registrar o fornecedor:', error));
}

// _______________________________________________ //
// ********** Manipulação do Formulário ********** //

form.addEventListener('submit', (e) =>
{
   e.preventDefault();
   e.stopPropagation();

   const nome = form.nome.value;
   const cnpj = form.cnpj.value;
   const telefone = form.telefone.value;
   const cidade = form.cidade.value;
   const uf = form.uf.value;
   const cep = form.cep.value;

   const fornecedor = { nome, cnpj, telefone, cidade, uf, cep };

   if
   (
      !authList(lista_fornecedor, fornecedor, 'cnpj') &&
      form.checkValidity()
   )
   {
      lista_fornecedor.push(fornecedor);
      registrarFornecedor(fornecedor);
      form.reset();
      showTable();
   }
   else
   {
      if (form.checkValidity())
         alert('Fornecedor já cadastrado!');
      else
         alert('Preencha todos os campos obrigatórios!');
   }
});

function showTable()
{
   const table = document.querySelector('#tabela');
   table.innerHTML = '';

   if (lista_fornecedor.length === 0)
   {
      table.innerHTML = "<div class='alert alert-warning text-center'>Nenhum fornecedor registrado!</div>";
      table.style.background = 'none';
   }
   else
   {
      table.style.background = '#fff';

      const thead = document.createElement('thead');
      const trHead = document.createElement('tr');

      Object.keys(lista_fornecedor[0]).forEach(key =>
      {
         if (key !== 'id')
         {
            const th = document.createElement('th');
            th.innerText = key;
            trHead.appendChild(th);
         }
      });

      const thAcoes = document.createElement('th');
      thAcoes.innerText = 'Ações';
      trHead.appendChild(thAcoes);
      thead.appendChild(trHead);

      const tbody = document.createElement('tbody');

      lista_fornecedor.forEach(fornecedor =>
      {
         const tr = document.createElement('tr');

         Object.entries(fornecedor).forEach(([key, value]) =>
         {
            if (key !== 'id')
            {
               const td = document.createElement('td');
               td.innerText = value;
               tr.appendChild(td);
            }
         });

         const tdAcoes = document.createElement('td');
         const btnExcluir = document.createElement('button');
         btnExcluir.className = 'btn btn-danger';
         btnExcluir.innerText = 'Excluir';
         
         btnExcluir.onclick = () => {
            if(fornecedor.id !== undefined) {
               removerFornecedor(fornecedor.id, fornecedor.nome);
            } else {
               alert('ID do fornecedor não encontrado para exclusão.');
            }
         };

         tdAcoes.appendChild(btnExcluir);
         tr.appendChild(tdAcoes);
         tbody.appendChild(tr);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
   }
}

function authList(lista, item, chave)
{
   const valido = lista.findIndex(i => i[chave] === item[chave]);
   return valido !== -1;
}

carregarFornecedores();