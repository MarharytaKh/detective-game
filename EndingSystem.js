class EndingSystem {
    static ENDINGS = {
        assistant:
            "Złapałeś prawdziwego złodzieja.\n\n" +
            "Asystent miał klucz do gabinetu i znał jego zabezpieczenia. " +
            "Został zauważony wieczorem w pobliżu oraz uchwycony na nagraniach.\n\n" +
            "Wykorzystał martwy punkt kamery, aby uniknąć wykrycia. " +
            "Jako osoba zaufana wiedział, jak dostać się do manuskryptu bez wzbudzania podejrzeń.\n\n" +
            "Motyw był prosty — pieniądze. Rękopis miał ogromną wartość i mógł zostać sprzedany na czarnym rynku.",

        student:
            "To był zły wybór. Student jest niewinny.\n\n" +
            "Rzeczywiście był tego wieczoru na uczelni, ale nie mówił całej prawdy.\n\n" +
            "Spotkał się z kimś w tajemnicy i nie chciał, żeby ktokolwiek się o tym dowiedział. " +
            "Dlatego kręcił się w mniej uczęszczanej części budynku.\n\n" +
            "Kiedy został zapytany o szczegóły, spanikował i skłamał o godzinie.\n\n" +
            "Bał się konsekwencji prywatnych, nie prawnych.\n\n" +
            "Nie miał klucza ani powodu, żeby kraść manuskrypt.\n" +
            "Jego zachowanie było podejrzane, ale niezwiązane z przestępstwem.",

        professor2:
            "Profesor nie był winny.\n\n" +
            "Miał motyw, ale nie podjął żadnych działań.\n" +
            "To nie on dopuścił się kradzieży.",
    }

    /** @param {UIManager} ui */
    constructor(ui) {
        this.ui             = ui
        this.screen         = document.getElementById("endingScreen")
        this.textElement    = document.getElementById("endingText")
        this.charactersEl   = document.getElementById("characters")
    }

    //Public API

    /** @param {string} accused  Klucz osk. ("assistant" | "student" | "professor2") */
    show(accused) {
        this.charactersEl.style.display = "none"
        this.ui.closePanel()
        this.ui.clearChoices()
        this.ui.setName("")
        this.ui.setText("")

        this.textElement.textContent = EndingSystem.ENDINGS[accused] ?? ""
        this.screen.classList.remove("hidden")
    }
}
