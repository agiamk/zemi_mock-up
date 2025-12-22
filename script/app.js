// 画面切り替え: 指定画面を表示、タイトル・戻るボタンを更新
function showScreen(screenId) {
  const allScreens = document.querySelectorAll(".screen");
  console.log(allScreens);
  allScreens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === screenId);
  });

  const targetScreen = document.querySelector(`#${screenId}`);
  const titleElement = document.querySelector("#globalTitle");
  if (targetScreen && titleElement) {
    titleElement.textContent =
      targetScreen.dataset.title || titleElement.textContent;
  }

  const backButton = document.querySelector("#globalBackBtn");
  if (backButton) {
    backButton.style.display = screenId === "menuScreen" ? "none" : "";
  }
}

// マップビュー切り替え: アラート / 通常表示
function setMapView(mode) {
  const alertMap = document.querySelector("#mapAlertView");
  const normalMap = document.querySelector("#mapNormalView");
  const alertBtn = document.querySelector("#mapViewAlertBtn");
  const normalBtn = document.querySelector("#mapViewNormalBtn");

  if (!alertMap || !normalMap || !alertBtn || !normalBtn) return;

  const isAlert = mode === "alert";
  alertMap.style.display = isAlert ? "" : "none";
  normalMap.style.display = isAlert ? "none" : "";
  alertBtn.classList.toggle("active", isAlert);
  normalBtn.classList.toggle("active", !isAlert);
}

// イベント登録
document.addEventListener("DOMContentLoaded", () => {
  const menuCards = document.querySelectorAll(".menu-card");
  const quizCards = document.querySelectorAll(".quiz-selection-card");
  const mapButtons = document.querySelectorAll("[data-view]");
  const backBtn = document.querySelector("#globalBackBtn");

  menuCards.forEach((card) => {
    card.addEventListener("click", () => {
      showScreen(card.dataset.screen);
      const cb = card.dataset.callback;
      if (cb && typeof window[cb] === "function") window[cb]("alert");
    });
  });

  // signal のみ遷移
  quizCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (card.dataset.quizType === "signal") {
        showScreen("quizQuestionScreen");
        Quiz.load("signal");
      }
    });
  });

  if (typeof Quiz !== 'undefined' && Quiz.init) Quiz.init();
  mapButtons.forEach((btn) => btn.addEventListener("click", () => setMapView(btn.dataset.view)));
  if (backBtn) backBtn.addEventListener("click", () => showScreen("menuScreen"));
});

  // Quiz モジュール: 状態管理 + UI レンダリング
  const Quiz = (function () {
    const QUIZ_DATA = {
      signal: {
        title: "信号のルール",
        questions: [
          {
            text: "信号が青の時に、自転車は進むことができますか？",
            image: "https://placehold.co/300x150/f0f0f0/999?text=NO%20IMAGE",
            options: [
              { text: "いつでも進める", correct: false },
              { text: "周りの安全を確認した後、進める", correct: true },
              { text: "進めない", correct: false },
              { text: "押して渡る", correct: false }
            ],
            explanation:
              "信号が青でも、交差点に突っ込む自動車がないか確認が必要です。"
          },
          {
            text: "赤信号の時、横断歩道を渡ることはできますか？",
            image: "https://placehold.co/300x150/f0f0f0/999?text=NO%20IMAGE",
            options: [
              { text: "できる", correct: false },
              { text: "できない", correct: true },
              { text: "急いでいれば渡れる", correct: false },
              { text: "夜間なら渡れる", correct: false }
            ],
            explanation: "赤信号は絶対に渡ってはいけません。危険です。"
          },
          {
            text: "信号機のない交差点では、自転車はどうすべきですか？",
            image: "https://placehold.co/300x150/f0f0f0/999?text=NO%20IMAGE",
            options: [
              { text: "自由に通行できる", correct: false },
              { text: "周囲をよく確認して渡る", correct: true },
              { text: "必ず止まる", correct: false },
              { text: "大声を出して通行する", correct: false }
            ],
            explanation: "信号がない交差点でも、周囲の確認は最優先です。"
          }
        ]
      }
    };

    let state = { type: null, quiz: null, current: 0, selected: null };
    const els = {
      qText: null,
      qImg: null,
      progressFill: null,
      progressText: null,
      answers: null,
      nextBtn: null,
      expl: null,
      explText: null
    };

    function init() {
      els.qText = document.querySelector('.question-text p');
      els.qImg = document.querySelector('.question-image img');
      els.progressFill = document.querySelector('.progress-fill');
      els.progressText = document.querySelector('.progress-text');
      els.answers = document.querySelector('.answer-options');
      els.nextBtn = document.querySelector('#quizNextBtn');
      els.expl = document.querySelector('.explanation');
      els.explText = document.querySelector('.explanation-text');
      if (els.nextBtn) els.nextBtn.addEventListener('click', next);
    }

    function load(quizType) {
      const q = QUIZ_DATA[quizType];
      if (!q) return;
      state.type = quizType;
      state.quiz = q;
      state.current = 0;
      state.selected = null;
      const titleEl = document.querySelector("#globalTitle");
      if (titleEl) titleEl.textContent = q.title;
      render(0);
    }

    function render(index) {
      if (!state.quiz) return;
      const question = state.quiz.questions[index];
      if (!question) return;
      const qText = els.qText || document.querySelector(".question-text p");
      const qImg = els.qImg || document.querySelector(".question-image img");
      if (qText) qText.textContent = question.text;
      if (qImg && question.image) qImg.src = question.image;
      const progressFill = els.progressFill || document.querySelector(".progress-fill");
      const progressText = els.progressText || document.querySelector(".progress-text");
      const total = state.quiz.questions.length;
      if (progressFill) progressFill.style.width = ((index + 1) / total) * 100 + "%";
      if (progressText) progressText.textContent = `問題${index + 1}/${total}`;
      const answers = els.answers || document.querySelector(".answer-options");
      if (!answers) return;
      answers.innerHTML = "";
      question.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "answer-option";
        btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + i)}</span><span class="option-text">${opt.text}</span>`;
        btn.addEventListener("click", () => handle(i, opt.correct, btn));
        answers.appendChild(btn);
      });
      state.current = index;
      state.selected = null;
      const nextBtn = els.nextBtn || document.querySelector('#quizNextBtn');
      if (nextBtn) nextBtn.disabled = true;
      const expl = els.expl || document.querySelector('.explanation');
      const explText = els.explText || document.querySelector('.explanation-text');
      if (explText) explText.textContent = '';
      if (expl) expl.style.display = 'none';
    }

    function handle(index, correct, btn) {
      const container = els.answers || document.querySelector(".answer-options");
      if (!container) return;
      container.querySelectorAll(".answer-option").forEach((b) => {
        b.classList.remove("selected", "correct", "incorrect");
      });
      btn.classList.add("selected");
      if (correct) btn.classList.add("correct");
      else btn.classList.add("incorrect");
      state.selected = index;
      const nextBtn = els.nextBtn || document.querySelector('#quizNextBtn');
      if (nextBtn) nextBtn.disabled = false;
      const expl = els.expl || document.querySelector('.explanation');
      const explText = els.explText || document.querySelector('.explanation-text');
      const question = state.quiz.questions[state.current];
      if (question && explText) explText.textContent = question.explanation || '';
      if (expl) expl.style.display = 'block';
      const optionButtons = (els.answers || document.querySelector('.answer-options')).querySelectorAll('.answer-option');
      optionButtons.forEach((b, idx) => {
        const opt = question.options[idx];
        if (opt && opt.correct) b.classList.add('correct');
      });
    }

    function next() {
      if (state.selected === null) return;
      const nextIndex = state.current + 1;
      if (!state.quiz) return;
      if (nextIndex < state.quiz.questions.length) {
        render(nextIndex);
      } else {
        showScreen('quizScreen');
      }
    }

    return { init, load, render, handle, next };
  })();
