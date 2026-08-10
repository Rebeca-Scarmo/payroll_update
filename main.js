document.getElementById("btnProcessar").addEventListener("click", obtem_envia_arquivos);
document.getElementById("btnDownload").addEventListener("click", downloadPlanilha);
document.getElementById("checkboxSelecionarTodos").addEventListener("change", function (evento) {
    const marcar = evento.target.checked;
    const checkboxes = document.getElementsByClassName("funcionarioCheckbox");
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = marcar;
    }
});
const inputOrigem = document.getElementById("uploadOrigem");
const inputDestino = document.getElementById("uploadDestino");
let indiceDestino;
let resultados;
let workbookDestino;
let workbookOrigem;

function obtem_envia_arquivos(){
    if((inputOrigem.files[0] != null) && (inputDestino.files[0] != null)){
        const arquivoDestino = inputDestino.files[0];
        const arquivoOrigem = inputOrigem.files[0];
        processarPlanilhas(arquivoOrigem, arquivoDestino);
    } else {
        alert("Insira os dois arquivos antes de enviar")
    }
}

async function processarPlanilhas(arquivoOrigem, arquivoDestino) {
    document.getElementById("caixaLogs").innerHTML = "";
    adicionarLog("Lendo planilhas...");

    const dadosDestino = await formataArquivoDestino(arquivoDestino);
    const dadosOrigem = await formataArquivoOrigem(arquivoOrigem);
    workbookDestino = dadosDestino.workbookDestino;
    workbookOrigem = dadosOrigem.workbookOrigem;
    adicionarLog(dadosOrigem.dadosOrigem.length + " funcionários lidos da contabilidade.");
    adicionarLog(dadosDestino.dadosDestino.length + " funcionários lidos da planilha modelo.");

    indiceDestino = criarIndice(dadosDestino.dadosDestino);
    resultados = cruzarPlanilhas(dadosOrigem.dadosOrigem, indiceDestino);
    adicionarLog(resultados.consistentes.length + " valores atualizados automaticamente.");
    atualizaValores(resultados.consistentes);

    if (resultados.inconsistentes.length != 0) {
        adicionarLog(resultados.inconsistentes.length + " com nome divergente — aguardando sua confirmação.");
        document.getElementById("checkboxSelecionarTodos").checked = false;
        criarModalIncosistentes(resultados.inconsistentes);
        abrirModal();
        const funcionariosSelecionados = await esperarDecisaoModal();
        atualizaValores(funcionariosSelecionados);
        adicionarLog(funcionariosSelecionados.length + " confirmados e atualizados.");
    }

    if (resultados.nao_encontrado.length != 0) {
        adicionarLog(resultados.nao_encontrado.length + " funcionários não encontrados na planilha modelo.");
        criarModalNaoEncontrados(resultados.nao_encontrado);
        abrirModalNaoEncontrados();
        await esperarFechamentoModalNaoEncontrados();
    }

    adicionarLog("Pronto — clique em Baixar para exportar a planilha atualizada.");
    btnDownload.disabled = false;
}

function esperarDecisaoModal() {
    return new Promise(function(resolve) {
        document.getElementById("btnAtualizar").onclick = function() {
            const selecionados = selecionaCheckbox();
            fecharModal();
            resolve(selecionados);
        };
        document.getElementById("btnCancelar").onclick = function() {
            fecharModal();
            resolve([]);
        };
    });
}

function abrirModal(){
    document.getElementById("modal").classList.remove("oculto");
}

function fecharModal(){
    document.getElementById("modal").classList.add("oculto");
}

function criarModalIncosistentes(vetor){
    const modalMensagem = document.getElementById("modalMensagem");
    modalMensagem.innerHTML = "";
    for (let i = 0; i < vetor.length; i++) {
        const divFuncionario = document.createElement("div");
        divFuncionario.classList.add("funcionario");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "funcionarioCheckbox";
        checkbox.value = vetor[i].origem.cpf;
        checkbox.funcionario = vetor[i];

        const nomeFuncionario = document.createElement("strong");
        nomeFuncionario.textContent = vetor[i].origem.nome;

        const nomeOrigem = document.createElement("p");
        nomeOrigem.textContent = "Origem: " + vetor[i].origem.nome;

        const nomeDestino = document.createElement("p");
        nomeDestino.textContent = "Destino: " + vetor[i].destino.nome;

        nomeOrigem.classList.add("origem");
        nomeDestino.classList.add("destino");

        modalMensagem.appendChild(divFuncionario);
        divFuncionario.appendChild(checkbox);
        divFuncionario.appendChild(nomeFuncionario);
        divFuncionario.appendChild(nomeOrigem);
        divFuncionario.appendChild(nomeDestino);
    }
}

function selecionaCheckbox(){
    const collectionCheckbox = document.getElementsByClassName("funcionarioCheckbox");
    const selecionados = [];
    for (let i = 0; i < collectionCheckbox.length; i++) {
        if (collectionCheckbox[i].checked === true) {
            selecionados.push(collectionCheckbox[i].funcionario);
        }
    }
    return selecionados;
}

function criarModalNaoEncontrados(vetor){
    const modalMensagem = document.getElementById("modalMensagemNaoEncontrados");
    modalMensagem.innerHTML = "";
    for (let i = 0; i < vetor.length; i++) {
        const nome = document.createElement("p");
        nome.textContent = vetor[i].nome;
        modalMensagem.appendChild(nome);
    }
}

function abrirModalNaoEncontrados(){
    document.getElementById("modalNaoEncontrados").classList.remove("oculto");
}

function fecharModalNaoEncontrados(){
    document.getElementById("modalNaoEncontrados").classList.add("oculto");
}

function esperarFechamentoModalNaoEncontrados() {
    return new Promise(function(resolve) {
        document.getElementById("btnOk").onclick = function() {
            fecharModalNaoEncontrados();
            resolve();
        };
    });
}

function adicionarLog(mensagem) {
    const caixaLogs = document.getElementById("caixaLogs");
    const linha = document.createElement("p");
    linha.textContent = mensagem;
    caixaLogs.appendChild(linha);
    caixaLogs.scrollTop = caixaLogs.scrollHeight;
}