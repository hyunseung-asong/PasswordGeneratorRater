const passwordRaterInput = document.getElementById('password-rater-input');
const passwordRaterForm = document.getElementById('password-rater-form');
const passwordRaterOutput = document.getElementById('password-rater-output');

// On submission of form, do password checking logic
passwordRaterForm.addEventListener('submit', e => {
  e.preventDefault();
  passwordRaterOutput.innerHTML = checkPassword(passwordRaterInput.value);
});

const checkPassword = (password) => {
  let words = wordList                              // create a copy of wordList
  words = words.sort((a,b) => b.length - a.length); // sort words so longest words come first
  let passwordStrength = "";                                 // final message to output to client
  let additionalMessage = null;
  let wordsFound = 0;                               // increment this when a word is found to add to the final calculation of num guesses
  const availableChars = 52;                        // alphabetic

  // for each word, check if it's in password
  // then remove it from the pass and add to words found
  words.forEach((word) => {
    while (password.toLowerCase().includes(word)) {
      wordsFound++;
      var regEx = new RegExp(word, "ig");
      password = password.replace(regEx, '&');
      console.log("Password contained a word!");
    }
  })

  // if password contains words & is weak/medium strength
  // inform the user
  if (wordsFound > 0) additionalMessage = `Your password contains ${wordsFound} word(s).`;
  
  // number of guesses is equal to available chars (f.e. 52 for alphabetic) to the power of
  // words found in password + the rest of the password
  // all divided by 2, because it takes about half num of guesses to crack pass
  const guesses = Math.pow(availableChars, password.length - wordsFound) / 2;
  if (guesses < Math.pow(10, 6))
    passwordStrength = "Weak password";
  else if (guesses < Math.pow(10, 14))
    passwordStrength = "Medium password";
  else
    passwordStrength = "Strong password";
  
  if (additionalMessage != null && passwordStrength != "Strong password") {
    passwordStrength += ". " + additionalMessage;
  }
  return passwordStrength;
}