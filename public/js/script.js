const phrase = $('.frase').text();
const phraseWords = phrase.match(/[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]+/g);
const timerStart = 30;

const $testArea = $('#test-area');
const $buttonReset = $('#button-reset-game');
const $showStats = $('#show-stats');
const $timeCount = $('#time-count');

// When page up
$(() => {
    setTestTextAreaOnFocus();
    sentenceStats();
    resetGame();
});

function sentenceStats () {
    const phraseWordsCount = phraseWords.length;
    $('#sentence-size-count').text(phraseWordsCount);
}

function markUser (text) {
    const visual = [text.toLowerCase()];
    for (let index in phraseWords) {
        const wordFromExpectedSentence = phraseWords[index];
        const remaining = visual[visual.length - 1];
        const searchIndex = remaining.search(wordFromExpectedSentence.toLowerCase());
        
        if (searchIndex != -1) {
            visual.pop();
            const leftSpace = remaining.slice(0, searchIndex);
            const word = remaining.slice(searchIndex, searchIndex + wordFromExpectedSentence.length);
            const rightSpace = remaining.slice(searchIndex + wordFromExpectedSentence.length, remaining.length);
            visual.push(leftSpace);
            const conditionLeft = ((leftSpace[0] || '').match(/[\s,\.?!]/g) || index == 0)
            const conditionRight = ((rightSpace[0] || '').match(/[\s,\.?!]/g) || !rightSpace)
            if (conditionLeft && conditionRight) {
                visual.push(`<mark class="right-word">${word}</mark>`);
            } else {
                visual.push(`<mark class="wrong-word">${word}</mark>`);
            }
            visual.push(rightSpace);
        }
    }
    const visualString = visual.join('');
    $showStats.html(visualString);
}

$testArea.on("input", function () {
    const text = $testArea.val();
    const textSplitted = text.match(/[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]+/g)
    
    const caracterCount = text.length;
    $('#caracter-count').text(caracterCount);

    const wordCount = $('#show-stats mark').length;
    $('#word-count').text(wordCount);

    markUser(text);
});

function resetGame () {
    $timeCount.text(timerStart);
    $testArea.val('');
    $testArea.attr('disabled', false);
    $testArea.toggleClass('test-area-disabled');
    $('#caracter-count').text(0);
    $('#word-count').text(0);
}

function whenGameStarts () {
    $testArea.val('');
    $testArea.toggleClass('test-area-disabled');
}

function setTestTextAreaOnFocus () {
    $testArea.one('focus', () => {
        whenGameStarts();
        let time = timerStart;

        const intervalID = setInterval(() => {
            time -= .01;
            // time is over ⤵
            if (time <= 0) {
                clearInterval(intervalID);
                $testArea.attr('disabled', true);
            }
            $timeCount.text(time <= 0 ? 0 : time.toFixed(2));
        }, 10)

        $testArea.on('paste', key => {
            $testArea.attr('disabled', true);
            clearInterval(intervalID);
            resetGame();
            setTestTextAreaOnFocus();
        })

        $buttonReset.one('click', () => {
            clearInterval(intervalID);
            resetGame();
            setTestTextAreaOnFocus();
        })
    })
}