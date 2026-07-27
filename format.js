function transformaCPF(cpf){
    const arrayCaracteres = cpf.split("");
    const arrayDigitos = arrayCaracteres.filter(function (caracter){
        if(caracter >= "0" && caracter <="9"){
            return true;
        }
        return false;
    });
    return arrayDigitos.join("");
}

function transformaValor(valor){
    const arrayCaracteres = valor.split("");
    const arrayDigitos = arrayCaracteres.filter(function (caracter){
        if( (caracter >= "0" && caracter <="9") || (caracter == "." || caracter == ",")){
            return true;
        }
        return false
    });
    const valorSemMilhar = (arrayDigitos.join("")).replaceAll(".","");
    const valorMonetario = parseFloat(valorMonetario.replaceAll(",","."));
    return valorMonetario;

}
function transformarNome(nome){
    const letras = nome.normalize("NFD");
    const caracteres = letras.split("");
    const nomeSemAcento = caracteres.filter(function (caracter){
        const codigo = caracter.charCodeAt(0);
        if(codigo < 768 || codigo > 879){
            return true;
        }
        return false
    })
    const nomeTransformado = (nomeSemAcento.join("")).toLowerCase();
    return nomeTransformado;
}
