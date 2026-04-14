class UIManager {
    constructor() {
        this.textElement    = document.getElementById("text")
        this.nameElement    = document.getElementById("name")
        this.notebookBtn    = document.getElementById("notebookBtn")
        this.panel          = document.getElementById("suspectsPanel")
        this.closeBtn       = document.getElementById("closeSuspects")
        this.leftChoices    = document.getElementById("leftChoices")
        this.dialogChoices  = document.getElementById("dialogChoices")
        this.introScreen    = document.getElementById("introScreen")
        this.startGameBtn   = document.getElementById("startGameBtn")
        this.gameContainer  = document.getElementById("game")
        this.detectiveImg   = document.getElementById("detective")
        this.suspectImg     = document.getElementById("suspect")
        this.music          = document.getElementById("bgMusic")
        this.musicBtn       = document.getElementById("musicBtn")
        this.musicIcon      = document.getElementById("musicIcon")
        this.volumeSlider   = document.getElementById("volumeSlider")
    }

    // Choices

    clearChoices() {
        this.leftChoices.innerHTML  = ""
        this.dialogChoices.innerHTML = ""
    }

    // Background

    setBackground(imageUrl) {
        this.gameContainer.style.backgroundImage = `url('${imageUrl}')`
    }

    // Characters

    showSuspect(imageSrc) {
        this.suspectImg.src            = imageSrc
        this.suspectImg.style.display  = "block"
    }

    hideSuspect() {
        this.suspectImg.style.display = "none"
    }

    showDetective() {
        this.detectiveImg.style.display = "block"
    }

    hideDetective() {
        this.detectiveImg.style.display = "none"
    }

    // Dialog box

    setName(name) {
        this.nameElement.textContent = name
    }

    setText(text) {
        this.textElement.textContent = text
    }

    appendChar(char) {
        this.textElement.textContent += char
    }

    clearText() {
        this.textElement.textContent = ""
    }

    // Suspects panel

    openPanel() {
        this.panel.classList.remove("hidden")
    }

    closePanel() {
        this.panel.classList.add("hidden")
    }
}
