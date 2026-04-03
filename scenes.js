window.scenes = {

    start: {
        text: "Szukasz złodzieja cennego rękopisu. Musisz przesłuchać wszystkich potencjalnych sprawców i świadków, aby wyciągnąć właściwe wnioski.",
        choices: [
            { text: "Gabinet", next: "cabinet" },
            { text: "Student", next: () => window.game.startInterrogation("student") },
            { text: "Asystent", next: () => window.game.startInterrogation("assistant") },
            {
                text: "Drugi profesor",
                next: () => window.game.startInterrogation("professor2"),
                condition: () => window.game.state.computerChecked
            },
            {
                text: "Kamery",
                next: "camera",
                condition: () => window.game.state.cameraUnlocked
            },
            {
                text: "Bibliotekarka",
                next: () => window.game.startInterrogation("librarian"),
                condition: () => window.game.state.flags && window.game.state.flags.studentSpoke
            },
            {
                text: "Sekretarka",
                next: () => window.game.startInterrogation("secretary"),
                condition: () => window.game.state.evidence && window.game.state.evidence.includes("assistant_key")
            },
            {
                text: "Ochroniarz",
                next: () => window.game.startInterrogation("guard"),
                condition: () => window.game.state.cameraUnlocked
            },
            {
                text: "Doktorant",
                next: () => window.game.startInterrogation("phd"),
                condition: () => window.game.state.evidence && window.game.state.evidence.includes("conflict_professors")
            }
        ]
    },

    cabinet: {
        text: "Gabinet. Jest biurko i komputer.",
        choices: [
            { text: "Zamek", next: "lock" },
            { text: "Komputer", next: "computer" },
            { text: "Szafka", next: "drawer" },
            { text: "Wróć", next: "start" }
        ]
    },

    lock: {
        dialog: [
            { name: "Ty", text: "Zamek nie jest uszkodzony." },
            { name: "Ty", text: "Użyto klucza." }
        ],
        action: (game) => game.addEvidence("key_access"),
        next: "cabinet"
    },

    computer: {
        text: "Na komputerze są maile.",
        choices: [
            { text: "korespondencja z profesorem filologii", next: "mail_professor" },
            { text: "korespondencja ze studentem", next: "mail_student" },
            { text: "Logi systemowe", next: "computer_logs" },
            { text: "Wróć", next: "cabinet" }
        ]
    },

    mail_professor: {
        dialog: [
            { name: "Ty", text: "Profesor odmówił udostępnienia manuskryptu." },
            { name: "Ty", text: "Hm, sądząc po korespondencji, doszło między nimi do poważnego sporu..." },
            { name: "Ty", text: "Trzeba koniecznie znaleźć tego profesora i go przesłuchać." }
        ],
        action: () => {
            window.game.addEvidence("conflict_professors")
            window.game.state.computerChecked = true
        },
        next: "computer"
    },

    mail_student: {
        dialog: [
            { name: "Ty", text: "Wygląda na to, że ten student bardzo pragnie obejrzeć tę relikwię." },
            { name: "Ty", text: "I najwyraźniej profesor był temu zdecydowanie przeciwny. Hm, ja też nie powierzyłbym studentowi tak drogiej rzeczy. Zwłaszcza biorąc pod uwagę jego niecierpliwość." },
            { name: "Ty", text: "Trzeba znaleźć tego studenta i go przesłuchać." }
        ],
        action: () => {
            window.game.addEvidence("student_motive")
            window.game.state.computerChecked = true
        },
        next: "computer"
    },

    camera: {
        dialog: [
            { name: "Ty", text: "Sprawdzam nagrania." },
            { name: "Ty", text: "Asystent wchodzi do gabinetu wieczorem." }
        ],
        action: () => {
            window.game.addEvidence("camera_assistant")
            window.game.addEvidence("camera_blind_spot")
        },
        next: "start"
    },

    drawer: {
        dialog: [
            { name: "Ty", text: "Szafka jest lekko uchylona." },
            { name: "Ty", text: "W środku kopia klucza." }
        ],
        action: () => window.game.addEvidence("fake_key"),
        next: "cabinet"
    },

    computer_logs: {
        dialog: [
            { name: "Ty", text: "Ktoś logował się późno." },
            { name: "Ty", text: "Godzina nie zgadza się zeznaniami studenta." }
        ],
        action: () => window.game.addEvidence("student_lie"),
        next: "computer"
    }

}
