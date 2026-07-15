// =========================
// 背景画像一覧
// =========================

const backgrounds = [];

for (let i = 1; i <= 30; i++) {

    backgrounds.push(
        `img/backgrounds/encaphoto/aqours${i}.JPG`
    );

}
// =========================
// スマホ判定
// =========================

const isMobile = window.matchMedia("(max-width: 768px)").matches;



// =========================
// 要素取得
// =========================

const bg1 = document.getElementById("background1");

const bg2 = document.getElementById("background2");



// =========================
// 初期設定
// =========================

// 前回表示していた画像番号を取得
const savedIndex =
    sessionStorage.getItem("backgroundIndex");

let current =
    savedIndex !== null
        ? Number(savedIndex)
        : 0;

let showingFirst = true;



// =========================
// 初期背景
// =========================

if (isMobile) {

    bg1.style.backgroundImage =
        'url("img/back.JPG")';

    bg1.classList.add("active");

}

else {

    bg1.style.backgroundImage =
        `url("${backgrounds[current]}")`;

    bg1.classList.add("active");

}



// =========================
// 背景切り替え
// =========================

function changeBackground() {

    current++;

    if (current >= backgrounds.length) {

        current = 0;

    }

    // 現在の画像番号を保存
    sessionStorage.setItem(
        "backgroundIndex",
        current
    );

    const nextImage =
        `url("${backgrounds[current]}")`;



    if (showingFirst) {

        bg2.style.backgroundImage = nextImage;
                bg2.classList.add("active");

        bg1.classList.remove("active");

    }

    else {

        bg1.style.backgroundImage = nextImage;

        bg1.classList.add("active");

        bg2.classList.remove("active");

    }

    showingFirst = !showingFirst;

}



// =========================
// PCだけスライドショー
// =========================

if (!isMobile) {

    setInterval(changeBackground, 7000);

}