const fs = require('fs');
const readline = require('readline');

const getWords = async() => {
  const fileStream = fs.createReadStream('words.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let words = [];
  for await (const line of rl) {
    if (line.length > 3) {
      words.push(line)
    }
  };

  words = words.sort((a,b) => b.length - a.length); // sort words so longest words come first
  return words;
}

const checkPassword = async(password) => {
  const availableChars = 52; // alphabetic
  const words = await getWords();
  let wordsFound = 0;

  words.forEach((word) => {
    while (password.includes(word)) {
      wordsFound++;
      password = password.replace(word, '');
      console.log("Password contained a word!");
    }
  })

  const guesses = Math.pow(availableChars, wordsFound + password.length) / 2;
  if (guesses < Math.pow(10, 6))
    console.log("weak pass");
  else if (guesses < Math.pow(10, 14))
    console.log("medium pass");
  else
    console.log("strong pass");
}

checkPassword("hellohello");