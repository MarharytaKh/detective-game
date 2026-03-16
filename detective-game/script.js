const textElement = document.getElementById("text")
const choicesElement = document.getElementById("choices")

const gameState = {
    evidence: []
}

function addEvidence(item) {
    if (!gameState.evidence.includes(item)) {
        gameState.evidence.push(item)
    }
}

const scenes = {

    start: {
        text: "Profesor odkrył rano, że manuskrypt zniknął z jego gabinetu.",
        choices: [
            { text: "Idź do gabinetu profesora", next: "searchCabinet" },
            { text: "Porozmawiaj ze studentem", next: "talkStudentMenu" },
            { text: "Porozmawiaj z asystentem", next: "talkAssistantMenu" },
            { text: "Porozmawiaj z drugim profesorem", next: "talkProfessorMenu" },
            { text: "Sprawdź kamery", next: "cameraMenu" },
            { text: "Oskarż kogoś", next: "accuse" }
        ]
    },

    searchCabinet: {
        text: "W gabinecie widzisz biurko profesora i zamkniętą szafkę.",
        choices: [
            { text: "Sprawdź teczkę", next: "checkFile" },
            { text: "Sprawdź zamek", next: "checkLock" },
            { text: "Wróć", next: "start" }
        ]
    },

    checkFile: {
        text: "Teczka jest pusta. Wcześniej znajdował się w niej manuskrypt.",
        choices: [
            { text: "Wróć", next: "searchCabinet" }
        ]
    },

    checkLock: {
        text: "Zamek nie jest uszkodzony. Ktoś użył klucza.",
        action: () => addEvidence("key_access"),
        choices: [
            { text: "Wróć", next: "searchCabinet" }
        ]
    },

    talkStudentMenu: {
        text: "Student wygląda na zdenerwowanego.",
        choices: [
            { text: "Zapytaj gdzie był wieczorem", next: "studentNight" },
            { text: "Zapytaj czy coś widział", next: "studentSaw" },
            { text: "Wróć", next: "start" }
        ]
    },

    studentNight: {
        text: "Student mówi: \"Byłem w bibliotece prawie cały wieczór.\"",
        choices: [
            { text: "Wróć", next: "talkStudentMenu" }
        ]
    },

    studentSaw: {
        text: "Student mówi: \"Widziałem asystenta wychodzącego z gabinetu późnym wieczorem.\"",
        action: () => addEvidence("assistant_evening"),
        choices: [
            { text: "Wróć", next: "talkStudentMenu" }
        ]
    },

    talkAssistantMenu: {
        text: "Asystent wygląda na zdenerwowanego.",
        choices: [
            { text: "Zapytaj o wczorajszy wieczór", next: "assistantNight" },
            { text: "Zapytaj o klucz do gabinetu", next: "assistantKey" },
            { text: "Wróć", next: "start" }
        ]
    },

    assistantNight: {
        text: "Asystent mówi: \"Nie byłem tu wieczorem. Wyszedłem wcześniej.\"",
        choices: [
            { text: "Wróć", next: "talkAssistantMenu" }
        ]
    },

    assistantKey: {
        text: "Asystent przyznaje, że ma zapasowy klucz do gabinetu profesora.",
        action: () => addEvidence("assistant_key"),
        choices: [
            { text: "Wróć", next: "talkAssistantMenu" }
        ]
    },

    talkProfessorMenu: {
        text: "Drugi profesor wygląda spokojnie.",
        choices: [
            { text: "Zapytaj kiedy wyszedł", next: "professorTime" },
            { text: "Zapytaj o manuskrypt", next: "professorManuscript" },
            { text: "Wróć", next: "start" }
        ]
    },

    professorTime: {
        text: "Profesor mówi: \"Wyszedłem około 18:00.\"",
        choices: [
            { text: "Wróć", next: "talkProfessorMenu" }
        ]
    },

    professorManuscript: {
        text: "Profesor twierdzi, że manuskrypt był bardzo cenny naukowo.",
        choices: [
            { text: "Wróć", next: "talkProfessorMenu" }
        ]
    },

    cameraMenu: {
        text: "Możesz obejrzeć nagranie z wieczora.",
        choices: [
            { text: "Obejrzyj nagranie", next: "cameraWatch" },
            { text: "Wróć", next: "start" }
        ]
    },

    cameraWatch: {
        text: "Na nagraniu widać asystenta wchodzącego do gabinetu późnym wieczorem.",
        action: () => addEvidence("camera_assistant"),
        choices: [
            { text: "Wróć", next: "cameraMenu" }
        ]
    },

    accuse: {
        text: "Kogo oskarżasz?",
        choices: [
            { text: "Asystent", next: "ending_good" },
            { text: "Student", next: "ending_bad" },
            { text: "Drugi profesor", next: "ending_bad" },
            { text: "Wróć", next: "start" }
        ]
    },

    ending_good: {
        text: "Dowody wskazują na asystenta. Przyznaje się do kradzieży manuskryptu.",
        choices: []
    },

    ending_bad: {
        text: "To nie była właściwa osoba. Sprawca pozostaje na wolności.",
        choices: []
    }

}
function showScene(sceneName) {

    const scene = scenes[sceneName]

    textElement.innerText = scene.text

    choicesElement.innerHTML = ""

    if (scene.action) {
        scene.action()
    }

    scene.choices.forEach(choice => {

        const button = document.createElement("button")
        button.innerText = choice.text

        button.onclick = () => showScene(choice.next)

        choicesElement.appendChild(button)

    })
}
showScene("start")


