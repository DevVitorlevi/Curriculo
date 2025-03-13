const form = document.getElementById('form');
const inputs = document.querySelectorAll('.inputs');
const spans = document.querySelectorAll('.span-required');

// Impede o envio ao pressionar Enter
document.addEventListener('keydown', (evt) => {
    if (evt.key == 'Enter') {
        impedirEnvio(evt);
    }
});

// Impede o envio do formulário
form.addEventListener('submit', impedirEnvio);
function impedirEnvio(ev) {
    ev.preventDefault();
    ValidarEscola();
    ValidarCPF();

    ValidarNome();
}

// Função para mostrar erro
function CasoError(indice) {
    inputs[indice].style.border = '2px solid #e63636';
    spans[indice].style.display = 'block';
}

// Função para remover erro
function NotError(indice) {
    inputs[indice].style.border = '';
    spans[indice].style.display = 'none';
}

// Validação da Escola
inputs[0].addEventListener('input', ValidarEscola);
function ValidarEscola() {
    if (inputs[0].value == '') {
        CasoError(0);
    } else {
        NotError(0);
    }
}

// Função para formatar o CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove tudo que não for número
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o primeiro ponto
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o segundo ponto
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço
    return cpf;
}

// Validação do CPF
inputs[1].addEventListener('input', () => {
    inputs[1].value = formatarCPF(inputs[1].value); // Aplica a máscara no CPF
    ValidarCPF(); // Valida o CPF após aplicar a máscara
});

// Função de validação do CPF
function ValidarCPF() {
    const cpf = inputs[1].value.replace(/\D/g, ''); // Remove os caracteres não numéricos
    if (cpf.length !== 11) {
        CasoError(1); // Caso o CPF não tenha 11 números
    } else {
        NotError(1); // Caso o CPF tenha 11 números
    }
}

// Validação do Nome Completo
inputs[2].addEventListener('input',ValidarNome);
function ValidarNome() {
    if (inputs[2].value == '') {
        CasoError(2);
    } else {
        NotError(2);
    }
}
