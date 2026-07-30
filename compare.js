
function criarIndice(vetor){
    const indice = {};
    for(let i=0;i<vetor.length;i++){
        const funcionario = vetor[i];
        indice[funcionario.cpf]=funcionario;
    }
    return indice;
}

function cruzarPlanilhas(dadosOrigem, indiceDestino){
    const consistentes = [];
    const inconsistentes = [];
    const nao_encontrado = [];
    for(let i=0;i<dadosOrigem.length;i++){
        if(indiceDestino[dadosOrigem[i].cpf]!== undefined){
            if(indiceDestino[dadosOrigem[i].cpf].nome === dadosOrigem[i].nome){
                consistentes.push(dadosOrigem[i]);
            }else{
                inconsistentes.push(dadosOrigem[i]);
            }
        }else{
            nao_encontrado.push(dadosOrigem[i]);
        }
    }
    return {    consistentes: consistentes, 
                inconsistentes: incosistentes, 
                nao_encontrado: nao_encontrado
            };
}