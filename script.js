// Mobile menu toggle
document.getElementById('mobile-menu-btn').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu if open
        document.getElementById('mobile-menu').classList.add('hidden');
    });
});

// RSA Calculator
let rsaKeys = {};

function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}

function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function modInverse(a, m) {
    for (let i = 1; i < m; i++) {
        if ((a * i) % m === 1) return i;
    }
    return null;
}

function modPow(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

function generateRSAKeys() {
    const p = parseInt(document.getElementById('prime-p').value);
    const q = parseInt(document.getElementById('prime-q').value);
    
    if (!isPrime(p) || !isPrime(q)) {
        document.getElementById('rsa-keys').innerHTML = '<p class="text-red-400">Please enter valid prime numbers!</p>';
        return;
    }
    
    if (p === q) {
        document.getElementById('rsa-keys').innerHTML = '<p class="text-red-400">p and q must be different primes!</p>';
        return;
    }

    const n = p * q;
    const phi = (p - 1) * (q - 1);

    // Check if n is too small
    if (n < 128) {
        document.getElementById('rsa-keys').innerHTML = '<p class="text-red-400 text-2xl">n is too small! Please choose larger primes so n > 128</p>';
        return;
    }

    // Find e (commonly 65537, but only if valid)
    let e = 65537;
    if (e >= phi || gcd(e, phi) !== 1) {
        // Find the smallest odd e > 2 such that gcd(e, phi) == 1
        e = 3;
        while (e < phi && gcd(e, phi) !== 1) {
            e += 2;
        }
        // If no valid e found, show error
        if (e >= phi) {
            document.getElementById('rsa-keys').innerHTML = '<p class="text-red-400">Could not find a valid public exponent e!</p>';
            return;
        }
    }

    const d = modInverse(e, phi);
    if (!d) {
        document.getElementById('rsa-keys').innerHTML = '<p class="text-red-400">Could not generate valid keys!</p>';
        return;
    }

    rsaKeys = { n, e, d, p, q, phi };

    document.getElementById('rsa-keys').innerHTML = `
        <div class="space-y-2">
            <p><strong>n : </strong> ${n}</p>
            <p><strong>φ(n) : </strong> ${phi}</p>
            <p><strong>Public Key (e) : </strong> ${e}</p>
            <p><strong>Private Key (d) : </strong> ${d}</p>
            <p class="text-green-400 mt-4">✓ RSA Keys Generated Successfully!</p>
        </div>
    `;
}

function encryptRSA() {
    // Check if RSA keys are generated
    console.log('Checking if RSA keys are generated (needed for encryption)...');
    if (!rsaKeys.n) {
        document.getElementById('rsa-encrypt-result').innerHTML = '<p class="text-red-400">Please generate RSA keys first!</p>';
        return;
    }

    // Get the message from user input
    console.log('Getting message from input (this is the plaintext to encrypt)...');
    const message = document.getElementById('rsa-encrypt-message').value;
    if (!message) {
        document.getElementById('rsa-encrypt-result').innerHTML = '<p class="text-red-400">Please enter a message to encrypt!</p>';
        return;
    }

    // Require public key e from input
    let eInput = document.getElementById('rsa-encrypt-e').value;
    if (!eInput) {
        document.getElementById('rsa-encrypt-result').innerHTML = '<p class="text-red-400">Please enter the public key (e)!</p>';
        return;
    }
    let e = parseInt(eInput);
    console.log('Using public key e for encryption:', e);

    // Convert message to ASCII codes (RSA works with numbers, not text)
    const asciiCodes = Array.from(message).map(char => char.charCodeAt(0));
    console.log('Converted message to ASCII codes (so each character can be encrypted as a number):', asciiCodes);

    // Encrypt each ASCII code using RSA formula: c = m^e mod n
    const encrypted = asciiCodes.map(m => modPow(m, e, rsaKeys.n));
    console.log('Encrypted each ASCII code using RSA (c = m^e mod n):', encrypted);

    // Display result in the HTML (shows user what happened)
    document.getElementById('rsa-encrypt-result').innerHTML = `
        <p><strong>Original Message:</strong> ${message}</p>
        <p><strong>ASCII Codes:</strong> ${asciiCodes.join(', ')}</p>
        <p><strong>Encrypted:</strong> ${encrypted.join(', ')}</p>
        <p class="text-green-400">✓ Message encrypted successfully!</p>
    `;
    console.log('Displayed the result in the HTML for the user.');
}

function decryptRSA() {
    // Check if RSA keys are generated
    console.log('Checking if RSA keys are generated (needed for decryption)...');
    if (!rsaKeys.n) {
        document.getElementById('rsa-decrypt-result').innerHTML = '<p class="text-red-400">Please generate RSA keys first!</p>';
        return;
    }

    // Get the encrypted message from user input
    console.log('Getting encrypted message from input (should be a list of numbers)...');
    const input = document.getElementById('rsa-decrypt-message').value;
    if (!input) {
        document.getElementById('rsa-decrypt-result').innerHTML = '<p class="text-red-400">Please enter the encrypted numbers to decrypt!</p>';
        return;
    }

    // Require private key d from input
    let dInput = document.getElementById('rsa-decrypt-d').value;
    if (!dInput) {
        document.getElementById('rsa-decrypt-result').innerHTML = '<p class="text-red-400">Please enter the private key (d)!</p>';
        return;
    }
    let d = parseInt(dInput);
    console.log('Using private key d for decryption:', d);

    // Parse the input as an array of numbers (comma or space separated)
    const encryptedArr = input.split(/[,\s]+/).map(x => parseInt(x)).filter(x => !isNaN(x));
    console.log('Parsed encrypted input into array of numbers:', encryptedArr);

    if (encryptedArr.length === 0) {
        document.getElementById('rsa-decrypt-result').innerHTML = '<p class="text-red-400">Invalid input! Please enter numbers separated by commas or spaces.</p>';
        return;
    }

    // Decrypt each number using RSA formula: m = c^d mod n
    const decryptedCodes = encryptedArr.map(c => modPow(c, d, rsaKeys.n));
    console.log('Decrypted each number to ASCII code using RSA (m = c^d mod n):', decryptedCodes);

    // Convert ASCII codes back to string
    const decryptedMessage = String.fromCharCode(...decryptedCodes);
    console.log('Converted ASCII codes back to string:', decryptedMessage);

    // Display result in the HTML
    document.getElementById('rsa-decrypt-result').innerHTML = `
        <p><strong>Encrypted Input:</strong> ${encryptedArr.join(', ')}</p>
        <p><strong>Decrypted ASCII Codes:</strong> ${decryptedCodes.join(', ')}</p>
        <p><strong>Decrypted Message:</strong> ${decryptedMessage}</p>
        <p class="text-green-400">✓ Message decrypted successfully!</p>
    `;
    console.log('Displayed the result in the HTML for the user.');
}

// Caesar Cipher
// function caesarShift(text, shift, encrypt = true) {
//     if (!encrypt) shift = -shift;
//     return text.replace(/[a-zA-Z]/g, function(char) {
//         const start = char <= 'Z' ? 65 : 97;
//         return String.fromCharCode(((char.charCodeAt(0) - start + shift + 26) % 26) + start);
//     });
// }

// function updateShiftedAlphabet() {
//     const shift = parseInt(document.getElementById('caesar-shift').value) || 0;
//     const original = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     const shifted = original.split('').map(char => 
//         String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65)
//     ).join(' ');
//     document.getElementById('shifted-alphabet').textContent = `Shifted:  ${shifted}`;
// }

// function encryptCaesar() {
//     const message = document.getElementById('caesar-message').value;
//     const shift = parseInt(document.getElementById('caesar-shift').value) || 0;
    
//     if (!message.trim()) {
//         document.getElementById('caesar-result').value = 'Please enter a message to encrypt!';
//         return;
//     }

//     const encrypted = caesarShift(message, shift, true);
//     document.getElementById('caesar-result').value = encrypted;
//     updateShiftedAlphabet();
// }


//RSA text book






// Caesar Cipher Implementation
// Shift value of 3 (classic Caesar cipher)
// const SHIFT = 3;


function getShift() {
  const shift = parseInt(document.getElementById('caesar-shift').value);
  return (isNaN(shift) || shift < 0 || shift > 25) ? 3 : shift; // default fallback
}


// Wrapper functions for HTML buttons
function encryptCaesar() {
    // Get input from the message textarea
    const inputText = document.getElementById('caesar-message').value;
    const shift = getShift();
    const result = caesarEncrypt(inputText, shift);
    // Display result in the result textarea
    document.getElementById('caesar-result').value = result;
    // updateShiftedAlphabet(shift); // optional, if showing shifted alphabet
    console.log('Encrypting:', inputText, '-> Result:', result); // Debug line
}

function decryptCaesar() {
    // Get input from the message textarea
    const inputText = document.getElementById('caesar-message').value;
    const shift = getShift();
    const result = caesarDecrypt(inputText, shift);
    // Display result in the result textarea
    document.getElementById('caesar-result').value = result;
    //  updateShiftedAlphabet((26 - shift) % 26); // optional for visual
    console.log('Decrypting:', inputText, '-> Result:', result); // Debug line
}

// Function to encrypt text using Caesar cipher
function caesarEncrypt(text, shift) {
    // Convert entire text to uppercase first
    text = text.toUpperCase();
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        
        // Check if character is a letter
        if (char >= 'A' && char <= 'Z') {
            // Convert to number (A=0, B=1, ..., Z=25)
            let charCode = char.charCodeAt(0) - 'A'.charCodeAt(0);
            // Add shift and use modulo 26
            let shiftedCode = (charCode + shift) % 26;
            // Convert back to letter
            let encryptedChar = String.fromCharCode(shiftedCode + 'A'.charCodeAt(0));
            result += encryptedChar;
        }
        // If not a letter, keep original character
        else {
            result += char;
        }
    }
    
    return result;
}

// Function to decrypt text using Caesar cipher
function caesarDecrypt(text, shift) {
    // Convert entire text to uppercase first
    text = text.toUpperCase();
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        
        // Check if character is a letter
        if (char >= 'A' && char <= 'Z') {
            // Convert to number (A=0, B=1, ..., Z=25)
            let charCode = char.charCodeAt(0) - 'A'.charCodeAt(0);
            // Subtract shift and use modulo 26 (add 26 to handle negative numbers)
            let shiftedCode = (charCode - shift + 26) % 26;
            // Convert back to letter
            let decryptedChar = String.fromCharCode(shiftedCode + 'A'.charCodeAt(0));
            result += decryptedChar;
        }
        // If not a letter, keep original character
        else {
            result += char;
        }
    }
    
    return result;
}

// Scroll spy for navigation
window.addEventListener('scroll', function() {
    const sections = ['home', 'docs', 'rsa', 'shift-cipher', 'team'];
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                current = section;
            }
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-crypto-accent');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-crypto-accent');
        }
    });
});










/*
File: script.js
Description: Powers the interactive features of the cryptography website, 
including the real-time Caesar Cipher tool.
*/

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Menu Functionality ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // --- Caesar Cipher Tool Functionality ---

  // Get references to all the necessary HTML elements
  const caesarMessageInput = document.getElementById('caesar-message');
  const caesarShiftInput = document.getElementById('caesar-shift');
  const caesarResultOutput = document.getElementById('caesar-result');
  const shiftedAlphabetDisplay = document.getElementById('shifted-alphabet');

  const originalAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  /**
   * Updates the 'Alphabet Reference' box in real-time.
   * This function is called whenever the shift value changes.
   */
  const updateAlphabetReference = () => {
    // Sanitize the shift value to be an integer between 0 and 25
    let shift = parseInt(caesarShiftInput.value, 10);
    if (isNaN(shift)) {
      shift = 0;
    }
    shift = shift % 26; // Use modulo to handle numbers > 25

    // Generate the shifted alphabet string
    const shiftedAlphabet = originalAlphabet.slice(shift) + originalAlphabet.slice(0, shift);
    
    // Format for display with spaces
    const formattedShiftedAlphabet = shiftedAlphabet.split('').join(' ');

    // Update the HTML content
    shiftedAlphabetDisplay.innerHTML = `<strong>Shifted:</strong> ${formattedShiftedAlphabet}`;
  };

  /**
   * Core logic for the Caesar cipher shift operation.
   * @param {string} text - The input message.
   * @param {number} shift - The number of positions to shift.
   * @param {string} mode - 'encrypt' or 'decrypt'.
   * @returns {string} - The processed (encrypted or decrypted) text.
   */
  const processCaesarCipher = (text, shift, mode) => {
    if (mode === 'decrypt') {
      shift = (26 - shift) % 26;
    }

    let result = "";

    for (let i = 0; i < text.length; i++) {
      let char = text[i];

      // Process uppercase letters
      if (char >= 'A' && char <= 'Z') {
        let charCode = text.charCodeAt(i);
        let shiftedCode = ((charCode - 65 + shift) % 26) + 65;
        result += String.fromCharCode(shiftedCode);
      }
      // Process lowercase letters
      else if (char >= 'a' && char <= 'z') {
        let charCode = text.charCodeAt(i);
        let shiftedCode = ((charCode - 97 + shift) % 26) + 97;
        result += String.fromCharCode(shiftedCode);
      }
      // Keep non-alphabetic characters as they are
      else {
        result += char;
      }
    }
    return result;
  };

  // --- Global Functions for onclick Handlers ---

  // These functions need to be global to be accessible by the 'onclick' attributes in the HTML.
  window.encryptCaesar = () => {
    const message = caesarMessageInput.value;
    const shift = parseInt(caesarShiftInput.value, 10) % 26;
    caesarResultOutput.value = processCaesarCipher(message, shift, 'encrypt');
  };

  window.decryptCaesar = () => {
    const message = caesarMessageInput.value;
    const shift = parseInt(caesarShiftInput.value, 10) % 26;
    caesarResultOutput.value = processCaesarCipher(message, shift, 'decrypt');
  };

  // --- Event Listeners ---

  // Add an event listener to the shift input field to update the alphabet in real-time.
  // The 'input' event fires every time the value is changed.
  if (caesarShiftInput) {
    caesarShiftInput.addEventListener('input', updateAlphabetReference);
  }

  // Initial call to set the correct shifted alphabet when the page first loads.
  updateAlphabetReference();

  // Note: The RSA and Team section functionalities would be added here.
  // For now, this script fully covers the Caesar Cipher section.
});