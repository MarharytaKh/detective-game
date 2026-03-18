const textElement = document.getElementById("text")
const nameElement = document.getElementById("name")

const leftChoices = document.getElementById("leftChoices")
const dialogChoices = document.getElementById("dialogChoices")

const notebookBtn = document.getElementById("notebookBtn")
const panel = document.getElementById("suspectsPanel")
const closeBtn = document.getElementById("closeSuspects")

let dialogIndex = 0

// ===== STATE =====
const gameState = {
    evidence: [],
    talkedStudent: false,
    talkedProfessor2: false
}

// ===== НАЗВАНИЯ УЛИК =====
const evidenceDescriptions = {
    key_access: "Ktoś użył klucza do gabinetu",
    assistant_evening: "Asystent był widziany wieczorem",
    assistant_key: "Asystent ma klucz",
    camera_assistant: "Nagranie: asystent w gabinecie"
}

// ===== ДОБАВЛЕНИЕ УЛИК =====
function addEvidence(item) {
    if (!gameState.evidence.includes(item)) {
        gameState.evidence.push(item)
        updateEvidenceUI()
    }
}

// ===== ОБНОВЛЕНИЕ UI =====
function updateEvidenceUI() {
    const list = document.getElementById("evidenceList")
    list.innerHTML = ""

    gameState.evidence.forEach(item => {
        const li = document.createElement("li")
        li.textContent = evidenceDescriptions[item] || item
        list.appendChild(li)
    })
}

// ===== БЛОКНОТ =====
notebookBtn.onclick = () => {
    panel.classList.remove("hidden")
}

closeBtn.onclick = () => {
    panel.classList.add("hidden")
}

// ===== TYPEWRITER =====
function typeText(text, callback) {
    let i = 0
    textElement.textContent = ""

    const interval = setInterval(() => {
        textElement.textContent += text[i]
        i++

        if (i >= text.length) {
            clearInterval(interval)
            callback()
        }
    }, 20)
}

function hasRequiredEvidence() {
    return gameState.evidence.includes("key_access") &&
        gameState.evidence.includes("assistant_evening") &&
        gameState.evidence.includes("camera_assistant")
}

const scenes = {

    start: {
        text: "Profesor odkrył rano, że manuskrypt zniknął z jego gabinetu.",
        choices: [
            { text: "Idź do gabinetu", next: "searchCabinet" },
            { text: "Porozmawiaj ze studentem", next: "talkStudent" },
            {
                text: "Porozmawiaj z asystentem",
                next: "talkAssistant",
                condition: () => gameState.talkedStudent
            },
            { text: "Porozmawiaj z drugim profesorem", next: "talkProfessor" },
            {
                text: "Sprawdź kamery",
                next: "camera",
                condition: () => gameState.talkedProfessor2
            },
            { text: "Oskarż kogoś", next: "accuse" }
        ]
    },

    searchCabinet: {
        text: "W gabinecie widzisz biurko i zamkniętą szafkę.",
        choices: [
            { text: "Sprawdź teczkę", next: "checkFile" },
            { text: "Sprawdź zamek", next: "checkLock" },
            { text: "Wróć", next: "start" }
        ]
    },

    checkFile: {
        dialog: [
            { name: "Ty", text: "Otwieram teczkę..." },
            { name: "Ty", text: "Jest pusta." },
            { name: "Ty", text: "Manuskrypt na pewno tu był." }
        ],
        next: "searchCabinet"
    },

    checkLock: {
        dialog: [
            { name: "Ty", text: "Sprawdzam zamek." },
            { name: "Ty", text: "Nie jest uszkodzony." },
            { name: "Ty", text: "Ktoś użył klucza." }
        ],
        action: () => addEvidence("key_access"),
        next: "searchCabinet"
    },

    talkStudent: {
        dialog: [
            { name: "Ty", text: "Gdzie byłeś wczoraj wieczorem?" },
            { name: "Student", text: "W bibliotece." },
            { name: "Ty", text: "Widziałeś coś podejrzanego?" },
            { name: "Student", text: "Tak... widziałem asystenta." }
        ],
        action: () => {
            addEvidence("assistant_evening")
            gameState.talkedStudent = true
        },
        next: "start"
    },

    talkAssistant: {
        dialog: [
            { name: "Ty", text: "Byłeś w gabinecie wieczorem." },
            { name: "Asystent", text: "To nieprawda." },
            { name: "Ty", text: "Student cię widział." },
            { name: "Asystent", text: "..." },
            { name: "Asystent", text: "Dobrze. Byłem tam." }
        ],
        action: () => addEvidence("assistant_key"),
        next: "start"
    },

    talkProfessor: {
        dialog: [
            { name: "Ty", text: "Kiedy wyszedł pan z uczelni?" },
            { name: "Profesor", text: "Około 18:00." },
            { name: "Profesor", text: "Warto sprawdzić kamery." }
        ],
        action: () => {
            gameState.talkedProfessor2 = true
        },
        next: "start"
    },

    camera: {
        dialog: [
            { name: "Ty", text: "Sprawdzam nagrania." },
            { name: "Ty", text: "Widzę asystenta w gabinecie wieczorem." }
        ],
        action: () => addEvidence("camera_assistant"),
        next: "start"
    },

    accuse: {
        text: "Kogo oskarżasz?",
        choices: [
            {
                text: "Asystent",
                next: () => hasRequiredEvidence() ? "ending_good" : "not_enough"
            },
            { text: "Student", next: "ending_bad" },
            { text: "Wróć", next: "start" }
        ]
    },

    not_enough: {
        text: "Nie masz wystarczających dowodów.",
        choices: [
            { text: "Wróć", next: "start" }
        ]
    },

    ending_good: {
        text: "Dowody wskazują na asystenta.",
        choices: []
    },

    ending_bad: {
        text: "To nie była właściwa osoba.",
        choices: []
    }
}

function showScene(sceneName) {

    const scene = scenes[sceneName]

    leftChoices.innerHTML = ""
    dialogChoices.innerHTML = ""

    if (scene.dialog) {
        dialogIndex = 0
        showDialog(scene)
        return
    }

    nameElement.textContent = ""
    textElement.textContent = scene.text

    if (scene.action) scene.action()

    scene.choices.forEach(choice => {

        if (choice.condition && !choice.condition()) return

        const btn = document.createElement("button")
        btn.textContent = choice.text
        btn.classList.add("leftBtn")

        btn.onclick = () => {
            const nextScene = typeof choice.next === "function"
                ? choice.next()
                : choice.next

            showScene(nextScene)
        }

        leftChoices.appendChild(btn)
    })
}

function showDialog(scene) {

    const line = scene.dialog[dialogIndex]
    nameElement.textContent = line.name

    typeText(line.text, () => {

        const btn = document.createElement("button")
        btn.textContent = "Dalej →"
        btn.classList.add("dialogBtn")

        btn.onclick = () => {

            dialogIndex++

            if (dialogIndex < scene.dialog.length) {
                showDialog(scene)
            } else {
                if (scene.action) scene.action()
                showScene(scene.next)
            }
        }

        dialogChoices.innerHTML = ""
        dialogChoices.appendChild(btn)
    })
}
updateEvidenceUI()
showScene("start")

