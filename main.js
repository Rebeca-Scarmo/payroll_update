document.getElementById("btnProcessar").addEventListener("click", obtem_envia_arquivos);
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
    //TO DO habilitar btnDownload
}

