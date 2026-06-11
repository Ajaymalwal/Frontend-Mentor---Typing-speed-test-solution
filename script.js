//Responsive Design
const Mobile_Select_Btn = document.querySelectorAll('.select-btn');
const Mobile_Select_Menu = document.querySelectorAll('.select-menu');
const Mobile_Select_Value = document.querySelectorAll('.select-btn-value');

Mobile_Select_Btn.forEach(btn => {
    btn.addEventListener('click', () => {
        const menu = btn.nextElementSibling;
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !btn.nextElementSibling.contains(e.target)) {
            btn.nextElementSibling.style.display = 'none';
        }
    });
});

Mobile_Select_Menu.forEach(menu => {
    menu.addEventListener('click', (e) => {
        if (e.target.tagName === 'LABEL') {
            const radio = e.target.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                // Trigger the same logic as desktop selection
                const value = radio.value;
                if (value === 'easy' || value === 'medium' || value === 'hard') {
                    Mobile_Select_Value[0].textContent = e.target.textContent; // Update button text to selected difficulty
                    chooseDifficulty(value);

                } else if (value === 'timed' || value === 'passage') {
                    chooseMode(value);
                        Mobile_Select_Value[1].textContent = e.target.textContent; // Update button text to selected mode
                }

            }
        }
    });
});

// Test not started UI Elements

const Personal_Best = document.getElementById('personal-best');
const Personal_Best_Mobile = document.getElementById('personal-best-mobile');

// Load personal best from localStorage if available

let personalBestValue = Number(localStorage.getItem('personalBest')) || 0;
Personal_Best.textContent = personalBestValue ? Math.round(personalBestValue) : '0';
Personal_Best_Mobile.textContent = personalBestValue ? Math.round(personalBestValue) : '0';

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
const Restart_Container = document.querySelector('.restart');

// Test completed UI Elements
const Test_Complete_Container = document.querySelector('.test-complete-container');
const Test_Complete_Text = document.querySelector('.test-complete-text');
const Test_Complete_Title = document.getElementById('test-complete-title');
const Test_Complete_Message = document.getElementById('test-complete-message');
const Test_Complete_Stats = document.querySelector('.test-complete-stats');
const Test_Score = document.querySelector('.test-score');
const Test_Complete_Icon = document.getElementById('test-complete-icon');

const Final_Wpm = document.getElementById('final-wpm');
const Final_Accuracy = document.getElementById('final-accuracy');
const Final_Correct_Chars = document.getElementById('final-correct-chars');
const Final_Wrong_Chars = document.getElementById('final-wrong-chars');

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
function loadTestData() {
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
}
loadTestData(); 

// Function to start the test
function StartButtonHandler() {
    // Reset test values
    testWpmValue = 0;
    testAccuracyValue = 0;
    testTimeValue = 60;
    // Hide main content and show test passage
    Start_Test.style.display = 'none';
    Test_Passage.style.display = 'block';
    Restart_Container.style.display = 'flex';

    if (modeValue === 'timed') {
        Mode_Passage.classList.add('disabled-button');
        Mode_Passage.removeEventListener('click', () => chooseMode('passage'));
        Test_Time.textContent = testTimeValue+'s';
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

    // create chart canvas in the controls area 
    //This is an Update in future version, currently disabled to focus on core functionality and avoid potential performance issues on lower-end devices. Will re-enable once optimized.
   /* const controlsEl = document.querySelector('.test-controls');
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
*/
    function computeAndUpdateStats() {
        const now = startTimestamp ? Date.now() : null;
        const minutesElapsed = startTimestamp ? Math.max((now - startTimestamp) / 60000, 1/60) : 0; // avoid div by zero
        const wpmRaw = minutesElapsed ? (correctChars / 5) / minutesElapsed : 0;
        const accuracy = typedChars ? Math.min(100, (correctChars / typedChars) * 100) : 0;
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
        Final_Wpm.textContent = Math.round(stats.wpm);
        Final_Accuracy.textContent = Math.round(stats.accuracy) + '%';
        Test_Time.textContent = 'Done';
        Final_Correct_Chars.textContent = correctChars;
        Final_Wrong_Chars.textContent = spans.length - correctChars;
        Test_Complete_Container.style.display = 'flex';
        Restart_Container.style.display = 'none';
        Main_Content.style.display = 'none';
        
        // show confetti if new personal best
         if (personalBestValue !== 0 &&stats.wpm > personalBestValue) {
            Test_Complete_Icon.src = './assets/images/icon-new-pb.svg';
            Test_Complete_Title.textContent = 'High Score Smashed!';
            Test_Complete_Message.textContent = 'You are getting faster! That was incredible typing.';
            Pattern_Confetti.style.display = 'block';
         }

         // update personal best if needed
         if(personalBestValue === 0 ) {
            Test_Complete_Title.textContent = 'Baseline Established!';
            Test_Complete_Message.textContent = 'You have set the bar. Now real challenge begins-time to beat it.';
            Pattern_Confetti.style.display = 'none';
         }
         if (stats.wpm > personalBestValue) {
            personalBestValue = stats.wpm;
            Personal_Best.textContent = Math.round(personalBestValue);
            Personal_Best_Mobile.textContent = Math.round(personalBestValue);
            localStorage.setItem('personalBest', personalBestValue);
        }

        //Update the test complete stats value color based on performance
        if (stats.wpm >= 60) {
            Final_Wpm.style.color = '#4CAF50'; // green for excellent  
        } else if (stats.wpm >= 40) {
            Final_Wpm.style.color = '#FFC107'; // amber for good
        } else {
            Final_Wpm.style.color = '#F44336'; // red for needs improvement
        }

        if(stats.accuracy >= 95) {
            Final_Accuracy.style.color = '#4CAF50'; // green for excellent
        } else if (stats.accuracy >= 80) {
            Final_Accuracy.style.color = '#FFC107'; // amber for good
        } else {
            Final_Accuracy.style.color = '#F44336'; // red for needs improvement
        }

        Final_Correct_Chars.style.color = '#4CAF50'; // green for correct chars
        Final_Wrong_Chars.style.color = '#F44336'; // red for wrong chars
    }

    function decrementCounter() {
        if (testTimeValue > 0) {
            testTimeValue--;
            Test_Time.textContent = testTimeValue+'s';
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
                Test_Time.textContent = testTimeValue+'s';
                counterInterval = setInterval(decrementCounter, 1000);
            } else {
                Test_Time.textContent = '∞';
            }
            // start chart updates
            /* Chart is for future version, currently disabled to focus on core functionality and avoid potential performance issues on lower-end devices. Will re-enable once optimized.
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
            */
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

            // if finished the passage (either mode), end test
            if (currentCharIndex >= spans.length) {
                endTest();
            }
        }
    }

    document.addEventListener('keydown', handleKeydown);

}

function resetTest() {
    // Reset all values and UI elements to initial state
    testWpmValue = 0;
    testAccuracyValue = 0;
    testTimeValue = 60;
    finalWpmValue = 0;
    finalAccuracyValue = 0;
    finalCharactersValue = 0;
    finalWrongCharactersValue = 0; 
    Test_Wpm.textContent = '0';
    Test_Accuracy.textContent = '0%';
    Test_Time.textContent = '60s';
    Test_Passage.style.display = '';
    Start_Test.style.display = 'flex';
    Test_Complete_Container.style.display = 'none';
    // re-enable difficulty and mode buttons
    Difficulty_Easy.classList.remove('disabled-button');
    Difficulty_Medium.classList.remove('disabled-button');
    Difficulty_Hard.classList.remove('disabled-button');
    Mode_Timed.classList.remove('disabled-button');
    Mode_Passage.classList.remove('disabled-button');
    // re-attach event listeners for difficulty and mode buttons
    Difficulty_Easy.addEventListener('click', () => chooseDifficulty('easy'));
    Difficulty_Medium.addEventListener('click', () => chooseDifficulty('medium'));
    Difficulty_Hard.addEventListener('click', () => chooseDifficulty('hard'));
    Mode_Timed.addEventListener('click', () => chooseMode('timed'));
    Mode_Passage.addEventListener('click', () => chooseMode('passage'));
    // clear passage text
    Main_Content.style.display = 'flex';
    Test_Passage_Text.textContent = 'Click the text and start typing to begin the test. You can also select a difficulty level and mode before starting.';
    Restart_Container.style.display = 'none';
    
}

Restart_Btn.addEventListener('click', resetTest);
Go_Again_Btn.addEventListener('click', resetTest);




