const wordElement = document.querySelector('.word');
const goButton = document.getElementById('goButton');
const nextButton = document.getElementById('nextButton');
const customButton = document.getElementById('customButton');
const customInputContainer = document.getElementById('customInputContainer');
const customInput = document.getElementById('customInput');
const tickButton = document.getElementById('tickButton');
const lessonsButton = document.getElementById('lessonsButton');
const toggleCButton = document.getElementById('toggleCButton');
const toggleFCButton = document.getElementById('toggleFCButton');

const words = ['ship', 'sharp', 'shut', 'cash', 'shall', 'fish', 'shelf', 'shot', 'shut', 'wish', 'shed', 'hush'];

let dragging = false;
let highlightedLetter = null;
let colorChangeEnabled = true;
let colorHighlightEnabled = true;
let currentWordIndex = 0;

const letterCombos = [
    { combo: 'sh', color: 'red' },
    { combo: 'th', color: 'green' },
    { combo: 'ch', color: 'blue' },
    { combo: 'oul', color: 'purple' },
    { combo: 'oa', color: 'orange' },
    { combo: 'ea', color: 'brown' },
    { combo: 'ee', color: 'pink' },
    { combo: 'ou', color: '#006a6a' },
    { combo: 'igh', color: 'magenta' },
    { combo: 'wh', color: '#FFAE42' }
];

wordElement.addEventListener('mousedown', handleMouseDown);
document.body.addEventListener('mousemove', handleMouseMove);
document.body.addEventListener('mouseup', handleMouseUp);
wordElement.addEventListener('touchstart', handleTouchStart);
document.body.addEventListener('touchmove', handleTouchMove);
document.body.addEventListener('touchend', handleTouchEnd);
goButton.addEventListener('click', handleGo);
nextButton.addEventListener('click', handleNext);
customButton.addEventListener('click', handleCustom);
tickButton.addEventListener('click', handleTick);
lessonsButton.addEventListener('click', handleLessons);
toggleCButton.addEventListener('click', handleToggleC);
toggleFCButton.addEventListener('click', handleToggleFC);

function handleMouseDown(event) {
    if (event.buttons === 1) {
        dragging = true;
        handleMouseMove(event);
    }
}

function handleMouseMove(event) {
    if (dragging && colorChangeEnabled) {
        const x = event.clientX;
        const y = event.clientY;
        updateLetterColors(x, y);
    }
}

function handleMouseUp() {
    dragging = false;
    resetLetterColors();
}

function handleTouchStart(event) {
    dragging = true;
    handleTouchMove(event);
}

function handleTouchMove(event) {
    if (dragging && colorChangeEnabled) {
        const x = event.touches[0].clientX;
        const y = event.touches[0].clientY;
        updateLetterColors(x, y);
    }
}

function handleTouchEnd() {
    dragging = false;
    resetLetterColors();
}

function updateLetterColors(x, y) {
    if (!colorChangeEnabled) return;

    const letters = Array.from(wordElement.querySelectorAll('span'));
    letters.forEach((letter, index) => {
        const rect = letter.getBoundingClientRect();
        const midX = (rect.left + rect.right) / 2;
        const midY = (rect.top + rect.bottom) / 2;
        const diffX = Math.abs(midX - x);
        const diffY = Math.abs(midY - y);
        const shouldChangeColor = diffX < 50 && diffY < 120;

        if (shouldChangeColor) {
            for (const { combo } of letterCombos) {
                for (let startIndex = Math.max(0, index - combo.length + 1); startIndex <= index; startIndex++) {
                    if (startIndex + combo.length <= letters.length) {
                        const comboSpans = letters.slice(startIndex, startIndex + combo.length);
                        const comboText = comboSpans.map(span => span.textContent.toLowerCase()).join('');
                        
                        if (comboText === combo.toLowerCase() && comboSpans.every((span, i, array) => 
                            i === 0 || span.previousSibling === array[i - 1])) {
                            comboSpans.forEach(span => span.style.color = '#bf6347');
                            return;
                        }
                    }
                }
            }
            letter.style.color = '#bf6347';
        }
    });
}

function resetLetterColors() {
    if (colorHighlightEnabled) {
        highlightLetterCombos();
    } else {
        const letters = Array.from(wordElement.querySelectorAll('span'));
        letters.forEach(letter => letter.style.color = 'black');
    }
}

function handleGo() {
    displayWord(words[currentWordIndex]);
    goButton.style.display = 'none';
    nextButton.style.display = 'inline-block';
    customButton.style.display = 'inline-block';
    toggleCButton.style.display = 'inline-block';
    toggleFCButton.style.display = 'inline-block';
}

function handleNext() {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    displayWord(words[currentWordIndex]);
    customInputContainer.style.display = 'none';
    customInput.value = '';
}

function handleCustom() {
    wordElement.innerHTML = '';
    customInputContainer.style.display = 'flex';
    customInput.focus();
}

function handleTick() {
    const customText = customInput.value.trim();
    if (customText.length > 0) {
        displayWord(customText);
        customInputContainer.style.display = 'none';
        customInput.value = '';
    } else {
        customInputContainer.style.display = 'none';
    }
    toggleCButton.style.display = 'inline-block';
    toggleFCButton.style.display = 'inline-block';
}

function handleLessons() {
    window.location.href = 'lessons.html';
}

function handleToggleC() {
    colorChangeEnabled = !colorChangeEnabled;
    toggleCButton.classList.toggle('greyed', !colorChangeEnabled);
}

function handleToggleFC() {
    colorHighlightEnabled = !colorHighlightEnabled;
    toggleFCButton.classList.toggle('greyed', !colorHighlightEnabled);
    displayWord(wordElement.textContent);
}

function displayWord(word) {
    wordElement.innerHTML = '';
    for (let char of word) {
        if (char === ' ') {
            wordElement.appendChild(document.createTextNode(' '));
        } else {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.fontFamily = 'Lexend, sans-serif';
            wordElement.appendChild(span);
        }
    }
    resetLetterColors();
}

function highlightLetterCombos() {
    const letters = Array.from(wordElement.querySelectorAll('span'));
    letters.forEach(letter => letter.style.color = 'black');
    
    for (let i = 0; i < letters.length; i++) {
        for (const { combo, color } of letterCombos) {
            if (i + combo.length <= letters.length) {
                const comboSpans = letters.slice(i, i + combo.length);
                const comboText = comboSpans.map(span => span.textContent.toLowerCase()).join('');
                
                if (comboText === combo.toLowerCase() && comboSpans.every((span, index, array) => 
                    index === 0 || span.previousSibling === array[index - 1])) {
                    comboSpans.forEach(span => span.style.color = color);
                }
            }
        }
    }
}
