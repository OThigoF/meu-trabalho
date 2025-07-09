import { armazenarNome } from './nomes.js';
import { CarProdutos } from './ApiProdutos.js';
import { mostrarCarrossel } from './carrossel.js';
import { iniciarTemporizador } from './carrossel.js';


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('pedidoForm');
    const initialScreen = document.getElementById('initial-screen');
    const mainApp = document.getElementById('main-app');
    const cancelar = document.getElementById('botao-cancelar');
    const finalizar = document.getElementById('botao-pedido');
    const pedido = localStorage.getItem('nomeCliente');



    console.log('JS conectado');
    if (cancelar) {
        cancelar.addEventListener('click', () => {
            console.warn("botao de cancelar funcionando corretamente");
            localStorage.removeItem("nomeCliente");
            location.reload()
        })
    }
    if (!pedido) {
        console.warn("Não existe usuário");

        // ✅ Mostra a tela inicial (que estava escondida via CSS)
        if (initialScreen) initialScreen.style.display = 'flex';
        if (mainApp) {
            mainApp.style.display = 'none';
            iniciarTemporizador();
        }

        if (form) {
            form.addEventListener('submit', async function(event) {
                event.preventDefault();

                const nomeArmazenado = armazenarNome();

                if (nomeArmazenado) {
                    // Transição para a tela principal
                    if (initialScreen) {
                        initialScreen.style.opacity = '0';
                        initialScreen.style.transition = 'opacity 0.5s ease';

                        setTimeout(() => {
                            initialScreen.style.display = 'none';

                            if (mainApp) {
                                mainApp.style.display = 'flex';
                                mainApp.style.opacity = '0';
                                mainApp.style.transition = 'opacity 0.5s ease';

                                setTimeout(() => {
                                    mainApp.style.opacity = '1';
                                }, 50);
                            }

                            CarProdutos();

                            if (finalizar) {
                                finalizar.addEventListener('click', () => {
                                    console.warn("Botão finalizar funcionando corretamente");
                                    window.location.href = '/carrinho';
                                });
                            }
                        }, 500);
                    }
                }
            });
        }

    } else {
        console.warn("Usuário já existe");

        // ✅ Garante que a tela inicial continue escondida
        if (initialScreen) initialScreen.style.display = 'none';
        if (mainApp) {
            mainApp.style.display = 'flex';
            mainApp.style.opacity = '1';
        }

        CarProdutos();

        if (finalizar) {
            finalizar.addEventListener('click', () => {
                console.warn("Botão finalizar funcionando corretamente");
                window.location.href = '/carrinho';
            });
        }
    }
});