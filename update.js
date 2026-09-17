function atualizaValores(funcionarios){
    let celulaModificar;
    for (let i =0; i<funcionarios.length;i++){
        celulaModificar = workbookDestino.Sheets["Principal"][funcionarios[i].destino.celula]
        if(celulaModificar != null){
            celulaModificar.v = funcionarios[i].origem.valor;
        }
    }
}

function zerarValores(funcionarios){
    let celulaModificar;
    for (let i=0; i<funcionarios.length; i++){
        celulaModificar = workbookDestino.Sheets["Principal"][funcionarios[i].celula];
        if(celulaModificar != null){
            celulaModificar.v = 0;
        }
    }
}

function lerLinhaCompleta(sheet, linha, ultimaColuna){
    const celulas = [];
    for (let c = 0; c <= ultimaColuna; c++){
        const referencia = XLSX.utils.encode_cell({r: linha - 1, c: c});
        celulas.push(sheet[referencia] || null);
    }
    return celulas;
}

function escreverLinhaCompleta(sheet, linha, celulas){
    for (let c = 0; c < celulas.length; c++){
        const referencia = XLSX.utils.encode_cell({r: linha - 1, c: c});
        if (celulas[c] != null){
            sheet[referencia] = celulas[c];
        } else {
            delete sheet[referencia];
        }
    }
}

function ordenarFuncionariosDestino(){
    const sheet = workbookDestino.Sheets["Principal"];
    const intervalo = XLSX.utils.decode_range(sheet["!ref"]);
    const primeiraLinha = 15;
    const ultimaLinha = intervalo.e.r + 1;
    const ultimaColuna = intervalo.e.c;

    if (ultimaLinha < primeiraLinha) return;

    const linhas = [];
    for (let linha = primeiraLinha; linha <= ultimaLinha; linha++){
        linhas.push(lerLinhaCompleta(sheet, linha, ultimaColuna));
    }

    linhas.sort(function(linhaA, linhaB){
        const nomeA = (linhaA[1] != null) ? String(linhaA[1].v) : "";
        const nomeB = (linhaB[1] != null) ? String(linhaB[1].v) : "";
        return nomeA.localeCompare(nomeB, "pt-BR", {sensitivity: "base"});
    });

    for (let i = 0; i < linhas.length; i++){
        escreverLinhaCompleta(sheet, primeiraLinha + i, linhas[i]);
    }
}

function downloadPlanilha() {
    XLSX.writeFile(workbookDestino, "planilha_atualizada.xlsx");
}