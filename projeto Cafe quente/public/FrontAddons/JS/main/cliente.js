// Lista com todos os usuários salvos
let usuarios = [];

// Objeto temporário que armazena o usuário sendo preenchido
let usuarioAtual = null;

// Gera o próximo ID automaticamente
function proxID() {
    if (usuarios.length === 0) return 1;
    return Math.max(...usuarios.map((u) => u.id)) + 1;
}

// Cria um novo usuário, se ainda não houver um sendo preenchido
function createUser() {
    if (usuarioAtual === null) {
        usuarioAtual = {
            id: proxID(),
            nome: null,
            cpf: null,
        };
    }
    return usuarioAtual;
}

function gerarIDPedido() {
    return 'PED-' + Date.now()
}

// Preenche o nome do usuário atual
async function attNome(nome) {
    const usuario = createUser(); // garante que o usuário atual exista
    usuario.nome = nome; // define o nome
    console.warn(`nome do ususario registrado ${usuario.nome}\n nome digitado ${nome}`);
    localStorage.setItem('nomeCliente', nome);
    console.error("todos itens do usuario", usuario);
    verificarSePodeSalvar(); // verifica se já pode salvar
}

// Preenche o CPF do usuário atual
async function attCpf(cpf) {
    const usuario = createUser(); // garante que o usuário atual exista
    usuario.cpf = cpf; // define o CPF
    verificarSePodeSalvar(); // verifica se já pode salvar
}

function criarPedido() {
    const carrinhoItens = JSON.parse(localStorage.getItem('cartItens') || '[]')
    const total = carrinhoItens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
    const pedido = {
        id: gerarIDPedido(),
        cliente: {
            nome: usuarioAtual.nome,
            cpf: usuarioAtual.cpf || null,
        },
        itens: carrinhoItens.map(item => ({
            id: item.id,
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantidade,
            subtotal: item.preco * item.quantidade
        })),
        total: total,
        dataHora: new Date().toDateString(),
        pagamento: {
            metodo: 'pix',
            cpfNaNota: true
        }
    };
    localStorage.setItem('pedidoAtual', JSON.stringify(pedido));
    return pedido
}

// Verifica se o usuário atual está completo (nome + cpf)
// Se estiver, salva no array e envia para o backend
async function verificarSePodeSalvar() {
    const usuario = usuarioAtual;

    if (usuario && usuario.nome && usuario.cpf) {
        usuarios.push(usuario); // adiciona ao array de usuários
        // await enviarClienteParaBackend(usuario); // envia para o servidor
        console.log('Usuário salvo:', usuario);
        usuarioAtual = null; // limpa para permitir o cadastro de outro
    } else {
        console.log('Aguardando mais informações...');
    }
}

// Envia os dados do cliente para o backend usando fetch()
async function enviarBackend(pedido) {
    try {
        const response = await fetch('/api/pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });

        const result = await response.json();
        if (result.success) {
            console.log('Pedido enviado com sucesso:', result.message);
        } else {
            console.error('Erro ao enviar pedido:', result.message);
        }
    } catch (error) {
        console.error('Erro ao enviar pedido:', error);
    }
}
async function finalizarPedido() {
    const usuario = usuarioAtual;

    if (usuario && usuario.nome && usuario.cpf) {
        const pedido = criarPedido();
        await enviarBackend(pedido);
        console.log("Pedido finalizado:", pedido);

        // Limpa o carrinho e o cliente atual
        localStorage.removeItem('carrinhoItens');
        usuarioAtual = null;
    } else {
        console.log("Informações do cliente incompletas.");
    }
}

// Exporta as funções para serem usadas em outro arquivo (caso esteja usando módulos)
export {
    createUser,
    attNome,
    attCpf,
    usuarios,
    criarPedido,
    finalizarPedido
}