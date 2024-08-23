document.addEventListener('DOMContentLoaded', async() => {

    const valorRenda = document.querySelector('#valorBruto');
    const numDependentes = document.querySelector('#quantDependentes');
    const valorPensao = document.querySelector('#valorPensao');
    const outrasDeducoes = document.querySelector('#outrasDeducoes');
    const buttonContainer = document.querySelector('.button-container');
    const btnCalcular = document.querySelector('#btnCalcular');
    //const btnLimpar = document.querySelector('#btnLimpar');
    const responseContainer = document.querySelector('#resposta-container');
    responseContainer.style.display = 'none'
    aplicaMascara = (moeda) => {
        let value = moeda.toFixed(2) + '';
        value = value.replace('.', ',');
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        console.log(value, typeof(value))
        return value;

    }
    
    document.querySelector('#formIrrf').addEventListener('submit', (e) => {
        e.preventDefault();

        responseContainer.style.display = 'block'

        let valor = valorRenda.value;
        let pensao = valorPensao.value;
        let deducoes =outrasDeducoes.value;
        valor = parseFloat(valor);
        pensao = parseFloat(pensao);
        deducoes = parseFloat(deducoes);
        let depend = calculaImposto(valor);
        
        const pIrff = document.createElement('p');
        pIrff.classList.add('pResposta', 'pIrrf');
        pIrff.textContent = `Valor IRRF = R$ ${aplicaMascara(depend)}`;
        responseContainer.appendChild(pIrff);
        
        
        btnCalcular.disabled = true;
        const btnLimpar = document.createElement('button');
        btnLimpar.id = 'btnLimpar';
        btnLimpar.classList.add('btn', 'btn-default')
        btnLimpar.textContent = 'Limpar';
        buttonContainer.appendChild(btnLimpar);
        btnLimpar.addEventListener('click', () => {
        location.reload();
          
        })

        console.log(depend)
    });

    calculaInss = (valor, inss) => {
        if(valor <= 1412.00){
            inss = valor * 0.075  
        }else if(valor > 1412.00 && valor <= 2666.68){
            inss = (valor * 0.09) - 21.18;
        }else if(valor > 2666.68 && valor <= 4000.03){
            inss = (valor * 0.12) - 101.18;
        }else if (valor > 4000.03 && valor <= 7786.02){
            inss = (valor * 0.15) - 181.18
        }else{
            inss = 0;
        }

        console.log(valor, typeof(valor))
        const spanValor = document.createElement('span');
        const pValor = document.createElement('p');
        pValor.classList.add('pResposta');
        pValor.textContent = `Valor Bruto: `;
        responseContainer.appendChild(pValor);
        spanValor.textContent = `R$ ${aplicaMascara(valor)}`;
        pValor.appendChild(spanValor);

        if(inss != 0){
            const spanInss = document.createElement('span')
            const pInss = document.createElement('p');
            pInss.classList.add('pResposta');
            pInss.textContent = `O valor do Inss `;
            responseContainer.appendChild( pInss)

            spanInss.textContent = `R$ ${aplicaMascara(inss)}`;
            pInss.appendChild(spanInss)

        }
        
        return inss;
    }

    calculoDependentes = (num) => {
        if(num > 0){
            return num * 189.59;
               
        }
        return 0;


    }

    baseDecalculoIr = (valor, inss, dep) => {
        inss = calculaInss(valor);
        dep = calculoDependentes(numDependentes.value);
        let base = 0;
        const deducaoSimples = 564.8
        if(inss + dep <= deducaoSimples){
            //alert('Seu IR será calculado com dedução simplificada!')
            base = valor - deducaoSimples
            
        }else{
            base = valor - dep - inss;
        }
        const spanQuantDep = document.createElement('span');
        const quantDep = document.createElement('p');
        quantDep.classList.add('pResposta');
        quantDep.textContent = `Dependentes: `;
        
        spanQuantDep.textContent = `${numDependentes.value}`;
        quantDep.appendChild(spanQuantDep)
        responseContainer.appendChild(quantDep);

        const spanValorDep = document.createElement('span');
        const pValorDep = document.createElement('p');
        pValorDep .classList.add('pResposta');
        pValorDep .textContent = `Dedução Dependente:`;
        responseContainer.appendChild(pValorDep);
        spanValorDep.textContent = ` R$ ${aplicaMascara(dep)}`;
        pValorDep.appendChild(spanValorDep);
        return base;
       
        
    }

    verificaAliquota = (valor) => {
        base = baseDecalculoIr(valor);
        if(base <= 2259.20){
            aliquota = 0;
            parcelaDeduzir = 0;
            console.log('Você não possui imposto a pagar!')
        }else if(base > 2259.20 && base <= 2826.65){
            aliquota = 0.075;
            parcelaDeduzir = 169.44;
        }else if(base > 2826.65 && base <= 3751.05){
            aliquota = 0.15;
            parcelaDeduzir = 381.44;
        }else if(base > 3571.05 && base <= 4664.68){
            aliquota = 0.225;
            parcelaDeduzir = 662.77;
        }else{
            aliquota = 0.275;
            parcelaDeduzir = 896.00;
        }
    }

    calculaImposto = (valor) => {
        verificaAliquota(valor)
        let valorIr = (base * aliquota ) - parcelaDeduzir;
        
        const spanBase = document.createElement('span');
        const spanAliquota = document.createElement('span');
        const spanDeduzir = document.createElement('span');
        const pBase = document.createElement('p');
        pBase.classList.add('pBase');
        pBase.textContent = ``;
        responseContainer.appendChild(pBase);
        spanBase.textContent = `Base calculo: R$ ${aplicaMascara(base)}`;
        spanAliquota.textContent = `Aliquota: (%) ${aliquota * 100} `;
        spanDeduzir.textContent = `Dedução: R$ ${aplicaMascara(parcelaDeduzir)}`;
        pBase.appendChild(spanBase);
        pBase.appendChild(spanAliquota);
        pBase.appendChild(spanDeduzir);
        return valorIr;
    } 

})
