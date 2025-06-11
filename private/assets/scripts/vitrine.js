let lista_produtos = [];

function getDataProducts()
{
   fetch('http://localhost:4000/produtos')
      .then((resp) => resp.json())
      .then(dados => lista_produtos = dados)
      .catch(() => lista_produtos = [])
      .finally(() => pushDataCards());
}

function pushDataCards()
{
   const vitrine = document.querySelector('#vitrine');
   vitrine.innerHTML = '';

   if (lista_produtos && lista_produtos.length > 0)
   {
      vitrine.className = 'row justify-content-center';

      lista_produtos.forEach(produto =>
      {
         const col = document.createElement('div');
         col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4';

         const card = document.createElement('div');
         const image = produto.imagem ? produto.imagem : '/images/default.jpg';
         card.className = 'card h-100';
         card.style.width = '100%';

         card.innerHTML = `
            <div class="card-body d-flex flex-column">
               <img class="card-img-top mb-3" src="${image}" alt="Card image cap"
                  style="height:200px;width:100%;object-fit:cover;">
               <h5 class="card-title">${produto.nome}</h5>
               <p class="card-text text-success fw-semibold">Preço: ${Number.parseFloat(produto.preco).toFixed(2)}</p>
               <p class="card-text">Estoque: <span class="text-primary">${produto.estoque} unidades</span></p>
               <a href="#" class="btn btn-dark w-100 mt-auto">Detalhes (Invalid Action)</a>
            </div>
         `;
         col.appendChild(card);
         vitrine.appendChild(col);
      });
   }
   else
   {
      vitrine.className = '';
      vitrine.innerHTML = `<div class='alert alert-warning mt-0 mb-4 text-center w-100'>Nenhum Produto Cadastrado!</div>`;
   }
}

getDataProducts();