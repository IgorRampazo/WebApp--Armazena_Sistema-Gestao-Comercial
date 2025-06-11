/* function getDataProducts(lista)
{
   fetch('http://127.0.0.1:5500/data/data.json')
      .then((resp) => resp.json())
      .then(dados => dados[lista])
      .catch(erro =>
      {
         console.error('Erro:', erro);
         return null;
      });
}
 */

function getDataProducts()
{
   return JSON.parse(localStorage.getItem('produtos')) || null;
}

function pushDataTable()
{
   const produtos = getDataProducts('produtos');
   const table = document.querySelector('#tabela');

   if (produtos) 
   {
      table.style.background = '#fff';
      let thead = document.createElement('thead');
      let tbody = document.createElement('tbody');

      const tr = document.createElement('tr');

      Object.keys(produtos[0]).forEach(key =>
      {
         const th = document.createElement('th');
         th.innerHTML = key;
         tr.appendChild(th);
      });

      thead.appendChild(tr);
      table.appendChild(thead);

      let lista_categoria = JSON.parse(localStorage.getItem('categorias')) || [];
      let lista_fornecedor = JSON.parse(localStorage.getItem('fornecedores')) || [];

      produtos.forEach(produto =>
      {
         const tr = document.createElement('tr');

         Object.entries(produto).forEach(([key, value]) => 
         {
            const td = document.createElement('td');

            if (key === 'fornecedor')
               td.innerText = lista_fornecedor[value]?.nome || '';
            else if (key === 'categoria')
               td.innerText = lista_categoria[value]?.nome || '';
            else
               td.innerText = value;

            tr.appendChild(td);
         });
         
         tbody.appendChild(tr);
      });

      table.appendChild(tbody);
   }
   else
   {
      table.style.background = 'none';
      table.innerHTML = `<div class='alert alert-warning mt-0 mb-4 text-center'>Nenhum Produto Cadastrado!</div>`;
   }
}

pushDataTable();