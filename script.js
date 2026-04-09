console.log("scenes:", window.scenes) // :contentReference[oaicite:0]{index=0}

class GameState {
    constructor() {
        this.evidence = []
        this.computerChecked = false
        this.cameraUnlocked = false
        this.interrogation = { current: null }
        this.flags = { studentSpoke: false }
        this.askedQuestions = {}
        this.accused = null
    }
}

class UIManager {
    constructor() {
        this.textElement = document.getElementById("text")
        this.nameElement = document.getElementById("name")
        this.notebookBtn = document.getElementById("notebookBtn")
        this.panel = document.getElementById("suspectsPanel")
        this.closeBtn = document.getElementById("closeSuspects")
        this.leftChoices = document.getElementById("leftChoices")
        this.dialogChoices = document.getElementById("dialogChoices")
        this.introScreen = document.getElementById("introScreen")
        this.startGameBtn = document.getElementById("startGameBtn")
        this.game = document.getElementById("game")
        this.detectiveImg = document.getElementById("detective")
        this.suspectImg = document.getElementById("suspect")

        this.music = document.getElementById("bgMusic")
        this.musicBtn = document.getElementById("musicBtn")
        this.musicIcon = document.getElementById("musicIcon")
    }
}

class DialogSystem {
    constructor(ui) {
        this.ui = ui
        this.typingInterval = null
    }

    typeText(text, callback) {
        if (this.typingInterval) clearInterval(this.typingInterval)

        let i = 0
        this.ui.textElement.textContent = ""

        this.typingInterval = setInterval(() => {
            this.ui.textElement.textContent += text[i]
            i++

            if (i >= text.length) {
                clearInterval(this.typingInterval)
                this.typingInterval = null
                if (callback) callback()
            }
        }, 20)
    }

    showDialog(dialog, callback) {
        this.ui.leftChoices.innerHTML = ""
        let index = 0

        const nextLine = () => {
            const line = dialog[index]
            this.ui.nameElement.textContent = line.name

            this.typeText(line.text, () => {
                const btn = document.createElement("button")
                btn.textContent = "Dalej →"
                btn.classList.add("dialogBtn")

                btn.onclick = () => {
                    index++
                    if (index < dialog.length) nextLine()
                    else callback()
                }

                this.ui.dialogChoices.innerHTML = ""
                this.ui.dialogChoices.appendChild(btn)
            })
        }

        nextLine()
    }
}

class InterrogationSystem {
    constructor(game) {
        this.game = game
    }

    start(name) {
        const { ui, state, dialogSystem } = this.game

        ui.suspectImg.src = this.game.characterImages[name] || ""
        ui.suspectImg.style.display = "block"

        if (name === "student") ui.game.style.backgroundImage = "url('images/fs.png')"
        else if (name === "assistant") ui.game.style.backgroundImage = "url('images/ae.png')"
        else if (name === "professor2") ui.game.style.backgroundImage = "url('images/fs.png')"

        state.interrogation.current = name

        dialogSystem.showDialog(
            this.game.interrogations[name].intro,
            () => this.showQuestions()
        )
    }

    showQuestions() {
        const { ui, state, dialogSystem } = this.game
        const data = this.game.interrogations[state.interrogation.current]

        ui.leftChoices.innerHTML = ""
        ui.dialogChoices.innerHTML = ""

        data.questions.forEach((q, index) => {
            const key = state.interrogation.current + "_" + index

            const btn = document.createElement("button")
            btn.textContent = q.text
            btn.classList.add("leftBtn")

            if (state.askedQuestions[key]) btn.classList.add("asked")
            else btn.classList.add("new")
            
            if (q.requires) {
                const missing = q.requires.some(req => {
                    return !Object.keys(state.askedQuestions)
                        .some(k => k.startsWith(state.interrogation.current) && k.includes(req))
                })

                if (missing) {
                    btn.classList.add("locked")
                    btn.onclick = () => {
                        alert(q.requiresHint || "To pytanie jest zablokowane")
                    }
                    ui.leftChoices.appendChild(btn)
                    return
                }
            }

            if (q.condition && !q.condition()) {
                btn.classList.add("locked")
                btn.onclick = () => {
                    alert(q.conditionHint || "Brak warunku")
                }
                ui.leftChoices.appendChild(btn)
                return
            }

            btn.onclick = () => {
                state.askedQuestions[key] = true

                dialogSystem.showDialog(q.dialog, () => {
                    if (q.evidence) this.game.addEvidence(q.evidence)
                    if (q.unlockCamera) state.cameraUnlocked = true
                    if (q.action) q.action()

                    this.showQuestions()
                })
            }

            ui.leftChoices.appendChild(btn)
        })

        const exitBtn = document.createElement("button")
        exitBtn.textContent = "Zakończ rozmowę"
        exitBtn.classList.add("leftBtn")
        exitBtn.onclick = () => this.game.showScene("start")

        ui.leftChoices.appendChild(exitBtn)
    }
}

class SceneSystem {
    constructor(game) {
        this.game = game
    }

    show(name) {
        const { ui, dialogSystem } = this.game
        const scene = this.game.scenes[name]

        ui.suspectImg.style.display = "none"

        ui.detectiveImg.style.display = "block"
        if (name === "mail_professor" || name === "mail_student") {
            ui.detectiveImg.style.display = "none"
        }

        ui.leftChoices.innerHTML = ""
        ui.dialogChoices.innerHTML = ""

        if (["cabinet", "lock", "computer", "drawer", "computer_logs"].includes(name)) {
            ui.game.style.backgroundImage = "url('images/po.png')"
        } else if (name === "mail_professor") {
            ui.game.style.backgroundImage = "url('images/mail_p.png')"
        } else if (name === "mail_student") {
            ui.game.style.backgroundImage = "url('images/mail_s.png')"
        } else {
            ui.game.style.backgroundImage = "url('images/kt.png')"
        }

        if (scene.dialog) {
            dialogSystem.showDialog(scene.dialog, () => {
                if (scene.action) scene.action(this.game)
                this.show(scene.next)
            })
            return
        }

        ui.nameElement.textContent = ""
        ui.textElement.textContent = scene.text

        scene.choices.forEach(choice => {
            if (choice.condition && !choice.condition(this.game)) return

            const btn = document.createElement("button")
            btn.textContent = choice.text
            btn.classList.add("leftBtn")

            btn.onclick = () => {
                const next = typeof choice.next === "function"
                    ? choice.next()
                    : choice.next

                if (typeof next === "string") this.show(next)
            }

            ui.leftChoices.appendChild(btn)
        })
    }
}

class Game {
    constructor() {
        this.ui = new UIManager()
        this.state = new GameState()
        this.dialogSystem = new DialogSystem(this.ui)
        this.interrogationSystem = new InterrogationSystem(this)
        this.sceneSystem = new SceneSystem(this)

        this.scenes = window.scenes
        this.interrogations = window.interrogations

        this.isPlaying = false

        this.characterImages = {
            student: "images/sut.png",
            assistant: "images/an.png",
            professor2: "images/pr.png",
            librarian: "images/sutdu.png",
            secretary: "images/bk.png",
            guard: "images/guard.png",
            phd: "images/jp.png"
        }

        this.evidenceDescriptions = {
            assistant_evening: "Asystent był widziany wieczorem",
            camera_assistant: "Nagranie: asystent w gabinecie",
            assistant_key: "Asystent ma klucz",
            key_access: "Ktoś użył klucza",
            conflict_professors: "Konflikt między profesorami ",
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

        window.game = this
        this.init()
    }

    init() {
        this.ui.notebookBtn.onclick = () => this.ui.panel.classList.remove("hidden")
        this.ui.closeBtn.onclick = () => this.ui.panel.classList.add("hidden")

        this.ui.musicBtn.onclick = () => this.toggleMusic()

        this.ui.startGameBtn.onclick = () => {
            this.ui.introScreen.style.display = "none"
            this.ui.music.play()
            this.isPlaying = true
        }

        window.accuse = (person) => {
            this.state.accused = person
            this.showEnding()
        }

        this.updateEvidenceUI()
        this.showScene("start")
    }

    toggleMusic() {
        if (this.isPlaying) {
            this.ui.music.pause()
            this.ui.musicIcon.src = "images/sf.png"
        } else {
            this.ui.music.play()
            this.ui.musicIcon.src = "images/so.png"
        }
        this.isPlaying = !this.isPlaying
    }

    addEvidence(item) {
        if (!this.state.evidence.includes(item)) {
            this.state.evidence.push(item)
            this.updateEvidenceUI()
        }
    }

    updateEvidenceUI() {
        const list = document.getElementById("evidenceList")
        list.innerHTML = ""

        this.state.evidence.forEach(e => {
            const li = document.createElement("li")
            li.textContent = this.evidenceDescriptions[e]
            list.appendChild(li)
        })
    }

    showScene(name) {
        this.sceneSystem.show(name)
    }

    startInterrogation(name) {
        this.interrogationSystem.start(name)
    }

    showEnding() {
        document.getElementById("characters").style.display = "none"
        const endingScreen = document.getElementById("endingScreen")
        const endingText = document.getElementById("endingText")

        document.getElementById("suspectsPanel").classList.add("hidden")

        this.ui.leftChoices.innerHTML = ""
        this.ui.dialogChoices.innerHTML = ""
        this.ui.nameElement.textContent = ""
        this.ui.textElement.textContent = ""

        endingScreen.classList.remove("hidden")

        let text = ""

        if (this.state.accused === "assistant") {
            text = "Złapałeś prawdziwego złodzieja.\n\n" +
                "Asystent miał klucz do gabinetu i znał jego zabezpieczenia. " +
                "Został zauważony wieczorem w pobliżu oraz uchwycony na nagraniach.\n\n" +
                "Wykorzystał martwy punkt kamery, aby uniknąć wykrycia. " +
                "Jako osoba zaufana wiedział, jak dostać się do manuskryptu bez wzbudzania podejrzeń.\n\n" +
                "Motyw był prosty — pieniądze. Rękopis miał ogromną wartość i mógł zostać sprzedany na czarnym rynku."
        } else if (this.state.accused === "student") {
            text = "To był zły wybór. Student jest niewinny.\n\n" +
                "Rzeczywiście był tego wieczoru na uczelni, ale nie mówił całej prawdy.\n\n" +
                "Spotkał się z kimś w tajemnicy i nie chciał, żeby ktokolwiek się o tym dowiedział. " +
                "Dlatego kręcił się w mniej uczęszczanej części budynku.\n\n" +
                "Kiedy został zapytany o szczegóły, spanikował i skłamał o godzinie.\n\n" +
                "Bał się konsekwencji prywatnych, nie prawnych.\n\n" +
                "Nie miał klucza ani powodu, żeby kraść manuskrypt.\n" +
                "Jego zachowanie było podejrzane, ale niezwiązane z przestępstwem."
        }
        else if (this.state.accused === "professor2") {
            text = "Profesor nie był winny.\n\n" +
                "Miał motyw, ale nie podjął żadnych działań.\n" +
                "To nie on dopuścił się kradzieży."
        }

        endingText.textContent = text
    }
}

const game = new Game()
