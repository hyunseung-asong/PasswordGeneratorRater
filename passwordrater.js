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
  setRatingColor("var(--purple)");
  passwordRaterOutput.innerHTML = checkPassword(passwordRaterInput.value);
});

// Check password strength & return a string containing password strength information
const checkPassword = (pw) => {
  if (pw.length == 0) return "Enter valid password";
  if (containsWhitespace(pw)) return "No spaces allowed";

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
      var regEx = new RegExp(word, "i");  // ignores case
      pw = pw.replace(regEx, '');         // replace word with empty string
      console.log(pw);
    }
  })

  // if password contains words & is weak/medium strength, add to final message
  if (wordsFound > 0) additionalMessage = `Your password contains ${wordsFound} word(s).`;
  
  // calculate the num of guesses to crack the password
  const guesses = Math.pow(availableChars, pw.length) / 2;
  // Determine password strength based on num guesses
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
  
  // if additional message is present, add it to final message if not strong/very strong already
  if (additionalMessage != null && passwordStrength != "Strong password" && passwordStrength != "Very strong password") {
    passwordStrength += ". " + additionalMessage;
  }

  return passwordStrength;
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
  passwordRaterOutput.style.color = color;
}