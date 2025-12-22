"use strict";

// イベント委譲でピンのクリックをハンドル（動的追加にも対応）
const initPinDelegation = () => {
  const media = document.querySelector('#body');
  if (!media) return;
  media.addEventListener('click', (e) => {
    const pin = e.target.closest('.postItem__pin');
    if (!pin) return;
    e.preventDefault();
    const detail = pin.closest('.postItem');
    dismissModal(detail);
    media.classList.add('mask');
    detail.setAttribute('open', '');
  });
};

initPinDelegation();

// 投稿フォームから新しい投稿を作成して表示領域に追加
const initPostForm = () => {
  const submitBtn = document.querySelector('#postScreen .btn-submit');
  if (!submitBtn) return;
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const tag = document.querySelector('#select')?.value || '';
    const title = document.querySelector('#text-title')?.value || '（無題）';
    const textarea = document.querySelector('#textarea')?.value || '';
    const fileInput = document.querySelector('#file-thumbnail');
    let imgSrc = '';
    if (fileInput && fileInput.files && fileInput.files[0]) {
      imgSrc = URL.createObjectURL(fileInput.files[0]);
    }

    const media = document.querySelector('#body');
    if (!media) return;

    const detail = document.createElement('details');
    detail.className = 'postItem';

    const summary = document.createElement('summary');
    summary.className = 'postItem__pin';
    summary.textContent = '掲示板投稿の位置情報';

    const content = document.createElement('div');
    content.className = 'postItem__content';

    if (tag) {
      const tagEl = document.createElement('span');
      tagEl.className = 'post-tag';
      tagEl.textContent = tag;
      content.appendChild(tagEl);
    }

    if (imgSrc) {
      const img = document.createElement('img');
      img.className = 'post-thumbnail';
      img.src = imgSrc;
      img.alt = '投稿のサムネイル';
      content.appendChild(img);
    }

    const h3 = document.createElement('h3');
    h3.textContent = title;
    const p = document.createElement('p');
    p.textContent = textarea;
    content.appendChild(h3);
    content.appendChild(p);

    detail.appendChild(summary);
    detail.appendChild(content);
    media.appendChild(detail);

    // フォームをリセット
    document.querySelector('#select').selectedIndex = 0;
    document.querySelector('#text-title').value = '';
    document.querySelector('#textarea').value = '';
    if (fileInput) fileInput.value = '';

    // 生成したピンを自動で開く
    dismissModal(detail);
    media.classList.add('mask');
    detail.setAttribute('open', '');
  });
};

initPostForm();


const toggleMaskBody = () => {
  const body = document.querySelector("#body");
  body.classList.toggle("mask")
}

const dismissModal = (currentDetail = null) => {
  // 一旦すべて閉じる（オプションで例外を指定可能）
  const allDetails = document.querySelectorAll(".postItem[open]");
  allDetails.forEach(detail => {
    if (detail !== currentDetail) {
      detail.removeAttribute("open");
    }
  });
}

// ボディの空白部分をクリックしたらモーダルを閉じる
const body = document.querySelector("#body");
if (body) {
  body.addEventListener("click", (e) => {
    // ポスト内部をクリックした場合は閉じない
    if (!e.target.closest(".postItem")) {
      dismissModal();
      body.classList.remove("mask");
    }
  });
}