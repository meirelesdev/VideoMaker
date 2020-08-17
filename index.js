const readline = require('readline-sync')

const start = ()=> {
    const content = {}

    content.searchTerm = askSearchTerm()
    content.prefix = askPrefix()

    function askSearchTerm() {
        return readline.question('Digite um termo para o seu video: ')
    }
    function askPrefix() {
        const prefixes = ['Quem é', 'O que é', 'A historia de']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Escolha uma das opções: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]

        return selectedPrefixText
    }
    console.log(content)
}

start()