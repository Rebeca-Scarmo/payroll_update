function transformaCPF(cpf){
    arrayCaracteres = cpf.split("");
    arrayDigitos = arrayCaracteres.filter(function (caracter){
        if(caracter >= 0 && caracter <=9){
            return caracter;
        }
    });
    return arrayDigitos.join("");
}

