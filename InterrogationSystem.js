class InterrogationSystem {
    static BACKGROUNDS = {
        student:    "images/fs.png",
        assistant:  "images/ae.png",
        professor2: "images/fs.png",
    }

    /**
     * @param {UIManager}      ui
     * @param {GameState}      state
     * @param {DialogSystem}   dialogSystem
     * @param {EvidenceSystem} evidenceSystem
     * @param {Object}         characterImages
     * @param {Object}         interrogations
     * @param {Function}       onExit
     */
    constructor(ui, state, dialogSystem, evidenceSystem, characterImages, interrogations, onExit) {
        this.ui              = ui
        this.state           = state
        this.dialogSystem    = dialogSystem
        this.evidenceSystem  = evidenceSystem
        this.characterImages = characterImages
        this.interrogations  = interrogations
        this.onExit          = onExit
    }

   

    /** @param {string} name*/
    start(name) {
        this.ui.showSuspect(this.characterImages[name] ?? "")

        const bg = InterrogationSystem.BACKGROUNDS[name]
        if (bg) this.ui.setBackground(bg)

        this.state.interrogation.current = name

        this.dialogSystem.showDialog(
            this.interrogations[name].intro,
            () => this._showQuestions()
        )
    }

    _showQuestions() {
        const name = this.state.interrogation.current
        const data = this.interrogations[name]

        this.ui.clearChoices()

        data.questions.forEach((q, index) => {
            const key = `${name}_${index}`
            const btn = this._createQuestionButton(q, key, name)
            this.ui.leftChoices.appendChild(btn)
        })

        this.ui.leftChoices.appendChild(this._createExitButton())
    }

    _createQuestionButton(q, key, name) {
        const btn       = document.createElement("button")
        btn.textContent = q.text ?? "???"
        btn.classList.add("leftBtn")

        if (this.state.isQuestionAsked(key)) {
            btn.classList.add("asked")
        } else {
            btn.classList.add("new")
        }
        if (this._isMissingRequires(q, name)) {
            btn.classList.add("locked")
            btn.onclick = () => alert(q.requiresHint ?? "To pytanie jest zablokowane")
            return btn
        }
        if (q.condition && !q.condition()) {
            btn.classList.add("locked")
            btn.onclick = () => alert(q.conditionHint ?? "Brak warunku")
            return btn
        }

        btn.onclick = () => this._askQuestion(q, key)
        return btn
    }

    _isMissingRequires(q, name) {
        if (!q.requires) return false
        return q.requires.some(
            req => !this.state.wasQuestionAskedFor(name, req)
        )
    }

    _askQuestion(q, key) {
        this.state.markQuestionAsked(key)

        this.dialogSystem.showDialog(q.dialog, () => {
            if (q.evidence)      this.evidenceSystem.add(q.evidence)
            if (q.unlockCamera)  this.state.cameraUnlocked = true
            if (q.action)        q.action()

            this._showQuestions()
        })
    }

    _createExitButton() {
        const btn       = document.createElement("button")
        btn.textContent = "Zakończ rozmowę"
        btn.classList.add("leftBtn")
        btn.onclick     = () => this.onExit()
        return btn
    }
}
