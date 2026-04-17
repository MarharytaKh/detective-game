/**
 * EndingSystem — показывает финальный экран.
 *
 * Тексты концовок приходят из window.storyEndings (выставляется StoryPicker),
 * поэтому EndingSystem не знает о конкретных сценариях.
 *
 * SRP: только отображение финала.
 * OCP: текст финала — снаружи; класс не меняется при добавлении новых сценариев.
 * DIP: принимает UIManager через конструктор.
 */
class EndingSystem {
    /** @param {UIManager} ui */
    constructor(ui) {
        this.ui           = ui
        this.screen       = document.getElementById("endingScreen")
        this.textElement  = document.getElementById("endingText")
        this.charactersEl = document.getElementById("characters")
    }

    // --- Public API --------------------------------------------------------

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
