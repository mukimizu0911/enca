import { auth, db } from "./firebase.js";
import { events } from "../data/events.js";
import { showToast } from "./toast.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";



// =========================
// 要素取得
// =========================

const eventSelect = document.getElementById("event");
const timeSelect = document.getElementById("time");
const addForm = document.getElementById("addForm");



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
// 時間一覧表示
// =========================

eventSelect.addEventListener("change", () => {

    timeSelect.innerHTML = "";

    const firstOption = document.createElement("option");

    firstOption.value = "";
    firstOption.textContent = "選択してください";

    timeSelect.appendChild(firstOption);

    const selectedEvent =
        events.find(event => event.id == eventSelect.value);

    if (!selectedEvent) return;

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

        const option = document.createElement("option");

        option.value = time;
        option.textContent = time;

        timeSelect.appendChild(option);

        minute += 30;

        if (minute >= 60) {

            minute = 0;
            hour++;

        }

    }

    const undecided = document.createElement("option");

    undecided.value = "未定";
    undecided.textContent = "未定";

    timeSelect.appendChild(undecided);

});



// =========================
// 登録
// =========================

addForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {

        showToast("❌ ログインしてください。");

        setTimeout(() => {

            location.href = "login.html";

        }, 2000);

        return;

    }

    try {

        // ユーザー情報取得
        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            showToast("❌ ユーザー情報が見つかりません。");

            return;

        }

        const userData = userSnap.data();

        // イベント取得
        const selectedEvent =
            events.find(event => event.id == eventSelect.value);

        // =========================
        // 同じイベントの予定を検索
        // =========================

        const q = query(

            collection(db, "schedules"),

            where("uid", "==", user.uid),

            where("eventId", "==", selectedEvent.id)

        );

        const snapshot = await getDocs(q);

        // =========================
        // 既に登録済みなら更新
        // =========================

        if (!snapshot.empty) {

            const scheduleDoc = snapshot.docs[0];

            await updateDoc(scheduleDoc.ref, {

                time: timeSelect.value

            });

            showToast("🔄 予定を更新しました！");

        }

        // =========================
        // 初めてなら新規登録
        // =========================

        else {

            await addDoc(collection(db, "schedules"), {

                uid: user.uid,

                userId: userData.userId,

                username: userData.username,

                eventId: selectedEvent.id,

                eventTitle: selectedEvent.title,

                eventDay: selectedEvent.day,

                eventDate: selectedEvent.date,

                session: selectedEvent.session,

                time: timeSelect.value,

                createdAt: serverTimestamp()

            });

            showToast("✅ 予定を登録しました！");

        }

        setTimeout(() => {

            location.href = "view.html";

        }, 2000);

    }

    catch (error) {

        console.error(error);

        showToast("❌ 登録に失敗しました。");

    }

});