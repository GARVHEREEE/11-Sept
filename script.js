/* =========================================================
   11 SEPTEMBER — FINAL SCRIPT
   Everything is wired to the current HTML.
========================================================= */

"use strict";

/* -------------------------
   SETTINGS
------------------------- */

const UNLOCK_TIME =
    new Date("2026-09-11T01:30:00Z").getTime();

const CORRECT_USERNAME = "nxzz_swastika";
const CORRECT_PASSWORD = "babyyyaalupilu";

const MUSIC_PATH = "assets/music/aankhon-se-batana.mp3";
const VIDEO_PATH = "assets/video/video.mp4";

/* -------------------------
   HELPERS
------------------------- */

const $ = (id) => document.getElementById(id);

function showLogin() {
    $("lock-screen").classList.remove("active");
    $("login-screen").classList.add("active");
}

function showSite() {
    $("lock-screen").classList.remove("active");
    $("login-screen").classList.remove("active");
    $("birthday-site").classList.add("active");
}

function showTab(id) {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
    });

    const target = $(id);

    if (target) {
        target.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

/* =========================================================
   1. COUNTDOWN
   Real timer is ALWAYS shown.
   Secret laptop bypass: Ctrl + Shift + B
========================================================= */

function updateCountdown() {
    const remaining = UNLOCK_TIME - Date.now();

    if (remaining <= 0) {
        $("days").textContent = "00";
        $("hours").textContent = "00";
        $("minutes").textContent = "00";
        $("seconds").textContent = "00";
        showLogin();
        return;
    }

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining / 3600000) % 24);
    const minutes = Math.floor((remaining / 60000) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    $("days").textContent = String(days).padStart(2, "0");
    $("hours").textContent = String(hours).padStart(2, "0");
    $("minutes").textContent = String(minutes).padStart(2, "0");
    $("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* Secret laptop bypass — no visible button */
document.addEventListener("keydown", event => {
    if (
        event.ctrlKey &&
        event.shiftKey &&
        event.key.toLowerCase() === "b"
    ) {
        event.preventDefault();
        showLogin();
    }
});

/* =========================================================
   2. LOGIN + MUSIC
========================================================= */

const music = $("background-music");

function startMusic() {
    if (!music) return;

    music.volume = 0.45;
    music.loop = true;

    const promise = music.play();

    if (promise) {
        promise.catch(() => {});
    }
}

$("login-form").addEventListener("submit", event => {
    event.preventDefault();

    const username = $("username").value.trim();
    const password = $("password").value;

    if (
        username === CORRECT_USERNAME &&
        password === CORRECT_PASSWORD
    ) {
        $("login-error").textContent = "";

        showSite();
        showTab("tab-1");
        startMusic();
    } else {
        $("login-error").textContent =
            "Wrong username or password. Try again. 👀";

        $("password").value = "";
    }
});

document.addEventListener("click", () => {
    if (
        $("birthday-site").classList.contains("active") &&
        music &&
        music.paused
    ) {
        music.play().catch(() => {});
    }
});

/* =========================================================
   3. EXISTING TAB NAVIGATION
========================================================= */

document.querySelectorAll(".next-button[data-next]").forEach(button => {
    button.addEventListener("click", () => {
        showTab(button.dataset.next);
    });
});

/* =========================================================
   4. PHOTOS
========================================================= */

const photos = [
    "IMG_20260321_140317_629.jpg",
    "IMG_20260321_140314_707.jpg",
    "IMG_20260321_140308_681.jpg",
    "IMG_20260321_140306_836.jpg",
    "IMG_20260321_140258_338.jpg",
    "IMG_20260319_202209_603.jpg"
];

let currentPhoto = 0;

const photo = $("memory-photo");
const caption = $("photo-caption");
const photoContainer = $("photo-container");
const nextPhoto = $("next-photo");
const videoContainer = $("video-container");
const video = $("memory-video");
const videoSource = $("video-source");

function displayPhoto() {
    if (!photo) return;

    photo.style.opacity = "0";

    const path = "assets/photos/" + photos[currentPhoto];

    photo.onload = () => {
        photo.style.opacity = "1";
    };

    photo.onerror = () => {
        photo.style.opacity = "1";
        caption.textContent =
            "Could not find: " + photos[currentPhoto];
    };

    photo.src = path;

    caption.textContent =
        `Memory ${currentPhoto + 1} / ${photos.length}`;
}

displayPhoto();

nextPhoto.addEventListener("click", () => {
    currentPhoto++;

    if (currentPhoto < photos.length) {
        displayPhoto();
        return;
    }

    photoContainer.classList.add("hidden");
    caption.classList.add("hidden");
    nextPhoto.classList.add("hidden");

    videoContainer.classList.remove("hidden");

    videoSource.src = VIDEO_PATH;
    video.load();

    video.play().catch(() => {});
});

$("video-continue").addEventListener("click", () => {
    video.pause();
    showTab("tab-3");
});

/* =========================================================
   5. TAB 3 — FUNNY QUESTIONS
========================================================= */

const funnyQuestions = Array.from(
    document.querySelectorAll(".funny-question")
);

function getFunnyResponseElement(question) {
    let response = question.querySelector(".funny-response");

    if (!response) {
        response = document.createElement("div");
        response.className = "funny-response";
        response.setAttribute("aria-live", "polite");

        const answers = question.querySelector(".funny-answer");

        if (answers) {
            answers.parentNode.insertBefore(response, answers);
        } else {
            question.appendChild(response);
        }
    }

    return response;
}

function getFunnyNextButton(question) {
    let next = question.querySelector(".funny-next");

    if (!next) {
        next = document.createElement("button");
        next.type = "button";
        next.className = "funny-next hidden";
        next.textContent = "Next →";
        question.appendChild(next);
    }

    return next;
}

function funnyMessage(questionNumber, answer) {
    const text = answer.textContent.trim().toLowerCase();

    switch (String(questionNumber)) {

        case "1":
            if (
                answer.dataset.response === "yes" ||
                text === "yes" ||
                text.includes("yes")
            ) {
                return "Sure sure... we'll believe you. 👀";
            }

            return "Hmm... at least you're honest. 😂";

        case "2":
            if (
                text.includes("me") ||
                text.includes("myself")
            ) {
                return "Interesting. Blaming yourself? Character development. 😂";
            }

            return "I KNEW IT. The evidence is overwhelming. 💀";

        case "3":
            if (
                text.startsWith("a.") ||
                text.startsWith("a ")
            ) {
                return "Finally, some honesty. 😂";
            }

            return "The confidence is concerning. 💀";

        case "4":
            if (
                text.includes("yes") ||
                text.includes("sure")
            ) {
                return "Good. That's exactly what I wanted to hear. ❤️";
            }

            return "Birthday discount accepted. 😭";

        default:
            return "Okay... noted. 👀😂";
    }
}

funnyQuestions.forEach((question, index) => {

    const questionNumber =
        question.dataset.question || String(index + 1);

    const answers =
        Array.from(question.querySelectorAll(".funny-answer"));

    const response =
        getFunnyResponseElement(question);

    const next =
        getFunnyNextButton(question);

    if (index > 0) {
        question.classList.add("hidden");
    }

    next.classList.add("hidden");

    answers.forEach(answer => {
        answer.addEventListener("click", () => {

            answers.forEach(button => {
                button.disabled = true;
            });

            response.textContent =
                funnyMessage(questionNumber, answer);

            response.classList.remove("hidden");
            next.classList.remove("hidden");

            response.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        });
    });

    next.addEventListener("click", () => {

        question.classList.add("hidden");

        const nextQuestion =
            funnyQuestions[index + 1];

        if (nextQuestion) {
            nextQuestion.classList.remove("hidden");

            window.scrollTo({
                top: nextQuestion.offsetTop - 80,
                behavior: "smooth"
            });
        } else {
            showTab("tab-4");
        }
    });
});

/* =========================================================
   5B. SAFETY FALLBACK FOR A SEPARATE Q4 FINISH BUTTON
========================================================= */

const funnyFinish = $("funny-finish");

if (funnyFinish) {
    funnyFinish.addEventListener("click", () => {
        showTab("tab-4");
    });
}

/* =========================================================
   6. TAB 4 — TWO FINAL QUESTIONS
========================================================= */

let questionOneAnswer = "";
let questionTwoAnswer = "";

document.querySelectorAll(".answer-button").forEach(button => {

    button.addEventListener("click", () => {

        const question = button.dataset.question;
        const answer = button.dataset.answer;

        if (question === "1") {
            questionOneAnswer = answer;

            $("question-1").classList.add("hidden");
            $("question-2").classList.remove("hidden");
        }

        if (question === "2") {
            questionTwoAnswer = answer;

            $("question-2").classList.add("hidden");
            $("answer-complete").classList.remove("hidden");

            saveAnswers();
        }
    });
});

$("answers-continue").addEventListener("click", () => {
    showTab("tab-5");
});

/* =========================================================
   7. SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://ofzwsyqwsxpuivfsyeum.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_PkGTYWtDC55fR5IV44nNwg_WkJ6YKxU";

async function saveAnswers() {

    const data = {
        question_1: questionOneAnswer,
        question_2: questionTwoAnswer,
        submitted_at: new Date().toISOString()
    };

    console.log("Answers:", data);

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return;
    }

    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/birthday_answers`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization":
                        `Bearer ${SUPABASE_ANON_KEY}`,
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify(data)
            }
        );

        if (!response.ok) {
            console.error(
                "Supabase error:",
                await response.text()
            );
        }

    } catch (error) {
        console.error(
            "Database connection error:",
            error
        );
    }
}

/* =========================================================
   8. TAB 6 — LET'S ADD THIS UP
========================================================= */

const calculateTruth = $("calculate-truth");
const truthResult = $("truth-result");
const tab6Next = $("tab-6-next");

if (calculateTruth && truthResult) {

    calculateTruth.addEventListener("click", () => {

        calculateTruth.disabled = true;
        calculateTruth.textContent = "Calculating... 🧮";

        setTimeout(() => {

            calculateTruth.classList.add("hidden");
            truthResult.classList.remove("hidden");

        }, 1200);

    });
}

if (tab6Next) {
    tab6Next.addEventListener("click", () => {
        showTab("tab-7");
    });
}

/* =========================================================
   9. TAB 7
   No extra functionality required.
   It is connected from Tab 6.
========================================================= */
