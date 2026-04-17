/**
 * Game — корневой класс-оркестратор.
 *
 * Единственная ответственность — собрать все подсистемы вместе (Composition Root)
 * и привязать глобальные точки входа (window.game, window.accuse).
 *
 * DIP: Game зависит от абстракций (систем), а не от конкретных реализаций.
 *      Все зависимости создаются здесь и передаются вниз через конструкторы.
 */
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
        // 0. Выбираем случайный сценарий — перезаписывает window.interrogations
        //    и window.storyEndings до того, как системы их прочитают
        StoryPicker.pick()

        // 1. Примитивные слои
        this.ui             = new UIManager()
        this.state          = new GameState()

        // 2. Системы без зависимостей от других систем
        this.evidenceSystem = new EvidenceSystem(this.state)
        this.dialogSystem   = new DialogSystem(this.ui)
        this.musicSystem    = new MusicSystem(this.ui)
        this.endingSystem   = new EndingSystem(this.ui)

        // 3. Фасад для data-файлов (scenes.js / interrogations.js)
        this.gameAPI        = new GameAPI(this.state, this.evidenceSystem)

        // 4. Системы высокого уровня
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

        // 5. Глобальные точки входа (для HTML-атрибутов и data-файлов)
        //    window.game используется из scenes.js и interrogations.js:
        //    addEvidence(), startInterrogation(), state.*
        window.game   = this
        window.accuse = (person) => this.accuse(person)

        this._bindEvents()
        this.evidenceSystem.init()
        this.showScene("start")
    }

    // --- Public API (вызывается из scenes.js через window.game или напрямую) --

    showScene(name) {
        this.sceneSystem.show(name)
    }

    startInterrogation(name) {
        this.interrogationSystem.start(name)
    }

    /** Для обратной совместимости с data-файлами: window.game.addEvidence(...) */
    addEvidence(item) {
        this.evidenceSystem.add(item)
    }

    accuse(person) {
        this.state.accused = person
        this.endingSystem.show(person)
    }

    // --- Private -----------------------------------------------------------

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

// Точка входа
const gameInstance = new Game()
