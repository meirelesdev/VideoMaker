const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')

const robot = async content => {
    await searchConentWiki(content)
        clearContent(content)
        breakContentSentences(content)

    async function searchConentWiki(content) {
        const algorithmiaAuth = algorithmia(algorithmiaApiKey )
        const wikiAlgorithm = algorithmiaAuth.algo('web/WikipediaParser/0.1.2')
        const wikiResponse = await wikiAlgorithm.pipe({
            articleName: content.searchTerm,
            lang: "pt"
        })
        const wikiContent = wikiResponse.get()
        content.originalContent = wikiContent.content
    }
    function clearContent(content) {
        const withOutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.originalContent)
        const withOutDatesInParecentheses = removeDatesInParentheses(withOutBlankLinesAndMarkdown)
        
        content.clearedContent = withOutDatesInParecentheses

        function removeBlankLinesAndMarkdown(text) {
            const allLines = text.split('\n')
            const withOutBlankLinesAndMarkdown = allLines.filter( line => {
                if( line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false
                }
                return true
            })
            return withOutBlankLinesAndMarkdown.join('')
        }

        function removeDatesInParentheses(text) {
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ')
        }
    }
    
    function breakContentSentences(content) {
        content.sentences = []            
        const sentences = sentenceBoundaryDetection.sentences(content.clearedContent)            
        sentences.forEach(sentence => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }
}

module.exports = robot