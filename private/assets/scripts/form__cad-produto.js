const form = document.querySelector('#form');
const API_URL = ['http://localhost:4000/categorias', 'http://localhost:4000/fornecedores', 'http://localhost:4000/produtos'];

let lista_categoria = [];
let lista_fornecedor = [];
let lista_produto = [];

function carregarDados(url, tipo)
{
   fetch(url)
      .then(resp => resp.json())
      .then(data => 
      {
         if (tipo === 'categoria') lista_categoria = data;
         else if (tipo === 'fornecedor') lista_fornecedor = data;
         else if (tipo === 'produto') lista_produto = data;
      })
      .catch(() => 
      {
         if (tipo === 'categoria') lista_categoria = [];
         else if (tipo === 'fornecedor') lista_fornecedor = [];
         else if (tipo === 'produto') lista_produto = [];
      })
      .finally(() =>
      {
         carregaOpcao();
         showTable();
      });
}

function removerProdutos(id, nome) 
{
   if (confirm(`Deseja realmente excluir o produto: ${nome}?`))
      fetch(API_URL[2] + '/' + id, { method: 'DELETE' })
         .then(() => carregarDados(API_URL[2], 'produto'))
         .catch(error => console.error('Erro ao remover categoria:', error));
}

function registrarProduto(produto)
{
   fetch(API_URL[2],
   {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto)
   })
   .then(resp => resp.json())
   .then(data => console.log('Produto registrado com sucesso:', data))
   .catch(error => console.log('Erro ao registrar o produto:', error));
}

function criaOpcao(select, value, text)
{
   const option = document.createElement('option');
   option.value = value;
   option.innerText = text;
   select.appendChild(option);
}

function carregaOpcao()
{
   const selDesc = document.querySelector('#categoria');
   const selForn = document.querySelector('#fornecedor');

   selDesc.innerHTML = '<option value="" selected disabled>Selecione uma categoria</option>';
   selForn.innerHTML = '<option value="" selected disabled>Selecione um fornecedor</option>';

   lista_categoria.forEach((categoria, i) => { criaOpcao(selDesc, i, categoria.nome) });
   lista_fornecedor.forEach((fornecedor, i) => { criaOpcao(selForn, i, fornecedor.nome) });
}

form.addEventListener('submit', (e) =>
{
   e.preventDefault();
   e.stopPropagation();

   const codigo = form.codigo.value;
   const nome = form.nome.value;
   const preco = form.preco.value;
   const descricao = form.descricao.value;
   const categoria = form.categoria.value;
   const fornecedor = form.fornecedor.value;
   const estoque = form.estoque.value;
   const imagem = form.imageUrl.value;

   const produto = { codigo, nome, preco, descricao, categoria, fornecedor, estoque, imagem };

   if
   (
      !authList(lista_produto, produto, 'codigo') &&
      form.checkValidity()
   )
   {
      lista_produto.push(produto);
      registrarProduto(produto);
      form.reset();
      showTable();
   }
   else
      if (form.checkValidity())
         alert('Produto já cadastrado!');
      else
         alert('Preencha todos os campos obrigatórios!');
});

function showTable()
{
   const table = document.querySelector('#tabela');
   table.innerHTML = '';

   if (lista_produto.length === 0)
   {
      table.innerHTML = "<div class='alert alert-warning text-center'>Nenhum produto registrado!</div>";
      table.style.background = 'none';
   }
   else
   {
      table.style.background = '#fff';
      const head = document.createElement('thead');
      const body = document.createElement('tbody');

      Object.keys(lista_produto[0]).forEach(key =>
      {
         if (key != 'id' && key != 'imagem')
         {
            const th = document.createElement('th');
            th.innerText = key;
            head.appendChild(th);
         }
      });

      head.innerHTML += "<th>Ações</th>";

      lista_produto.forEach(produto =>
      {
         const tr = document.createElement('tr');

         Object.entries(produto).forEach(([key, value]) =>
         {
            if (key != 'id' && key != 'imagem')
            {
               const td = document.createElement('td');

               if (key === 'fornecedor')
                  td.innerText = lista_fornecedor[value].nome || '';

               else if (key === 'categoria')
                  td.innerText = lista_categoria[value].nome || '';
               
               else
                  td.innerText = value;
               
               tr.appendChild(td);
            }
         });

         tr.innerHTML += `<td><button class="btn btn-danger" onclick="removerProdutos('${produto.id}', '${produto.nome}')">Excluir</button></td>`;
         body.appendChild(tr);
      });

      table.appendChild(head);
      table.appendChild(body);
   }
}

function authList(lista, item, chave)
{
   return lista.findIndex(i => i[chave] === item[chave]) !== -1;
}

carregarDados(API_URL[0], 'categoria');
carregarDados(API_URL[1], 'fornecedor');
carregarDados(API_URL[2], 'produto');