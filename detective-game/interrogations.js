window.interrogations = {
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
                ]
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
                    { name: "Ty", text: "Rozumiem." }
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
                    { name: "Student", text: "Nie, nie, nie chcę iść do więzienia. No dobrze. Co mi do tego. Widziałem, jak asystent profesora nerwowo kręcił się w skrzydle, w którym znajduje się gabinet. Więcej nie mam do powiedzenia." }
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
                evidence: "student_evening",
                action: () => {
                    gameState.flags.studentSpoke = true
                }
            }
        ]
    },

    assistant: {
        intro: [
            { name: "Ty", text: "Witam, wie Pan już o moim przyjeździe i o tym, kim jestem. Muszę zadać wam kilka pytań. Ma Pan chwilę?" },
            { name: "Asystent", text: "Oczywiście, proszę bardzo, mamy wystarczająco dużo czasu." },
            { name: "Ty", text: "Świetnie. Jest pan asystentem profesora historii sztuki, prawda?" },
            { name: "Asystent", text: "Tak" },
            { name: "Ty", text: "Czy mogę odtąd zwracać się do Pana na „ty”?" },
            { name: "Asystent", text: "Tak, jasne" }
        ],
        questions: [
            {
                text: "Masz klucz do gabinetu?",
                dialog: [
                    { name: "Ty", text: "Masz klucz do gabinetu, prawda?" },
                    { name: "Asystent", text: "Tak, mam klucz." },
                    { name: "Ty", text: "Czyli mogłeś wejść kiedy chciałeś." },
                    { name: "Asystent", text: "Oczywiście, proszę tylko, żeby nie traktować tego jako bezpośredniego dowodu na to, że mogłem coś ukraść" }
                ],
                evidence: "assistant_key"
            },
            {
                text: "Byłeś w gabinecie wieczorem?",
                dialog: [
                    { name: "Ty", text: "Zauważono cię w korytarzu przy gabinecie" },
                    { name: "Asystent", text: "Byłem tam, tak,to prawda" },
                    { name: "Ty", text: "Co tam robiłeś w tym czasie?" },
                    { name: "Asystent", text: "Zostawiłem w gabinecie prace studentów, które profesor zlecił mi sprawdzić, więc musiałem wrócić, żeby je zabrać" }
                ]
            },
            {
                text: "Czy ktoś może to potwierdzić?",
                dialog: [
                    { name: "Asystent", text: "Niestety nie, bo sam dobrze wiesz, że w gabinetach nie nagrywa się rozmów ze względu na poufność." }
                ]
            },
            {
                text: "Dlaczego kamera cię nie pokazuje dokładnie?",
                condition: () => gameState.evidence.includes("camera_blind_spot"),
                dialog: [
                    { name: "Asystent", text: "Bo kamera nie obejmuje wszystkiego." }
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
    },

    librarian: {
        intro: [
            { name: "Ty", text: "Chciałbym zadać kilka pytań." },
            { name: "Bibliotekarka", text: "Słucham." }
        ],
        questions: [
            {
                text: "Student wieczorem",
                dialog: [
                    { name: "Bibliotekarka", text: "Był, ale wyszedł wcześniej niż mówi." }
                ],
                evidence: "student_lie"
            }
        ]
    },

    secretary: {
        intro: [
            { name: "Ty", text: "Chciałbym zadać kilka pytań." },
            { name: "Sekretarka", text: "Słucham." }
        ],
        questions: [
            {
                text: "Klucze",
                dialog: [
                    { name: "Sekretarka", text: "Kopia klucza istnieje." }
                ],
                evidence: "fake_key"
            }
        ]
    },

    guard: {
        intro: [
            { name: "Ty", text: "Chciałbym zadać kilka pytań." },
            { name: "Ochroniarz", text: "Słucham." }
        ],
        questions: [
            {
                text: "Kto wychodził",
                dialog: [
                    { name: "Ochroniarz", text: "Asystent wychodził późno." }
                ],
                evidence: "assistant_evening"
            },
            {
                text: "Czy ktoś jeszcze",
                dialog: [
                    { name: "Ochroniarz", text: "Możliwe, kamera nie łapie wszystkiego." }
                ],
                evidence: "camera_blind_spot"
            }
        ]
    },

    phd: {
        intro: [
            { name: "Ty", text: "Chciałbym zadać kilka pytań." },
            { name: "Doktorant", text: "Słucham." }
        ],
        questions: [
            {
                text: "Konflikt",
                dialog: [
                    { name: "Doktorant", text: "Profesor był wściekły." }
                ],
                evidence: "conflict_professors"
            }
        ]
    }
}
