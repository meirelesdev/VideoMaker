const algorithmia = require('algorithmia')
const watson = require('../credentials/watson-nlu.json')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')
const NatualLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1')
const { IamAuthenticator } = require('ibm-watson/auth')

const nlu = new NatualLanguageUnderstandingV1({
    version: '2019-07-12',
    authenticator: new IamAuthenticator({
      apikey: watson.apikey,
    }),
    url: watson.url,
})

const robot = async content => {

    await searchConentWiki(content)
          clearContent(content)
          breakContentSentences(content)
          limitMaxSentences(content)
    await fetchKeywordsOfAllSentences(content)

    async function searchConentWiki(content) {
        const algorithmiaAuth = algorithmia(algorithmiaApiKey )
        const wikiAlgorithm = algorithmiaAuth.algo('web/WikipediaParser/0.1.2')

        const wikiResponse = await wikiAlgorithm.pipe({
            articleName: content.searchTerm,
            lang: "pt"
        })
        
        if(!wikiResponse.result){
            console.log("Busca sem resultado...")
            process.exit()
        }
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
    function limitMaxSentences(content) {
        content.sentences = content.sentences.slice(0, content.maxSentences)
    }
    async function fetchKeywordsOfAllSentences(content) {
        for( const sentence of content.sentences) {
            sentence.keywords = await fetchWatsonKeywords(sentence.text)
        }
    }
    async function fetchWatsonKeywords(sentence) {
        return new Promise((resolve, reject) => {
            nlu.analyze({
                text: sentence,
                features: {
                    keywords: {}
                }
            }, (error, response) => {
                if(error) {
                    
                    throw error
                }
               
                const keywords = response.result.keywords.map( keyword => {
                    return keyword.text
                })
                
                resolve(keywords)
            })
        })
    }
}

module.exports = robot