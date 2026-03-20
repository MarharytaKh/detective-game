const textElement = document.getElementById("text")
const nameElement = document.getElementById("name")
const notebookBtn = document.getElementById("notebookBtn")
const panel = document.getElementById("suspectsPanel")
const closeBtn = document.getElementById("closeSuspects")
const leftChoices = document.getElementById("leftChoices")
const dialogChoices = document.getElementById("dialogChoices")
const introScreen = document.getElementById("introScreen")
const startGameBtn = document.getElementById("startGameBtn")
const game = document.getElementById("game")
startGameBtn.onclick = () => {
    introScreen.style.display = "none"
}
const gameState = {
    evidence: [],
    computerChecked: false,
    cameraUnlocked: false,
    interrogation: {
        current: null
    }
}

notebookBtn.onclick = () => panel.classList.remove("hidden")
closeBtn.onclick = () => panel.classList.add("hidden")

const evidenceDescriptions = {
    assistant_evening: "Asystent był widziany wieczorem",
    camera_assistant: "Nagranie: asystent w gabinecie",
    assistant_key: "Asystent ma klucz",
    key_access: "Ktoś użył klucza",
    conflict_professors: "Konflikt między profesorami",

    student_motive: "Student bardzo chciał manuskrypt",
    student_evening: "student był tego wieczoru w pobliżu gabinetu i zeznawał przeciwko asystentowi",
    professor_nervous: "Profesor był zdenerwowany"
}

function addEvidence(item) {
    if (!gameState.evidence.includes(item)) {
        gameState.evidence.push(item)
        updateEvidenceUI()
    }
}

function updateEvidenceUI() {
    const list = document.getElementById("evidenceList")
    list.innerHTML = ""

    gameState.evidence.forEach(e => {
        const li = document.createElement("li")
        li.textContent = evidenceDescriptions[e]
        list.appendChild(li)
    })
}

function typeText(text, callback) {
    let i = 0
    textElement.textContent = ""

    const interval = setInterval(() => {
        textElement.textContent += text[i]
        i++
        if (i >= text.length) {
            clearInterval(interval)
            callback()
        }
    }, 20)
}

const interrogations = {

    student: {
        intro: [
            { name: "Ty", text: "Cześć, musimy pogadać. Wszystko w porządku, ale muszę zadać ci kilka pytań." },
            { name: "Student", text: "No dobrze, ale ja nic nie zrobiłem, jeśli o to chodzi." },
            { name: "Ty", text: "Pewnie już wiesz. Z gabinetu profesora z katedry historii zniknął cenny rękopis. Cenny zarówno pod względem kulturowym, jak i finansowym." },
            { name: "Student", text: "Wiem... wszyscy o tym gadają." },
            { name: "Ty", text: "Wiesz, dlaczego pytam właśnie ciebie?" },
            { name: "Student", text: "*Zaczyna się stresować.*" },
            { name: "Ty", text: "Powiem wprost. Wiem, że jesteś wzorowym studentem, więc twoje aktywne zainteresowanie rękopisem jest zrozumiałe. Jednak właśnie z tego powodu jesteś również traktowany jako potencjalny złodziej." }
        ],

        questions: [
            {
                text: "Dlaczego interesowałeś się manuskryptem?",
                dialog: [
                    { name: "Ty", text: "Wysłałeś maila z prośbą o dostęp.Widziałem twoje prośby w wiadomościach e-mail profesora." },
                    { name: "Student", text: "No bo to ważne... każdy by chciał to zobaczyć. A ja, jako student studiów magisterskich na wydziale historii, bardzo chciałem zapoznać się z tym rękopisem, a przynajmniej go zobaczyć." },
                    { name: "Ty", text: "Byłeś bardzo zdeterminowany i uparty w swoich prośbach." },
                    { name: "Student", text: "Może trochę..." }
                ],

            },
            {
                text: "Gdzie byłeś wieczorem?",
                dialog: [
                    { name: "Ty", text: "Gdzie byłeś wieczorem w dniu zaginięcia?" },
                    { name: "Ty", text: "Podaj dokładnie." },
                    { name: "Student", text: "Jak zwykle spędziłem wieczór w bibliotece uniwersyteckiej, a potem, około godziny 20:00, poszedłem do swojego pokoju w akademiku" },
                    { name: "Ty", text: "Świetnie, kto może potwierdzić twoje zeznania?" },
                    { name: "Student", text: "Nie wiem, w bibliotece nie ma zbyt wielu ludzi, zwłaszcza wieczorem; być może są tam kamery. A jeśli chodzi o akademik, to przy wejściu stoi tylko kierowniczka." },
                    { name: "Ty", text: "A drugi współlokator? Przecież nie mieszkasz sam, prawda?" },
                    { name: "Student", text: "Nie, mam współlokatora. Ale mój sąsiad to straszny imprezowicz i wrócił z klubu nad ranem, więc nic nie wie i nic nie powie." },
                    { name: "Ty", text: "Rozumiem." },
                ]
            },
            {
                text: "Co widziałeś przy gabinecie?",
                dialog: [
                    { name: "Ty", text: "Nie masz już nic do powiedzenia, może widziałeś kogoś podejrzanego?" },
                    { name: "Student", text: "*jest zdenerwowany*..." },
                    { name: "Ty", text: "Nie milcz, bo lepiej opowiedz o wszystkim, co widziałeś, biorąc pod uwagę, że do późna na uniwersytecie było mało ludzi, jak sam mówisz." },
                    { name: "Student", text: "..." },
                    { name: "Ty", text: "Bo jeśli nie będę miał wystarczających dowodów i poszlak, mogę nie dowiedzieć się wszystkiego i oskarżyć niewłaściwą osobę." },
                    { name: "Student", text: "..." },
                    { name: "Ty", text: "Na przykład ciebie." },
                    { name: "Student", text: "Nie, nie, nie chcę iść do więzienia. No dobrze. Co mi do tego. Widziałem, jak asystent profesora nerwowo kręcił się w skrzydle, w którym znajduje się gabinet. Więcej nie mam do powiedzenia." },
                ],
                evidence: "assistant_evening"
            },
            {
                text: "Dlaczego tam byłeś?",
                dialog: [
                    { name: "Student", text: "Skracałem drogę." },
                    { name: "Ty", text: "O tej godzinie?" },
                    { name: "Student", text: "...no dobra, może nie brzmi to najlepiej. Ale to prawda." }
                ],
                evidence: "student_evening"
            }
        ]
    },

    assistant: {
        intro: [
            { name: "Ty", text: "Musimy wyjaśnić kilka rzeczy." },
            { name: "Asystent", text: "Nie mam czasu na przesłuchania." },
            { name: "Ty", text: "Masz problem, więc znajdziesz czas." },
            { name: "Asystent", text: "...o co chodzi?" },
            { name: "Ty", text: "O manuskrypt." },
            { name: "Asystent", text: "(Milczy chwilę)" }
        ],

        questions: [
            {
                text: "Masz klucz do gabinetu?",
                dialog: [
                    { name: "Ty", text: "Masz dostęp, prawda?" },
                    { name: "Asystent", text: "Tak, mam klucz." },
                    { name: "Ty", text: "Czyli mogłeś wejść kiedy chciałeś." },
                    { name: "Asystent", text: "To nic nie znaczy." }
                ],
                evidence: "assistant_key"
            },
            {
                text: "Byłeś w gabinecie wieczorem?",
                dialog: [
                    { name: "Ty", text: "Byłeś tam po godzinach." },
                    { name: "Asystent", text: "Nie." },
                    { name: "Ty", text: "Mamy świadka." },
                    { name: "Asystent", text: "...to pomyłka." }
                ]
            },
            {
                text: "Po co wracałeś na uczelnię?",
                dialog: [
                    { name: "Ty", text: "Kamery mogą to sprawdzić." },
                    { name: "Asystent", text: "..." },
                    { name: "Asystent", text: "Miałem coś do dokończenia." },
                    { name: "Ty", text: "(Wygląda na spiętego.)" }
                ]
            },
            {
                text: "Czy ktoś może to potwierdzić?",
                dialog: [
                    { name: "Asystent", text: "Nie potrzebuję świadków." },
                    { name: "Ty", text: "(Unika odpowiedzi.)" }
                ]
            }
        ]
    },

    professor2: {
        intro: [
            { name: "Ty", text: "Panie profesorze, chciałbym zadać kilka pytań." },
            { name: "Profesor", text: "Proszę bardzo." },
            { name: "Ty", text: "Chodzi o manuskrypt." },
            { name: "Profesor", text: "Domyślam się." },
            { name: "Ty", text: "(Zbyt spokojny.)" }
        ],

        questions: [
            {
                text: "Dlaczego chciał Pan manuskrypt?",
                dialog: [
                    { name: "Ty", text: "Prosił Pan o dostęp." },
                    { name: "Profesor", text: "To naturalne w pracy naukowej." },
                    { name: "Ty", text: "Odmówiono Panu." },
                    { name: "Profesor", text: "...tak." },
                    { name: "Ty", text: "(Wyraźne napięcie.)" }
                ],
                evidence: "conflict_professors"
            },
            {
                text: "Czy był Pan zdenerwowany?",
                dialog: [
                    { name: "Ty", text: "Reakcja była dość emocjonalna." },
                    { name: "Profesor", text: "To poważna sprawa." },
                    { name: "Ty", text: "(Może coś ukrywa... albo nie.)" }
                ],
                evidence: "professor_nervous"
            },
            {
                text: "Kiedy Pan wyszedł z uczelni?",
                dialog: [
                    { name: "Ty", text: "Dokładna godzina?" },
                    { name: "Profesor", text: "Około 18:00." },
                    { name: "Ty", text: "Można to zweryfikować?" },
                    { name: "Profesor", text: "Tak. Kamery przy wyjściu." },
                    { name: "Ty", text: "(To otwiera dostęp do nagrań.)" }
                ],
                unlockCamera: true
            },
            {
                text: "Czy miał Pan dostęp do gabinetu?",
                dialog: [
                    { name: "Profesor", text: "Nie posiadałem klucza." },
                    { name: "Ty", text: "(Czyli ktoś inny musiał wejść.)" }
                ]
            }
        ]
    }

}
const scenes = {

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
            }
        ]
    },

    cabinet: {
        text: "Gabinet. Jest biurko i komputer.",
        choices: [
            { text: "Zamek", next: "lock" },
            { text: "Komputer", next: "computer" },
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
            { name: "Ty", text: "Trzeba znaleźć tego studenta i go przesłuchać." },
            
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
        action: () => addEvidence("camera_assistant"),
        next: "start"
    }

}

function startInterrogation(name) {
    gameState.interrogation.current = name
    showCustomDialog(interrogations[name].intro, () => showQuestions())
}

function showQuestions() {

    const data = interrogations[gameState.interrogation.current]

    leftChoices.innerHTML = ""
    dialogChoices.innerHTML = ""

    data.questions.forEach((q, index) => {

        const btn = document.createElement("button")
        btn.textContent = q.text
        btn.classList.add("leftBtn")

        btn.onclick = () => {

            showCustomDialog(q.dialog, () => {

                if (q.evidence) addEvidence(q.evidence)

                if (q.unlockCamera) gameState.cameraUnlocked = true

                showQuestions()
            })
        }

        leftChoices.appendChild(btn)
    })

    const exitBtn = document.createElement("button")
    exitBtn.textContent = "Zakończ rozmowę"
    exitBtn.classList.add("leftBtn")

    exitBtn.onclick = () => showScene("start")

    leftChoices.appendChild(exitBtn)
}

function showScene(name) {

    const scene = scenes[name]

    leftChoices.innerHTML = ""
    dialogChoices.innerHTML = ""

    if (name === "cabinet" || name === "lock" || name === "computer") {
        game.style.backgroundImage = "url('images/po.png')"
    } else {
        game.style.backgroundImage = "url('images/kt.png')"
    }
    if (scene.dialog) {
        showCustomDialog(scene.dialog, () => {
            if (scene.action) scene.action()
            showScene(scene.next)
        })
        return
    }

    nameElement.textContent = ""
    textElement.textContent = scene.text

    scene.choices.forEach(choice => {

        if (choice.condition && !choice.condition()) return

        const btn = document.createElement("button")
        btn.textContent = choice.text
        btn.classList.add("leftBtn")

        btn.onclick = () => {
            const next = typeof choice.next === "function"
                ? choice.next()
                : choice.next
            if (typeof next === "string") showScene(next)
        }

        leftChoices.appendChild(btn)
    })
}

function showCustomDialog(dialog, callback) {

    leftChoices.innerHTML = ""

    let index = 0

    function nextLine() {
        const line = dialog[index]
        nameElement.textContent = line.name

        typeText(line.text, () => {

            const btn = document.createElement("button")
            btn.textContent = "Dalej →"
            btn.classList.add("dialogBtn")

            btn.onclick = () => {
                index++
                if (index < dialog.length) nextLine()
                else callback()
            }

            dialogChoices.innerHTML = ""
            dialogChoices.appendChild(btn)
        })
    }

    nextLine()
}

updateEvidenceUI()
showScene("start")
