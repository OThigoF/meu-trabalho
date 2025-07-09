// Manipulador de carrossel e inatividade
const TEMPO_INATIVIDADE = 3000; // 20 segundos
const IMAGENS_PROMOCAO = [
    'https://s2-oglobo.glbimg.com/7Ea-LBy4TqZ1W6xASfbifUnp8b8=/0x0:301x301/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2022/5/0/hdhwI2St270nDxTqBtnQ/96450421-um-caseiro-de-21-anos-matou-sua-mulher-que-estava-gravida-de-4-meses-a-enteada-de-2-anos-e.jpg'
];

let temporizadorInatividade;

function iniciarTemporizador() {
    clearTimeout(temporizadorInatividade);
    temporizadorInatividade = setTimeout(mostrarCarrossel, TEMPO_INATIVIDADE);
}

function mostrarCarrossel() {
    console.warn("mostrando carrossel");

    const sobreposicao = document.getElementById('overlay-carrossel');
    if (!sobreposicao) return;
    sobreposicao.style.display = 'flex';
    let index = 0;
    const img = sobreposicao.querySelector('img');
    if (img) img.src = IMAGENS_PROMOCAO[index];
    const interval = setInterval(() => {
        index = (index + 1) % IMAGENS_PROMOCAO.length;
        if (img) img.src = IMAGENS_PROMOCAO[index];
    }, 3000);

    function fechar() {
        sobreposicao.style.display = 'none';
        window.location.href = '/';
        clearInterval(interval);
        sobreposicao.removeEventListener('click', fechar);
    }

    sobreposicao.addEventListener('click', fechar);
}

function reiniciarTemporizador() {
    iniciarTemporizador();
}

document.addEventListener('DOMContentLoaded', () => {
    ['mousemove', 'mousedown', 'keydown', 'touchstart'].forEach(evt => {
        document.addEventListener(evt, reiniciarTemporizador);
    });
    iniciarTemporizador();
});
export { iniciarTemporizador, mostrarCarrossel };

/* 

<div>
                <h1>PROMOÇÕES DO DIA</h1>
                <p>Café Quente Menu</p>
            </div>
            <div class="carrinho" id="carrinho-btn">
                🛒
                <span class="carrinho-contador" id="cart-count" style="display: none;">0</span>
            </div>
        </header>
        
        <div class="main-content">
            <div class="categories-sidebar" id="categories-sidebar">
                <!-- Categorias serão inseridas aqui via JS -->
            </div>

            <div class="products-section" id="products-section">
                <!-- Produtos serão inseridos aqui via JS, organizados por categoria -->
            </div>
        </div>
        
        <footer>
            <p>&copy; 2024 Café Quente - Todos os direitos reservados</p>
        </footer>
    </div>

    <div id="overlay-carrossel" class="overlay-carrossel" style="display:none;">
        <img src="" alt="Promoção" />
    </div>
    <script type="module" src="/FrontAddons/JS/main/main.js"></script>
    <script type="module" src="/FrontAddons/JS/main/carrossel.js"></script>
</body>

</html>
`*/