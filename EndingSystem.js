class EndingSystem {
    /** @param {UIManager} ui */
    constructor(ui) {
        this.ui           = ui
        this.screen       = document.getElementById("endingScreen")
        this.textElement  = document.getElementById("endingText")
        this.charactersEl = document.getElementById("characters")
    }

    /** @param {string} accused  Ключ обвиняемого */
    show(accused) {
        this.charactersEl.style.display = "none"
        this.ui.closePanel()
        this.ui.clearChoices()
        this.ui.setName("")
        this.ui.setText("")

        const endings = window.storyEndings ?? {}
        this.textElement.textContent = endings[accused] ?? "Koniec."
        this.screen.classList.remove("hidden")
    }
}
