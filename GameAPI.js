class GameAPI {
    /**
     * @param {GameState}      state
     * @param {EvidenceSystem} evidenceSystem
     */
    constructor(state, evidenceSystem) {
        this.state          = state
        this._evidenceSystem = evidenceSystem
    }

    addEvidence(item) {
        this._evidenceSystem.add(item)
    }
}
