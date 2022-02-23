#!/usr/bin/env node

const textFile = process.argv[2];

const fs = require('fs')

fs.readFile(textFile, 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  characters = seperateCharacters(data)
  uniqueCharacters = findUnique(characters[0])

  totalChineseCharacters = characters[0].length
  totalNoneChineseCharacters = characters[1].length
  console.log("Total Characters: ", totalChineseCharacters + totalNoneChineseCharacters)
  console.log("------")
  console.log("Total Chinese Characters: ", totalChineseCharacters)
  console.log("Total Other Characters: ", totalNoneChineseCharacters)
  console.log("Total Unique Characters: ", uniqueCharacters.length)

  fs.readFile("data/hsk_characters.json", 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
  
    inHSK = findCharactersInHSK(data, uniqueCharacters)
    percInHSK = calculatePercentage(inHSK.length, uniqueCharacters.length)
    console.log("Percentage in HSK: %d%", Math.round(percInHSK))
  })
})


function seperateCharacters(str) {
  const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
  characters = str.split("")

  chinese = characters.filter((string)=>REGEX_CHINESE.test(string))
  nonChinese = characters.filter((string)=>!REGEX_CHINESE.test(string))
  return [chinese, nonChinese]
}

function findUnique(characters) {
  return characters.filter(function(v,i) { return i==characters.lastIndexOf(v); })
}

function getHSKCharacters() {
  fs.readFile("data/hsk_characters.json", 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
  
    return data
  })
}

function findCharactersInHSK(hsk, characters) {
  included = []
  characters.forEach(function(character){
    if (hsk.includes(character)) {
      included.push(character)
    }
  })

  return included
}

function calculatePercentage(a, b) {
  return (a/b) * 100
}