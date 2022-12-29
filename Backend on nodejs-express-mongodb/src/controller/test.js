let content = "My name is amir sohel __0 and I live in Dakshin Bagnar __1 and my ps is __4"

let wordArr = content.split(" ")



for(let i=0;i<wordArr.length;i++){
    if(wordArr[i][0] == "_" && wordArr[i][1]=="_"){
        wordArr[i] = `${wordArr[i][2]}`
    }
}

console.log(wordArr)