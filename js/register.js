import { auth, db } from "./firebase.js";
import { showToast } from "./toast.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    doc,
    setDoc,
    runTransaction
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // ユーザー名チェック
    if (username === "") {
        showToast("ユーザー名を入力してください。");
        return;
    }

    // パスワード確認
    if (password !== confirmPassword) {
        showToast("パスワードが一致しません。");
        return;
    }

    // 半角英数字チェック
    const regex = /^[A-Za-z0-9]+$/;

    if (!regex.test(password)) {
        showToast("パスワードは半角英数字のみ使用できます。");
        return;
    }

    try {

        // =========================
        // ユーザーID採番
        // =========================

        const counterRef = doc(db, "counters", "userCounter");

        const userId = await runTransaction(db, async (transaction) => {

            const counterDoc = await transaction.get(counterRef);

            if (!counterDoc.exists()) {
                throw new Error("カウンターが存在しません");
            }

            const nextId = counterDoc.data().currentId + 1;

            transaction.update(counterRef, {
                currentId: nextId
            });

            return String(nextId).padStart(8, "0");

        });

        // =========================
        // メールアドレス作成
        // =========================

        const email = `${userId}@enca.local`;

        // =========================
        // Authentication登録
        // =========================

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const uid = userCredential.user.uid;

        // =========================
        // Firestore保存
        // =========================

        await setDoc(doc(db, "users", uid), {

            userId: userId,

            username: username,

            email: email,

            createdAt: new Date()

        });

        // =========================
        // 完了画面へ渡す
        // =========================

        sessionStorage.setItem("newUserId", userId);

        sessionStorage.setItem("newUsername", username);

        // =========================
        // 登録完了画面へ
        // =========================

        location.href = "register-success.html";

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});