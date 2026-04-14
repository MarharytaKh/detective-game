class SceneSystem {
    static OFFICE_SCENES = new Set(["cabinet", "lock", "computer", "drawer", "computer_logs"])

    static BACKGROUNDS = {
        office:          "images/po.png",
        mail_professor:  "images/mail_p.png",
        mail_student:    "images/mail_s.png",
        default:         "images/kt.png",
    }

    /**
     * @param {UIManager}    ui
     * @param {DialogSystem} dialogSystem
     * @param {GameAPI}      gameAPI
     * @param {Object}       scenes
     */
    constructor(ui, dialogSystem, gameAPI, scenes) {
        this.ui           = ui
        this.dialogSystem = dialogSystem
        this.gameAPI      = gameAPI
        this.scenes       = scenes
    }

    /** @param {string} name  */
    show(name) {
        const scene = this.scenes[name]

        this.ui.hideSuspect()
        this.ui.clearChoices()
        this._setBackground(name)
        this._toggleDetective(name)

        if (scene.dialog) {
            this._showDialogScene(scene)
            return
        }

        this._showChoiceScene(scene)
    }

    // Private 

    _setBackground(name) {
        if (SceneSystem.OFFICE_SCENES.has(name)) {
            this.ui.setBackground(SceneSystem.BACKGROUNDS.office)
        } else if (SceneSystem.BACKGROUNDS[name]) {
            this.ui.setBackground(SceneSystem.BACKGROUNDS[name])
        } else {
            this.ui.setBackground(SceneSystem.BACKGROUNDS.default)
        }
    }

    _toggleDetective(name) {
        const noDetective = name === "mail_professor" || name === "mail_student"
        noDetective ? this.ui.hideDetective() : this.ui.showDetective()
    }

    _showDialogScene(scene) {
        this.dialogSystem.showDialog(scene.dialog, () => {
            if (scene.action) scene.action(this.gameAPI)
            this.show(scene.next)
        })
    }

    _showChoiceScene(scene) {
        this.ui.setName("")
        this.ui.setText(scene.text)

        scene.choices.forEach(choice => {
            if (choice.condition && !choice.condition(this.gameAPI)) return

            const btn       = document.createElement("button")
            btn.textContent = choice.text
            btn.classList.add("leftBtn")

            btn.onclick = () => {
                const next = typeof choice.next === "function" ? choice.next() : choice.next
                if (typeof next === "string") this.show(next)
            }

            this.ui.leftChoices.appendChild(btn)
        })
    }
}
