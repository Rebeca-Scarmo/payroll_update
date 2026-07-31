function atualizaValores(funcionarios){
    let celulaModificar;
    for (let i =0; i<funcionarios.length;i++){
        celulaModificar = workbookDestino.Sheets["Principal"][funcionarios[i].destino.celula]
        if(celulaModificar != null){
            celulaModificar.v = funcionarios[i].origem.valor;
        }
    }
}

function downloadPlanilha() {
    XLSX.writeFile(workbookDestino, "planilha_atualizada.xlsx");
}