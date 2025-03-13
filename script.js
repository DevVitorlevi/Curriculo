
const form = document.getElementById('form')
const inputs = document.querySelectorAll('.inputs')
const spans = document.querySelectorAll('.span-required')


document.addEventListener('keydown', (evt) => {
    if (evt.key == 'Enter') {
        impedirEnvio(evt)
    }
})
form.addEventListener('submit', impedirEnvio)
function impedirEnvio(ev) {
    ev.preventDefault()//Impedir o Envio do Form
}


function CasoError(indice) {
    inputs[indice].style.border = '2px solid #e63636'
    spans[indice].style.display = 'block'
}
function NotError(indice) {
    inputs[indice].style.border = ''
    spans[indice].style.display = 'none'
}

inputs[0].addEventListener('input')
inputs[1].addEventListener('input')
inputs[2].addEventListener('input')
inputs[3].addEventListener('input')
inputs[4].addEventListener('input')
inputs[5].addEventListener('input')


console.log(inputs)