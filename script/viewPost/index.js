"use strict";

const showModal = () => {
  const pinns = document.querySelectorAll(".postItem__pin");

  pinns.forEach(pinNode => {
    pinNode.addEventListener("click", (e) => {
      e.preventDefault();

      const detail = pinNode.closest(".postItem");
      // クリックした要素以外は閉じる
      dismissModal(detail);
      // マスクを付与
      document.querySelector("#body").classList.add("mask");
      detail.setAttribute("open", "");
    });
  });
};


showModal();


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