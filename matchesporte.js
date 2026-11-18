document.addEventListener("DOMContentLoaded", () => {
    protegerPaginas();
    iniciarMenu();
    destacarPaginaAtual();
    adicionarAtletas();
    adicionarAtletasCadastrados();
    iniciarFiltros();
    iniciarFormularioConexao();
    iniciarAutenticacao();
});

// =========================================================================
// SEGURANÇA: REDIRECIONA SEM ALERTAS FEIOS
// =========================================================================
function protegerPaginas() {
    const caminhoCompleto = window.location.pathname;
    const paginaAtual = caminhoCompleto.split("/").pop() || "index.html";
    
    const paginasPublicas = ["index.html", "contato.html"];
    const estaLogado = sessionStorage.getItem("matchEsporte_usuarioLogado");

    // Se não estiver logado, redireciona instantaneamente para o index.html sem exibir caixas de alerta
    if (!estaLogado && !paginasPublicas.includes(paginaAtual)) {
        window.location.href = "index.html";
    }
}

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
    const paginaAtual = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("#nav-menu a").forEach(link => {
        const destino = link.getAttribute("href");
        link.classList.toggle("active", destino === paginaAtual);
    });
}

// LISTA DE ATLETAS PADRÃO
const novosAtletas = [
    { nome: "Ana Clara Souza", esporte: "Vôlei", posicao: "Levantadora", idade: 19, altura: "1.75m", cidade: "Vitória, ES", icone: "🏐" },
    { nome: "Pedro Henrique", esporte: "Futebol", posicao: "Goleiro", idade: 20, altura: "1.88m", cidade: "Vila Velha, ES", icone: "⚽" },
    { nome: "Mariana Costa", esporte: "Basquete", posicao: "Ala", idade: 21, altura: "1.78m", cidade: "Serra, ES", icone: "🏀" },
    { nome: "Gabriel Santos", esporte: "Futebol", posicao: "Meio-campista", idade: 22, altura: "1.80m", cidade: "Cariacica, ES", icone: "⚽" },
    { nome: "Beatriz Oliveira", esporte: "Vôlei", posicao: "Líbero", idade: 20, altura: "1.68m", cidade: "Vila Velha, ES", icone: "🏐" },
    { nome: "Rafael Mendes", esporte: "Futsal", posicao: "Ala", idade: 19, altura: "1.76m", cidade: "Vitória, ES", icone: "🥅" },
    { nome: "Isabela Ferreira", esporte: "Basquete", posicao: "Armadora", idade: 22, altura: "1.72m", cidade: "Serra, ES", icone: "🏀" },
    { nome: "João Pedro Alves", esporte: "Futebol", posicao: "Zagueiro", idade: 21, altura: "1.84m", cidade: "Cariacica, ES", icone: "⚽" },
    { nome: "Camila Rodrigues", esporte: "Handebol", posicao: "Ponta", idade: 20, altura: "1.70m", cidade: "Vitória, ES", icone: "🤾" }
];

function adicionarAtletas() {
    const grade = document.getElementById("playersGrid");
    if (!grade) return;

    novosAtletas.forEach(atleta => {
        criarCardAtleta(grade, atleta, "Perfil demonstrativo");
    });
}

function adicionarAtletasCadastrados() {
    const grade = document.getElementById("playersGrid");
    if (!grade) return;

    let usuarios = [];
    try {
        usuarios = JSON.parse(localStorage.getItem("matchEsporte_usuarios")) || [];
    } catch (e) {
        usuarios = [];
    }

    usuarios.forEach(user => {
        const atletaDinamico = {
            nome: user.nome,
            esporte: "Multiesporte / Atleta",
            posicao: "Novo Membro",
            idade: "Recém-Cadastrado",
            altura: "Não informada",
            cidade: user.endereco || "Espírito Santo",
            icone: "⭐"
        };
        criarCardAtleta(grade, atletaDinamico, "Cadastrado recentemente na plataforma 🚀");
    });
}

function criarCardAtleta(grade, atleta, subtituloExtra) {
    const card = document.createElement("article");
    card.className = "directory-card";
    card.dataset.sport = atleta.esporte.toLowerCase();
    card.dataset.text = `${atleta.nome} ${atleta.esporte} ${atleta.posicao} ${atleta.cidade}`.toLowerCase();

    card.innerHTML = `
        <div class="card-top-info">
            <span class="status-badge active-status">Disponível</span>
            <span class="sport-tag">${atleta.esporte}</span>
        </div>
        <div class="profile-avatar-placeholder">${atleta.icone}</div>
        <h3>${atleta.nome}</h3>
        <p class="profile-subtitle">${atleta.posicao} • ${atleta.idade}</p>
        <div class="profile-stats">
            <div><span>Altura/Detalhe:</span> ${atleta.altura}</div>
            <div><span>Modalidade:</span> ${atleta.esporte}</div>
            <div><span>Local/Endereço:</span> ${atleta.cidade}</div>
        </div>
        <a href="conexoes.html" class="btn-primary btn-full">Solicitar Conexão</a>
        <small>${subtituloExtra}</small>
    `;
    grade.appendChild(card);
}

function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

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
            const texto = normalizarTexto((card.dataset.text || "") + " " + card.textContent);
            const modalidade = normalizarTexto(card.dataset.sport || card.querySelector(".sport-tag")?.textContent || "");

            const combinaPesquisa = texto.includes(termo);
            const combinaEsporte = !esporte || modalidade.includes(esporte);
            const mostrar = combinaPesquisa && combinaEsporte;

            card.style.display = mostrar ? "" : "none";
            if (mostrar) quantidadeEncontrada++;
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
        aviso.style.display = quantidadeEncontrada === 0 ? "block" : "none";
    }

    pesquisa?.addEventListener("input", filtrarAtletas);
    filtro?.addEventListener("change", filtrarAtletas);
}

function iniciarFormularioConexao() {
    const formulario = document.querySelector(".connection-card-form form");
    if (!formulario || formulario.id === "form-login" || formulario.id === "form-cadastro") return;

    formulario.addEventListener("submit", event => {
        event.preventDefault();
        const nome = document.getElementById("seu-nome")?.value.trim();
        const tipo = document.getElementById("tipo-perfil")?.value;
        const destinatario = document.getElementById("destinatario")?.value.trim();
        const mensagem = document.getElementById("mensagem")?.value.trim();

        if (!nome || !tipo || !destinatario || !mensagem) {
            return;
        }

        const novaConexao = {
            nome,
            tipoPerfil: tipo,
            destinatario,
            mensagem,
            data: new Date().toLocaleString("pt-BR")
        };

        let historico = [];
        try {
            historico = JSON.parse(localStorage.getItem("matchEsporte_historicoConexoes")) || [];
        } catch (erro) {
            historico = [];
        }

        historico.push(novaConexao);
        localStorage.setItem("matchEsporte_historicoConexoes", JSON.stringify(historico));
        formulario.reset();
    });
}

// Função auxiliar para mostrar mensagens bonitas na tela (Feedback Visual)
function mostrarFeedback(elementoId, mensagem, tipo) {
    const box = document.getElementById(elementoId);
    if (!box) return;

    box.textContent = mensagem;
    box.style.display = "block";

    if (tipo === "erro") {
        box.style.backgroundColor = "#fee2e2";
        box.style.color = "#dc2626";
        box.style.border = "1px solid #fca5a5";
    } else {
        box.style.backgroundColor = "#dcfce7";
        box.style.color = "#16a34a";
        box.style.border = "1px solid #86efac";
    }
}

function iniciarAutenticacao() {
    const formLogin = document.getElementById("form-login");
    const formCadastro = document.getElementById("form-cadastro");
    const btnToRegister = document.getElementById("to-register");
    const btnToLogin = document.getElementById("to-login");
    const authTitle = document.getElementById("auth-title");
    const authSubtitle = document.getElementById("auth-subtitle");

    if (!formLogin || !formCadastro) return;

    btnToRegister.addEventListener("click", () => {
        formLogin.style.display = "none";
        formCadastro.style.display = "block";
        authTitle.textContent = "Criar Conta no MatchEsporte";
        authSubtitle.textContent = "Preencha seus dados para aparecer no diretório de atletas.";
        document.getElementById("login-mensagem-feedback").style.display = "none";
    });

    btnToLogin.addEventListener("click", () => {
        formCadastro.style.display = "none";
        formLogin.style.display = "block";
        authTitle.textContent = "Entrar no MatchEsporte";
        authSubtitle.textContent = "Aceda à sua conta para se conectar com atletas e equipas.";
        document.getElementById("cadastro-mensagem-feedback").style.display = "none";
    });

    // Submissão do Cadastro
    formCadastro.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = document.getElementById("cad-nome").value.trim();
        const email = document.getElementById("cad-email").value.trim();
        const senha = document.getElementById("cad-senha").value.trim();
        const endereco = document.getElementById("cad-endereco").value.trim();
        const telefone = document.getElementById("cad-telefone").value.trim();
        const nascimento = document.getElementById("cad-nascimento").value;
        const cpf = document.getElementById("cad-cpf").value.trim();

        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem("matchEsporte_usuarios")) || [];
        } catch (err) {
            usuarios = [];
        }

        const existe = usuarios.some(u => u.email === email);
        if (existe) {
            mostrarFeedback("cadastro-mensagem-feedback", "⚠️ Este e-mail já está cadastrado. Tente fazer login.", "erro");
            return;
        }

        const novoUsuario = { nome, email, senha, endereco, telefone, nascimento, cpf };
        usuarios.push(novoUsuario);
        localStorage.setItem("matchEsporte_usuarios", JSON.stringify(usuarios));

        mostrarFeedback("cadastro-mensagem-feedback", "✨ Cadastro realizado com sucesso! Redirecionando...", "sucesso");
        formCadastro.reset();
        
        setTimeout(() => {
            btnToLogin.click();
            mostrarFeedback("login-mensagem-feedback", "✅ Conta criada com sucesso! Faça login abaixo.", "sucesso");
        }, 1500);
    });

    // Submissão do Login
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const senha = document.getElementById("login-senha").value.trim();

        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem("matchEsporte_usuarios")) || [];
        } catch (err) {
            usuarios = [];
        }

        const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

        if (usuarioEncontrado || (email === "admin@matchesporte.com" && senha === "admin123")) {
            sessionStorage.setItem("matchEsporte_usuarioLogado", "ativo");
            mostrarFeedback("login-mensagem-feedback", "🚀 Login efetuado com sucesso! A entrar...", "sucesso");
            setTimeout(() => {
                window.location.href = "home.html";
            }, 1000);
        } else {
            mostrarFeedback("login-mensagem-feedback", "❌ Utilizador não encontrado ou senha incorreta. Verifique os seus dados.", "erro");
        }
    });
}