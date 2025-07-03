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
    
    // Find e (commonly 65537 or 3)
    let e = 65537;
    if (gcd(e, phi) !== 1) {
        e = 3;
        if (gcd(e, phi) !== 1) {
            for (let i = 3; i < phi; i += 2) {
                if (gcd(i, phi) === 1) {
                    e = i;
                    break;
                }
            }
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
            <p><strong>n (modulus):</strong> ${n}</p>
            <p><strong>φ(n):</strong> ${phi}</p>
            <p><strong>Public Key (e):</strong> ${e}</p>
            <p><strong>Private Key (d):</strong> ${d}</p>
            <p class="text-green-400 mt-4">✓ RSA Keys Generated Successfully!</p>
        </div>
    `;
}

function encryptRSA() {
    if (!rsaKeys.n) {
        document.getElementById('rsa-result').innerHTML = '<p class="text-red-400">Please generate RSA keys first!</p>';
        return;
    }

    const message = parseInt(document.getElementById('rsa-message').value);
    if (isNaN(message) || message >= rsaKeys.n) {
        document.getElementById('rsa-result').innerHTML = '<p class="text-red-400">Message must be a number less than n!</p>';
        return;
    }

    const encrypted = modPow(message, rsaKeys.e, rsaKeys.n);
    document.getElementById('rsa-result').innerHTML = `
        <p><strong>Original Message:</strong> ${message}</p>
        <p><strong>Encrypted:</strong> ${encrypted}</p>
        <p class="text-green-400">✓ Message encrypted successfully!</p>
    `;
}

function decryptRSA() {
    if (!rsaKeys.n) {
        document.getElementById('rsa-result').innerHTML = '<p class="text-red-400">Please generate RSA keys first!</p>';
        return;
    }

    const message = parseInt(document.getElementById('rsa-message').value);
    if (isNaN(message)) {
        document.getElementById('rsa-result').innerHTML = '<p class="text-red-400">Please enter a valid number!</p>';
        return;
    }

    const decrypted = modPow(message, rsaKeys.d, rsaKeys.n);
    document.getElementById('rsa-result').innerHTML = `
        <p><strong>Encrypted Message:</strong> ${message}</p>
        <p><strong>Decrypted:</strong> ${decrypted}</p>
        <p class="text-green-400">✓ Message decrypted successfully!</p>
    `;
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