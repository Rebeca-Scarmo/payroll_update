document.getElementById("btnUpload").addEventListener("click", obtem_envia_arquivos);
const inputOrigem = document.getElementById("uploadOrigem");
const inputDestino = document.getElementById("uploadDestino");

async function obtem_envia_arquivos(){
    if((inputOrigem.files[0] != null) && (inputDestino.files[0] != null)){
            const arquivoDestino = inputDestino.files[0];
            const arquivoOrigem = inputOrigem.files[0];
            const dadosDestino = await formataArquivoDestino(arquivoDestino);
            const dadosOrigem = await formataArquivoOrigem(arquivoOrigem);
    }else{
        alert("Insira os dois arquivos antes de enviar")
    }
}