const readline = require('readline-sync')
const state = require('./state')

function robot() {
    const content = {
        maxSentences: 7
    }
    
    content.searchTerm = askSearchTerm()
    content.prefix = askPrefix()
    state.save(content)    
    function askSearchTerm() {
        return readline.question('Digite um termo para o seu video: ')
    }

    function askPrefix() {
        const prefixes = ['Quem é', 'O que é', 'A historia de']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Escolha uma das opções: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]
    
        return selectedPrefixText
    }
}

module.exports = robot
