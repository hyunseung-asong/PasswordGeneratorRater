const passwordRaterInput = document.getElementById('password-rater-input');
const passwordRaterForm = document.getElementById('password-rater-form');
const passwordRaterOutput = document.getElementById('password-rater-output');

// On submission of form, do password checking logic
passwordRaterForm.addEventListener('submit', e => {
  e.preventDefault();
  passwordRaterOutput.innerHTML = checkPassword(passwordRaterInput.value);
});

const checkPassword = (pw) => {
  let words = wordList                              // create a copy of wordList
  words = words.sort((a,b) => b.length - a.length); // sort words so longest words come first
  let passwordStrength = "";                        // final message to output to client
  let additionalMessage = null;                     // additional message to attach to output
  let wordsFound = 0;                               // increment this when a word is found to add to the final calculation of num guesses
  const availableChars = checkComplexity(pw);       // get num of different characters are in the password (alpha, numeric, special char)

  // for each word, check if it's in password
  // then remove it from the pass and add to words found
  words.forEach((word) => {
    while (pw.toLowerCase().includes(word)) {
      wordsFound++;
      var regEx = new RegExp(word, "ig");
      pw = pw.replace(regEx, '');
      console.log("Password contained a word!");
    }
  })

  // if password contains words & is weak/medium strength
  // inform the user
  if (wordsFound > 0) additionalMessage = `Your password contains ${wordsFound} word(s).`;
  
  // number of guesses is equal to available chars (poss tokens) to the power of
  // words found in password + the rest of the password
  // all divided by 2, because it takes about half num of guesses to crack pass
  const guesses = Math.pow(availableChars, pw.length - wordsFound) / 2;
  if (guesses < Math.pow(10, 6)) {
    passwordStrength = "Weak password";
    setRatingColor("red");
  }
  else if (guesses < Math.pow(10, 14)) {
    passwordStrength = "Medium password";
    setRatingColor("yellow");
  }
  else if (guesses < Math.pow(10, 20)) {
    passwordStrength = "Strong password";
    setRatingColor("green");
  }
  else {
    passwordStrength = "Very strong password";
    setRatingColor("aquamarine");
  }
  if (additionalMessage != null && passwordStrength != "Strong password") {
    passwordStrength += ". " + additionalMessage;
  }

  return passwordStrength;
}

const checkComplexity = (pw) => {
  let possTokens = 0;
  if (pw.match(new RegExp("[" + lowercase + "]"))) possTokens += lowercase.length;
  if (pw.match(new RegExp("[" + uppercase + "]"))) possTokens += uppercase.length;
  if (pw.match(new RegExp("[" + digits + "]"))) possTokens += digits.length;
  if (pw.match(new RegExp("[" + specialChars + "]"))) possTokens += specialChars.length;

  return possTokens;
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
}

const setRatingColor = (color) => {
  passwordRaterOutput.style.color = color;
}