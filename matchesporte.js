document.addEventListener("DOMContentLoaded", () => {
    inicializarMenuMobile();
    destacarMenuAtivo();
    inicializarFiltrosDiretorio();
    inicializarFormularioConexao();
});

function inicializarMenuMobile() {
    const botoesMenu = document.querySelectorAll(".menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (!botoesMenu.length || !navMenu) return;

    botoesMenu.forEach(botao => {
        botao.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            botao.classList.toggle("active");
        });
    });

    
    const linksNav = navMenu.querySelectorAll("a");
    linksNav.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            botoesMenu.forEach(b => b.classList.remove("active"));
        });
    });
}

function destacarMenuAtivo() {
    const caminhoAtual = window.location.pathname.split("/").pop() || "home.html";
    const linksMenu = document.querySelectorAll("nav a");

    linksMenu.forEach(link => {
        const href = link.getAttribute("href");
        if (href === caminhoAtual) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

function inicializarFiltrosDiretorio() {
    const inputPesquisa = document.getElementById("searchInput");
    const selectEsporte = document.getElementById("sportSelect");
    const cards = document.querySelectorAll(".directory-card");

    if (!cards.length) return;

    function filtrar() {
        const termoPesquisa = inputPesquisa ? inputPesquisa.value.toLowerCase().trim() : "";
        const esporteSelecionado = selectEsporte ? selectEsporte.value.toLowerCase() : "";

        cards.forEach(card => {
            const dataText = card.getAttribute("data-text") || "";
            const conteudoCard = card.textContent.toLowerCase();
            const tagEsporte = card.querySelector(".sport-tag")?.textContent.toLowerCase() || "";

            const correspondeTexto = !termoPesquisa || dataText.includes(termoPesquisa) || conteudoCard.includes(termoPesquisa);
            const correspondeEsporte = !esporteSelecionado || tagEsporte.includes(esporteSelecionado);

            if (correspondeTexto && correspondeEsporte) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    }

    if (inputPesquisa) {
        inputPesquisa.addEventListener("input", filtrar);
    }

    if (selectEsporte) {
        selectEsporte.addEventListener("change", filtrar);
    }
}

function inicializarFormularioConexao() {
    const formConexao = document.querySelector(".connection-card-form form");
    if (!formConexao) return;

    formConexao.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = document.getElementById("seu-nome")?.value.trim();
        const tipoPerfil = document.getElementById("tipo-perfil")?.value;
        const destinatario = document.getElementById("destinatario")?.value.trim();
        const mensagem = document.getElementById("mensagem")?.value.trim();

        if (!nome || !destinatario || !mensagem) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const novaConexao = {
            nome,
            tipoPerfil,
            destinatario,
            mensagem,
            data: new Date().toLocaleDateString("pt-BR")
        };

        salvarConexaoNoStorage(novaConexao);

        alert(`Solicitação enviada com sucesso para ${destinatario}! O clube ou atleta responderá em breve.`);
        formConexao.reset();
    });
}

function salvarConexaoNoStorage(conexao) {
    let historico = JSON.parse(localStorage.getItem("matchEsporte_historicoConexoes")) || [];
    historico.push(conexao);
    localStorage.setItem("matchEsporte_historicoConexoes", JSON.stringify(historico));
}    