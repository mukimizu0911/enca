// =========================
// 要素取得
// =========================

const bg1 = document.getElementById("background1");
const bg2 = document.getElementById("background2");

// =========================
// スマホ判定
// =========================

const isMobile = window.matchMedia("(max-width: 768px)").matches;

// =========================
// スマホは固定背景
// =========================

if (isMobile) {

    bg1.style.backgroundImage = 'url("img/back.JPG")';
    bg1.classList.add("active");

}

// =========================
// PCだけスライドショー
// =========================

else {

    const backgrounds = [];

    for (let i = 1; i <= 30; i++) {

        backgrounds.push(
            `img/backgrounds/encaphoto/aqours${i}.JPG`
        );

    }

    const savedIndex =
        sessionStorage.getItem("backgroundIndex");

    let current =
        savedIndex !== null
            ? Number(savedIndex)
            : 0;

    let showingFirst = true;

    bg1.style.backgroundImage =
        `url("${backgrounds[current]}")`;

    bg1.classList.add("active");

    function changeBackground() {

        current++;

        if (current >= backgrounds.length) {

            current = 0;

        }

        sessionStorage.setItem(
            "backgroundIndex",
            current
        );

        const nextImage =
            `url("${backgrounds[current]}")`;

        if (showingFirst) {

            bg2.style.backgroundImage = nextImage;            bg2.classList.add("active");

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
    // 7秒ごとに切り替え
    // =========================

    setInterval(changeBackground, 7000);

}