const fs = require('fs')
const contentFilePath = './content.json'

function save(content) {
    //Recebe o conteudo converte pra JSON
    const contentString = JSON.stringify(content)
    // grava um arquivo com o nome ecaminho que esta no contentFilePath
    // e com o conteudo que esta na variavel contentString
    return fs.writeFileSync(contentFilePath, contentString)
}

function load() {
    // pega o arquivo que esta no contentFilePath
    // e faz um buffer no conteudo
    const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8')
    // tranforma o buffer em objeto
    const contentJson = JSON.parse(fileBuffer)
    // e returna esse objeto
    return contentJson
}

module.exports = {
    save,
    load
}