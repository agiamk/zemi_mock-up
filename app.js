// 汎用画面切替関数: 指定IDのスクリーンを active にし、ヘッダーのタイトルと戻るボタンを更新
function showScreen(screenId) {
    var screens = document.querySelectorAll('.screen');
    screens.forEach(function(s) { s.classList.toggle('active', s.id === screenId); });

    var target = document.getElementById(screenId);
    var titleEl = document.getElementById('globalTitle');
    var backBtn = document.getElementById('globalBackBtn');

    if (target && titleEl) {
        titleEl.textContent = target.dataset.title || titleEl.textContent;
    }

    if (backBtn) {
        backBtn.style.display = (screenId === 'menuScreen') ? 'none' : '';
    }
}

function showMenuScreen() { showScreen('menuScreen'); }
function showQuizScreen() { showScreen('quizScreen'); }
function showPostScreen() { showScreen('postScreen'); }
function showMapScreen() { showScreen('mapScreen'); setMapView('alert'); }

function setMapView(mode) {
    var alertView = document.getElementById('mapAlertView');
    var normalView = document.getElementById('mapNormalView');
    var alertBtn = document.getElementById('mapViewAlertBtn');
    var normalBtn = document.getElementById('mapViewNormalBtn');

    if (!alertView || !normalView) return;

    var showAlert = (mode === 'alert');
    alertView.style.display = showAlert ? '' : 'none';
    normalView.style.display = showAlert ? 'none' : '';

    alertBtn && alertBtn.classList.toggle('active', showAlert);
    normalBtn && normalBtn.classList.toggle('active', !showAlert);
}
