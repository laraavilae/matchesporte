
document.addEventListener("DOMContentLoaded", () => {
    iniciarMenu();
    destacarPaginaAtual();
    adicionarAtletas();
    iniciarFiltros();
    iniciarFormularioConexao();
});

// MENU MOBILE
function iniciarMenu() {
    const botao = document.querySelector(".menu-toggle");
    const menu = document.getElementById("nav-menu");

    if (!botao || !menu) return;

    botao.addEventListener("click", () => {
        const aberto = menu.classList.toggle("active");

        botao.classList.toggle("active", aberto);
        botao.setAttribute("aria-expanded", aberto);
    });

    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
            botao.classList.remove("active");
            botao.setAttribute("aria-expanded", "false");
        });
    });
}

// DESTACAR A PÁGINA ATUAL NO MENU
function destacarPaginaAtual() {
    const paginaAtual =
        window.location.pathname.split("/").pop() || "home.html";

    document.querySelectorAll("#nav-menu a").forEach(link => {
        const destino = link.getAttribute("href");

        link.classList.toggle("active", destino === paginaAtual);
    });
}

// LISTA DE NOVOS ATLETAS
const novosAtletas = [
    {
        nome: "Ana Clara Souza",
        esporte: "Vôlei",
        posicao: "Levantadora",
        idade: 19,
        altura: "1.75m",
        cidade: "Vitória, ES",
        icone: "🏐"
    },
    {
        nome: "Pedro Henrique",
        esporte: "Futebol",
        posicao: "Goleiro",
        idade: 20,
        altura: "1.88m",
        cidade: "Vila Velha, ES",
        icone: "⚽"
    },
    {
        nome: "Mariana Costa",
        esporte: "Basquete",
        posicao: "Ala",
        idade: 21,
        altura: "1.78m",
        cidade: "Serra, ES",
        icone: "🏀"
    },
    {
        nome: "Gabriel Santos",
        esporte: "Futebol",
        posicao: "Meio-campista",
        idade: 22,
        altura: "1.80m",
        cidade: "Cariacica, ES",
        icone: "⚽"
    },
    {
        nome: "Beatriz Oliveira",
        esporte: "Vôlei",
        posicao: "Líbero",
        idade: 20,
        altura: "1.68m",
        cidade: "Vila Velha, ES",
        icone: "🏐"
    },
    {
        nome: "Rafael Mendes",
        esporte: "Futsal",
        posicao: "Ala",
        idade: 19,
        altura: "1.76m",
        cidade: "Vitória, ES",
        icone: "🥅"
    },
    {
        nome: "Isabela Ferreira",
        esporte: "Basquete",
        posicao: "Armadora",
        idade: 22,
        altura: "1.72m",
        cidade: "Serra, ES",
        icone: "🏀"
    },
    {
        nome: "João Pedro Alves",
        esporte: "Futebol",
        posicao: "Zagueiro",
        idade: 21,
        altura: "1.84m",
        cidade: "Cariacica, ES",
        icone: "⚽"
    },
    {
        nome: "Camila Rodrigues",
        esporte: "Handebol",
        posicao: "Ponta",
        idade: 20,
        altura: "1.70m",
        cidade: "Vitória, ES",
        icone: "🤾"
    }
];

// ADICIONAR ATLETAS NA PÁGINA
function adicionarAtletas() {
    const grade = document.getElementById("playersGrid");

    if (!grade) return;

    novosAtletas.forEach(atleta => {
        const card = document.createElement("article");

        card.className = "directory-card";
        card.dataset.sport = atleta.esporte;
        card.dataset.text = `
            ${atleta.nome}
            ${atleta.esporte}
            ${atleta.posicao}
            ${atleta.cidade}
        `;

        card.innerHTML = `
            <div class="card-top-info">
                <span class="status-badge active-status">
                    Disponível
                </span>

                <span class="sport-tag">
                    ${atleta.esporte}
                </span>
            </div>

            <div class="profile-avatar-placeholder">
                ${atleta.icone}
            </div>

            <h3>${atleta.nome}</h3>

            <p class="profile-subtitle">
                ${atleta.posicao} • ${atleta.idade} anos
            </p>

            <div class="profile-stats">
                <div><span>Altura:</span> ${atleta.altura}</div>
                <div><span>Modalidade:</span> ${atleta.esporte}</div>
                <div><span>Cidade:</span> ${atleta.cidade}</div>
            </div>

            <a href="conexoes.html" class="btn-primary btn-full">
                Solicitar Conexão
            </a>

            <small>Perfil demonstrativo</small>
        `;

        grade.appendChild(card);
    });
}

// NORMALIZAR TEXTO PARA PESQUISA
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

// PESQUISA E FILTRO DE ATLETAS
function iniciarFiltros() {
    const pesquisa = document.getElementById("searchInput");
    const filtro = document.getElementById("sportSelect");
    const grade = document.getElementById("playersGrid");

    if (!grade) return;

    function filtrarAtletas() {
        const termo = normalizarTexto(pesquisa?.value || "");
        const esporte = normalizarTexto(filtro?.value || "");

        const cards = grade.querySelectorAll(".directory-card");
        let quantidadeEncontrada = 0;

        cards.forEach(card => {
            const texto = normalizarTexto(
                (card.dataset.text || "") + " " + card.textContent
            );

            const modalidade = normalizarTexto(
                card.dataset.sport ||
                card.querySelector(".sport-tag")?.textContent ||
                ""
            );

            const combinaPesquisa = texto.includes(termo);
            const combinaEsporte =
                !esporte || modalidade.includes(esporte);

            const mostrar = combinaPesquisa && combinaEsporte;

            card.style.display = mostrar ? "" : "none";

            if (mostrar) {
                quantidadeEncontrada++;
            }
        });

        let aviso = document.getElementById("nenhumAtleta");

        if (!aviso) {
            aviso = document.createElement("p");
            aviso.id = "nenhumAtleta";
            aviso.textContent = "Nenhum atleta encontrado.";
            aviso.style.textAlign = "center";
            aviso.style.padding = "20px";
            grade.after(aviso);
        }

        aviso.style.display =
            quantidadeEncontrada === 0 ? "block" : "none";
    }

    pesquisa?.addEventListener("input", filtrarAtletas);
    filtro?.addEventListener("change", filtrarAtletas);
}

// FORMULÁRIO DE CONEXÃO
function iniciarFormularioConexao() {
    const formulario = document.querySelector(
        ".connection-card-form form"
    );

    if (!formulario) return;

    formulario.addEventListener("submit", event => {
        event.preventDefault();

        const nome = document.getElementById("seu-nome")?.value.trim();
        const tipo = document.getElementById("tipo-perfil")?.value;
        const destinatario =
            document.getElementById("destinatario")?.value.trim();
        const mensagem =
            document.getElementById("mensagem")?.value.trim();

        if (!nome || !tipo || !destinatario || !mensagem) {
            alert("Preencha todos os campos antes de enviar.");
            return;
        }

        const novaConexao = {
            nome: nome,
            tipoPerfil: tipo,
            destinatario: destinatario,
            mensagem: mensagem,
            data: new Date().toLocaleString("pt-BR")
        };

        let historico = [];

        try {
            historico = JSON.parse(
                localStorage.getItem("matchEsporte_historicoConexoes")
            ) || [];
        } catch (erro) {
            historico = [];
        }

        historico.push(novaConexao);

        localStorage.setItem(
            "matchEsporte_historicoConexoes",
            JSON.stringify(historico)
        );

        alert("Solicitação registrada com sucesso!");

        formulario.reset();
    });
}
