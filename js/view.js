import { db } from "./firebase.js";
import { events } from "../data/events.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// =========================
// 要素取得
// =========================

const eventSelect = document.getElementById("event");
const scheduleList = document.getElementById("scheduleList");

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
// イベント変更
// =========================

eventSelect.addEventListener("change", loadSchedules);

// =========================
// Firestore取得
// =========================

async function loadSchedules() {

    scheduleList.innerHTML = "";

    if (eventSelect.value === "") {

        scheduleList.innerHTML =
            "<p class='emptyMessage'>イベントを選択してください。</p>";

        return;

    }

    const selectedEvent =
        events.find(event => event.id == eventSelect.value);

    try {

        const snapshot =
            await getDocs(collection(db, "schedules"));

        let schedules = [];

        snapshot.forEach((doc) => {

            const data = doc.data();

            if (Number(data.eventId) === Number(eventSelect.value)) {

                schedules.push(data);

            }

        });

        if (schedules.length === 0) {

            scheduleList.innerHTML =
                "<p class='emptyMessage'>まだ予定は登録されていません。</p>";

            return;

        }

        // ↓↓↓ この続きは次で貼る ↓↓↓
                // =========================
        // 時間順に並べる
        // =========================

        schedules.sort((a, b) => {

            if (a.time === "未定") return 1;
            if (b.time === "未定") return -1;

            return a.time.localeCompare(b.time);

        });

        // =========================
        // 時間ごとにまとめる
        // =========================

        const groupedSchedules = {};

        schedules.forEach((schedule) => {

            if (!groupedSchedules[schedule.time]) {

                groupedSchedules[schedule.time] = [];

            }

            groupedSchedules[schedule.time].push(schedule);

        });

        // =========================
        // イベント名表示
        // =========================

        const title = document.createElement("h2");

        title.className = "event-title";

        title.textContent =
            `📍 ${selectedEvent.title} ${selectedEvent.day}`;

        scheduleList.appendChild(title);

        // =========================
        // 時間ごとに表示
        // =========================

        Object.keys(groupedSchedules).forEach((time) => {

            const card = document.createElement("div");

            card.className = "schedule-card";

            const timeTitle = document.createElement("h3");

            timeTitle.className = "schedule-time";

            timeTitle.textContent = `🕒 ${time}`;

            card.appendChild(timeTitle);

            groupedSchedules[time].forEach((person) => {

                const user = document.createElement("p");

                user.className = "schedule-user";

                user.textContent = `👤 ${person.username}`;

                card.appendChild(user);

            });

            scheduleList.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        scheduleList.innerHTML =
            "<p class='emptyMessage'>予定の取得に失敗しました。</p>";

    }

}