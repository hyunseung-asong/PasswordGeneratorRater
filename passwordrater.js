/**
const fs = require('browserify-fs');
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
*/
// Event listener.
const ratingBtn = document.querySelector('.password-checker-submit');
ratingBtn.addEventListener('click', function (event) {
  const password = document.querySelector('.password-input').value;
  checkPassword(event, password)
});

const checkPassword = async (e, pw) => {
  let possTokens = 0;
  if (pw.match(new RegExp("[" + lowercase + "]"))) possTokens += lowercase.length;
  if (pw.match(new RegExp("[" + uppercase + "]"))) possTokens += uppercase.length;
  if (pw.match(new RegExp("[" + digits + "]"))) possTokens += digits.length;
  if (pw.match(new RegExp("[" + specialChars + "]"))) possTokens += specialChars.length;

  const numEnglishWords = 56000;
  let wordsFound = 0;
  /**
  const words = await getWords();

  words.forEach((word) => {
    while (password.includes(word)) {
      wordsFound++;
      password = password.replace(word, '');
    }
  })
  console.log("Password contains " + wordsFound + " words!");
  */

  // Calculate password complexity.
  const possTokenPermutations = Math.pow(possTokens, pw.length);
  const ptpStr = possTokenPermutations.toString();
  let pow10Exp = ptpStr.length - 1;
  if (ptpStr.includes("+")) pow10Exp = ptpStr.substring(ptpStr.indexOf("+") + 1);

  // Print message.
  let ratingMsg = "Your password complexity is at least 10^" + pow10Exp + ".";
  if (possTokenPermutations < Math.pow(10, 6)) {
    ratingMsg = "WEAK: " + ratingMsg;
    setRatingColor("red");
  }
  else if (possTokenPermutations < Math.pow(10, 14)) {
    ratingMsg = "MEDIUM: " + ratingMsg;
    setRatingColor("yellow");
  }
  else if (possTokenPermutations < Math.pow(10, 20)) {
    ratingMsg = "STRONG: " + ratingMsg;
    setRatingColor("green");
  }
  else if (possTokenPermutations >= Math.pow(10, 20)) {
    ratingMsg = "VERY STRONG: " + ratingMsg;
    setRatingColor("aquamarine");
  }

  // Update HTML with rating response.
  const ratingMsgElement = document.querySelector('.rating-msg');
  ratingMsgElement.innerHTML = ratingMsg;
}

const setRatingColor = async (color) => {
  var element = document.querySelector('.rating-container');
  element.style.color = "var(--" + color + ")";
}