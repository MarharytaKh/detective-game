class EvidenceSystem {
    static DESCRIPTIONS = {
        assistant_evening:  "Asystent był widziany wieczorem",
        camera_assistant:   "Nagranie: asystent w gabinecie",
        assistant_key:      "Asystent ma klucz",
        key_access:         "Ktoś użył klucza",
        conflict_professors:"Konflikt między profesorami",
        student_motive:     "Student bardzo chciał manuskrypt",
        student_evening:    "Student był tego wieczoru w pobliżu gabinetu i zeznawał przeciwko asystentowi",
        professor_nervous:  "Profesor był zdenerwowany",
        camera_blind_spot:  "Kamera miała martwy punkt",
        student_lie:        "Student skłamał o czasie",
        assistant_lie:      "Asystent skłamał",
        professor_access:   "Profesor miał pośredni dostęp",
        fake_key:           "Istnieje drugi klucz",
        night_entry:        "Ktoś wszedł po godzinach",
        third_key_stolen:   "Trzeci klucz zniknął z sejfu",
        drawer_key:         "W szufladzie znaleziono klucz",
    }

    /**
     * @param {GameState} state
     */
    constructor(state) {
        this.state       = state
        this.listElement = document.getElementById("evidenceList")
    }

    //Public API
    add(item) {
        const added = this.state.addEvidence(item)
        if (added) this._render()
    }
    init() {
        this._render()
    }

    //Private
    _render() {
        this.listElement.innerHTML = ""

        this.state.evidence.forEach(key => {
            const li       = document.createElement("li")
            li.textContent = EvidenceSystem.DESCRIPTIONS[key] ?? key
            this.listElement.appendChild(li)
        })
    }
}
