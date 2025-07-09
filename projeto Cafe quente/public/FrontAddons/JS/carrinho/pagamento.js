console.error("Página carregada");

const final = document.getElementById("Finalizar");
const voltar = document.getElementById("voltar");
const cancelar = document.getElementById('cancelar')
const pagarPix = document.getElementById('pix');
const pagarDinheir = document.getElementById('dinheiro');
const principal = document.getElementById('principal');

voltar.addEventListener('click', () => {
    window.location.href = "index.html"; // ou o caminho da página principal do cardápio
});

final.addEventListener('click', abrirPagamento);
cancelar.addEventListener('click', fecharModal)
pagarPix.addEventListener('click', () => pagar('Pix'));
pagarDinheir.addEventListener('click', () => pagar('Dinheiro'));

// Carrega e exibe os itens do carrinho
exibirCarrinho();

function abrirPagamento() {
    document.getElementById('paymentModal').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function pagar(metodo) {
    alert('Você escolheu pagar com: ' + metodo);
    fecharModal();
    limparCarrinho();
    localStorage.removeItem("nomeCliente")
        // Aqui você pode chamar sua função de `finalizarPedido(metodo)`
}

function removerDoCarrinho(index) {
    const carrinhoItens = JSON.parse(localStorage.getItem('cartItems') || '[]');
    carrinhoItens.splice(index, 1); // remove o item pelo índice
    localStorage.setItem('cartItems', JSON.stringify(carrinhoItens));
    exibirCarrinho(); // Atualiza a visualização
}

// Renderiza os itens do carrinho na tela
function exibirCarrinho() {
    const carrinhoItens = JSON.parse(localStorage.getItem('cartItems') || '[]');
    principal.innerHTML = '';

    if (carrinhoItens.length === 0) {
        principal.innerHTML = '<p style="text-align:center;">Seu carrinho está vazio.</p>';
        return;
    }

    let total = 0;

    carrinhoItens.forEach((item, index) => {
        const preco = parseFloat(item.preco) || 0;
        const quantidade = parseInt(item.quantidade) || 1;
        const subtotal = preco * quantidade;
        total += subtotal;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <img src="${item.img || 'https://via.placeholder.com/100'}" 
                 alt="${item.nome}" 
                 style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; margin-right: 20px;" 
                 onerror="this.src='https://via.placeholder.com/100?text=Produto'">

            <div style="flex: 1">
                <h3 style="margin: 0 0 5px;">${item.nome}</h3>
                <p style="margin: 0;">Preço: R$ ${preco.toFixed(2)}</p>
                <p style="margin: 0;">Quantidade: ${quantidade}</p>
                <p style="margin: 0;"><strong>Subtotal: R$ ${subtotal.toFixed(2)}</strong></p>
            </div>

            <button 
                id="remover-${index}" 
                class="btn-remover-item">
                Remover
            </button>
        `;

        principal.appendChild(itemDiv);

        // Adicionando o evento de remoção para cada botão
        document.getElementById(`remover-${index}`).addEventListener('click', () => {
            removerDoCarrinho(index);
        });
    });

    const totalDiv = document.createElement('div');
    totalDiv.classList.add('cart-total');
    totalDiv.innerHTML = `
        <div style="flex: 1; text-align: right;">
            <h3>Total: R$ ${total.toFixed(2)}</h3>
        </div>
    `;
    principal.appendChild(totalDiv);
}

function limparCarrinho() {
    localStorage.removeItem('cartItems'); // limpa o localStorage
    // carrinhoItens = []; // zera o array se ele estiver sendo usado em memória
    exibirCarrinho(); // atualiza a interface
    console.warn("Carrinho esvaziado com sucesso!");
}

export { exibirCarrinho }