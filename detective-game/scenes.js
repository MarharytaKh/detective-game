window.scenes = {

    start: {
        text: "Szukasz złodzieja cennego rękopisu. Musisz przesłuchać wszystkich potencjalnych sprawców i świadków, aby wyciągnąć właściwe wnioski.",
        choices: [
            { text: "Gabinet", next: "cabinet" },
            { text: "Student", next: () => startInterrogation("student") },
            { text: "Asystent", next: () => startInterrogation("assistant") },
            {
                text: "Drugi profesor",
                next: () => startInterrogation("professor2"),
                condition: () => gameState.computerChecked
            },
            {
                text: "Kamery",
                next: "camera",
                condition: () => gameState.cameraUnlocked
            },
            {
                text: "Bibliotekarka",
                next: () => startInterrogation("librarian"),
                condition: () => gameState.flags && gameState.flags.studentSpoke
            },
            {
                text: "Sekretarka",
                next: () => startInterrogation("secretary"),
                condition: () => gameState.evidence && gameState.evidence.includes("assistant_key")
            },
            {
                text: "Ochroniarz",
                next: () => startInterrogation("guard"),
                condition: () => gameState.cameraUnlocked
            },
            {
                text: "Doktorant",
                next: () => startInterrogation("phd"),
                condition: () => gameState.evidence && gameState.evidence.includes("conflict_professors")
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
        action: () => addEvidence("key_access"),
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
            addEvidence("conflict_professors")
            gameState.computerChecked = true
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
            addEvidence("student_motive")
            gameState.computerChecked = true
        },
        next: "computer"
    },

    camera: {
        dialog: [
            { name: "Ty", text: "Sprawdzam nagrania." },
            { name: "Ty", text: "Asystent wchodzi do gabinetu wieczorem." }
        ],
        action: () => {
            addEvidence("camera_assistant")
            addEvidence("camera_blind_spot")
        },
        next: "start"
    },

    drawer: {
        dialog: [
            { name: "Ty", text: "Szafka jest lekko uchylona." },
            { name: "Ty", text: "W środku kopia klucza." }
        ],
        action: () => addEvidence("fake_key"),
        next: "cabinet"
    },

    computer_logs: {
        dialog: [
            { name: "Ty", text: "Ktoś logował się późno." },
            { name: "Ty", text: "Godzina nie zgadza się zeznaniami studenta." }
        ],
        action: () => addEvidence("student_lie"),
        next: "computer"
    }

}
