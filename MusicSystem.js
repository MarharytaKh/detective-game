class MusicSystem {
    static ICON_PLAYING = "images/so.png"
    static ICON_PAUSED  = "images/sf.png"

    /** @param {UIManager} ui */
    constructor(ui) {
        this.ui        = ui
        this.isPlaying = false
        this._initSlider()
    }
    play() {
        this.ui.music.play()
        this.ui.musicIcon.src = MusicSystem.ICON_PLAYING
        this.isPlaying        = true
    }

    pause() {
        this.ui.music.pause()
        this.ui.musicIcon.src = MusicSystem.ICON_PAUSED
        this.isPlaying        = false
    }

    toggle() {
        this.isPlaying ? this.pause() : this.play()
    }

    _initSlider() {
        const slider = this.ui.volumeSlider

        const update = () => {
            const percent = Number(slider.value)
            const start   = 6
            const end     = 93
            const fill    = start + (end - start) * percent

            slider.style.background =
                `linear-gradient(to right,
                    transparent ${start}%,
                    lime ${start}%,
                    lime ${fill}%,
                    transparent ${fill}%),
                url("images/bnslts.png")`

            slider.style.backgroundSize     = "100% 6px, 100% 100%"
            slider.style.backgroundPosition = "center, center"
            slider.style.backgroundRepeat   = "no-repeat"
        }

        slider.oninput = () => {
            this.ui.music.volume = slider.value
            update()
        }

        update()
    }
}
