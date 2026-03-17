const textElement = document.getElementById("text")
const choicesElement = document.getElementById("choices")
const nameElement = document.getElementById("name")

let dialogIndex = 0
let typing = false
let fullText = ""

// stan gry
const gameState = {
    evidence: [],
    talkedStudent: false,
    talkedProfessor2: false
}

// opisy dowodów
const evidenceDescriptions = {
    key_access: "Ktoś użył klucza do gabinetu",
    assistant_evening: "Asystent był widziany wieczorem",
    assistant_key: "Asystent ma klucz do gabinetu",
    camera_assistant: "Nagranie: asystent w gabinecie wieczorem"
}

// dodawanie dowodu
function addEvidence(item) {
    if (!gameState.evidence.includes(item)) {
        gameState.evidence.push(item)
        updateEvidenceUI()
    }
}

// panel dowodów
function updateEvidenceUI() {
    const list = document.getElementById("evidenceList")
    if (!list) return

    list.innerHTML = ""

    gameState.evidence.forEach(item => {
        const li = document.createElement("li")
        li.textContent = evidenceDescriptions[item]
        list.appendChild(li)
    })
}

// ===== TYPEWRITER =====

function typeText(text, callback) {

    let i = 0
    typing = true
    fullText = text

    textElement.textContent = ""

    const interval = setInterval(() => {

        textElement.textContent += text.charAt(i)
        i++

        if (i >= text.length) {
            clearInterval(interval)
            typing = false
            if (callback) callback()
        }

    }, 20)
}

// klik = skip
textElement.onclick = () => {
    if (typing) {
        textElement.textContent = fullText
        typing = false
    }
}

// ===== SCENY =====

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

    // ===== GABINET =====

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

    // ===== STUDENT =====

    talkStudent: {
        dialog: [
            { name: "Ty", text: "Gdzie byłeś wczoraj wieczorem?" },
            { name: "Student", text: "W bibliotece." },
            { name: "Ty", text: "Widziałeś coś podejrzanego?" },
            { name: "Student", text: "Tak... widziałem asystenta wychodzącego z gabinetu." }
        ],
        action: () => {
            addEvidence("assistant_evening")
            gameState.talkedStudent = true
        },
        next: "start"
    },

    // ===== ASYSTENT =====

    talkAssistant: {
        dialog: [
            { name: "Ty", text: "Musimy porozmawiać." },
            { name: "Asystent", text: "O co chodzi?" },
            { name: "Ty", text: "Byłeś w gabinecie wieczorem." },
            { name: "Asystent", text: "To nieprawda." },
            { name: "Ty", text: "Student cię widział." },
            { name: "Asystent", text: "..." },
            { name: "Asystent", text: "Dobrze. Byłem tam." }
        ],
        action: () => addEvidence("assistant_key"),
        next: "start"
    },

    // ===== PROFESOR 2 =====

    talkProfessor: {
        dialog: [
            { name: "Ty", text: "Kiedy wyszedł pan z uczelni?" },
            { name: "Profesor", text: "Około 18:00." },
            { name: "Ty", text: "Czy coś było nie tak?" },
            { name: "Profesor", text: "Nie... ale warto sprawdzić kamery." }
        ],
        action: () => {
            gameState.talkedProfessor2 = true
        },
        next: "start"
    },

    // ===== KAMERY =====

    camera: {
        dialog: [
            { name: "Ty", text: "Sprawdzam nagrania." },
            { name: "Ty", text: "Widzę asystenta wchodzącego do gabinetu." },
            { name: "Ty", text: "Było już późno wieczorem." }
        ],
        action: () => addEvidence("camera_assistant"),
        next: "start"
    },

    // ===== OSKARŻENIE =====

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
        text: "Nie masz wystarczających dowodów. Musisz dalej prowadzić śledztwo.",
        choices: [
            { text: "Wróć", next: "start" }
        ]
    },

    ending_good: {
        text: "Dowody wskazują na asystenta. Przyznaje się do kradzieży.",
        choices: []
    },

    ending_bad: {
        text: "To nie była właściwa osoba.",
        choices: []
    }

}
function hasRequiredEvidence() {
    return gameState.evidence.includes("key_access") &&
        gameState.evidence.includes("assistant_evening") &&
        gameState.evidence.includes("camera_assistant")
}
// ===== WYŚWIETLANIE =====

function showScene(sceneName) {

    const scene = scenes[sceneName]

    choicesElement.innerHTML = ""

    if (scene.dialog) {
        dialogIndex = 0
        showDialog(scene)
        return
    }

    nameElement.textContent = ""
    textElement.textContent = scene.text

    if (scene.action) {
        scene.action()
    }

    scene.choices.forEach(choice => {

        if (choice.condition && !choice.condition()) return

        const button = document.createElement("button")
        button.textContent = choice.text
        button.onclick = () => {
            const nextScene = typeof choice.next === "function"
                ? choice.next()
                : choice.next

            showScene(nextScene)
        }
        choicesElement.appendChild(button)
    })
}

// ===== DIALOG =====

function showDialog(scene) {

    const line = scene.dialog[dialogIndex]

    nameElement.textContent = line.name

    choicesElement.innerHTML = ""

    typeText(line.text, () => {

        const button = document.createElement("button")
        button.textContent = "Dalej →"

        button.onclick = () => {

            dialogIndex++

            if (dialogIndex < scene.dialog.length) {
                showDialog(scene)
            } else {

                nameElement.textContent = ""

                if (scene.action) {
                    scene.action()
                }

                showScene(scene.next)
            }
        }

        choicesElement.appendChild(button)
    })
}

// start
updateEvidenceUI()
showScene("start")

