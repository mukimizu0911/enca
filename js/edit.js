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
    getDocs
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
// イベント選択
// =========================

eventSelect.addEventListener("change", () => {

    loadSchedule();

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
                このイベントの予定はまだ登録されていません。
            </p>
        `;

        return;

    }

    const schedule = snapshot.docs[0];

    const data = schedule.data();

    const selectedEvent =
        events.find(event => event.id == data.eventId);

    let options = "";

    let [hour, minute] =
        selectedEvent.start.split(":").map(Number);

    const [endHour, endMinute] =
        selectedEvent.end.split(":").map(Number);

    while (
        hour < endHour ||
        (hour === endHour && minute <= endMinute)
    ) {

        const time =
            String(hour).padStart(2, "0") +
            ":" +
            String(minute).padStart(2, "0");

        options += `
            <option
                value="${time}"
                ${time === data.time ? "selected" : ""}
            >
                ${time}
            </option>
        `;

        minute += 30;

        if (minute >= 60) {

            minute = 0;
            hour++;

        }

    }

    options += `
        <option
            value="未定"
            ${data.time === "未定" ? "selected" : ""}
        >
            未定
        </option>
    `;

    scheduleArea.innerHTML = `
    <div class="schedule-card">

    <p><strong>現在の予定</strong></p>

    <h2 style="margin:15px 0;">
        🕒 ${data.time}
    </h2>

    <p style="margin-top:20px;">
        変更後
    </p>

    <select id="newTime">

        ${options}

    </select>

    <br><br>

    <button
        id="saveButton"
        class="btn">

        💾 保存

    </button>

</div>
`;

    // =========================
    // 更新
    // =========================

    document
        .getElementById("saveButton")
        .addEventListener("click", async () => {

            const newTime =
                document.getElementById("newTime").value;

            try {

                const {
                    updateDoc
                } = await import(
                    "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js"
                );

                await updateDoc(
                    schedule.ref,
                    {
                        time: newTime
                    }
                );

                showToast("🔄 予定を更新しました！");

                loadSchedule();

            }

            catch (error) {

                console.error(error);

                showToast("❌ 更新に失敗しました。");

            }

        });

}