// ゲームの各要素をHTMLから選択
const startPage = document.querySelector('#ty-start-page');
const typingGame = document.querySelector('#ty-game');
const titleTime = document.querySelector('#ty-title-time');
const timer = document.querySelector('#ty-timer');
const timeSelectEl = document.querySelector('.ty-time-select');
const typing = document.querySelector('#typing');
const backToStart = document.querySelector('#ty-back-to-start');
const resultContainer = document.querySelector('#ty-result-container');
const textArea = document.querySelector('#ty-textarea');
const quote = document.querySelector('#ty-quote');
const quoteAuthor = document.querySelector('#ty-author-name');
const LPM = document.querySelector('#ty-LPM');
const quoteReview = document.querySelector('#ty-quote-review');

// 初期のタイムリミットを30秒と設定
let timelimit = 30;
let remainingTime;  // ゲーム内での残り時間を格納
let isActive = false; // ゲームスタート待機状態か確認するフラグ
let isPlaying = false; // ゲーム中か確認するフラグ
let intervalId = null; // ゲームのカウントダウンタイマーのID
let quotes;            // APIから取得した引用を格納
let typedCount = 0;    // 正しくタイプされた文字数
let LPMCount;          // 1分あたりの打鍵数

// タイムリミットの選択ボックスの値が変わったときの処理
timeSelectEl.addEventListener('change', () => {
    timelimit = timeSelectEl.value; // 選択された時間を更新
})

// Enterキーを押したときのゲーム開始処理
window.addEventListener('keypress', (e) => {
    isActive = typing.classList.contains('active');
    if (e.key === 'Enter' && isActive && !isPlaying) {
        start();
        isActive = false;
        isPlaying = true;
    }
})

// ゲームを開始する関数
const start = async () => {
    startPage.classList.remove('show');  // スタートページを非表示
    typingGame.classList.add('show');    // ゲーム画面を表示
    titleTime.textContent = timelimit;   // 選択された時間を画面に表示
    remainingTime = timelimit;           // 残り時間を設定
    timer.textContent = remainingTime;   // 残り時間を画面に表示

    await fetchAndRenderQuotes();  // 引用を取得して画面に表示
    textArea.disabled = false;     // テキストエリアを有効に
    textArea.focus();              // テキストエリアにフォーカスを移動
    typedCount = 0;                // タイプ数を初期化

    // 1秒ごとに残り時間を減らして、0になったら結果を表示
    intervalId = setInterval(() => {
        remainingTime -= 1;
        timer.textContent = remainingTime;
        if (remainingTime <= 0) {
            showResult();
        }
    }, 1000);
}

// ゲーム画面からスタート画面に戻る
backToStart.addEventListener('click', () => {
    typingGame.classList.remove('show');
    startPage.classList.add('show');
    resultContainer.classList.remove('show');
    isPlaying = false; // ゲーム終了状態に設定
})

// 結果を表示する関数
const showResult = () => {
    textArea.disabled = true;     // テキストエリアを無効に
    clearInterval(intervalId);    // タイマーを停止

    // 分あたりの打鍵数を計算
    LPMCount = remainingTime === 0 
        ? Math.floor(typedCount * 60 / timelimit) 
        : Math.floor(typedCount * 60 / (timelimit - remainingTime));
    LPM.textContent = LPMCount;   // 打鍵数を表示

    // 結果としての引用を表示
    quoteReview.innerHTML = `${quotes.quote} <br>--- ${quotes.author} ---`;
    
    // 打鍵数をカウントアップアニメーションで表示
    let count = 0;
    setTimeout(() => {
        resultContainer.classList.add('show');
        const countup = setInterval(() => {
            LPM.textContent = count;
            count += 1;
            if (count >= LPMCount) {
                clearInterval(countup);
            }
        }, 20);
    }, 1000);
}

// APIからランダムな引用を取得して表示する関数
const fetchAndRenderQuotes = async () => {
    quote.innerHTML = '';
    textArea.value = '';
    const RANDOM_QUOTE_API = 'https://api.quotable.io/random';
    const response = await fetch(RANDOM_QUOTE_API);
    const data = await response.json();

    quotes = { quote: data.content, author: data.author };

    quotes.quote.split('').forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter;
        quote.appendChild(span);
    });
    quoteAuthor.textContent = quotes.author;  // 著者の名前を表示
}
fetchAndRenderQuotes()

// テキストエリアでの入力を監視する関数
textArea.addEventListener('input', () => {
    let inputArray = textArea.value.split('')
    let spans = quote.querySelectorAll('span')
    spans.forEach(span => {
        span.className = ''
    })

    typedCount = 0

    inputArray.forEach((letter, index) => {
        if(letter === spans[index].textContent) {
            spans[index].classList.add('correct')
            if(spans[index].textContent !== ' ') {
                typedCount += 1
            }
        } else {
            spans[index].classList.add('wrong')
            if(spans[index].textContent === ' ') {
                spans[index].classList.add('bar')
            }
        }
    })
    if(spans.length === inputArray.length && [...spans].every(span => span.classList.contains('correct'))) {
        showResult()
    }
})