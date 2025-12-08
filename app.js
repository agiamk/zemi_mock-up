function showMenuScreen() {
    document.getElementById('menuScreen').classList.add('active');
    document.getElementById('quizScreen') && document.getElementById('quizScreen').classList.remove('active');
    document.getElementById('postScreen') && document.getElementById('postScreen').classList.remove('active');
    document.getElementById('mapScreen') && document.getElementById('mapScreen').classList.remove('active');
}

function showQuizScreen() {
    document.getElementById('menuScreen').classList.remove('active');
    document.getElementById('quizScreen').classList.add('active');
    document.getElementById('postScreen') && document.getElementById('postScreen').classList.remove('active');
    document.getElementById('mapScreen') && document.getElementById('mapScreen').classList.remove('active');
}

function showPostScreen() {
    document.getElementById('menuScreen').classList.remove('active');
    document.getElementById('quizScreen') && document.getElementById('quizScreen').classList.remove('active');
    document.getElementById('postScreen').classList.add('active');
    document.getElementById('mapScreen') && document.getElementById('mapScreen').classList.remove('active');
}

function showMapScreen() {
    document.getElementById('menuScreen').classList.remove('active');
    document.getElementById('quizScreen') && document.getElementById('quizScreen').classList.remove('active');
    document.getElementById('postScreen') && document.getElementById('postScreen').classList.remove('active');
    document.getElementById('mapScreen') && document.getElementById('mapScreen').classList.add('active');
    setMapView('alert');
}

function setMapView(mode) {
    var alertView = document.getElementById('mapAlertView');
    var normalView = document.getElementById('mapNormalView');
    var alertBtn = document.getElementById('mapViewAlertBtn');
    var normalBtn = document.getElementById('mapViewNormalBtn');

    if (!alertView || !normalView) return;

    if (mode === 'alert') {
        alertView.style.display = '';
        normalView.style.display = 'none';
        alertBtn && alertBtn.classList.add('active');
        normalBtn && normalBtn.classList.remove('active');
    } else {
        alertView.style.display = 'none';
        normalView.style.display = '';
        alertBtn && alertBtn.classList.remove('active');
        normalBtn && normalBtn.classList.add('active');
    }
}
