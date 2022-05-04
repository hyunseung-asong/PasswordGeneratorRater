"use strict";

// Enumerator for password strength.
class PasswordStrength {
  static WEAK = new PasswordStrength("WEAK");
  static MEDIUM = new PasswordStrength("MEDIUM");
  static STRONG = new PasswordStrength("STRONG");
  constructor(name) {
    this.name = name;
  }
}

// Poss. tokens.
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = lowercase.toUpperCase();
const digits = "0123456789";
const specialChars = "!@#$%^&*";
const specialCharsExtended = "!\"#$%&'*+,./:;=?@\\^`|~-_[]{}()<>";
// use randomWords to call functions from package
const randomWords = require('random-words');
// wordList is the list of words inside package
const wordList = randomWords.wordList;


// Settings
let allowLowercase = true;
let allowUppercase = false;
let allowDigits = false;
let allowSpecialChars = false;
let allowWords = false;
let reqUppercase = false;
let reqDigits = false;
let reqSpecialChars = false;
let reqWords = false;
let pwLength = 8; 
let pwStrength = PasswordStrength.MEDIUM;


// Mapping to functions.
const buttonMap = {
  btnWeak: function (event) {
    pwStrength = PasswordStrength.WEAK;
    allowLowercase = true;
    // allowUppercase = false;
    // allowDigits = false;
    // allowSpecialChars = false;
    // reqUppercase = false;
    // reqDigits = false;
    // reqSpecialChars = false;
    //add setting for words
    generatePassword(event.target);
  },
  btnMedium: function (event) {
    pwStrength = PasswordStrength.MEDIUM;
    allowLowercase = true;
    // allowUppercase = false;
    // allowDigits = false;
    // allowSpecialChars = false;
    // reqUppercase = false;
    // reqDigits = false;
    // reqSpecialChars = false;
    generatePassword(event.target);
  },
  btnStrong: function (event) {
    pwStrength = PasswordStrength.STRONG;
    allowLowercase = true;
    // allowUppercase = false;
    // allowDigits = false;
    // allowSpecialChars = false;
    // reqUppercase = false;
    // reqDigits = false;
    // reqSpecialChars = false;
    generatePassword(event.target);
  },
  btnReset: function (event) {
    reset();
  }
}

// Event listener.
const container = document.querySelector('.password-generator-form');
const buttonClick = container && container.addEventListener('click', function(event) {
  const target = event.target;
  var handler;
  if (target.nodeName == "BUTTON" && (handler = target.getAttribute('data-handler'))) {
    buttonMap[handler](event)
  }
})

// Password generation.
function generatePassword(e) {
  console.log("generating pass");
  // default allow lower case
  let possTokens = lowercase;
  let pw = "";
  // reset settings
  allowUppercase = false;
  reqUppercase = false;
  allowDigits = false;
  allowWords = false;
  reqDigits = false;
  allowSpecialChars = false;
  reqSpecialChars = false;
  if(document.getElementById("checkbox-upper").checked){
    allowUppercase = true;
    reqUppercase = true;
  }
  if(document.getElementById("checkbox-nums").checked){
    allowDigits = true;
    reqDigits = true;
  }
  if(document.getElementById("checkbox-symbols").checked){
    allowSpecialChars = true;
    reqSpecialChars = true;
  }
  if(document.getElementById("checkbox-words").checked){
    allowWords = true;
  }
  // if (allowLowercase) possTokens = lowercase;
  if (allowUppercase) possTokens += uppercase;
  if (allowDigits) possTokens += digits;
  if (allowSpecialChars) possTokens += specialChars;
  do {
    pw = "";
    for (let i = 0; i < pwLength; i++) {
      pw = pw + possTokens.charAt(Math.random() * (possTokens.length));
    }
  }
  while (
    (reqUppercase && !pw.match(new RegExp("[" + uppercase + "]"))) ||
    (reqDigits && !pw.match(new RegExp("[" + digits + "]"))) ||
    (reqSpecialChars && !pw.match(new RegExp("[" + specialChars + "]")))
  )
  let frequencyCheckedPassword = limitCharacterFrequency(possTokens, "aaaaaaaa");
  if(allowWords) frequencyCheckedPassword = appendWord(frequencyCheckedPassword);

  document.getElementById("pgen-result").innerHTML = frequencyCheckedPassword;
  return frequencyCheckedPassword;
}

function limitCharacterFrequency(possibleTokens, givenPassword) {

    let password = givenPassword;
    let uniform = false;
    let variability = password.length / 4; // 4 is temp number that adjusts variability of password
    let freq = new Map();
    // initialize all available characters' frequency to 0
    for (let c of possibleTokens) {
        freq.set(c, 0);
    }
    while (!uniform) {
        // get frequency of highest occuring character
        let maximum = 0;
        let char = '';
        for (let c of password) {
            freq.set(c, freq.get(c) + 1);
            if (freq.get(c) > maximum) {
                maximum = freq.get(c);
                char = c;
            }
        }

        if (maximum > maximum / 2 + variability) {
            uniform = false;
            // reset most occuring character while keeping character requirements
            let pw = "";
            do {
                pw = "";
                for (let i = 0; i < password.length; i++) {
                    if (password.charAt(i) == char) {
                        let newChar = possibleTokens.charAt(Math.random() * (possibleTokens.length));
                        pw += newChar;
                    } else {
                        pw += password.charAt(i);
                    }
                }
            }
            while (
                (reqUppercase && !pw.match(new RegExp("[" + uppercase + "]"))) ||
                (reqDigits && !pw.match(new RegExp("[" + digits + "]"))) ||
                (reqSpecialChars && !pw.match(new RegExp("[" + specialChars + "]")))
            )
            password = pw;
        } else {
            uniform = true;
        }
    }
    return password;
}

function appendWord(pw){
  if(pwStrength = PasswordStrength.WEAK){
    if(document.getElementById("user-word-input").value != ""){
      pw+=document.getElementById("user-word-input").value;
    }
    else{
      //Append a random word of lenth 4 to end of password
      let wordListMapped = wordList.filter(word => word.length === 4);   
      pw+=wordListMapped[randInt(wordListMapped.length)];
    }
  }
  return pw;
}

function reset() {
  document.getElementById("pgen-result").innerHTML = "Select the settings and then click one of the buttons";
  document.getElementById("checkbox-upper").checked = false;
  document.getElementById("checkbox-nums").checked = false;
  document.getElementById("checkbox-symbols").checked = false;
  document.getElementById("checkbox-words").checked = false;
  document.getElementById("user-word-input").value = "";
}

function randInt(lessThan) {
  return Math.floor(Math.random() * lessThan);
}
