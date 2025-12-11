// ===============================================
// 画面切り替え関数
// ===============================================

/**
 * 画面を切り替える関数
 * @param {string} screenId - 切り替え先の画面ID（例: 'menuScreen', 'mapScreen'）
 */
function showScreen(screenId) {
    // 1. すべての画面を非表示にして、指定された画面だけ表示する
    var allScreens = document.querySelectorAll('.screen');
    allScreens.forEach(function(screen) {
        screen.classList.toggle('active', screen.id === screenId);
    });

    // 2. ページのタイトルを変更する
    var targetScreen = document.getElementById(screenId);
    var titleElement = document.getElementById('globalTitle');
    if (targetScreen && titleElement) {
        titleElement.textContent = targetScreen.dataset.title || titleElement.textContent;
    }

    // 3. 戻るボタンの表示/非表示を切り替える（メニュー画面では非表示）
    var backButton = document.getElementById('globalBackBtn');
    if (backButton) {
        backButton.style.display = (screenId === 'menuScreen') ? 'none' : '';
    }
}

/**
 * マップビューを切り替える関数（危険アラート / 通常表示）
 * @param {string} mode - 表示モード（'alert' または 'normal'）
 */
function setMapView(mode) {
    // 1. HTMLから要素を取得する
    var alertMapElement = document.getElementById('mapAlertView');
    var normalMapElement = document.getElementById('mapNormalView');
    var alertButtonElement = document.getElementById('mapViewAlertBtn');
    var normalButtonElement = document.getElementById('mapViewNormalBtn');

    // 2. 要素が存在しない場合は処理を中断
    if (!alertMapElement || !normalMapElement) return;

    // 3. モードに応じて表示/非表示を切り替える
    var isAlertMode = (mode === 'alert');
    alertMapElement.style.display = isAlertMode ? '' : 'none';
    normalMapElement.style.display = isAlertMode ? 'none' : '';

    // 4. ボタンのアクティブ状態を更新する（選択中のボタンをハイライト）
    if (alertButtonElement) alertButtonElement.classList.toggle('active', isAlertMode);
    if (normalButtonElement) normalButtonElement.classList.toggle('active', !isAlertMode);
}

// ===============================================
// ページ読み込み完了時の処理
// ===============================================

/**
 * ページ読み込み完了後、すべてのクリックイベントを設定する
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // 【1】メニューカードのクリック時の処理
    var menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(function(card) {
        card.addEventListener('click', function() {
            // クリックされたカードから移動先の画面IDを取得
            var targetScreenId = this.dataset.screen;
            // 追加の関数を実行する場合の関数名を取得
            var callbackFunctionName = this.dataset.callback;
            
            // 画面を切り替える
            showScreen(targetScreenId);
            
            // 必要に応じて追加の関数を実行する（例: マップの初期状態設定）
            if (callbackFunctionName && typeof window[callbackFunctionName] === 'function') {
                window[callbackFunctionName]('alert');
            }
        });
    });

    // 【2】マップビューボタンのクリック時の処理
    var mapViewButtons = document.querySelectorAll('[data-view]');
    mapViewButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // ボタンの data-view 属性からモードを取得
            var viewMode = this.dataset.view;
            // マップの表示モードを切り替える
            setMapView(viewMode);
        });
    });

    // 【3】戻るボタンのクリック時の処理
    var backButton = document.getElementById('globalBackBtn');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // メニュー画面に戻る
            showScreen('menuScreen');
        });
    }
});
