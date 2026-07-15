import { showToast } from "./toast.js";
// =========================
// 登録情報取得
// =========================

const userId = sessionStorage.getItem("newUserId");
const username = sessionStorage.getItem("newUsername");

// データがない場合
if (!userId || !username) {

    location.href = "register.html";

}

// 表示
document.getElementById("userId").textContent = userId;
document.getElementById("username").textContent =
`👤 ${username} さん`;



// =========================
// コピー
// =========================

const copyButton = document.getElementById("copyButton");

copyButton.addEventListener("click", async () => {

    try {

        await navigator.clipboard.writeText(userId);

        showToast("📋 IDをコピーしました！");

        copyButton.textContent = "✅ コピーしました！";
        copyButton.style.background = "#28a745";

        setTimeout(() => {

            copyButton.textContent = "📋 IDをコピー";
            copyButton.style.background = "#00a8ff";

        }, 3000);

    } catch (error) {

        showToast("❌　コピーに失敗しました。");

    }

});