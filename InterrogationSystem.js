class InterrogationSystem {
    static BACKGROUNDS = {
        student:    "images/fs.png",
        assistant:  "images/ae.png",
        professor2: "images/fs.png",
    }

    static TIMER_DURATION = 90  // seconds per interrogation

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

        this._timerInterval  = null
        this._timeLeft       = 0
        this._timerEl        = document.getElementById("interrogationTimer")
        this._timerFill      = document.getElementById("timerFill")
        this._timerText      = document.getElementById("timerText")
    }

    _startTimer() {
        this._stopTimer()
        this._timeLeft = InterrogationSystem.TIMER_DURATION
        this._updateTimerUI()
        this._timerEl.classList.remove("hidden")

        this._timerInterval = setInterval(() => {
            this._timeLeft--
            this._updateTimerUI()

            if (this._timeLeft <= 0) {
                this._stopTimer()
                this._onTimerExpired()
            }
        }, 1000)
    }

    _pauseTimer() {
        if (this._timerInterval) {
            clearInterval(this._timerInterval)
            this._timerInterval = null
        }
    }

    _resumeTimer() {
        if (this._timeLeft > 0 && !this._timerInterval) {
            this._timerInterval = setInterval(() => {
                this._timeLeft--
                this._updateTimerUI()
                if (this._timeLeft <= 0) {
                    this._stopTimer()
                    this._onTimerExpired()
                }
            }, 1000)
        }
    }

    _stopTimer() {
        clearInterval(this._timerInterval)
        this._timerInterval = null
        if (this._timerEl) this._timerEl.classList.add("hidden")
    }

    _updateTimerUI() {
        if (!this._timerText || !this._timerFill) return
        const pct = this._timeLeft / InterrogationSystem.TIMER_DURATION

        this._timerText.textContent = this._timeLeft + "s"

        // Color shifts: green → yellow → red
        const hue = Math.round(pct * 120)
        this._timerFill.style.width      = (pct * 100) + "%"
        this._timerFill.style.background = `hsl(${hue}, 90%, 45%)`

        // Pulse when low
        if (this._timeLeft <= 15) {
            this._timerEl.classList.add("timer-urgent")
        } else {
            this._timerEl.classList.remove("timer-urgent")
        }
    }

    _onTimerExpired() {
        this.ui.clearChoices()
        this.ui.setName("Ty")
        this.ui.setText("Czas minął. Podejrzany odmawia dalszej rozmowy.")

        const btn = document.createElement("button")
        btn.textContent = "Odejdź"
        btn.classList.add("dialogBtn")
        btn.onclick = () => this.onExit()
        this.ui.dialogChoices.innerHTML = ""
        this.ui.dialogChoices.appendChild(btn)
    }

    /** @param {string} name*/
    start(name) {
        this.ui.showSuspect(this.characterImages[name] ?? "")

        const bg = InterrogationSystem.BACKGROUNDS[name]
        if (bg) this.ui.setBackground(bg)

        this.state.interrogation.current = name

        // Intro plays without timer — start timer after intro
        this.dialogSystem.showDialog(
            this.interrogations[name].intro,
            () => {
                this._startTimer()
                this._showQuestions()
            }
        )
    }

    _showQuestions() {
        const name = this.state.interrogation.current
        const data = this.interrogations[name]

        this.ui.clearChoices()
        this._resumeTimer()

        data.questions.forEach((q, index) => {
            const key = q.id ? `${name}_${q.id}` : `${name}_${index}`
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
            req => !this.state.isQuestionAsked(`${name}_${req}`)
        )
    }

    _askQuestion(q, key) {
        this.state.markQuestionAsked(key)
        this._pauseTimer()  // pause while dialog plays

        this.dialogSystem.showDialog(q.dialog, () => {
            if (q.evidence)      this.evidenceSystem.add(q.evidence)
            if (q.unlockCamera)  this.state.cameraUnlocked = true
            if (q.action)        q.action()

            this._showQuestions()  // _resumeTimer called inside _showQuestions
        })
    }

    _createExitButton() {
        const btn       = document.createElement("button")
        btn.textContent = "Zakończ rozmowę"
        btn.classList.add("leftBtn")
        btn.onclick     = () => {
            this._stopTimer()
            this.onExit()
        }
        return btn
    }
}
