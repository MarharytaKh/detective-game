class DialogSystem {
    /** @param {UIManager} ui */
    constructor(ui) {
        this.ui              = ui
        this.typingInterval  = null
    }

    // Public API

    /**
     *
     * @param {string}   text
     * @param {Function} [callback]
     */
    typeText(text, callback) {
        this._stopTyping()

        let i = 0
        this.ui.clearText()

        this.typingInterval = setInterval(() => {
            this.ui.appendChar(text[i])
            i++

            if (i >= text.length) {
                this._stopTyping()
                if (callback) callback()
            }
        }, 20)
    }

    /**
     *
     * @param {Array<{name: string, text: string}>} dialog
     * @param {Function} callback
     */
    showDialog(dialog, callback) {
        this.ui.leftChoices.innerHTML = ""
        let index = 0

        const showNext = () => {
            const line = dialog[index]
            this.ui.setName(line.name)

            this.typeText(line.text, () => {
                const btn = this._createNextButton(() => {
                    index++
                    if (index < dialog.length) showNext()
                    else callback()
                })

                this.ui.dialogChoices.innerHTML = ""
                this.ui.dialogChoices.appendChild(btn)
            })
        }

        showNext()
    }

    // Private

    _stopTyping() {
        if (this.typingInterval) {
            clearInterval(this.typingInterval)
            this.typingInterval = null
        }
    }

    _createNextButton(onClick) {
        const btn       = document.createElement("button")
        btn.textContent = "Dalej →"
        btn.classList.add("dialogBtn")
        btn.onclick     = onClick
        return btn
    }
}
