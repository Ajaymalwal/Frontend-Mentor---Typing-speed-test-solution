// Test not started UI Elements
const mainContentc = document.querySelector('.main-content');

const Personal_Best = document.getElementById('personal-best');
let personalBestValue = 0;

const Main_Content = document.querySelector('.main-content');

const Test_Wpm = document.getElementById('test-wpm');
const Test_Accuracy = document.getElementById('test-accuracy');
const Test_Time = document.getElementById('test-time');

let testWpmValue = 0;
let testAccuracyValue = 0;
let testTimeValue = 60;

const Difficulty_Easy = document.getElementById('easy-btn');
const Difficulty_Medium = document.getElementById('medium-btn');
const Difficulty_Hard = document.getElementById('hard-btn');

let difficultyValue = 'easy';

const Mode_Timed = document.getElementById('timed-btn');
const Mode_Passage = document.getElementById('passage-btn');

let modeValue = 'timed';

const Test_Passage = document.getElementById('test-passage');
const Test_Passage_Text = document.getElementById('test-passage-text');

const Start_Test_Btn = document.getElementById('start-btn');
const Start_Test = document.querySelector('.start-test');

const Restart_Btn = document.getElementById('restart-btn');

// Reserve space for the WPM chart to avoid layout shifts when it's added later
const _controlsEl_placeholder = document.querySelector('.test-controls');
if (_controlsEl_placeholder) {
    const _placeholderCanvas = document.createElement('canvas');
    _placeholderCanvas.id = 'wpm-chart';
    _placeholderCanvas.width = 600;
    _placeholderCanvas.height = 160;
    _placeholderCanvas.style.width = '300px';
    _placeholderCanvas.style.height = '80px';
    // keep it invisible but occupying layout space to prevent shifts
    _placeholderCanvas.style.visibility = 'hidden';
    _controlsEl_placeholder.appendChild(_placeholderCanvas);
}


// Test completed UI Elements
const Test_Complete_Container = document.querySelector('.test-complete-container');
const Test_Complete_Text = document.querySelector('.test-complete-text');
const Test_Complete_Title = document.getElementById('test-complete-title');
const Test_Complete_Message = document.getElementById('test-complete-message');
const Test_Complete_Stats = document.querySelector('.test-complete-stats');
const Test_Score = document.querySelector('.test-score');

const Final_Wpm = document.getElementById('final-wpm');
const Final_Accuracy = document.getElementById('final-accuracy');
const Final_Characters = document.getElementById('final-characters');

let finalWpmValue = 0;
let finalAccuracyValue = 0;
let finalCharactersValue = 0;
let finalWrongCharactersValue = 0;

const Go_Again_Btn = document.getElementById('go-again-btn');

const Star_Pattern_1 = document.querySelector('.star-pattern-1');
const Star_Pattern_2 = document.querySelector('.star-pattern-2');
const Pattern_Confetti = document.querySelector('.confetti-pattern');

// Normalize common punctuation variations (smart quotes, dashes, ellipsis)
function normalizeChar(ch) {
    if (!ch) return '';
    const map = {
        '\u2018': "'", // left single quote
        '\u2019': "'", // right single quote / apostrophe
        '\u201C': '"', // left double quote
        '\u201D': '"', // right double quote
        '\u2013': '-', // en dash
        '\u2014': '-', // em dash
        '\u2026': '...', // ellipsis
        '\u00A0': ' ', // non-breaking space
        '\u2010': '-',
        '\u2011': '-',
    };
    const replaced = map[ch] || ch;
    return replaced.toLowerCase();
}


// Loading the test
let testData = null;
fetch('./data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    testData = data;
    console.log(data);
    // Use data here
  })
  .catch(error => console.error('Error fetching data:', error));   

// Function to start the test
function StartButtonHandler() {
    // Reset test values
    testWpmValue = 0;
    testAccuracyValue = 0;
    testTimeValue = 60;
    // Hide main content and show test passage
    Start_Test.style.display = 'none';
    Test_Passage.style.display = 'block';

    if (modeValue === 'timed') {
        Mode_Passage.classList.add('disabled-button');
        Mode_Passage.removeEventListener('click', () => chooseMode('passage'));
        Test_Time.textContent = testTimeValue;
    }

    if(modeValue === 'passage') {
        Mode_Timed.classList.add('disabled-button');
        Mode_Timed.removeEventListener('click', () => chooseMode('timed'));
        Test_Time.textContent = '∞';
    }

    if (difficultyValue === 'easy') {
        Difficulty_Medium.classList.add('disabled-button');
        Difficulty_Hard.classList.add('disabled-button');
        Difficulty_Medium.removeEventListener('click', () => chooseDifficulty('medium'));
        Difficulty_Hard.removeEventListener('click', () => chooseDifficulty('hard'));
        Test_Passage_Text.textContent = testData.easy[Math.floor(Math.random() * testData.easy.length)].text;
    }

    if (difficultyValue === 'medium') {
        Difficulty_Easy.classList.add('disabled-button');
        Difficulty_Hard.classList.add('disabled-button');
        Difficulty_Easy.removeEventListener('click', () => chooseDifficulty('easy'));
        Difficulty_Hard.removeEventListener('click', () => chooseDifficulty('hard'));
        Test_Passage_Text.textContent = testData.medium[Math.floor(Math.random() * testData.medium.length)].text;
    }

    if (difficultyValue === 'hard') {
        Difficulty_Easy.classList.add('disabled-button');
        Difficulty_Medium.classList.add('disabled-button');
        Difficulty_Easy.removeEventListener('click', () => chooseDifficulty('easy'));
        Difficulty_Medium.removeEventListener('click', () => chooseDifficulty('medium'));
        Test_Passage_Text.textContent = testData.hard[Math.floor(Math.random() * testData.hard.length)].text;
    }

    // Prepare passage and wire up typing behavior
    typingTestHandler();

}

 Start_Test.addEventListener('click', StartButtonHandler);

 function chooseDifficulty(difficulty) {
    difficultyValue = difficulty;
    Difficulty_Easy.classList.remove('active');
    Difficulty_Medium.classList.remove('active');
    Difficulty_Hard.classList.remove('active');
    document.getElementById(difficulty + '-btn').classList.add('active');
}

function chooseMode(mode) {
    modeValue = mode;
    Mode_Timed.classList.remove('active');
    Mode_Passage.classList.remove('active');
    document.getElementById(mode + '-btn').classList.add('active');
}

Difficulty_Easy.addEventListener('click', () => chooseDifficulty('easy'));
Difficulty_Medium.addEventListener('click', () => chooseDifficulty('medium'));
Difficulty_Hard.addEventListener('click', () => chooseDifficulty('hard'));

Mode_Timed.addEventListener('click', () => chooseMode('timed'));
Mode_Passage.addEventListener('click', () => chooseMode('passage'));


function typingTestHandler() {
    // Create one span per character without re-reading textContent while appending
    const text = Test_Passage_Text.textContent || '';
    Test_Passage_Text.textContent = '';
    const spans = [];
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        Test_Passage_Text.appendChild(span);
        spans.push(span);
    }

    // initial active caret
    let currentCharIndex = 0;
    if (spans.length > 0) spans[0].classList.add('active');

    let startedTyping = false;
    let counterInterval;
    let startTimestamp = null;

    // Charting variables
    let chartInterval = null;
    const wpmHistory = [];

    // stats
    let typedChars = 0;
    let correctChars = 0;

    // create chart canvas in the controls area (if not present)
    const controlsEl = document.querySelector('.test-controls');
    let canvas = document.getElementById('wpm-chart');
    if (!canvas && controlsEl) {
        canvas = document.createElement('canvas');
        canvas.id = 'wpm-chart';
        // logical size for crisp drawing
        canvas.width = 600;
        canvas.height = 160;
        canvas.style.width = '300px';
        canvas.style.height = '80px';
        controlsEl.appendChild(canvas);
    }
    const ctx = canvas ? canvas.getContext('2d') : null;
    if (canvas) canvas.style.visibility = 'visible';

    function computeAndUpdateStats() {
        const now = startTimestamp ? Date.now() : null;
        const minutesElapsed = startTimestamp ? Math.max((now - startTimestamp) / 60000, 1/60) : 0; // avoid div by zero
        const wpmRaw = minutesElapsed ? (correctChars / 5) / minutesElapsed : 0;
        const accuracy = typedChars ? (correctChars / typedChars) * 100 : 0;
        Test_Wpm.textContent = Math.round(wpmRaw);
        Test_Accuracy.textContent = Math.round(accuracy) + '%';
        return { wpm: wpmRaw, accuracy: accuracy };
    }

    function endTest() {
        clearInterval(counterInterval);
        if (chartInterval) {
            clearInterval(chartInterval);
            chartInterval = null;
        }
        document.removeEventListener('keydown', handleKeydown);
        const stats = computeAndUpdateStats();
        Final_Wpm.textContent = stats.wpm;
        Final_Accuracy.textContent = stats.accuracy + '%';
        Final_Characters.textContent = `${correctChars}/${spans.length}`;
        Test_Complete_Container.style.display = 'flex';
    }

    function decrementCounter() {
        if (testTimeValue > 0) {
            testTimeValue--;
            Test_Time.textContent = testTimeValue;
        } else {
            Test_Time.textContent = 'Done';
            endTest();
        }
    }

    function handleKeydown(e) {
        const key = e.key;
        // ignore non-printable/navigation keys
        if (key === 'Shift' || key === 'Alt' || key === 'Control' || key === 'Meta' || key === 'Tab' || key.startsWith('Arrow')) return;

        if (!startedTyping) {
            startedTyping = true;
            startTimestamp = Date.now();
            if (modeValue === 'timed') {
                Test_Time.textContent = testTimeValue;
                counterInterval = setInterval(decrementCounter, 1000);
            } else {
                Test_Time.textContent = '∞';
            }
            // start chart updates
            if (!chartInterval && ctx) {
                chartInterval = setInterval(() => {
                    const stats = computeAndUpdateStats();
                    // push raw value
                    wpmHistory.push(stats.wpm);
                    if (wpmHistory.length > 60) wpmHistory.shift();
                    // compute smoothed points for plotting (moving avg 3)
                    const smoothed = wpmHistory.map((_, i) => {
                        const start = Math.max(0, i - 2);
                        const slice = wpmHistory.slice(start, i + 1);
                        return slice.reduce((a, b) => a + b, 0) / slice.length;
                    });
                    // draw chart
                    const width = canvas.width;
                    const height = canvas.height;
                    ctx.clearRect(0, 0, width, height);
                    if (smoothed.length > 0) {
                        const maxVal = Math.max(...smoothed, 10);
                        const padding = 10;
                        const plotW = width - padding * 2;
                        const plotH = height - padding * 2;
                        const stepX = plotW / Math.max(smoothed.length - 1, 1);
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
                        ctx.lineWidth = 2;
                        for (let i = 0; i < smoothed.length; i++) {
                            const v = smoothed[i];
                            const x = padding + i * stepX;
                            const y = padding + (1 - v / maxVal) * plotH;
                            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                    }
                }, 1000);
            }
        }

        if (key === 'Backspace') {
            if (currentCharIndex > 0) {
                // remove active from current if exists
                if (spans[currentCharIndex]) spans[currentCharIndex].classList.remove('active');
                currentCharIndex--;
                const removedSpan = spans[currentCharIndex];
                if (removedSpan.classList.contains('correct')) {
                    correctChars--;
                    typedChars--;
                } else if (removedSpan.classList.contains('incorrect')) {
                    typedChars--;
                }
                removedSpan.classList.remove('correct', 'incorrect');
                removedSpan.classList.add('active');
                computeAndUpdateStats();
            }
            return;
        }

        // handle only single-character input
        if (key.length === 1) {
            if (currentCharIndex >= spans.length) return;
            const expected = spans[currentCharIndex].textContent;
            // case-insensitive + punctuation-normalized comparison
            const match = normalizeChar(key) === normalizeChar(expected);
            // remove active from this span before marking
            spans[currentCharIndex].classList.remove('active');
            if (match) {
                spans[currentCharIndex].classList.add('correct');
                correctChars++;
            } else {
                spans[currentCharIndex].classList.add('incorrect');
            }
            typedChars++;
            currentCharIndex++;
            // set active on next span
            if (currentCharIndex < spans.length) spans[currentCharIndex].classList.add('active');
            computeAndUpdateStats();

            // if finished the passage in passage mode, end test
            if (modeValue === 'passage' && currentCharIndex >= spans.length) {
                endTest();
            }
        }
    }

    document.addEventListener('keydown', handleKeydown);

}


