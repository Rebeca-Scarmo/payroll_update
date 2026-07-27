async function lerPlanilha(linhaInicial, arquivo, pagina) {
    const bytes = await arquivo.arrayBuffer();
    const workbook = XLSX.read(bytes, {type: 'array'});
    const jsonArquivo = XLSX.utils.sheet_to_json(workbook.Sheets[pagina], {range: linhaInicial});
    return jsonArquivo;
}