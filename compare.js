
function criarIndice(vetor){
    const indice = {};
    for(let i=0;i<vetor.length;i++){
        const funcionario = vetor[i];
        indice[funcionario.cpf]=funcionario;
    }
    return indice;
}

function cruzarPlanilhas(){
    
}