// Seleção dos elementos principais do formulário
const form = document.getElementById('form')
const inputs = document.querySelectorAll('.inputs')
const spans = document.querySelectorAll('.span-required')

// Estrutura de dados de nacionalidades, estados e cidades
// Essa estrutura é utilizada para validar e popular os campos de seleção do formulário
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

// Inputs de texto que o usuário preenche
const nacionalidadeInput = document.getElementById('nacionalidadeInput')
const estadoInput = document.getElementById('estadoInput')
const cidadeInput = document.getElementById('cidadeInput')

// Elementos datalist que fornecem as sugestões de preenchimento
const nacionalidadeDatalist = document.getElementById('nacionalidade')
const estadoDatalist = document.getElementById('estado')
const cidadeDatalist = document.getElementById('city')

// Popula o datalist de nacionalidades quando a página é carregada
preencherNacionalidades()

// Impede que o usuário envie o formulário pressionando a tecla Enter
document.addEventListener('keydown', (evt) => {
    if (evt.key == 'Enter') {
        impedirEnvio(evt)
    }
})

// Impede envio do formulário ao clicar no botão Submit e chama as validações
form.addEventListener('submit', impedirEnvio)

// Função principal para bloquear o envio e validar todos os campos obrigatórios
function impedirEnvio(ev) {
    ev.preventDefault()
    ValidarEscola()
    ValidarCPF()
    ValidarNome()
    ValidarNacionalidade()
    ValidarEstado()
    ValidarCidade()
}

// Exibe feedback visual de erro nos inputs e mensagens de aviso
function CasoError(indice) {
    inputs[indice].style.border = '2px solid #e63636' // Borda vermelha indica erro
    spans[indice].style.display = 'block' // Exibe a mensagem de erro associada
}

// Remove o feedback de erro quando o campo está correto
function NotError(indice) {
    inputs[indice].style.border = '2px solid #9333ff' // Borda roxa padrão
    spans[indice].style.display = 'none' // Oculta a mensagem de erro
}

// Exibe uma notificação toast com mensagens de erro dinâmicas
function exibirToast(mensagem) {
    const toast = document.getElementById('toast')

    toast.textContent = mensagem
    toast.classList.remove('hidden')
    toast.classList.add('show')

    // Remove a notificação após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show')
        setTimeout(() => {
            toast.classList.add('hidden')
        }, 300)
    }, 3000)
}

// ==================== Validações de campos ==================== //

// Validação simples de campo obrigatório para o campo Escola
inputs[0].addEventListener('input', ValidarEscola)
function ValidarEscola() {
    if (inputs[0].value === '') {
        CasoError(0)
    } else {
        NotError(0)
    }
}

// CPF com máscara de formatação em tempo real e validação de quantidade de caracteres
inputs[1].addEventListener('input', () => {
    inputs[1].value = formatarCPF(inputs[1].value)
    ValidarCPF()
})

// Função que aplica a máscara no campo de CPF (formato 000.000.000-00)
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '') // Remove tudo que não for dígito
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    return cpf
}

// Verifica se o CPF tem 11 dígitos após a formatação (não faz validação matemática ainda)
function ValidarCPF() {
    const cpf = inputs[1].value.replace(/\D/g, '')
    if (cpf.length !== 11) {
        CasoError(1)
    } else {
        NotError(1)
    }
}

// Validação simples de campo obrigatório para Nome
inputs[2].addEventListener('input', ValidarNome)
function ValidarNome() {
    if (inputs[2].value === '') {
        CasoError(2)
    } else {
        NotError(2)
    }
}

// ==================== Validações dependentes dos dados ==================== //

// Ao alterar a nacionalidade, atualiza estados e valida a nacionalidade
nacionalidadeInput.addEventListener('input', () => {
    preencherEstados(nacionalidadeInput.value)
    ValidarNacionalidade()
})

// Verifica se a nacionalidade digitada existe no objeto dados (case insensitive)
function ValidarNacionalidade() {
    const nacionalidade = buscarChave(dados, nacionalidadeInput.value)
    if (!nacionalidade) {
        CasoError(3)
        exibirToast(`O país "${nacionalidadeInput.value}" não está cadastrado!`)
        estadoDatalist.innerHTML = ''
        cidadeDatalist.innerHTML = ''
    } else {
        NotError(3)
    }
}

// Ao alterar o estado, atualiza cidades e valida o estado
estadoInput.addEventListener('input', () => {
    preencherCidades(nacionalidadeInput.value, estadoInput.value)
    ValidarEstado()
})

// Verifica se o estado digitado existe dentro da nacionalidade escolhida (case insensitive)
function ValidarEstado() {
    const nacionalidade = buscarChave(dados, nacionalidadeInput.value)
    if (!nacionalidade) {
        CasoError(3)
        exibirToast(`O país "${nacionalidadeInput.value}" não está cadastrado!`)
        return
    }

    const estados = dados[nacionalidade]
    const estado = buscarChave(estados, estadoInput.value)

    if (!estado) {
        CasoError(4)
        exibirToast(`O estado "${estadoInput.value}" não está cadastrado em "${nacionalidade}"!`)
        cidadeDatalist.innerHTML = ''
    } else {
        NotError(4)
    }
}

// Ao alterar a cidade, valida se ela existe no estado e país selecionados
cidadeInput.addEventListener('input', ValidarCidade)

function ValidarCidade() {
    const nacionalidade = buscarChave(dados, nacionalidadeInput.value)
    if (!nacionalidade) {
        CasoError(3)
        exibirToast(`O país "${nacionalidadeInput.value}" não está cadastrado!`)
        return
    }

    const estados = dados[nacionalidade]
    const estado = buscarChave(estados, estadoInput.value)

    if (!estado) {
        CasoError(4)
        exibirToast(`O estado "${estadoInput.value}" não está cadastrado em "${nacionalidade}"!`)
        return
    }

    const cidades = estados[estado]

    // Compara a cidade ignorando letras maiúsculas e minúsculas
    const cidadeExiste = cidades.some(cidade => cidade.toLowerCase() === cidadeInput.value.toLowerCase())

    if (!cidadeExiste) {
        CasoError(5)
        exibirToast(`A cidade "${cidadeInput.value}" não está cadastrada no estado "${estado}"!`)
    } else {
        NotError(5)
    }
}

// ==================== Funções auxiliares ==================== //

// Preenche o datalist com os países disponíveis
function preencherNacionalidades() {
    nacionalidadeDatalist.innerHTML = ''

    Object.keys(dados).forEach(pais => {
        const option = document.createElement('option')
        option.value = pais
        nacionalidadeDatalist.appendChild(option)
    })
}

// Preenche o datalist com os estados correspondentes ao país selecionado
function preencherEstados(paisSelecionado) {
    estadoDatalist.innerHTML = ''
    cidadeDatalist.innerHTML = ''

    const nacionalidade = buscarChave(dados, paisSelecionado)

    if (nacionalidade) {
        const estados = Object.keys(dados[nacionalidade])
        estados.forEach(estado => {
            const option = document.createElement('option')
            option.value = estado
            estadoDatalist.appendChild(option)
        })
    }
}

// Preenche o datalist com as cidades correspondentes ao estado e país selecionados
function preencherCidades(paisSelecionado, estadoSelecionado) {
    cidadeDatalist.innerHTML = ''

    const nacionalidade = buscarChave(dados, paisSelecionado)

    if (nacionalidade) {
        const estados = dados[nacionalidade]
        const estado = buscarChave(estados, estadoSelecionado)

        if (estado) {
            const cidades = estados[estado]
            cidades.forEach(cidade => {
                const option = document.createElement('option')
                option.value = cidade
                cidadeDatalist.appendChild(option)
            })
        }
    }
}

// Busca uma chave dentro de um objeto sem considerar letras maiúsculas/minúsculas
// Exemplo: permite que "brasil", "BRASIL" ou "Brasil" sejam interpretados corretamente
function buscarChave(obj, chave) {
    const entrada = chave.toLowerCase()

    // Retorna a chave original do objeto que corresponde à entrada fornecida
    return Object.keys(obj).find(k => k.toLowerCase() === entrada)
}
