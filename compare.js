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
    const cpfsOrigem = {};

    for(let i=0;i<dadosOrigem.length;i++){
        cpfsOrigem[dadosOrigem[i].cpf] = true;

        if(indiceDestino[dadosOrigem[i].cpf]!== undefined){
            if(indiceDestino[dadosOrigem[i].cpf].nome === dadosOrigem[i].nome){
                consistentes.push({
                    origem: dadosOrigem[i],
                    destino: indiceDestino[dadosOrigem[i].cpf]
                });
            }else{
                inconsistentes.push({
                    origem: dadosOrigem[i],
                    destino: indiceDestino[dadosOrigem[i].cpf]                
                });
            }
        }else{
            nao_encontrado.push(dadosOrigem[i]);
        }
    }

    const sem_correspondencia = [];
    for(const cpf in indiceDestino){
        if(cpfsOrigem[cpf] === undefined){
            sem_correspondencia.push(indiceDestino[cpf]);
        }
    }

    return {    
                consistentes: consistentes, 
                inconsistentes: inconsistentes, 
                nao_encontrado: nao_encontrado,
                sem_correspondencia: sem_correspondencia
            };
}