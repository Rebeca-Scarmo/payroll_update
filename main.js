document.getElementById("btnProcessar").addEventListener("click", obtem_envia_arquivos);
document.getElementById("btnDownload").addEventListener("click", downloadPlanilha);
document.getElementById("checkboxSelecionarTodos").addEventListener("change", function (evento) {
    const marcar = evento.target.checked;
    const checkboxes = document.getElementsByClassName("funcionarioCheckbox");
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = marcar;
    }
});
document.getElementById("checkboxSelecionarTodosNaoEncontrados").addEventListener("change", function (evento) {
    const marcar = evento.target.checked;
    const checkboxes = document.getElementsByClassName("naoEncontradoCheckbox");
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
let proximaLinhaDestino;

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
    proximaLinhaDestino = 15 + dadosDestino.dadosDestino.length;
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
        document.getElementById("checkboxSelecionarTodosNaoEncontrados").checked = false;
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

function formatarCpfExibicao(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function criarModalNaoEncontrados(vetor){
    const modalMensagem = document.getElementById("modalMensagemNaoEncontrados");
    modalMensagem.innerHTML = "";
    for (let i = 0; i < vetor.length; i++) {
        const divFuncionario = document.createElement("div");
        divFuncionario.classList.add("funcionario");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "naoEncontradoCheckbox";
        checkbox.funcionario = vetor[i];

        const info = document.createElement("div");

        const nome = document.createElement("strong");
        nome.textContent = vetor[i].nomeOriginal;

        const cpfTag = document.createElement("p");
        cpfTag.classList.add("origem");
        cpfTag.textContent = "CPF: " + formatarCpfExibicao(vetor[i].cpf);

        const valorTag = document.createElement("p");
        valorTag.classList.add("destino");
        valorTag.textContent = "Valor: R$ " + vetor[i].valor.toFixed(2).replace(".", ",");

        info.appendChild(nome);
        info.appendChild(cpfTag);
        info.appendChild(valorTag);

        divFuncionario.appendChild(checkbox);
        divFuncionario.appendChild(info);
        modalMensagem.appendChild(divFuncionario);
    }
}

function selecionaCheckboxNaoEncontrados(){
    const collectionCheckbox = document.getElementsByClassName("naoEncontradoCheckbox");
    const selecionados = [];
    for (let i = 0; i < collectionCheckbox.length; i++) {
        if (collectionCheckbox[i].checked === true) {
            selecionados.push(collectionCheckbox[i].funcionario);
        }
    }
    return selecionados;
}

function abrirModalNaoEncontrados(){
    document.getElementById("modalNaoEncontrados").classList.remove("oculto");
}

function fecharModalNaoEncontrados(){
    document.getElementById("modalNaoEncontrados").classList.add("oculto");
}

function esperarFechamentoModalNaoEncontrados() {
    return new Promise(function(resolve) {
        document.getElementById("btnOk").onclick = async function() {
            const selecionados = selecionaCheckboxNaoEncontrados();
            fecharModalNaoEncontrados();
            await processarCadastrosSelecionados(selecionados);
            resolve();
        };
    });
}

// ===== Cadastro de novos funcionários (não encontrados) =====

async function processarCadastrosSelecionados(selecionados){
    for (let i = 0; i < selecionados.length; i++) {
        const funcionario = selecionados[i];
        const dadosForm = await abrirModalCadastro(funcionario);
        if (dadosForm) {
            adicionarLinhaDestino(funcionario, dadosForm, proximaLinhaDestino);
            proximaLinhaDestino++;
            adicionarLog(funcionario.nomeOriginal + " adicionado à planilha.");
        } else {
            adicionarLog(funcionario.nomeOriginal + " não adicionado (pulado).");
        }
    }
}

function abrirModalCadastro(funcionario){
    const form = document.getElementById("formCadastro");
    form.reset();

    document.getElementById("campoNomeCadastro").value = funcionario.nomeOriginal;
    document.getElementById("campoCpfCadastro").value = formatarCpfExibicao(funcionario.cpf);
    document.getElementById("campoSalarioCadastro").value = "R$ " + funcionario.valor.toFixed(2).replace(".", ",");

    document.getElementById("modalCadastro").classList.remove("oculto");

    return new Promise(function(resolve) {
        form.onsubmit = function(evento) {
            evento.preventDefault();
            const dadosForm = {
                tipo: document.getElementById("campoTipoCadastro").value,
                banco: document.getElementById("campoBancoCadastro").value.trim(),
                agencia: document.getElementById("campoAgenciaCadastro").value.trim(),
                tipoConta: document.getElementById("campoTipoContaCadastro").value,
                conta: document.getElementById("campoContaCadastro").value.trim(),
                dvConta: document.getElementById("campoDvContaCadastro").value.trim()
            };
            fecharModalCadastro();
            resolve(dadosForm);
        };
        document.getElementById("btnCancelarCadastro").onclick = function() {
            fecharModalCadastro();
            resolve(null);
        };
    });
}

function fecharModalCadastro(){
    document.getElementById("modalCadastro").classList.add("oculto");
}

function expandirIntervaloPlanilha(sheet, referenciaCelula) {
    const endereco = XLSX.utils.decode_cell(referenciaCelula);
    const intervalo = XLSX.utils.decode_range(sheet["!ref"]);
    if (endereco.r > intervalo.e.r) intervalo.e.r = endereco.r;
    if (endereco.c > intervalo.e.c) intervalo.e.c = endereco.c;
    sheet["!ref"] = XLSX.utils.encode_range(intervalo);
}

function definirCelula(sheet, referenciaCelula, valor, tipo) {
    sheet[referenciaCelula] = { t: tipo, v: valor };
    expandirIntervaloPlanilha(sheet, referenciaCelula);
}

function adicionarLinhaDestino(funcionario, dadosForm, linha) {
    const sheet = workbookDestino.Sheets["Principal"];
    definirCelula(sheet, "A" + linha, dadosForm.tipo, "s");
    definirCelula(sheet, "B" + linha, funcionario.nomeOriginal, "s");
    definirCelula(sheet, "C" + linha, funcionario.cpf, "s");
    definirCelula(sheet, "K" + linha, dadosForm.banco, "s");
    definirCelula(sheet, "L" + linha, dadosForm.agencia, "s");
    definirCelula(sheet, "M" + linha, dadosForm.tipoConta, "s");
    definirCelula(sheet, "O" + linha, dadosForm.conta, "s");
    definirCelula(sheet, "P" + linha, dadosForm.dvConta, "s");
    definirCelula(sheet, "Q" + linha, funcionario.valor, "n");
}

function adicionarLog(mensagem) {
    const caixaLogs = document.getElementById("caixaLogs");
    const linha = document.createElement("p");
    linha.textContent = mensagem;
    caixaLogs.appendChild(linha);
    caixaLogs.scrollTop = caixaLogs.scrollHeight;
}