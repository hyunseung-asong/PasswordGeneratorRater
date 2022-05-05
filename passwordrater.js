/*
  1. Checks for empty/invalid password input
  2. Calculates password complexity (variety of characters)
  3. Calculates number of possible permutations/2 to be number of guesses needed to crack password
  4. Outputs message to user & changes color based on password strength rating
*/

const passwordRaterInput = document.getElementById('password-rater-input');
const passwordRaterForm = document.getElementById('password-rater-form');
const passwordRaterOutput = document.getElementById('password-rater-output');

// On submission of password rater form, do password checking logic
passwordRaterForm.addEventListener('submit', e => {
  e.preventDefault();
  passwordRaterOutput.innerHTML = checkPassword(passwordRaterInput.value);
});

// Check password strength & return a string containing password strength information
const checkPassword = (pw) => {
  if (pw.length == 0) return "Please enter a valid password.";
  if (containsWhitespace(pw)) return "A valid password cannot have spaces.";

  // Check if password is in the top 1000 most common passwords.
  let commonPasswords = mostCommonPasswords;
  let isCommonPassword = false;
  commonPasswords.every((word) => {
    if (pw == word) {
      isCommonPassword = true;
      pw = "";
      return false;
    }
    return true;
  })
  console.log("Password is common!");

  let possTokenPermutations = 0;
  let words = wordList                              // create a copy of wordList
  words = words.sort((a, b) => b.length - a.length); // sort words so longest words come first
  let passwordStrength = "";                        // final message to output to client
  let additionalMessage = null;                     // additional message to attach to output
  let wordsFound = 0;                               // count number of English words found
  const uniqueWords = new Set();                    // tracks unique English words
  const availableChars = checkComplexity(pw);       // get num of different characters are in the password (alpha, numeric, special char)

  // If the password is common, we can skip the complexity calculation process.
  if (isCommonPassword) {
    possTokenPermutations = commonPasswords.length;
    additionalMessage = `Your password is very commonly used.`;
  }
  else {
    // Check every English word in our dictionary; if it's in the password, remove it.
    words.forEach((word) => {
      while (pw.toLowerCase().includes(word)) {
        uniqueWords.add(word);
        wordsFound++;
        var regEx = new RegExp(word, "i");  // ignores case
        pw = pw.replace(regEx, '');         // replace word with empty string
        console.log(pw);
      }
    })
    console.log("Password contains " + wordsFound + " words!");

    // Weak, word heavy passwords will show the number of words in the password.
    if (wordsFound > 0) additionalMessage = `Your password contains ${uniqueWords.size} word(s).`;

    // Calculate password complexity based on length (after words are removed).
    possTokenPermutations = Math.pow(availableChars, pw.length);

    // Add the number of unique words back into the password's complexity.
    const numEnglishWords = words.length;
    possTokenPermutations *= Math.pow(availableChars + numEnglishWords, uniqueWords.size);
    // For dupes, a brute force attacker no longer has to guess the type of word; only the type of available character.
    possTokenPermutations *= Math.pow(availableChars + uniqueWords.size, wordsFound - uniqueWords.size);

  }

  // The (base) rating string returned.
  const avgGuesses = (possTokenPermutations / 2).toString();
  let nthPowerOf10 = avgGuesses.length - 1;
  if (avgGuesses.includes("+")) nthPowerOf10 = avgGuesses.substring(avgGuesses.indexOf("+") + 1);

  // Rate password strength based on num guesses
  let ratingMsg = "10^" + nthPowerOf10 + " guesses needed on average.";
  if (possTokenPermutations < Math.pow(10, 6)) {
    ratingMsg = "WEAK | " + ratingMsg;
    setRatingColor("red");
  }
  else if (possTokenPermutations < Math.pow(10, 14)) {
    ratingMsg = "MEDIUM | " + ratingMsg;
    setRatingColor("yellow");
  }
  else if (possTokenPermutations < Math.pow(10, 20)) {
    ratingMsg = "STRONG | " + ratingMsg;
    setRatingColor("green");
  }
  else if (possTokenPermutations >= Math.pow(10, 20)) {
    ratingMsg = "VERY STRONG | " + ratingMsg;
    setRatingColor("aquamarine");
  }

  // if additional message is present, add it to final message if not strong/very strong already
  if (additionalMessage != null && possTokenPermutations < Math.pow(10, 14)) {
    ratingMsg += " | " + additionalMessage;
  }
  return ratingMsg;
}

// Helper function for checking whitespace in password
const containsWhitespace = (pw) => {
  return /\s/.test(pw);
}

// Uses regex to check the variety of different characters in a password
// Returns the number of possible tokens
const checkComplexity = (pw) => {
  let possTokens = 0;
  if (pw.match(new RegExp("[" + lowercase + "]"))) possTokens += lowercase.length;
  if (pw.match(new RegExp("[" + uppercase + "]"))) possTokens += uppercase.length;
  if (pw.match(new RegExp("[" + digits + "]"))) possTokens += digits.length;
  if (pw.match(new RegExp("[" + specialChars + "]"))) possTokens += specialChars.length;

  return possTokens;
}

// Helper function to change color of output text
const setRatingColor = (color) => {
  passwordRaterOutput.style.color = "var(--" + color + ")";
}