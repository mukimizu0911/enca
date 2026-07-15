import { auth, db } from "./firebase.js";

import {
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { greetings } from "./greetings.js";



// =========================
// 今日の日付
// =========================

const today = new Date();

const week = ["日", "月", "火", "水", "木", "金", "土"];

const year = today.getFullYear();

const month = String(today.getMonth() + 1).padStart(2, "0");

const day = String(today.getDate()).padStart(2, "0");

document.getElementById("today").textContent =
`📅 ${year}/${month}/${day}（${week[today.getDay()]}）`;



// =========================
// ランダムコールレスポンス
// =========================

const randomGreeting =
greetings[Math.floor(Math.random() * greetings.length)];

const message =
document.getElementById("characterMessage");

message.textContent =
`${randomGreeting.icon} ${randomGreeting.message}`;

message.style.color =
randomGreeting.color;



// =========================
// ユーザー情報取得
// =========================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";

        return;

    }

    try {

        const docRef = doc(db, "users", user.uid);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            const data = docSnap.data();

            document.getElementById("welcomeUser").textContent =
                `👤 ${data.username} さん`;

        }

    } catch (error) {

        console.error(error);

    }

});



// =========================
// ログアウト
// =========================

const logoutButton =
document.getElementById("logout");

logoutButton.addEventListener("click", async (e) => {

    e.preventDefault();

    try {

        await signOut(auth);

        location.href = "login.html";

    } catch (error) {

        console.error(error);

        alert("ログアウトに失敗しました。");

    }

});