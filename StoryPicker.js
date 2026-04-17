/**
 * StoryPicker — выбирает случайный сценарий из StoryVariants и публикует:
 *   window.interrogations  — данные допросов для выбранного сценария
 *   window.storyEndings    — тексты финалов для выбранного сценария
 *   window.activeCulprit   — ключ виноватого (для отладки / расширений)
 *
 * SRP: только выбор и публикация сценария.
 * OCP: новый сценарий = новый объект в StoryVariants, StoryPicker не меняется.
 */
class StoryPicker {
    static pick() {
        const variants = window.StoryVariants
        const chosen   = variants[Math.floor(Math.random() * variants.length)]

        window.interrogations  = chosen.interrogations
        window.storyEndings    = chosen.endings
        window.activeCulprit   = chosen.culprit   // удобно при отладке

        return chosen
    }
}
