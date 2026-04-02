console.log("scenes:", window.scenes)

class Game {
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

        this.state = {
            evidence: [],
            computerChecked: false,
            cameraUnlocked: false,
            interrogation: { current: null },
            flags: { studentSpoke: false },
            askedQuestions: {}
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

        this.init()
    }

    init() {
        this.notebookBtn.onclick = () => this.panel.classList.remove("hidden")
        this.closeBtn.onclick = () => this.panel.classList.add("hidden")

        this.musicBtn.onclick = () => this.toggleMusic()

        this.startGameBtn.onclick = () => {
            this.introScreen.style.display = "none"
            this.music.play()
            this.isPlaying = true
        }

        window.accuse = (person) => {
            this.state.accused = person
            this.showEnding()
        }

        this.updateEvidenceUI()
        this.showScene("start")
        this.loadGame()

        document.getElementById("resetBtn").onclick = () => {
            localStorage.removeItem("detectiveSave")
            location.reload()
        }
    }

    toggleMusic() {
        if (this.isPlaying) {
            this.music.pause()
            this.musicIcon.src = "images/sf.png"
        } else {
            this.music.play()
            this.musicIcon.src = "images/so.png"
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

    typeText(text, callback) {
        let i = 0
        this.textElement.textContent = ""

        const interval = setInterval(() => {
            this.textElement.textContent += text[i]
            i++
            if (i >= text.length) {
                clearInterval(interval)
                callback()
            }
        }, 20)
    }

    startInterrogation(name) {
        this.suspectImg.src = this.characterImages[name] || ""
        this.suspectImg.style.display = "block"

        if (name === "student") this.game.style.backgroundImage = "url('images/fs.png')"
        else if (name === "assistant") this.game.style.backgroundImage = "url('images/ae.png')"
        else if (name === "professor2") this.game.style.backgroundImage = "url('images/fs.png')"

        this.state.interrogation.current = name
        this.showCustomDialog(this.interrogations[name].intro, () => this.showQuestions())
    }

    showQuestions() {
        const data = this.interrogations[this.state.interrogation.current]

        this.leftChoices.innerHTML = ""
        this.dialogChoices.innerHTML = ""

        data.questions.forEach((q, index) => {
            const key = this.state.interrogation.current + "_" + index

            const btn = document.createElement("button")
            btn.textContent = q.text
            btn.classList.add("leftBtn")

            if (this.state.askedQuestions[key]) btn.classList.add("asked")
            else btn.classList.add("new")

            btn.onclick = () => {
                this.state.askedQuestions[key] = true

                this.showCustomDialog(q.dialog, () => {
                    if (q.evidence) this.addEvidence(q.evidence)
                    if (q.unlockCamera) this.state.cameraUnlocked = true
                    if (q.action) q.action()

                    this.showQuestions()
                })
            }

            this.leftChoices.appendChild(btn)
        })

        const exitBtn = document.createElement("button")
        exitBtn.textContent = "Zakończ rozmowę"
        exitBtn.classList.add("leftBtn")
        exitBtn.onclick = () => this.showScene("start")

        this.leftChoices.appendChild(exitBtn)
    }

    showScene(name) {
        this.suspectImg.style.display = "none"

        const scene = this.scenes[name]
        const detective = this.detectiveImg

        detective.style.display = "block"

        if (name === "mail_professor" || name === "mail_student") {
            detective.style.display = "none"
        }

        this.leftChoices.innerHTML = ""
        this.dialogChoices.innerHTML = ""

        if (["cabinet", "lock", "computer", "drawer", "computer_logs"].includes(name)) {
            this.game.style.backgroundImage = "url('images/po.png')"
        } else if (name === "mail_professor") {
            this.game.style.backgroundImage = "url('images/mail_p.png')"
        } else if (name === "mail_student") {
            this.game.style.backgroundImage = "url('images/mail_s.png')"
        } else {
            this.game.style.backgroundImage = "url('images/kt.png')"
        }

        if (scene.dialog) {
            this.showCustomDialog(scene.dialog, () => {
                if (scene.action) scene.action()
                this.showScene(scene.next)
            })
            return
        }

        this.nameElement.textContent = ""
        this.textElement.textContent = scene.text

        scene.choices.forEach(choice => {
            if (choice.condition && !choice.condition()) return

            const btn = document.createElement("button")
            btn.textContent = choice.text
            btn.classList.add("leftBtn")

            btn.onclick = () => {
                const next = typeof choice.next === "function"
                    ? choice.next()
                    : choice.next

                if (typeof next === "string") this.showScene(next)
            }

            this.leftChoices.appendChild(btn)
        })
    }

    showCustomDialog(dialog, callback) {
        this.leftChoices.innerHTML = ""
        let index = 0

        const nextLine = () => {
            const line = dialog[index]
            this.nameElement.textContent = line.name

            this.typeText(line.text, () => {
                const btn = document.createElement("button")
                btn.textContent = "Dalej →"
                btn.classList.add("dialogBtn")

                btn.onclick = () => {
                    index++
                    if (index < dialog.length) nextLine()
                    else callback()
                }

                this.dialogChoices.innerHTML = ""
                this.dialogChoices.appendChild(btn)
            })
        }
        saveGame() {
            localStorage.setItem("detectiveSave", JSON.stringify(this.state))
        }

        loadGame() {
            const data = localStorage.getItem("detectiveSave")
            if (data) {
                Object.assign(this.state, JSON.parse(data))
                this.updateEvidenceUI()
            }
        }

        nextLine()
    }

    showEnding() {
        document.getElementById("characters").style.display = "none"
        const endingScreen = document.getElementById("endingScreen")
        const endingText = document.getElementById("endingText")

        document.getElementById("suspectsPanel").classList.add("hidden")

        this.leftChoices.innerHTML = ""
        this.dialogChoices.innerHTML = ""
        this.nameElement.textContent = ""
        this.textElement.textContent = ""

        endingScreen.classList.remove("hidden")

        let text = ""

        if (gameState.accused === "assistant") {
            text = "Złapałeś prawdziwego złodzieja.\n\n" +
                "Asystent miał klucz do gabinetu i znał jego zabezpieczenia. " +
                "Został zauważony wieczorem w pobliżu oraz uchwycony na nagraniach.\n\n" +
                "Wykorzystał martwy punkt kamery, aby uniknąć wykrycia. " +
                "Jako osoba zaufana wiedział, jak dostać się do manuskryptu bez wzbudzania podejrzeń.\n\n" +
                "Motyw był prosty — pieniądze. Rękopis miał ogromną wartość i mógł zostać sprzedany na czarnym rynku."
        } else if (gameState.accused === "student") {
            text = "To był zły wybór. Student jest niewinny.\n\n" +
                "Rzeczywiście był tego wieczoru na uczelni, ale nie mówił całej prawdy.\n\n" +
                "Spotkał się z kimś w tajemnicy i nie chciał, żeby ktokolwiek się o tym dowiedział. " +
                "Dlatego kręcił się w mniej uczęszczanej części budynku.\n\n" +
                "Kiedy został zapytany o szczegóły, spanikował i skłamał o godzinie.\n\n" +
                "Bał się konsekwencji prywatnych, nie prawnych.\n\n" +
                "Nie miał klucza ani powodu, żeby kraść manuskrypt.\n" +
                "Jego zachowanie było podejrzane, ale niezwiązane z przestępstwem."
        }
        else if (gameState.accused === "professor2") {
            text = "Profesor nie był winny.\n\n" +
                "Miał motyw, ale nie podjął żadnych działań.\n" +
                "To nie on dopuścił się kradzieży."
        }

        endingText.textContent = text
    }
}

const game = new Game()
