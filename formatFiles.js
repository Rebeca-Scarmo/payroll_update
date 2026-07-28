async function lerPlanilha(linhaInicial, arquivo, pagina) {
    const bytes = await arquivo.arrayBuffer();
    const workbook = XLSX.read(bytes, {type: 'array'});
    const jsonArquivo = XLSX.utils.sheet_to_json(workbook.Sheets[pagina], {range: linhaInicial});
    return jsonArquivo;
}

function padronizarLinhaOrigem(linhaCrua) {
  return {
    cpf: transformaCPF(linhaCrua["CPF"]),
    nome: transformarNome(linhaCrua["Nome do Funcionário"]),
    valor: transformaValor(linhaCrua["Valor"]),
  };
}

function padronizarLinhaDestino(linhaCrua) {
  return {
    cpf: transformaCPF(linhaCrua["CPF"]),
    nome: transformarNome(linhaCrua["Funcionário"]),
    valor: transformaValor(linhaCrua["Salário"]),
  };
}

async function formataArquivoOrigem(arquivoOrigem) {
    const jsonArquivoOrigem = await lerPlanilha(0, arquivoOrigem, "Planilha1");
    const dadosOrigem = jsonArquivoOrigem.map(padronizarLinhaOrigem);
    return dadosOrigem;
}

async function formataArquivoDestino(arquivoDestino) {
    const jsonArquivoDestino = await lerPlanilha(13,arquivoDestino,"Principal");
    const dadosDestino = jsonArquivoDestino.map(padronizarLinhaDestino);
    return dadosDestino;
}