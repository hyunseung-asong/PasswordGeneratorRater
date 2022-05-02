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

// Settings
let allowLowercase = true;
let allowUppercase = false;
let allowDigits = false;
let allowSpecialChars = false;
let reqUppercase = false;
let reqDigits = false;
let reqSpecialChars = false;
let pwLength = 8;
let pwStrength = PasswordStrength.MEDIUM;


// Mapping to functions.
const buttonMap = {
  btnWeak: function (event) {
    pwStrength = PasswordStrength.WEAK;
    allowLowercase = true;
    allowUppercase = false;
    allowDigits = false;
    allowSpecialChars = false;
    reqUppercase = false;
    reqDigits = false;
    reqSpecialChars = false;
    if(document.getElementById("checkbox-upper").checked){
        allowUppercase = true;
    }
    if(document.getElementById("checkbox-nums").checked){
        allowDigits = true;
    }
    if(document.getElementById("checkbox-symbols").checked){
        allowSpecialChars = true;
    }
    //add setting for words
    generatePassword(event.target);
  },
  btnMedium: function (event) {
    pwStrength = PasswordStrength.MEDIUM;
    allowLowercase = true;
    allowUppercase = false;
    allowDigits = false;
    allowSpecialChars = false;
    reqUppercase = false;
    reqDigits = false;
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
    generatePassword(event.target);
  },
  btnStrong: function (event) {
    pwStrength = PasswordStrength.STRONG;
    allowLowercase = true;
    allowUppercase = false;
    allowDigits = false;
    allowSpecialChars = false;
    reqUppercase = false;
    reqDigits = false;
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
    generatePassword(event.target);
  },
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
  let possTokens = "";
  let pw = "";
  if (allowLowercase) possTokens = possTokens + lowercase;
  if (allowUppercase) possTokens += possTokens + uppercase;
  if (allowDigits) possTokens += possTokens + digits;
  if (allowSpecialChars) possTokens += possTokens + specialChars;
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
  document.getElementById("pgen-result").innerHTML = pw;
  return pw;
}
