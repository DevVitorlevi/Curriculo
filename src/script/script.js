// =======================
// URL da API de países
// =======================
const paisesAPI = 'https://raw.githubusercontent.com/juliolvfilho/lista-paises/refs/heads/master/paises-array.json'

// =======================
// Variável para armazenar os dados da API de países
// =======================
let paises = []

// =======================
// Seleção dos elementos principais do formulário
// =======================
const form = document.getElementById('form')
const inputs = document.querySelectorAll('.inputs')
const spans = document.querySelectorAll('.span-required')

// =======================
// Inputs de texto que o usuário preenche
// =======================
const nacionalidadeInput = document.getElementById('nacionalidadeInput')
const estadoInput = document.getElementById('estadoInput')
const cidadeInput = document.getElementById('cidadeInput')

// =======================
// Elementos datalist que fornecem as sugestões de preenchimento
// =======================
const nacionalidadeDatalist = document.getElementById('nacionalidade')
const estadoDatalist = document.getElementById('estado')
const cidadeDatalist = document.getElementById('city')

/**
 * Função assíncrona para carregar os dados da API de países.
 * Após o carregamento dos dados, chama a função para preencher o datalist de nacionalidades.
 */
async function carregarDados() {
    try {
        const responsePaises = await fetch(paisesAPI)
        paises = await responsePaises.json()

        preencherNacionalidades()
    } catch (error) {
        console.error('Erro ao carregar dados da API de países:', error)
    }
}

/**
 * Preenche o datalist de nacionalidades com os países obtidos da API.
 */
function preencherNacionalidades() {
    // Limpa o conteúdo anterior do datalist
    nacionalidadeDatalist.innerHTML = ''

    // Percorre o array de países, criando uma option para cada um
    paises.forEach(pais => {
        const option = document.createElement('option')
        option.value = pais.nome // Usa o campo "nome" do JSON de países
        nacionalidadeDatalist.appendChild(option)
    })
}

// =======================
// EVENT LISTENERS
// =======================

// Valida a nacionalidade ao digitar no campo correspondente
nacionalidadeInput.addEventListener('input', ValidarNacionalidade)

// Impede o envio do formulário ao pressionar a tecla Enter
document.addEventListener('keydown', (evt) => {
    if (evt.key == 'Enter') {
        impedirEnvio(evt)
    }
})

// Impede envio do formulário ao clicar no botão Submit e chama as validações
form.addEventListener('submit', impedirEnvio)

/**
 * Valida se a nacionalidade digitada pelo usuário existe na lista de países da API.
 * Caso não exista, exibe um erro visual e uma mensagem via toast.
 */
function ValidarNacionalidade() {
    const nacionalidade = paises.find(pais => pais.nome.toLowerCase() === nacionalidadeInput.value.toLowerCase())

    if (!nacionalidade) {
        CasoError(3)
        exibirToast(`O país "${nacionalidadeInput.value}" não está cadastrado!`)
    } else {
        NotError(3)
    }
}

/**
 * Função principal para impedir o envio do formulário,
 * validando todos os campos obrigatórios antes de liberar a submissão.
 */
function impedirEnvio(ev) {
    ev.preventDefault()

    ValidarEscola()
    ValidarCPF()
    ValidarNome()
    ValidarNacionalidade()
    ValidarEstado()
    ValidarCidade()
}

// =======================
// FUNÇÕES DE FEEDBACK VISUAL
// =======================

/**
 * Aplica o estilo de erro ao campo indicado, alterando a borda e exibindo a mensagem.
 * @param {number} indice - Índice do campo dentro da NodeList `inputs` e `spans`.
 */
function CasoError(indice) {
    inputs[indice].style.border = '2px solid #e63636' // Borda vermelha para indicar erro
    spans[indice].style.display = 'block' // Exibe a mensagem de erro associada
}

/**
 * Remove o estilo de erro do campo indicado, retornando ao estado normal.
 * @param {number} indice - Índice do campo dentro da NodeList `inputs` e `spans`.
 */
function NotError(indice) {
    inputs[indice].style.border = '2px solid #9333ff' // Borda roxa padrão
    spans[indice].style.display = 'none' // Oculta a mensagem de erro
}

/**
 * Exibe uma notificação toast com a mensagem informada.
 * A notificação desaparece automaticamente após 3 segundos.
 * @param {string} mensagem - Mensagem de erro que será exibida no toast.
 */
function exibirToast(mensagem) {
    const toast = document.getElementById('toast')

    toast.textContent = mensagem
    toast.classList.remove('hidden')
    toast.classList.add('show')

    // Oculta a notificação após o tempo determinado
    setTimeout(() => {
        toast.classList.remove('show')

        setTimeout(() => {
            toast.classList.add('hidden')
        }, 300)
    }, 3000)
}

// =======================
// FUNÇÕES DE VALIDAÇÃO DOS CAMPOS
// =======================

// Valida se o campo "Nome da Escola" está preenchido
inputs[0].addEventListener('input', ValidarEscola)
function ValidarEscola() {
    if (inputs[0].value === '') {
        CasoError(0)
    } else {
        NotError(0)
    }
}

// Valida se o campo CPF está com o número correto de caracteres após a formatação
inputs[1].addEventListener('input', () => {
    inputs[1].value = formatarCPF(inputs[1].value)
    ValidarCPF()
})

/**
 * Aplica a máscara de CPF no formato 000.000.000-00 durante a digitação.
 * @param {string} cpf - CPF digitado pelo usuário.
 * @returns {string} CPF formatado.
 */
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '') // Remove tudo que não for dígito
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    return cpf
}

/**
 * Valida se o CPF possui 11 dígitos após a remoção da máscara.
 */
function ValidarCPF() {
    const cpf = inputs[1].value.replace(/\D/g, '') // Remove a máscara para validação
    if (cpf.length !== 11) {
        CasoError(1)
    } else {
        NotError(1)
    }
}

// Valida se o campo Nome está preenchido
inputs[2].addEventListener('input', ValidarNome)
function ValidarNome() {
    if (inputs[2].value === '') {
        CasoError(2)
    } else {
        NotError(2)
    }
}

// Valida se o campo Cidade está preenchido
inputs[4].addEventListener('input', ValidarCidade)
function ValidarCidade() {
    if (inputs[4].value === '') {
        CasoError(4)
    } else {
        NotError(4)
    }
}

// Valida se o campo Estado está preenchido
inputs[5].addEventListener('input', ValidarEstado)
function ValidarEstado() {
    if (inputs[5].value === '') {
        CasoError(5)
    } else {
        NotError(5)
    }
}

// =======================
// INICIALIZAÇÃO AO CARREGAR A PÁGINA
// =======================

/**
 * Quando o conteúdo da página for carregado, inicia o carregamento dos dados da API.
 */
document.addEventListener('DOMContentLoaded', carregarDados)
