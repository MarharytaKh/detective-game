class StoryPicker {
    static pick() {
        const variants = window.StoryVariants
        const chosen   = variants[Math.floor(Math.random() * variants.length)]

        window.interrogations  = chosen.interrogations
        window.storyEndings    = chosen.endings
        window.activeCulprit   = chosen.culprit

        return chosen
    }
}
