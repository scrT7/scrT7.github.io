let beat = 1;
const totalBeats = 12;
let interval = 500; // Initial interval in milliseconds (500ms = 120 beats per minute)
let intervalId;
let currentPattern;
let volume = 0.1; // Initial volume (10%)
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

if (audioCtx.state === 'suspended') {
    audioCtx.resume();
}

const patterns = {
    buleria: [0, 3, 6, 8, 10], // Bulería strong beats
    solea: [2, 5, 7, 9, 11], // Soleá strong beats
    thirdFour: [0, 3, 6, 9, 12], // 1/3 Pattern strong beats
    twoFour: [0, 2, 4, 6, 8,10 , 12],
    fourFour: [0,  4, 8, 12]
};

function createBeatButtons() {
    const container = document.getElementById('beatButtonsContainer');
    container.innerHTML = '';
    for (let i = 0; i < totalBeats; i++) {
        const button = document.createElement('div');
        button.classList.add('beat-button');
        container.appendChild(button);
    }
}

function createStrongPatternButtons(pattern) {
    const container = document.getElementById('strongPatternContainer');
    container.innerHTML = '';
    for (let i = 0; i < totalBeats; i++) {
        const button = document.createElement('div');
        button.classList.add('beat-button');
        if (patterns[pattern].includes(i)) {
            button.classList.add('strong-pattern');
        }
        container.appendChild(button);
    }
}

function updateBeatButtons(currentBeat, pattern) {
    const buttons = document.querySelectorAll('.beat-button');
    buttons.forEach((button, index) => {
        button.classList.remove('active-strong', 'active-weak');
        if (index === currentBeat) {
            if (patterns[pattern].includes(index)) {
                button.classList.add('active-strong');
            } else {
                button.classList.add('active-weak');
            }
        }
    });
}

function startMetronome(pattern) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    currentPattern = pattern;
    beat = 1;
    document.getElementById('beatCount').textContent = 'Beats: ' + beat;
    document.getElementById('currentPattern').textContent = 'Current Pattern: ' + pattern.charAt(0).toUpperCase() + pattern.slice(1);
    createBeatButtons();
    createStrongPatternButtons(pattern);
    updateBeatButtons(beat - 1, pattern);
    clearInterval(intervalId); // Clear any existing interval
    intervalId = setInterval(() => {
        document.getElementById('beatCount').textContent = 'Beats: ' + beat;
        updateBeatButtons(beat - 1, pattern);
        playBeep(beat - 1, pattern); // Adjust index for stronger beats
        beat++;
        if (beat > totalBeats) {
            beat = 1; // Reset beat count for the next loop
        }
    }, interval);
}

function stopMetronome() {
    clearInterval(intervalId); // Stop the metronome
    document.getElementById('currentPattern').textContent = 'Current Pattern: None';
    document.getElementById('beatCount').textContent = 'Beats: 0';
    // Reset all beat buttons to default color
    const buttons = document.querySelectorAll('.beat-button');
    buttons.forEach((button) => {
        button.classList.remove('active-strong', 'active-weak');
    });
    // Reset strong pattern buttons below "Current Pattern"
    const strongPatternButtons = document.querySelectorAll('.strong-pattern');
    strongPatternButtons.forEach((button) => {
        button.classList.remove('strong-pattern');
    });
}

function playBeep(currentBeat, pattern) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    if (patterns[pattern].includes(currentBeat)) {
        oscillator.frequency.setValueAtTime(1500, audioCtx.currentTime); // Strong beat frequency
        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime); // Adjusted volume
    } else {
        oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime); // Regular beat frequency
        gainNode.gain.setValueAtTime(volume * 0.5, audioCtx.currentTime); // Adjusted volume
    }

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1); // Beep duration
}

function updateTempo(value) {
    interval = parseInt(value, 10);
    const bpm = Math.round(60000 / interval);
    document.getElementById('tempoValue').textContent = `${bpm} BPM`;
    if (intervalId) {
        clearInterval(intervalId); // Restart metronome if already running
        startMetronome(currentPattern);
    }
}

function updateVolume(value) {
    volume = parseFloat(value);
    document.getElementById('volumeValue').textContent = `${Math.round(volume * 100)}%`;
}

function changeColor(button) {
    // Get all buttons with class 'color-button'
    const buttons = document.querySelectorAll('.color-button');
    
    // Remove 'active' class from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));

    // Add 'active' class to the clicked button
    button.classList.add('active');
}



// Initialize beat buttons on page load
createBeatButtons();


