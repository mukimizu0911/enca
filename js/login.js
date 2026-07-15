import { auth } from "./firebase.js";
import { showToast } from "./toast.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const userId = document.getElementById("userId").value.trim();

    const password = document.getElementById("password").value;

    // 8桁チェック
    if (!/^\d{8}$/.test(userId)) {

        showToast("⚠️ ユーザーIDは8桁の数字で入力してください。");

        return;

    }

    // Firebase用メールアドレス
    const email = `${userId}@enca.local`;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        showToast("🎉 ログインしました！");

        setTimeout(() => {

            location.href = "dashboard.html";

        }, 2000);

    } catch (error) {

        console.error(error);

        showToast("❌ ユーザーIDまたはパスワードが違います。");

    }

});