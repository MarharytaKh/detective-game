class GameState {
    constructor() {
        this.evidence          = []
        this.computerChecked   = false
        this.cameraUnlocked    = false
        this.interrogation     = { current: null }
        this.flags             = { studentSpoke: false }
        this.askedQuestions    = {}
        this.accused           = null
    }

    addEvidence(item) {
        if (this.evidence.includes(item)) return false
        this.evidence.push(item)
        return true
    }

    hasEvidence(item) {
        return this.evidence.includes(item)
    }

    setFlag(key, value) {
        this.flags[key] = value
    }

    getFlag(key) {
        return !!this.flags[key]
    }
    markQuestionAsked(key) {
        this.askedQuestions[key] = true
    }

    isQuestionAsked(key) {
        return !!this.askedQuestions[key]
    }



    wasQuestionAskedFor(characterName, questionId) {
        return !!this.askedQuestions[`${characterName}_${questionId}`]
    }
}
