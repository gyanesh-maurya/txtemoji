// Create multiple emoji options for each byte value (0-255)
const emojiOptions = Array.from({length: 256}, (_, byte) => {
    // Create 5 different emoji options for each byte value
    return [
        String.fromCodePoint(0x1F300 + byte), // First option
        String.fromCodePoint(0x1F400 + byte), // Second option
        String.fromCodePoint(0x1F500 + byte), // Third option
        String.fromCodePoint(0x1F600 + byte), // Fourth option
        String.fromCodePoint(0x1F700 + byte)  // Fifth option
    ].filter(emoji => {
        // Filter out any invalid emojis that might result from out-of-range code points
        try {
            return /\p{Emoji}/u.test(emoji);
        } catch {
            return false;
        }
    });
});

// Create a reverse mapping from emoji to byte value
const emojiToByte = {};
emojiOptions.forEach((options, byte) => {
    options.forEach(emoji => {
        emojiToByte[emoji] = byte;
    });
});

function encrypt() {
    const input = document.getElementById('input').value;
    if (!input.trim()) {
        showTooltip("Please enter text to encrypt");
        return;
    }
    const encrypted = encryptText(input);
    document.getElementById('output').value = encrypted;
    document.querySelector('.output-container').style.display = 'block';
    showTooltip("Text encrypted successfully!");
}

function decrypt() {
    const input = document.getElementById('input').value;
    if (!input.trim()) {
        showTooltip("Please enter emojis to decrypt");
        return;
    }
    const decrypted = decryptEmoji(input);
    document.getElementById('output').value = decrypted;
    if (decrypted === "Decryption failed - invalid input") {
        showTooltip("Decryption failed - invalid emoji input");
    } else {
        document.querySelector('.output-container').style.display = 'block';
        showTooltip("Text decrypted successfully!");
    }
}

function encryptText(text) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    return Array.from(bytes, byte => {
        const options = emojiOptions[byte];
        if (!options || options.length === 0) {
            // Fallback if no emoji options exist for this byte
            return String.fromCodePoint(0x1F300 + byte);
        }
        // Randomly select one of the emoji options
        return options[Math.floor(Math.random() * options.length)];
    }).join('');
}

function decryptEmoji(emojiStr) {
    const decoder = new TextDecoder();
    const bytes = new Uint8Array(
        Array.from(emojiStr, emoji => {
            const byte = emojiToByte[emoji];
            return byte !== undefined ? byte : 0;
        }).filter(e => e !== 0)
    );
    try {
        return decoder.decode(bytes);
    } catch (e) {
        return "Decryption failed - invalid input";
    }
}

function copyOutput() {
    const output = document.getElementById('output');
    if (!output.value.trim()) {
        showTooltip("Nothing to copy");
        return;
    }
    output.select();
    navigator.clipboard.writeText(output.value).then(() => {
        showTooltip('Copied to clipboard!');
    }).catch(err => {
        showTooltip('Failed to copy');
    });
}

function showTooltip(message) {
    const tooltip = document.getElementById('tooltip');
    tooltip.textContent = message;
    tooltip.classList.add('show');
    setTimeout(() => {
        tooltip.classList.remove('show');
    }, 2000);
}

// Add floating emoji background
const emojis = ['🔒', '🔑', '💻', '🔐', '🖥️', '🎨'];
document.addEventListener('DOMContentLoaded', () => {
    for(let i = 0; i < 50; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.animationDelay = `${Math.random() * 5}s`;
        emoji.style.fontSize = `${Math.random() * 20 + 10}px`;
        document.body.appendChild(emoji);
    }
});