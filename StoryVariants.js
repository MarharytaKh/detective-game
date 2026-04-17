window.StoryVariants = [
    {
        culprit: "assistant",

        endings: {
            assistant:
                "Złapałeś prawdziwego złodzieja.\n\n" +
                "Asystent miał klucz do gabinetu i znał jego zabezpieczenia. " +
                "Został zauważony wieczorem w pobliżu oraz uchwycony na nagraniach.\n\n" +
                "Wykorzystał martwy punkt kamery, aby uniknąć wykrycia. " +
                "Jako osoba zaufana wiedział, jak dostać się do manuskryptu bez wzbudzania podejrzeń.\n\n" +
                "Motyw był prosty — pieniądze. Rękopis miał ogromną wartość i mógł zostać sprzedany na czarnym rynku.",

            student:
                "To był zły wybór. Student jest niewinny.\n\n" +
                "Był tego wieczoru na uczelni, ale tylko dlatego, że spotykał się z kimś w tajemnicy. " +
                "Spanikował podczas przesłuchania i skłamał o godzinie — bał się prywatnych konsekwencji, nie prawnych.\n\n" +
                "Nie miał klucza ani realnego dostępu do gabinetu.\n\n" +
                "Prawdziwy złodziej — asystent — zdążył już zacierać ślady.",

            professor2:
                "Profesor jest niewinny.\n\n" +
                "Miał motyw, ale nie działał. Jego zachowanie było podejrzane właśnie przez " +
                "poczucie winy — wiedział, że konflikt z kolegą mógł go pogrążyć w oczach śledczego.\n\n" +
                "Prawdziwy złodziej — asystent — uniknął sprawiedliwości.",
        },

        interrogations: {

            student: {
                intro: [
                    { name: "Ty", text: "Cześć, musimy pogadać. Muszę zadać ci kilka pytań." },
                    { name: "Student", text: "Dobrze, ale ja nic nie zrobiłem." },
                    { name: "Ty", text: "Z gabinetu profesora zniknął cenny rękopis. Wiem, że bardzo chciałeś go zobaczyć." },
                    { name: "Student", text: "Wiem... wszyscy o tym gadają." },
                    { name: "Ty", text: "Właśnie dlatego z tobą rozmawiam." },
                ],
                questions: [
                    {
                        id: "student_why_manuscript",
                        text: "Dlaczego interesowałeś się manuskryptem?",
                        dialog: [
                            { name: "Ty", text: "Wysłałeś wiele maili z prośbą o dostęp. Profesor odmawiał." },
                            { name: "Student", text: "To ważne źródło historyczne. Każdy student historii by chciał." },
                            { name: "Ty", text: "Byłeś jednak wyjątkowo natarczywy." },
                            { name: "Student", text: "Może trochę... ale to nie przestępstwo." },
                        ]
                    },
                    {
                        id: "student_where_evening",
                        text: "Gdzie byłeś wieczorem?",
                        dialog: [
                            { name: "Ty", text: "Gdzie byłeś dokładnie wieczorem w dniu kradzieży?" },
                            { name: "Student", text: "W bibliotece do około dwudziestej, potem poszedłem do akademika." },
                            { name: "Ty", text: "Kto może to potwierdzić?" },
                            { name: "Student", text: "Kierowniczka przy wejściu do akademika. W bibliotece... może kamery." },
                        ],
                        action: () => { window.game.state.flags.studentSpoke = true }
                    },
                    {
                        id: "student_why_here",
                        text: "Dlaczego tam byłeś?",
                        requires: ["student_where_evening"],
                        requiresHint: "Najpierw zapytaj, gdzie był wieczorem.",
                        dialog: [
                            { name: "Student", text: "Skracałem drogę przez ten korytarz." },
                            { name: "Ty", text: "O dwudziestej? Przez skrzydło, w którym jest gabinet profesora?" },
                            { name: "Student", text: "...no, może to dziwnie brzmi. Ale tak było." },
                        ],
                        evidence: "student_evening"
                    },
                    {
                        id: "student_seen_someone",
                        text: "Co widziałeś przy gabinecie?",
                        requires: ["student_why_here"],
                        requiresHint: "Najpierw zapytaj, dlaczego tam był.",
                        dialog: [
                            { name: "Ty", text: "Byłeś blisko. Widziałeś coś podejrzanego?" },
                            { name: "Student", text: "..." },
                            { name: "Ty", text: "Jeśli nie powiesz, mogę wyciągnąć złe wnioski — na przykład o tobie." },
                            { name: "Student", text: "Dobra! Widziałem asystenta. Nerwowo kręcił się przy gabinecie. Więcej nie wiem." },
                        ],
                        evidence: "assistant_evening"
                    }
                ]
            },

            assistant: {
                intro: [
                    { name: "Ty", text: "Dzień dobry. Muszę zadać kilka pytań w sprawie rękopisu." },
                    { name: "Asystent", text: "Oczywiście, służę pomocą." },
                    { name: "Ty", text: "Jest pan asystentem profesora historii sztuki, prawda?" },
                    { name: "Asystent", text: "Tak, od trzech lat." },
                ],
                questions: [
                    {
                        id: "assistant_has_key",
                        text: "Masz klucz do gabinetu?",
                        dialog: [
                            { name: "Ty", text: "Ma pan klucz do gabinetu?" },
                            { name: "Asystent", text: "Tak, mam. To niezbędne do pracy." },
                            { name: "Ty", text: "Czyli ma pan swobodny dostęp o każdej porze." },
                            { name: "Asystent", text: "Tak, ale proszę nie traktować tego jako dowodu winy." },
                        ],
                        evidence: "assistant_key"
                    },
                    {
                        id: "assistant_evening",
                        text: "Byłeś w gabinecie wieczorem?",
                        requires: ["assistant_has_key"],
                        requiresHint: "Najpierw zapytaj o klucz.",
                        condition: () => {
                            const ev = window.game.state.evidence
                            return ev.includes("assistant_evening") || ev.includes("camera_assistant")
                        },
                        conditionHint: "Potrzebujesz dowodu że asystent był wieczorem przy gabinecie.",
                        dialog: [
                            { name: "Ty", text: "Widziano pana w korytarzu przy gabinecie wieczorem." },
                            { name: "Asystent", text: "To prawda. Wróciłem po prace studentów, które zostawiłem." },
                            { name: "Ty", text: "O której godzinie dokładnie?" },
                            { name: "Asystent", text: "Około... dwudziestej drugiej. Może dwudziestej trzeciej. Nie pamiętam dokładnie." },
                            { name: "Ty", text: "Dość późno jak na odbiór prac." },
                            { name: "Asystent", text: "Zapomniałem wcześniej. Zdarza się." },
                        ]
                    },
                    {
                        id: "assistant_alibi",
                        text: "Czy ktoś może to potwierdzić?",
                        requires: ["assistant_evening"],
                        requiresHint: "Najpierw zapytaj, czy był wieczorem.",
                        dialog: [
                            { name: "Ty", text: "Ktoś może potwierdzić pana obecność?" },
                            { name: "Asystent", text: "Niestety nie. Byłem sam. W gabinetach nie ma kamer." },
                            { name: "Ty", text: "Wie pan, że to pana zeznanie jest niemożliwe do zweryfikowania." },
                            { name: "Asystent", text: "Rozumiem. Ale mówię prawdę." },
                        ]
                    }
                ]
            },

            professor2: {
                intro: [
                    { name: "Ty", text: "Panie profesorze, muszę zadać kilka pytań." },
                    { name: "Profesor", text: "Proszę bardzo." },
                    { name: "Ty", text: "Chodzi o zaginiony rękopis." },
                    { name: "Profesor", text: "Domyślam się." },
                ],
                questions: [
                    {
                        id: "prof2_motive",
                        text: "Prosił pan o dostęp do rękopisu?",
                        dialog: [
                            { name: "Ty", text: "Prosił pan o dostęp do manuskryptu i spotkał się z odmową." },
                            { name: "Profesor", text: "To naturalne w pracy naukowej. Takie spory zdarzają się często." },
                            { name: "Ty", text: "Odmowa była jednak dość ostra." },
                            { name: "Profesor", text: "...tak. Ale to nie powód, żeby kraść." },
                        ],
                        evidence: "conflict_professors"
                    },
                    {
                        id: "prof2_when_left",
                        text: "Kiedy pan wyszedł?",
                        dialog: [
                            { name: "Ty", text: "O której opuścił pan budynek w dniu kradzieży?" },
                            { name: "Profesor", text: "Około osiemnastej. Kamery przy wyjściu potwierdzą." },
                            { name: "Ty", text: "I nie wracał pan później?" },
                            { name: "Profesor", text: "Nie. Prosto do domu." },
                        ],
                        unlockCamera: true
                    }
                ]
            },

            librarian: {
                intro: [
                    { name: "Ty", text: "Dzień dobry. Muszę potwierdzić pewną informację." },
                    { name: "Bibliotekarka", text: "Słucham." }
                ],
                questions: [
                    {
                        id: "librarian_student",
                        text: "Student wieczorem w bibliotece",
                        dialog: [
                            { name: "Ty", text: "Czy student Piotr Lojoński był wczoraj w bibliotece wieczorem?" },
                            { name: "Bibliotekarka", text: "Był, ale wyszedł wcześniej niż twierdzi. Przed dziewiętnastą." },
                        ],
                        evidence: "student_lie"
                    }
                ]
            },

            secretary: {
                intro: [
                    { name: "Ty", text: "Chciałbym zapytać o klucze do gabinetu." },
                    { name: "Sekretarka", text: "Słucham." }
                ],
                questions: [
                    {
                        id: "secretary_keys",
                        text: "Ile jest kopii klucza?",
                        dialog: [
                            { name: "Ty", text: "Kto posiada klucze do gabinetu 302b?" },
                            { name: "Sekretarka", text: "Trzy klucze: profesor, asystent i jeden zapasowy w sejfie." },
                            { name: "Ty", text: "Klucz z sejfu jest na miejscu?" },
                            { name: "Sekretarka", text: "Sprawdziłam rano. Jest." },
                        ],
                        evidence: "fake_key"
                    }
                ]
            },

            phd: {
                intro: [
                    { name: "Ty", text: "Słyszałem, że zna pani kulisy konfliktu między profesorami." },
                    { name: "Doktorantka", text: "Lepiej uważać z tym, co się mówi. Ale powiem, co wiem." },
                ],
                questions: [
                    {
                        id: "phd_conflict",
                        text: "Co się stało między nimi?",
                        dialog: [
                            { name: "Doktorantka", text: "Kilka lat temu wspólny grant. Wyniki nie pasowały do hipotezy." },
                            { name: "Ty", text: "I?" },
                            { name: "Doktorantka", text: "Jeden chciał opublikować jak jest. Drugi naciskał na 'korektę' danych." },
                            { name: "Ty", text: "Wykryto to?" },
                            { name: "Doktorantka", text: "Tak. Grant cofnięto. Od tamtej pory — cisza, ale chłodna." },
                        ],
                        evidence: "conflict_professors"
                    }
                ]
            }
        }
    },

    {
        culprit: "student",

        endings: {
            student:
                "Znakomita robota. Student był prawdziwym złodziejem.\n\n" +
                "Piotr Lojoński przez miesiące obsesyjnie starał się o dostęp do rękopisu. " +
                "Gdy profesor ostatecznie odmówił, postanowił działać sam.\n\n" +
                "Skopiował klucz podczas wizyty w gabinecie — profesor wpuścił go kiedyś, żeby oddać pracę zaliczeniową. " +
                "Wieczorem wrócił, wykorzystując martwy punkt kamery.\n\n" +
                "Jego zeznanie o bibliotece było kłamstwem. Bibliotekarka potwierdziła, że wyszedł wcześniej. " +
                "Miał czas, motyw i środki.",

            assistant:
                "To był błąd. Asystent jest niewinny.\n\n" +
                "Rzeczywiście był wieczorem przy gabinecie, ale po swoje dokumenty — " +
                "co potwierdza dziennik wejść do systemu.\n\n" +
                "Prawdziwy złodziej — student — sprytnie skierował podejrzenia na asystenta. " +
                "Wiedział, że jego obecność w korytarzu wzbudzi wątpliwości.",

            professor2:
                "Profesor jest niewinny.\n\n" +
                "Jego konflikt z kolegą był realny, ale nie posunął się do kradzieży. " +
                "Wyszedł o osiemnastej — kamery to potwierdzają.\n\n" +
                "Student zdążył już sprzedać rękopis.",
        },

        interrogations: {

            student: {
                intro: [
                    { name: "Ty", text: "Musimy porozmawiać o rękopisie." },
                    { name: "Student", text: "Słucham. Coś mogę pomóc?" },
                    { name: "Ty", text: "Może. Wiem, że bardzo zależało ci na dostępie do manuskryptu." },
                    { name: "Student", text: "Tak, ale profesor nie chciał... To frustrujące, ale rozumiałem." },
                    { name: "Ty", text: "Naprawdę rozumiałeś?" },
                    { name: "Student", text: "*lekka pauza* Oczywiście." },
                ],
                questions: [
                    {
                        id: "student_why_manuscript",
                        text: "Dlaczego tak bardzo chciałeś dostępu?",
                        dialog: [
                            { name: "Ty", text: "Wysłałeś kilkanaście maili w ciągu dwóch tygodni. To wyjątkowe zaangażowanie." },
                            { name: "Student", text: "To temat mojej pracy magisterskiej. Bez tego źródła cały rozdział wisi w powietrzu." },
                            { name: "Ty", text: "Na tyle ważny, żeby działać poza procedurami?" },
                            { name: "Student", text: "Nie wiem, co pan sugeruje." },
                        ]
                    },
                    {
                        id: "student_where_evening",
                        text: "Gdzie byłeś wieczorem?",
                        dialog: [
                            { name: "Ty", text: "Gdzie byłeś wieczorem w dniu zaginięcia rękopisu?" },
                            { name: "Student", text: "W bibliotece. Siedziałem tam do dwudziestej, potem poszedłem do akademika." },
                            { name: "Ty", text: "Kto może potwierdzić?" },
                            { name: "Student", text: "Bibliotekarka widziała mnie. Kamery też pewnie nagrały." },
                            { name: "Ty", text: "A między dziewiętnastą a dwudziestą?" },
                            { name: "Student", text: "...byłem w bibliotece. Mówiłem." },
                        ],
                        action: () => { window.game.state.flags.studentSpoke = true }
                    },
                    {
                        id: "student_why_here",
                        text: "Znasz układ budynku?",
                        requires: ["student_where_evening"],
                        requiresHint: "Najpierw zapytaj, gdzie był wieczorem.",
                        dialog: [
                            { name: "Ty", text: "Byłeś w gabinecie profesora przed kradzieżą — oddawał pan pracę zaliczeniową, prawda?" },
                            { name: "Student", text: "Tak, ale to było tygodnie temu." },
                            { name: "Ty", text: "Wystarczy, żeby zapamiętać układ zamka." },
                            { name: "Student", text: "To absurd." },
                        ],
                        evidence: "student_evening"
                    },
                    {
                        id: "student_seen_someone",
                        text: "Co widziałeś przy gabinecie?",
                        requires: ["student_why_here"],
                        requiresHint: "Najpierw zapytaj o układ budynku.",
                        dialog: [
                            { name: "Ty", text: "Strażnik widział kogoś przy gabinecie wieczorem. Sylwetka pasuje do ciebie." },
                            { name: "Student", text: "To niemożliwe, byłem w bibliotece!" },
                            { name: "Ty", text: "Bibliotekarka mówi, że wyszedłeś przed dziewiętnastą." },
                            { name: "Student", text: "*milczenie*" },
                            { name: "Ty", text: "Masz komentarz?" },
                            { name: "Student", text: "...muszę pomyśleć." },
                        ],
                        evidence: "student_lie"
                    }
                ]
            },

            assistant: {
                intro: [
                    { name: "Ty", text: "Dzień dobry. Kilka pytań w związku ze śledztwem." },
                    { name: "Asystent", text: "Oczywiście. Chętnie pomogę." },
                    { name: "Ty", text: "Jest pan asystentem od trzech lat. Zna pan gabinet dobrze." },
                    { name: "Asystent", text: "Bardzo dobrze. To moje miejsce pracy." },
                ],
                questions: [
                    {
                        id: "assistant_has_key",
                        text: "Masz klucz do gabinetu?",
                        dialog: [
                            { name: "Ty", text: "Ma pan klucz do gabinetu?" },
                            { name: "Asystent", text: "Tak. Niezbędny do codziennej pracy." },
                            { name: "Ty", text: "Klucz był zawsze przy panu?" },
                            { name: "Asystent", text: "Tak, zawsze. Chyba że... chwileczkę." },
                            { name: "Ty", text: "Słucham." },
                            { name: "Asystent", text: "Tygodnie temu student przyniósł pracę zaliczeniową. Był chwilę sam przy biurku, kiedy wychodziłem odebrać telefon. Klucz leżał na biurku." },
                        ],
                        evidence: "assistant_key"
                    },
                    {
                        id: "assistant_evening",
                        text: "Byłeś w gabinecie wieczorem?",
                        requires: ["assistant_has_key"],
                        requiresHint: "Najpierw zapytaj o klucz.",
                        condition: () => {
                            const ev = window.game.state.evidence
                            return ev.includes("assistant_evening") || ev.includes("camera_assistant")
                        },
                        conditionHint: "Potrzebujesz dowodu że asystent był wieczorem przy gabinecie.",
                        dialog: [
                            { name: "Ty", text: "Widziano pana wieczorem w korytarzu." },
                            { name: "Asystent", text: "Tak. Wróciłem po dokumenty, które zostawiłem. To łatwe do zweryfikowania — logowałem się do systemu." },
                            { name: "Ty", text: "To ważna informacja." },
                            { name: "Asystent", text: "Nie mam nic do ukrycia." },
                        ]
                    },
                    {
                        id: "assistant_alibi",
                        text: "Czy ktoś może to potwierdzić?",
                        requires: ["assistant_evening"],
                        requiresHint: "Najpierw zapytaj, czy był wieczorem.",
                        dialog: [
                            { name: "Ty", text: "Logowanie do systemu potwierdza pana wersję co do minuty." },
                            { name: "Asystent", text: "Właśnie. I wyszedłem przed dwudziestą pierwszą. Kamera przy wyjściu to nagra." },
                        ]
                    }
                ]
            },

            professor2: {
                intro: [
                    { name: "Ty", text: "Panie profesorze, kilka pytań." },
                    { name: "Profesor", text: "Proszę." },
                    { name: "Ty", text: "Zaginął rękopis z gabinetu pańskiego kolegi." },
                    { name: "Profesor", text: "Wiem. Przykra sprawa." },
                ],
                questions: [
                    {
                        id: "prof2_motive",
                        text: "Wasz konflikt — opowie pan?",
                        dialog: [
                            { name: "Ty", text: "Był między panami spór o dostęp do manuskryptu." },
                            { name: "Profesor", text: "Tak. Odmówił mi. Ale zrozumiałem — to jego obiekt badań." },
                            { name: "Ty", text: "Nie czuł pan żalu?" },
                            { name: "Profesor", text: "Żal to za mało słowo. Ale nie kradzież." },
                        ],
                        evidence: "conflict_professors"
                    },
                    {
                        id: "prof2_when_left",
                        text: "Kiedy pan wyszedł?",
                        dialog: [
                            { name: "Ty", text: "Kiedy opuścił pan budynek?" },
                            { name: "Profesor", text: "O osiemnastej. Poproszę, żeby sprawdzić kamery — będzie potwierdzenie." },
                            { name: "Ty", text: "Doceniam współpracę." },
                        ],
                        unlockCamera: true
                    }
                ]
            },

            librarian: {
                intro: [
                    { name: "Ty", text: "Dzień dobry, mam pytanie o wczorajszy wieczór." },
                    { name: "Bibliotekarka", text: "Słucham." }
                ],
                questions: [
                    {
                        id: "librarian_student",
                        text: "Czy student był w bibliotece?",
                        dialog: [
                            { name: "Ty", text: "Student Piotr Lojoński twierdzi, że był u pani do dwudziestej." },
                            { name: "Bibliotekarka", text: "Nie. Wyszedł przed dziewiętnastą. Pamiętam, bo zamykałam sekcję." },
                            { name: "Ty", text: "Jest pani pewna?" },
                            { name: "Bibliotekarka", text: "Absolutnie." },
                        ],
                        evidence: "student_lie"
                    }
                ]
            },

            secretary: {
                intro: [
                    { name: "Ty", text: "Chciałbym zapytać o klucze." },
                    { name: "Sekretarka", text: "Słucham." }
                ],
                questions: [
                    {
                        id: "secretary_keys",
                        text: "Ile jest kopii klucza?",
                        dialog: [
                            { name: "Ty", text: "Kto posiada klucze do gabinetu 302b?" },
                            { name: "Sekretarka", text: "Profesor, asystent i jeden zapasowy w sejfie." },
                            { name: "Ty", text: "Czy jest możliwe, że ktoś skopiował klucz?" },
                            { name: "Sekretarka", text: "Teoretycznie tak, jeśli miał do niego chwilowy dostęp." },
                        ],
                        evidence: "fake_key"
                    }
                ]
            },

            phd: {
                intro: [
                    { name: "Ty", text: "Interesuje mnie studencka obsesja na punkcie rękopisu." },
                    { name: "Doktorantka", text: "Lojoński? To temat jego pracy. Ale rozmawiał o tym jakby... jakby to była jego własność." },
                ],
                questions: [
                    {
                        id: "phd_conflict",
                        text: "Co pani o nim wie?",
                        dialog: [
                            { name: "Doktorantka", text: "Był na seminarium, gdy profesor pokazał rękopis zdjęcia. Od tamtej pory nie mówił o niczym innym." },
                            { name: "Ty", text: "Czy sugerował, że mógłby działać poza procedurami?" },
                            { name: "Doktorantka", text: "Raz powiedział, że profesor 'nie zasługuje, żeby to trzymać za szkłem'. Zareagowałam, że to dziwne. Zmienił temat." },
                            { name: "Ty", text: "Dziękuję. To bardzo pomocne." },
                        ],
                        evidence: "student_motive"
                    }
                ]
            }
        }
    },
    {
        culprit: "professor2",

        endings: {
            professor2:
                "Właśnie tak. Profesor był prawdziwym sprawcą.\n\n" +
                "Lata konfliktu i poczucie niesprawiedliwości doprowadziły go do skrajności. " +
                "Wiedział, że nie dostanie dostępu oficjalnie — więc zadziałał inaczej.\n\n" +
                "Miesiąc wcześniej zlecił wykonanie kopii klucza, przekonując pracownika technicznego, " +
                "że zgubił swój. Wieczorem wślizgnął się do gabinetu przez wejście od zaplecza, " +
                "o którym wiedział z czasów wspólnych projektów.\n\n" +
                "Nagrania nie objęły tego wejścia — znał martwy punkt kamery. " +
                "Na zewnątrz wyglądał na spokojnego. W środku — od lat gotował się z urazy.",

            student:
                "Student jest niewinny.\n\n" +
                "Był tego wieczoru na uczelni i skłamał o godzinie, bo spotkał się z kimś " +
                "i nie chciał tego ujawniać. Nic wspólnego z kradzieżą.\n\n" +
                "Profesor, prawdziwy sprawca, wyszedł z budynku oficjalnym wejściem o osiemnastej — " +
                "co kamery potwierdzają. Ale wrócił przez zaplecze. Tego nikt nie sprawdził.",

            assistant:
                "Asystent jest niewinny.\n\n" +
                "Owszem, był wieczorem przy gabinecie. Owszem, ma klucz. " +
                "Ale to właśnie on odkrył zaginięcie rękopisu i zgłosił sprawę.\n\n" +
                "Profesor liczył, że podejrzenie padnie na asystenta. Prawie mu się udało.",
        },

        interrogations: {

            student: {
                intro: [
                    { name: "Ty", text: "Muszę zadać kilka pytań w związku z kradzieżą." },
                    { name: "Student", text: "Jasne, chętnie pomogę." },
                    { name: "Ty", text: "Wiem o twoim zainteresowaniu rękopisem." },
                    { name: "Student", text: "Tak, ale profesor odmówił. Rozumiałem to." },
                ],
                questions: [
                    {
                        id: "student_why_manuscript",
                        text: "Dlaczego interesowałeś się manuskryptem?",
                        dialog: [
                            { name: "Ty", text: "Wysyłałeś wiele próśb o dostęp." },
                            { name: "Student", text: "To temat mojej pracy. Ale nie dostałem dostępu i zaakceptowałem to." },
                            { name: "Ty", text: "Serio?" },
                            { name: "Student", text: "Tak. Znalazłem inne źródła. Zdenerwowałem się, ale to minęło." },
                        ]
                    },
                    {
                        id: "student_where_evening",
                        text: "Gdzie byłeś wieczorem?",
                        dialog: [
                            { name: "Ty", text: "Gdzie byłeś w dniu zaginięcia, wieczorem?" },
                            { name: "Student", text: "Przy gabinecie. Skracałem drogę przez skrzydło B. Głupio, że akurat tamtędy." },
                            { name: "Ty", text: "Widziałeś kogoś?" },
                            { name: "Student", text: "Asystenta. Wychodził z gabinetu. I... był ktoś jeszcze, przy schodach od zaplecza. Nie rozpoznałem." },
                        ],
                        action: () => { window.game.state.flags.studentSpoke = true },
                        evidence: "student_evening"
                    },
                    {
                        id: "student_why_here",
                        text: "Ta druga osoba — opisz ją.",
                        requires: ["student_where_evening"],
                        requiresHint: "Najpierw zapytaj, gdzie był wieczorem.",
                        dialog: [
                            { name: "Ty", text: "Ta druga osoba — cokolwiek pamiętasz?" },
                            { name: "Student", text: "Sylwetka, ciemne ubranie. Starszy mężczyzna chyba. Szedł szybko." },
                            { name: "Ty", text: "Skąd wychodził?" },
                            { name: "Student", text: "Od zaplecza. Wyjście techniczne, zazwyczaj zamknięte." },
                        ],
                        evidence: "night_entry"
                    },
                    {
                        id: "student_seen_someone",
                        text: "Co widziałeś przy gabinecie?",
                        requires: ["student_why_here"],
                        requiresHint: "Najpierw zapytaj o tę drugą osobę.",
                        dialog: [
                            { name: "Ty", text: "Czy ta osoba mogła wyjść z gabinetu?" },
                            { name: "Student", text: "Nie wiem. Ale wyglądało jakby się śpieszyła i nie chciała być widziana." },
                            { name: "Ty", text: "To ważne zeznanie. Dziękuję." },
                        ],
                        evidence: "assistant_evening"
                    }
                ]
            },

            assistant: {
                intro: [
                    { name: "Ty", text: "Dzień dobry. To pan odkrył zaginięcie?" },
                    { name: "Asystent", text: "Tak. Rano wszedłem do gabinetu i rękopisu nie było." },
                    { name: "Ty", text: "Był pan ostatnim, który zamknął gabinet?" },
                    { name: "Asystent", text: "Myślałem, że tak. Ale wieczorem wróciłem po dokumenty — może ktoś wszedł po mnie." },
                ],
                questions: [
                    {
                        id: "assistant_has_key",
                        text: "Kto ma klucze do gabinetu?",
                        dialog: [
                            { name: "Ty", text: "Kto posiada klucze?" },
                            { name: "Asystent", text: "Profesor i ja. Plus jeden zapasowy w sekretariacie." },
                            { name: "Ty", text: "Czy profesor miał dostęp do wejścia od zaplecza?" },
                            { name: "Asystent", text: "Tak. Znam to wejście — kiedyś razem pracowali w tym skrzydle." },
                        ],
                        evidence: "assistant_key"
                    },
                    {
                        id: "assistant_evening",
                        text: "Byłeś w gabinecie wieczorem?",
                        requires: ["assistant_has_key"],
                        requiresHint: "Najpierw zapytaj o klucze.",
                        condition: () => {
                            const ev = window.game.state.evidence
                            return ev.includes("assistant_evening") || ev.includes("camera_assistant")
                        },
                        conditionHint: "Potrzebujesz dowodu że asystent był wieczorem przy gabinecie.",
                        dialog: [
                            { name: "Ty", text: "Widziano pana wieczorem w korytarzu." },
                            { name: "Asystent", text: "Tak, byłem. Wróciłem po dokumenty. Zamknąłem gabinet i wyszedłem — kamera przy wyjściu głównym to potwierdzi." },
                            { name: "Ty", text: "A wejście od zaplecza?" },
                            { name: "Asystent", text: "Tego nie nagrywają. Mówiłem o tym szefowi ochrony, że to luka. Nikt nie słuchał." },
                        ]
                    },
                    {
                        id: "assistant_alibi",
                        text: "Czy ktoś może potwierdzić godzinę wyjścia?",
                        requires: ["assistant_evening"],
                        requiresHint: "Najpierw zapytaj, czy był wieczorem.",
                        dialog: [
                            { name: "Ty", text: "Ktoś widział pana wychodzącego?" },
                            { name: "Asystent", text: "Kamera przy bramie głównej. Wyszedłem przed dwudziestą pierwszą." },
                        ]
                    }
                ]
            },

            professor2: {
                intro: [
                    { name: "Ty", text: "Panie profesorze. Kilka pytań." },
                    { name: "Profesor", text: "Oczywiście. Słyszałem o kradzieży. Przykra historia." },
                    { name: "Ty", text: "Rzeczywiście. Był pan z kolegą w konflikcie o ten rękopis." },
                    { name: "Profesor", text: "*powoli* To przesada. Mieliśmy różne zdania na temat dostępu." },
                ],
                questions: [
                    {
                        id: "prof2_motive",
                        text: "Opowie pan o konflikcie?",
                        dialog: [
                            { name: "Ty", text: "Prosił pan o dostęp. Odmówiono. Jak pan to przyjął?" },
                            { name: "Profesor", text: "Profesjonalnie. To praca naukowa, nie prywatna własność." },
                            { name: "Ty", text: "Jednak napisał pan dość ostrego maila po odmowie." },
                            { name: "Profesor", text: "Byłem... sfrustrowany. To minęło." },
                            { name: "Ty", text: "Czy na pewno?" },
                            { name: "Profesor", text: "*dłuższa pauza* Tak. Na pewno." },
                        ],
                        evidence: "conflict_professors"
                    },
                    {
                        id: "prof2_when_left",
                        text: "Kiedy pan wyszedł z budynku?",
                        dialog: [
                            { name: "Ty", text: "O której opuścił pan budynek?" },
                            { name: "Profesor", text: "O osiemnastej. Kamera przy wyjściu głównym to potwierdzi." },
                            { name: "Ty", text: "A wejście od zaplecza — zna je pan?" },
                            { name: "Profesor", text: "*chwila wahania* Dawno temu. Nie pamiętam już tego rozkładu." },
                            { name: "Ty", text: "Interesujące, bo asystent mówi, że pracowaliście razem w tym skrzydle." },
                            { name: "Profesor", text: "To było lata temu." },
                        ],
                        unlockCamera: true,
                        evidence: "professor_access"
                    }
                ]
            },

            librarian: {
                intro: [
                    { name: "Ty", text: "Dzień dobry. Krótkie pytanie." },
                    { name: "Bibliotekarka", text: "Słucham." }
                ],
                questions: [
                    {
                        id: "librarian_student",
                        text: "Student wieczorem",
                        dialog: [
                            { name: "Ty", text: "Czy student Lojoński był w bibliotece wieczorem?" },
                            { name: "Bibliotekarka", text: "Był przed dziewiętnastą. Potem go nie widziałam." },
                        ],
                        evidence: "student_lie"
                    }
                ]
            },

            secretary: {
                intro: [
                    { name: "Ty", text: "Pytanie o klucze i dostępy." },
                    { name: "Sekretarka", text: "Słucham." }
                ],
                questions: [
                    {
                        id: "secretary_keys",
                        text: "Klucze i wejście od zaplecza",
                        dialog: [
                            { name: "Ty", text: "Kto ma dostęp do wejścia technicznego od zaplecza?" },
                            { name: "Sekretarka", text: "Formalnie tylko obsługa techniczna. Ale klucz do tego wejścia bywa pożyczany. Profesor prosił o niego miesiąc temu." },
                            { name: "Ty", text: "Pod jakim pretekstem?" },
                            { name: "Sekretarka", text: "Powiedział, że musi odebrać sprzęt po godzinach. Podpisał się. Mam kwit." },
                        ],
                        evidence: "fake_key"
                    }
                ]
            },

            phd: {
                intro: [
                    { name: "Ty", text: "Interesuje mnie historia konfliktu między profesorami." },
                    { name: "Doktorantka", text: "Lepiej mnie nie cytować. Ale powiem." },
                ],
                questions: [
                    {
                        id: "phd_conflict",
                        text: "Co się między nimi stało?",
                        dialog: [
                            { name: "Doktorantka", text: "Lata temu wspólny projekt, sfałszowane dane, cofnięty grant." },
                            { name: "Ty", text: "Kto poniósł winę?" },
                            { name: "Doktorantka", text: "Formalnie obaj. Ale profesor od manuskryptu wziął na siebie więcej — żeby chronić zespół." },
                            { name: "Ty", text: "A ten drugi?" },
                            { name: "Doktorantka", text: "Czuł, że jest winien tamtemu przysługę. Ale tamten nigdy nie chciał tego rozliczać. Ostatnio słyszałam, że powiedział wprost: 'on nie zasługuje, żeby sam decydować o tym rękopisie'." },
                        ],
                        evidence: "conflict_professors"
                    }
                ]
            }
        }
    }
]
