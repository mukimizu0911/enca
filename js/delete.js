import { auth, db } from "./firebase.js";
import { events } from "../data/events.js";
import { showToast } from "./toast.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


// =========================
// 要素取得
// =========================

const eventSelect = document.getElementById("event");
const scheduleArea = document.getElementById("scheduleArea");


// =========================
// イベント一覧表示
// =========================

events.forEach((event) => {

    const option = document.createElement("option");

    option.value = event.id;

    let text = `${event.title}〈${event.day}〉`;

    if (event.session) {

        text += `〈${event.session}〉`;

    }

    option.textContent = text;

    eventSelect.appendChild(option);

});


// =========================
// ログイン確認
// =========================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        location.href = "login.html";
        return;

    }

});


// =========================
// イベント変更
// =========================

eventSelect.addEventListener("change", () => {

    loadSchedule();

});


// =========================
// 自分の予定取得
// =========================

async function loadSchedule() {

    scheduleArea.innerHTML = "";

    const user = auth.currentUser;

    if (!user) return;

    const q = query(

        collection(db, "schedules"),

        where("uid", "==", user.uid),

        where("eventId", "==", Number(eventSelect.value))

    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        scheduleArea.innerHTML = `
            <p>
                このイベントの予定は登録されていません。
            </p>
        `;

        return;

    }

    const schedule = snapshot.docs[0];

    const data = schedule.data();

    scheduleArea.innerHTML = `
    <div class="schedule-card">

    <p><strong>現在の予定</strong></p>

    <h2 style="margin:20px 0;">
        🕒 ${data.time}
    </h2>

    <button
        id="deleteButton"
        class="btn back-btn">

        🗑 削除する

    </button>

</div>
`;

    // =========================
    // 削除
    // =========================

    document
        .getElementById("deleteButton")
        .addEventListener("click", async () => {

            const result = confirm(
                "この予定を削除しますか？"
            );

            if (!result) return;

            try {

                await deleteDoc(schedule.ref);

                showToast("🗑️ 予定を削除しました！");

                location.href = "view.html";

            }

            catch (error) {

                console.error(error);

                showToast("❌ 削除に失敗しました。");

            }

        });

}