document.getElementById("btnProcessar").addEventListener("click", obtem_envia_arquivos);
document.getElementById("btnDownload").addEventListener("click", downloadPlanilha);
document.getElementById("btnAtualizar").addEventListener("click", selecionaCheckbox);
document.getElementById("btnCancelar").addEventListener("click",fecharModal);
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
            processarPlanilhas(arquivoOrigem,arquivoDestino);

    }else{
        alert("Insira os dois arquivos antes de enviar")
    }
}

async function processarPlanilhas(arquivoOrigem, arquivoDestino) {
    const dadosDestino = await formataArquivoDestino(arquivoDestino);
    const dadosOrigem = await formataArquivoOrigem(arquivoOrigem);
    workbookDestino = dadosDestino.workbookDestino;
    workbookOrigem = dadosOrigem.workbookOrigem;
    indiceDestino = criarIndice(dadosDestino.dadosDestino);
    resultados = cruzarPlanilhas(dadosOrigem.dadosOrigem, indiceDestino);
    atualizaValores(resultados.consistentes);
    if(resultados.inconsistentes.length != 0){
        criarModalIncosistentes(resultados.inconsistentes);
        abrirModal();
        const funcionariosSelecionados = selecionaCheckbox();
        if(funcionariosSelecionados !== null){
            atualizaValores(funcionariosSelecionados);
        }
    }
    if(resultados.nao_encontrado.length != 0){
        let mensagem = juntaNomesNaoEncontrados(resultados.nao_encontrado);
        alert("esses funcionários não foram encontrados:\n\n" + mensagem)
    }
   
    btnDownload.disabled = false;
}


function abrirModal(){
    document.getElementById("modal oculto").classList.remove("oculto");
}

function fecharModal(){
    document.getElementById("modal oculto").classList.add("oculto");
}

function criarModalIncosistentes(vetor){
    const modalMensagem = document.getElementById("modalMensagem");
    modalMensagem.innerHTML="";
    for(let i=0; i<vetor.length; i++){
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
        nomeOrigem.textContent = "Origem: "+vetor[i].origem.nome;

        const nomeDestino = document.createElement("p");
        nomeDestino.textContent = "Destino: "+vetor[i].destino.nome;

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
    for(let i=0; i<collectionCheckbox.length;i++){
        if(collectionCheckbox[i].checked === true){
            selecionados[i] = collectionCheckbox[i].funcionario;
        }
    }
    return selecionados;
}