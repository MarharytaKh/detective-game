console.log("scenes:", window.scenes)
const textElement = document.getElementById("text")
const nameElement = document.getElementById("name")
const notebookBtn = document.getElementById("notebookBtn")
const panel = document.getElementById("suspectsPanel")
const closeBtn = document.getElementById("closeSuspects")
const leftChoices = document.getElementById("leftChoices")
const dialogChoices = document.getElementById("dialogChoices")
const introScreen = document.getElementById("introScreen")
const startGameBtn = document.getElementById("startGameBtn")
const game = document.getElementById("game")
const detectiveImg = document.getElementById("detective")
const suspectImg = document.getElementById("suspect")
const scenes = window.scenes
const interrogations = window.interrogations
startGameBtn.onclick = () => {
    introScreen.style.display = "none"
}
const characterImages = {
    student: "images/sut.png",
    assistant: "images/an.png",
    professor2: "images/pr.png",
    librarian: "images/sutdu.png",
    secretary: "images/bk.png",
    guard: "images/guard.png",
    phd: "images/jp.png"
}
const gameState = {
    evidence: [],
    computerChecked: false,
    cameraUnlocked: false,
    interrogation: {
        current: null
    },
    flags: {
        studentSpoke: false
    },
    askedQuestions: {}
}

notebookBtn.onclick = () => panel.classList.remove("hidden")
closeBtn.onclick = () => panel.classList.add("hidden")

const evidenceDescriptions = {
    assistant_evening: "Asystent był widziany wieczorem",
    camera_assistant: "Nagranie: asystent w gabinecie",
    assistant_key: "Asystent ma klucz",
    key_access: "Ktoś użył klucza",
    conflict_professors: "Konflikt między profesorami",

    student_motive: "Student bardzo chciał manuskrypt",
    student_evening: "student był tego wieczoru w pobliżu gabinetu i zeznawał przeciwko asystentowi",
    professor_nervous: "Profesor był zdenerwowany",
    camera_blind_spot: "Kamera miała martwy punkt",
    student_lie: "Student skłamał o czasie",
    assistant_lie: "Asystent skłamał",
    professor_access: "Profesor miał pośredni dostęp",
    fake_key: "Istnieje drugi klucz",
    night_entry: "Ktoś wszedł po godzinach",
}

function addEvidence(item) {
    if (!gameState.evidence.includes(item)) {
        gameState.evidence.push(item)
        updateEvidenceUI()
    }
}
window.accuse = function (person) {
    gameState.accused = person
    showEnding()
}
function updateEvidenceUI() {
    const list = document.getElementById("evidenceList")
    list.innerHTML = ""

    gameState.evidence.forEach(e => {
        const li = document.createElement("li")
        li.textContent = evidenceDescriptions[e]
        list.appendChild(li)
    })
}

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

function startInterrogation(name) {
    suspectImg.src = characterImages[name] || ""
    suspectImg.style.display = "block"
    if (name === "student") {
        game.style.backgroundImage = "url('images/fs.png')"
    }

    else if (name === "assistant") {
        game.style.backgroundImage = "url('images/ae.png')"
    }

    else if (name === "professor2") {
        game.style.backgroundImage = "url('images/fs.png')"
    }

    gameState.interrogation.current = name
    showCustomDialog(interrogations[name].intro, () => showQuestions())
}

function showQuestions() {

    const data = interrogations[gameState.interrogation.current]

    leftChoices.innerHTML = ""
    dialogChoices.innerHTML = ""

    data.questions.forEach((q, index) => {

        const key = gameState.interrogation.current + "_" + index

        const btn = document.createElement("button")
        btn.textContent = q.text
        btn.classList.add("leftBtn")

        // если уже спрашивали → серый
        if (gameState.askedQuestions[key]) {
            btn.classList.add("asked")
        } else {
            btn.classList.add("new") // новый цвет
        }

        btn.onclick = () => {

            gameState.askedQuestions[key] = true

            showCustomDialog(q.dialog, () => {

                if (q.evidence) addEvidence(q.evidence)
                if (q.unlockCamera) gameState.cameraUnlocked = true
                if (q.action) q.action()

                showQuestions()
            })
        }

        leftChoices.appendChild(btn)
    })

    const exitBtn = document.createElement("button")
    exitBtn.textContent = "Zakończ rozmowę"
    exitBtn.classList.add("leftBtn")

    exitBtn.onclick = () => showScene("start")

    leftChoices.appendChild(exitBtn)
}

function showScene(name) {
    suspectImg.style.display = "none"
    const scene = scenes[name]

    const detective = document.getElementById("detective")

    // по умолчанию показываем
    detective.style.display = "block"

    // скрываем в нужных сценах
    if (name === "mail_professor" || name === "mail_student") {
        detective.style.display = "none"
    }
    leftChoices.innerHTML = ""
    dialogChoices.innerHTML = ""

    if (name === "cabinet" || name === "lock" || name === "computer" || name === "drawer" || name === "computer_logs") {
        game.style.backgroundImage = "url('images/po.png')"
    }
    else if (name === "mail_professor"){
        game.style.backgroundImage = "url('images/mail_p.png')"
    }
    else if (name === "mail_student") {
        game.style.backgroundImage = "url('images/mail_s.png')"
    }
    else {
        game.style.backgroundImage = "url('images/kt.png')"
    }
    if (scene.dialog) {
        showCustomDialog(scene.dialog, () => {
            if (scene.action) scene.action()
            showScene(scene.next)
        })
        return
    }

    nameElement.textContent = ""
    textElement.textContent = scene.text

    scene.choices.forEach(choice => {

        if (choice.condition && !choice.condition()) return

        const btn = document.createElement("button")
        btn.textContent = choice.text
        btn.classList.add("leftBtn")

        btn.onclick = () => {
            const next = typeof choice.next === "function"
                ? choice.next()
                : choice.next
            if (typeof next === "string") showScene(next)
        }

        leftChoices.appendChild(btn)
    })
}

function showCustomDialog(dialog, callback) {

    leftChoices.innerHTML = ""

    let index = 0

    function nextLine() {
        const line = dialog[index]
        nameElement.textContent = line.name

        typeText(line.text, () => {

            const btn = document.createElement("button")
            btn.textContent = "Dalej →"
            btn.classList.add("dialogBtn")

            btn.onclick = () => {
                index++
                if (index < dialog.length) nextLine()
                else callback()
            }

            dialogChoices.innerHTML = ""
            dialogChoices.appendChild(btn)
        })
    }

    nextLine()
}
function showEnding() {
    document.getElementById("characters").style.display = "none"
    const endingScreen = document.getElementById("endingScreen")
    const endingText = document.getElementById("endingText")

    // скрываем только игру
    document.getElementById("suspectsPanel").classList.add("hidden")

    leftChoices.innerHTML = ""
    dialogChoices.innerHTML = ""
    nameElement.textContent = ""
    textElement.textContent = ""

    endingScreen.classList.remove("hidden")

    let text = ""

    if (gameState.accused === "assistant") {
        text = "Złapałeś prawdziwego złodzieja."
    } else if (gameState.accused === "student") {
        text = "To był zły wybór. Student jest niewinny."
    } else if (gameState.accused === "professor2") {
        text = "Profesor nie był winny."
    }

    endingText.textContent = text
}
updateEvidenceUI()
showScene("start")
