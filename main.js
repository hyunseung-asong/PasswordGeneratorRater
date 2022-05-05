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
<<<<<<< HEAD
=======
const specialCharsExtended = "!\"#$%&'*+,./:;=?@\\^`|~-_[]{}()<>";
>>>>>>> passwordrater

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
    pwLength = 6;
    allowLowercase = true;
    generatePassword(event.target);
  },
  btnMedium: function (event) {
    pwStrength = PasswordStrength.MEDIUM;
    pwLength = 10;
    allowLowercase = true;
    generatePassword(event.target);
  },
  btnStrong: function (event) {
    pwStrength = PasswordStrength.STRONG;
    pwLength = 20;
    allowLowercase = true;
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
  // default allow lower case
  let possTokens = lowercase;
  let pw = "";
//   let userInputWord = "";
  // reset settings
  allowUppercase = false;
  reqUppercase = false;
  allowDigits = false;
  allowWords = false;
  reqDigits = false;
  allowSpecialChars = false;
  reqSpecialChars = false;
  // check or user settings
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

  if (allowUppercase) possTokens += uppercase;
  if (allowDigits) possTokens += digits;
  if (allowSpecialChars) possTokens += specialChars;
  let randomWordMinLength = 2;
  let randomWordMaxLength = 4;
  if(pwStrength == PasswordStrength.WEAK){ 
    randomWordMinLength = 2;
    randomWordMaxLength = 4;
  }
  if(pwStrength == PasswordStrength.MEDIUM){ 
    randomWordMinLength = 3;
    randomWordMaxLength = 6;
  }
  if(pwStrength == PasswordStrength.STRONG){ 
    randomWordMinLength = 5;
    randomWordMaxLength = 8;
  }
  do {
      let passwordLength = pwLength;
      let words = new Array();
      let wordListMapped = wordList.filter(word => (word.length >= randomWordMinLength && word.length <= randomWordMaxLength));
    if(allowWords){
        words.push(wordListMapped[(randInt(wordListMapped.length))]);
        if(pwStrength == PasswordStrength.STRONG){
            words.push(wordListMapped[randInt(wordListMapped.length)]);
        }
    }
    console.log(words);

    let wordsLength = 0;
    for(let w of words){
        wordsLength += w.length;
    }
    passwordLength -= wordsLength;
    console.log("pw: " + passwordLength + ", wordLength: " + wordsLength);

    pw = "";
    for (let i = 0; i < passwordLength; i++) {
      pw = pw + possTokens.charAt(Math.random() * (possTokens.length));
    }
    pw = limitCharacterFrequency(possTokens, pw);
    if(pwStrength != PasswordStrength.WEAK){
        words = leetspeakify(words);
        pw = randomlyAppend(words, pw);
    }else{
        if(allowWords){
            pw += words[0];
        }
    }
  }
  while (
    (reqUppercase && !pw.match(new RegExp("[" + uppercase + "]"))) ||
    (reqDigits && !pw.match(new RegExp("[" + digits + "]"))) ||
    (reqSpecialChars && !pw.match(new RegExp("[" + specialChars + "]")))
  )

  document.getElementById("pgen-result").value = pw;
  return pw;
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
        if (maximum > Math.ceil(maximum / 2 + variability)) {
            uniform = false;
            // reset most occuring character
            let pw = "";
            pw = "";
            for (let i = 0; i < password.length; i++) {
                if (password.charAt(i) == char) {
                    let newChar = possibleTokens.charAt(Math.random() * (possibleTokens.length));
                    pw += newChar;
                } else {
                    pw += password.charAt(i);
                }
            }
            password = pw;
        } else {
            uniform = true;
        }
    }
    return password;
}

// Turns regular text into leetspeak
function leetspeakify(words){
    let newWords = new Array();
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    const leetDigitsDictionary = {
        "a": "4", "b": "86", "c": "",  "d": "", "e": "3", "f": "",  "g": "9", "h": "",  "i": "1",
        "j": "",  "k": "",   "l": "1", "m": "", "n": "",  "o": "0", "p": "",  "q": "9", "r": "", 
        "s": "5", "t": "7",  "u": "",  "v": "", "w": "",  "x": "",  "y": "",  "z": "2"};
    const leetSpecialDictionary = {
            "a": "@", "b": "",  "c": "(<", "d": "", "e": "", "f": "", "g": "&", "h": "#", "i": "!",
            "j": ";", "k": "",  "l": "|",  "m": "", "n": "", "o": "", "p": "",  "q": "",  "r": "", 
            "s": "$", "t": "+", "u": "",   "v": "", "w": "", "x": "", "y": "",  "z": ""};
    for(let w = 0; w < words.length; w++){
        let word = words[w];
        let newWord = "";
        for(let i = 0; i < word.length; i++){
            // console.log("checking: " + word[i] + ", " + word[i].toLowerCase());
            // console.log(alphabet.includes(word[i].toLowerCase()));
            let char = "";
            let digitOrSpecial = 0;
            let lowerOrUpper = 0;
            if(reqUppercase && reqDigits && reqSpecialChars){
                digitOrSpecial = Math.floor(Math.random() * 2);
                lowerOrUpper = Math.floor(Math.random() * 2);
            }else if (reqDigits && reqSpecialChars){
                digitOrSpecial = Math.floor(Math.random() * 2);
                lowerOrUpper = 1;
            }else if (reqUppercase & reqDigits){
                digitOrSpecial = 0;
                lowerOrUpper = Math.floor(Math.random() * 2);
            }else if(reqUppercase && reqSpecialChars){
                digitOrSpecial = 1;
                lowerOrUpper = Math.floor(Math.random() * 2);
            }else if(reqUppercase){
                digitOrSpecial = -1;
                lowerOrUpper = Math.floor(Math.random() * 2);
            }else if(reqDigits){
                digitOrSpecial = 0;
                lowerOrUpper = 1;
            }else if(reqSpecialChars){
                digitOrSpecial = 1;
                lowerOrUpper = 1;
            }else{
                digitOrSpecial = -1;
                lowerOrUpper = 1;
            }
            if(digitOrSpecial == 0){
                if(alphabet.includes(word[i].toLowerCase())){
                    char = leetDigitsDictionary[word[i].toLowerCase()][0];
                }
            }else if(digitOrSpecial == 1){
                if(alphabet.includes(word[i].toLowerCase())){
                    char = leetSpecialDictionary[word[i].toLowerCase()][0];
                }
            }else{
                char = "";
            }
            if(char == "" || char == null){
                if (lowerOrUpper == 0){
                    char = word[i].toUpperCase();
                }else if (lowerOrUpper == 1){
                    char = word[i];
                }
            }
            newWord += char;
        }
        newWords.push(newWord);
    }
    return newWords;
}

// adds words into a random index of password.
// given words will always be added in the order they are given.
function randomlyAppend(words, password){
    let combined = "";
    let indexes = new Array();
    indexes.push(0);
    for(let i = 0; i < words.length; i++){
        indexes.push(Math.floor(Math.random() * password.length));
    }
    indexes.push(password.length);
    indexes.sort(function(a, b) {
        return a - b;
    });
    for(let i = 0; i < words.length; i++){
        combined += password.substring(indexes[i], indexes[i+1]) + words[i]
    }
    combined += password.substring(indexes[words.length], indexes[words.length + 1]);
    return combined;
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
  document.getElementById("pgen-result").value = "";
}

function copy() {
  let copyText = document.getElementById("pgen-result").value;
   navigator.clipboard.writeText(copyText);
}

//From random-words package
function randInt(lessThan) {
  return Math.floor(Math.random() * lessThan);
}
