document.getElementById("btnProcessar").addEventListener("click", obtem_envia_arquivos);
const inputOrigem = document.getElementById("uploadOrigem");
const inputDestino = document.getElementById("uploadDestino");
let indiceDestino;
let indiceOrigem;

async function obtem_envia_arquivos(){
    if((inputOrigem.files[0] != null) && (inputDestino.files[0] != null)){
            const arquivoDestino = inputDestino.files[0];
            const arquivoOrigem = inputOrigem.files[0];
            const dadosDestino = await formataArquivoDestino(arquivoDestino);
            const dadosOrigem = await formataArquivoOrigem(arquivoOrigem);
            indiceDestino = criarIndice(dadosDestino);
            indiceOrigem = criarIndice(dadosOrigem);

    }else{
        alert("Insira os dois arquivos antes de enviar")
    }
}
