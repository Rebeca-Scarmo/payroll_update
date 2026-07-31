document.getElementById("btnProcessar").addEventListener("click", obtem_envia_arquivos);
const inputOrigem = document.getElementById("uploadOrigem");
const inputDestino = document.getElementById("uploadDestino");
const btnDownload = document.getElementById("btnDownload");
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
        let mensagem = juntaNomesInconsistentes(resultados.inconsistentes);
        const decisao = confirm("Foram encontrados os seguintes funcionários inconsistentes: \n\n"+ mensagem+"\n Deseja atualizar os valores?");
        if(decisao){
            atualizaValores(resultados.inconsistentes);
        }
    }
    if(resultados.nao_encontrado.length != 0){
        let mensagem = juntaNomesNaoEncontrados(resultados.nao_encontrado);
        alert("esses funcionários não foram encontrados:\n\n" + mensagem)
    }
   
    btnDownload.disabled = false;
}

function juntaNomesInconsistentes (vetor){
    let mensagem="";
    for(let i=0; i<vetor.length; i++){
        mensagem += "Origem: " + vetor[i].origem.nome + "\n";
        mensagem += "Destino: " + vetor[i].destino.nome + "\n\n";
    }
    return mensagem
}

function juntaNomesNaoEncontrados (vetor){
    let mensagem="";
    for(let i=0; i<vetor.length; i++){
        mensagem += (vetor[i].nome + "\n");
    }
    return mensagem
}