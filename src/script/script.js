
const form = document.getElementById('form')
const inputs = document.querySelectorAll('.inputs')
const spans = document.querySelectorAll('.span-required')


const dados = {
    "Brasil": {
        "São Paulo": ["São Paulo", "Campinas", "Santos"],
        "Ceará": ["Fortaleza", "Icapuí", "Sobral"]
    },
    "Estados Unidos": {
        "Florida": ["Miami", "Orlando", "Tampa"],
        "California": ["Los Angeles", "San Francisco", "San Diego"]
    },
    "Portugal": {
        "Lisboa": ["Lisboa", "Cascais", "Sintra"],
        "Porto": ["Porto", "Braga", "Guimarães"]
    },
    "China": {
        "Pequim": ["Pequim"],
        "Xangai": ["Xangai", "Suzhou", "Hangzhou"]
    }
}

const nacionalidadeInput = document.getElementById('nacionalidadeInput')
const estadoInput = document.getElementById('estadoInput')
const cidadeInput = document.getElementById('cidadeInput')

// 🎯 DATALISTS QUE SERÃO PREENCHIDOS DINAMICAMENTE
const nacionalidadeDatalist = document.getElementById('nacionalidade')
const estadoDatalist = document.getElementById('estado')
const cidadeDatalist = document.getElementById('city')

//INICIALIZA O PREENCHIMENTO DOS PAÍSES NO DATALIST AO CARREGAR
preencherNacionalidades()

// IMPEDIR ENVIO DO FORMULÁRIO QUANDO PRESSIONAR ENTER
document.addEventListener('keydown', (evt) => {
    if (evt.key == 'Enter') {
        impedirEnvio(evt)
    }
});

//IMPEDIR ENVIO QUANDO CLICAR NO BOTÃO SUBMIT
form.addEventListener('submit', impedirEnvio)

// FUNÇÃO PRINCIPAL PARA IMPEDIR ENVIO DO FORMULÁRIO E VALIDAR TODOS OS CAMPOS
function impedirEnvio(ev) {
    ev.preventDefault() // Impede o envio padrão do formulário
    ValidarEscola()        
    ValidarCPF()               
    ValidarNome()                
    ValidarNacionalidade()      
    ValidarEstado()            
    ValidarCidade()             
}

//FUNÇÃO QUE MOSTRA ERRO (BORDER VERMELHA E SPAN)
function CasoError(indice) {
    inputs[indice].style.border = '2px solid #e63636'   
    spans[indice].style.display = 'block'
}

//FUNÇÃO QUE REMOVE O ERRO
function NotError(indice) {
    inputs[indice].style.border = ''      
    spans[indice].style.display = 'none'
}
// ----------------- VALIDAÇÕES INDIVIDUAIS -----------------

//VALIDAÇÃO DA ESCOLA (INDEX 0 NO ARRAY INPUTS)
inputs[0].addEventListener('input', ValidarEscola);
function ValidarEscola() {
    if (inputs[0].value === '') {
        CasoError(0)       
    } else {
        NotError(0)
    }
}

// APLICA MÁSCARA E VALIDAÇÃO DE CPF (INDEX 1)
inputs[1].addEventListener('input', () => {
    inputs[1].value = formatarCPF(inputs[1].value)// Aplica máscara no CPF em tempo real
    ValidarCPF() // Valida se está no formato correto
});

// FORMATA O CPF: 123.456.789-00
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');  cpf.replace(/(\d{3})(\d)/, '$1.$2') // Coloca o primeiro ponto
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')// Coloca o segundo ponto
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2')// Coloca o traço antes dos dois últimos dígitos

    return cpf;
}

// VALIDA SE O CPF TEM 11 DÍGITOS
function ValidarCPF() {
    const cpf = inputs[1].value.replace(/\D/g, '') // Remove pontuação pra validar só os números
    if (cpf.length !== 11) {
        CasoError(1)
    } else {
        NotError(1)
    }
}

// VALIDAÇÃO DO NOME COMPLETO (INDEX 2)
inputs[2].addEventListener('input', ValidarNome);
function ValidarNome() {
    if (inputs[2].value === '') {                                  
        CasoError(2)                                             
    } else {
        NotError(2)                                              
    }
}

// ----------------- EVENTOS E VALIDAÇÕES PARA CAMPOS DINÂMICOS -----------------

// EVENTO AO ESCOLHER/EDITAR NACIONALIDADE
nacionalidadeInput.addEventListener('input', () => {
    preencherEstados(nacionalidadeInput.value)                   
    ValidarNacionalidade()                              
});

// VALIDA NACIONALIDADE (INDEX 3)
function ValidarNacionalidade() {
    if (inputs[3].value === '') {                                  
        CasoError(3)
    } else {
        NotError(3)
    }
}

// EVENTO AO ESCOLHER/EDITAR ESTADO
estadoInput.addEventListener('input', () => {
    preencherCidades(nacionalidadeInput.value, estadoInput.value)
    ValidarEstado()
});

// VALIDA ESTADO (INDEX 4)
function ValidarEstado() {
    if (inputs[4].value === '') {                                  
        CasoError(4)                            
    } else {
        NotError(4)                                               
    }
}

// 🌆 EVENTO AO ESCOLHER/EDITAR CIDADE
cidadeInput.addEventListener('input', ValidarCidade);

// VALIDA CIDADE (INDEX 5)
function ValidarCidade() {
    if (inputs[5].value === '') {                                  
        CasoError(5)                                            
    } else {
        NotError(5)
    }
}

// ----------------- FUNÇÕES DE PREENCHIMENTO DOS DATALISTS -----------------

// PREENCHE OS PAÍSES DISPONÍVEIS NO DATALIST DE NACIONALIDADE
function preencherNacionalidades() {
    nacionalidadeDatalist.innerHTML = '' // Limpa o datalist antes de adicionar novas opções

    Object.keys(dados).forEach(pais => { // Itera sobre todos os países
        const option = document.createElement('option') // Cria um elemento dinamicamente <option>
        option.value = pais // Define o valor como o nome do país
        nacionalidadeDatalist.appendChild(option) // Adiciona ao datalist
    });
}

// PREENCHE OS ESTADOS COM BASE NO PAÍS SELECIONADO
function preencherEstados(paisSelecionado) {
    estadoDatalist.innerHTML = '' // Limpa o datalist de estados
    cidadeDatalist.innerHTML = ''// Limpa o datalist de cidades

    if (dados[paisSelecionado]) { // Verifica se o país existe no objeto
        const estados = Object.keys(dados[paisSelecionado]) // Pega os estados daquele país 
        estados.forEach(estado => { // Itera sobre cada estado
            const option = document.createElement('option') /// Cria um elemento dinamicamente <option>
            option.value = estado // Define o valor como o nome do estado
            estadoDatalist.appendChild(option) // Adiciona ao datalist de estados
        });
    }
}

// 🌆 PREENCHE AS CIDADES COM BASE NO ESTADO E PAÍS SELECIONADOS
function preencherCidades(paisSelecionado, estadoSelecionado) {
    cidadeDatalist.innerHTML = '';                                 // Limpa o datalist de cidades

    if (dados[paisSelecionado] && dados[paisSelecionado][estadoSelecionado]) {  // Verifica se o país e o estado existem
        const cidades = dados[paisSelecionado][estadoSelecionado] // Pega as cidades daquele estado
        cidades.forEach(cidade => { // Itera sobre cada cidade
            const option = document.createElement('option')// Cria um elemento dinamicamente <option>
            option.value = cidade // Define o valor como o nome da cidade
            cidadeDatalist.appendChild(option) // Adiciona ao datalist de cidades
        });
    }
}
