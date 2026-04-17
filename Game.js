class Game {
    static CHARACTER_IMAGES = {
        student:    "images/sut.png",
        assistant:  "images/an.png",
        professor2: "images/pr.png",
        librarian:  "images/sutdu.png",
        secretary:  "images/bk.png",
        guard:      "images/guard.png",
        phd:        "images/jp.png",
    }

    constructor() {
        StoryPicker.pick()

        this.ui             = new UIManager()
        this.state          = new GameState()

        this.evidenceSystem = new EvidenceSystem(this.state)
        this.dialogSystem   = new DialogSystem(this.ui)
        this.musicSystem    = new MusicSystem(this.ui)
        this.endingSystem   = new EndingSystem(this.ui)

        this.gameAPI        = new GameAPI(this.state, this.evidenceSystem)

        this.interrogationSystem = new InterrogationSystem(
            this.ui,
            this.state,
            this.dialogSystem,
            this.evidenceSystem,
            Game.CHARACTER_IMAGES,
            window.interrogations,
            () => this.showScene("start")
        )

        this.sceneSystem = new SceneSystem(
            this.ui,
            this.dialogSystem,
            this.gameAPI,
            window.scenes
        )

        window.game   = this
        window.accuse = (person) => this.accuse(person)

        this._bindEvents()
        this.evidenceSystem.init()
        this.showScene("start")
    }
    showScene(name) {
        this.sceneSystem.show(name)
    }

    startInterrogation(name) {
        this.interrogationSystem.start(name)
    }

    addEvidence(item) {
        this.evidenceSystem.add(item)
    }

    accuse(person) {
        this.state.accused = person
        this.endingSystem.show(person)
    }

    _bindEvents() {
        this.ui.notebookBtn.onclick  = () => this.ui.openPanel()
        this.ui.closeBtn.onclick     = () => this.ui.closePanel()
        this.ui.musicBtn.onclick     = () => this.musicSystem.toggle()

        this.ui.startGameBtn.onclick = () => {
            this.ui.introScreen.style.display = "none"
            this.musicSystem.play()
        }
    }
}

const gameInstance = new Game()
