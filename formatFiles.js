async function lerPlanilha(linhaInicial, arquivo, pagina) {
    const bytes = await arquivo.arrayBuffer();
    const workbook = XLSX.read(bytes, {type: 'array'});
    const jsonArquivoCru = XLSX.utils.sheet_to_json(workbook.Sheets[pagina], {range: linhaInicial});
    const jsonArquivo = jsonArquivoCru.map(normalizarChavesLinha);
    return {
              jsonArquivo: jsonArquivo, 
              workbook: workbook};
  }

function normalizarChavesLinha(linhaCrua) {
    const linhaNormalizada = {};
    for (const chave in linhaCrua) {
        linhaNormalizada[chave.trim()] = linhaCrua[chave];
    }
    return linhaNormalizada;
}


function padronizarLinhaOrigem(linhaCrua,indice) {
  return {
    cpf: transformaCPF(linhaCrua["CPF"]),
    nome: transformarNome(linhaCrua["Nome do Funcionário"]),
    nomeOriginal: linhaCrua["Nome do Funcionário"],
    valor: transformaValor(linhaCrua["Valor"]),
    celula: "G"+(indice+7)
  };
}

function padronizarLinhaDestino(linhaCrua, indice) {
  return {
    cpf: transformaCPF(linhaCrua["CPF"]),
    nome: transformarNome(linhaCrua["Funcionário"]),
    valor: transformaValor(linhaCrua["Salário"]),
    celula: "Q"+(indice+15)
  };
}

async function formataArquivoOrigem(arquivoOrigem) {
    const conteudoOrigem = await lerPlanilha(3, arquivoOrigem, "Plan1");
    const dadosOrigem = conteudoOrigem.jsonArquivo.map(padronizarLinhaOrigem);
    return {
              dadosOrigem: dadosOrigem,
              workbookOrigem: conteudoOrigem.workbook
    } 
}

async function formataArquivoDestino(arquivoDestino) {
    const conteudoDestino = await lerPlanilha(13,arquivoDestino,"Principal");
    const dadosDestino = conteudoDestino.jsonArquivo.map(padronizarLinhaDestino);
    return {
              dadosDestino: dadosDestino,
              workbookDestino: conteudoDestino.workbook
    }
}