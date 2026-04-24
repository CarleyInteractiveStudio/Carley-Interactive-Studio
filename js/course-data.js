/* ==============================
   Course Data - The Scripting Path (CES)
   Updated with Advanced Mechanics & Rich Content
============================== */

window.courseData = {
    stages: [
        {
            id: 1,
            name: "Fundamentos del Despertar",
            color: "#7ED957",
            courses: [
                {
                    id: 1,
                    title: "El Despertar: ve motor;",
                    steps: [
                        {
                            type: "teoria",
                            content: "¡Bienvenido al inicio de tu viaje! En Creative Engine, todo script comienza con una conexión. La instrucción 've motor;' no es solo código, es el 'hola mundo' técnico que despierta al motor. Sin esta línea, tu script no puede interactuar con el mundo.",
                            code: "// Iniciando la conexión\nve motor;"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Cuál es la función principal de 've motor;'?",
                            options: [
                                { text: "Dibujar un personaje", correct: false },
                                { text: "Conectar el script con el motor", correct: true },
                                { text: "Cerrar el juego", correct: false }
                            ],
                            feedback: "Exacto. Es el puente entre tu código y el corazón de Creative Engine."
                        },
                        {
                            type: "practica",
                            question: "Escribe la instrucción obligatoria para despertar tu script:",
                            answer: "ve motor;"
                        }
                    ]
                },
                {
                    id: 2,
                    title: "Identidad: materias",
                    steps: [
                        {
                            type: "teoria",
                            content: "En Creative Engine hablamos de 'materias'. Una materia es cualquier cosa tangible: el jugador, una bala, o una moneda. Definir una materia es darle un nombre a algo.",
                            code: "materia Jugador;"
                        },
                        {
                            type: "completar-codigo",
                            question: "Completa la definición de la materia para nuestro héroe:",
                            codeTemplate: "[BLOQUE] Carl;",
                            blocks: ["materia", "ley", "dato"],
                            answer: "materia"
                        },
                        {
                            type: "practica",
                            question: "Crea una materia llamada 'Enemigo':",
                            answer: "materia Enemigo;"
                        }
                    ]
                },
                {
                    id: 3,
                    title: "Leyes: Comportamiento",
                    steps: [
                        {
                            type: "teoria",
                            content: "Si las materias son los cuerpos, las 'leyes' son el cerebro. Una ley define qué hace una materia. La estructura básica es: materia -> ley.",
                            code: "materia Bala;\nley MovimientoLineal;"
                        },
                        {
                            type: "ordenar-bloques",
                            question: "Ordena los bloques para aplicar la ley 'Gravedad' a la materia 'Piedra':",
                            blocks: ["materia Piedra;", "ley Gravedad;"],
                            answer: ["materia Piedra;", "ley Gravedad;"]
                        }
                    ]
                },
                {
                    id: 4,
                    title: "Luz y Color",
                    steps: [
                        {
                            type: "teoria",
                            content: "Podemos definir el color base de una materia usando la ley de Color. CES usa nombres de colores estándar.",
                            code: "materia Pared;\nley Color(Azul);"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué pasa si olvidas el paréntesis en ley Color(Rojo)?",
                            options: [
                                { text: "El motor explota", correct: false },
                                { text: "Dará un error de sintaxis", correct: true },
                                { text: "Se pone color negro por defecto", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 5,
                    title: "El Corazón del Bucle",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un videojuego se repite 60 veces por segundo. Usamos 'ciclo' para código constante.",
                            code: "ciclo {\n  // Código constante aquí\n}"
                        },
                        {
                            type: "completar-codigo",
                            question: "Selecciona el bloque que inicia el bucle infinito:",
                            codeTemplate: "[BLOQUE] { ... }",
                            blocks: ["si", "ciclo", "materia"],
                            answer: "ciclo"
                        }
                    ]
                },
                {
                    id: 6,
                    title: "Eventos: Al Iniciar",
                    steps: [
                        {
                            type: "teoria",
                            content: "Para cosas que solo pasan UNA vez al principio, usamos 'al_iniciar'.",
                            code: "al_iniciar {\n  // Solo una vez\n}"
                        },
                        {
                            type: "practica",
                            question: "Escribe el nombre del bloque que se ejecuta solo una vez al arrancar:",
                            answer: "al_iniciar"
                        }
                    ]
                },
                {
                    id: 7,
                    title: "Colisiones Críticas",
                    steps: [
                        {
                            type: "teoria",
                            content: "La ley 'Solido' permite que una materia interactúe físicamente con otras.",
                            code: "materia Suelo;\nley Solido;"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué ley evita que atravieses las paredes?",
                            options: [
                                { text: "ley Traspasar;", correct: false },
                                { text: "ley Solido;", correct: true },
                                { text: "ley Invisible;", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 8,
                    title: "Entrada de Usuario",
                    steps: [
                        {
                            type: "teoria",
                            content: "Usamos 'si_tecla' para detectar pulsaciones del jugador.",
                            code: "si_tecla(Espacio) {\n  // Saltar\n}"
                        },
                        {
                            type: "completar-codigo",
                            question: "Detecta si se presiona la tecla 'A':",
                            codeTemplate: "si_tecla([BLOQUE])",
                            blocks: ["A", "Enter", "Click"],
                            answer: "A"
                        }
                    ]
                },
                {
                    id: 9,
                    title: "Variables y Datos",
                    steps: [
                        {
                            type: "teoria",
                            content: "En CES usamos 'dato' para crear variables numéricas o de texto.",
                            code: "dato vida = 100;"
                        },
                        {
                            type: "ordenar-bloques",
                            question: "Crea un dato llamado 'oro' con valor 50:",
                            blocks: ["dato", "oro", "=", "50;"],
                            answer: ["dato", "oro", "=", "50;"]
                        }
                    ]
                },
                {
                    id: 10,
                    title: "¡JEFE FINAL: El Bug Maestro!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "¡CUIDADO! Un Bug Maestro ha aparecido. Para derrotarlo, demuestra que dominas los fundamentos.",
                            code: "// MODO BATALLA ACTIVADO"
                        },
                        {
                            type: "practica",
                            question: "RONDA 1: Reconecta el motor.",
                            answer: "ve motor;"
                        },
                        {
                            type: "opcion-multiple",
                            question: "RONDA 2: El Bug se esconde. ¿Cómo definimos su 'cuerpo'?",
                            options: [
                                { text: "dato Bug;", correct: false },
                                { text: "materia Bug;", correct: true }
                            ]
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA 3: ¡El golpe final! Dale físicas para que no escape:",
                            codeTemplate: "ley [BLOQUE];",
                            blocks: ["Solido", "Liquido", "Color"],
                            answer: "Solido"
                        }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: "Arquitectura de Materias",
            color: "#00AAFF",
            courses: [
                {
                    id: 11,
                    title: "Etiquetas: El Poder de Agrupar",
                    steps: [
                        {
                            type: "teoria",
                            content: "Cuando tienes 100 enemigos, no quieres darles órdenes uno por uno. Usamos etiquetas (Tags). Una etiqueta permite agrupar materias bajo un mismo concepto, como 'Enemigos' o 'Premios'.",
                            code: "materia Fantasma;\nley Etiqueta(Enemigo);"
                        },
                        {
                            type: "completar-codigo",
                            question: "Asigna la etiqueta 'Jugador' a nuestra materia:",
                            codeTemplate: "ley Etiqueta([BLOQUE]);",
                            blocks: ["Jugador", "Cosa", "Mundo"],
                            answer: "Jugador"
                        },
                        {
                            type: "practica",
                            question: "¿Cómo se llama la ley para poner etiquetas?",
                            answer: "ley Etiqueta"
                        }
                    ]
                },
                {
                    id: 12,
                    title: "Jerarquía: Padre e Hijo",
                    steps: [
                        {
                            type: "teoria",
                            content: "En CES, una materia puede estar 'dentro' de otra. Si mueves al Padre, el Hijo se mueve con él. Esto es ideal para armas que el jugador lleva en la mano.",
                            code: "materia Jugador {\n  materia Espada;\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "Si eliminas a la materia 'Padre', ¿qué pasa con el 'Hijo'?",
                            options: [
                                { text: "Se queda flotando solo", correct: false },
                                { text: "Se elimina también", correct: true },
                                { text: "Se convierte en el nuevo Padre", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 13,
                    title: "Capas de Sorteo",
                    steps: [
                        {
                            type: "teoria",
                            content: "El orden en que se ven las cosas importa. La ley 'Capa' define qué se dibuja primero (atrás) y qué después (adelante). Las capas con números altos se ven sobre las bajas.",
                            code: "materia Fondo; ley Capa(0);\nmateria Jugador; ley Capa(10);"
                        },
                        {
                            type: "completar-codigo",
                            question: "Queremos que el 'Filtro' esté sobre todo. Ponle una capa alta:",
                            codeTemplate: "ley Capa([BLOQUE]);",
                            blocks: ["-5", "0", "99"],
                            answer: "99"
                        }
                    ]
                },
                {
                    id: 14,
                    title: "Prefabs: El Molde",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un Prefab es un molde. Si diseñas una 'Bala' perfecta con luces y sonidos, la guardas como Prefab para crear mil iguales sin repetir código.",
                            code: "instanciar(BalaPrefab, posicion);"
                        },
                        {
                            type: "practica",
                            question: "Escribe el comando para crear una copia de un Prefab:",
                            answer: "instanciar"
                        }
                    ]
                },
                {
                    id: 15,
                    title: "Visibilidad y Control",
                    steps: [
                        {
                            type: "teoria",
                            content: "Puedes ocultar materias sin borrarlas. La ley 'Visible' acepta verdadero o falso. Útil para menús o efectos que aparecen y desaparecen.",
                            code: "materia Inventario;\nley Visible(falso);"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Cómo harías que un objeto sea invisible?",
                            options: [
                                { text: "ley Visible(falso);", correct: true },
                                { text: "ley Invisible(verdadero);", correct: false },
                                { text: "borrar materia;", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 16,
                    title: "Puntos de Anclaje",
                    steps: [
                        {
                            type: "teoria",
                            content: "El 'Ancla' es el punto central de una materia. Por defecto está en el medio (0.5, 0.5), pero si es una puerta, quizás quieras el ancla en un borde para que rote correctamente.",
                            code: "ley Ancla(0, 0.5); // Borde izquierdo"
                        },
                        {
                            type: "practica",
                            question: "¿Qué ley define el punto de rotación de una materia?",
                            answer: "ley Ancla"
                        }
                    ]
                },
                {
                    id: 17,
                    title: "Escenas y Carga",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un juego se divide en escenas. Puedes pasar del Menú al Nivel 1 usando el comando 'ir_a_escena'.",
                            code: "ir_a_escena(\"Nivel1\");"
                        },
                        {
                            type: "completar-codigo",
                            question: "Viaja al 'Bosque':",
                            codeTemplate: "ir_a_escena([BLOQUE]);",
                            blocks: ["\"Bosque\"", "Bosque", "ir"],
                            answer: "\"Bosque\""
                        }
                    ]
                },
                {
                    id: 18,
                    title: "Optimización: Pooling",
                    steps: [
                        {
                            type: "teoria",
                            content: "Crear y destruir materias constantemente (como balas) cansa al motor. El 'Pool' permite reciclar materias. En lugar de borrar, ocultamos y reusamos.",
                            code: "reciclar(Bala);"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Para qué sirve el Pooling?",
                            options: [
                                { text: "Para que el juego sea más bonito", correct: false },
                                { text: "Para mejorar el rendimiento (FPS)", correct: true },
                                { text: "Para guardar la partida", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 19,
                    title: "Nombres y Rutas",
                    steps: [
                        {
                            type: "teoria",
                            content: "Puedes buscar materias por su nombre único en todo el proyecto usando 'buscar'.",
                            code: "variable target = buscar(\"Jefe_Final\");"
                        },
                        {
                            type: "practica",
                            question: "Escribe el comando para encontrar una materia por su nombre:",
                            answer: "buscar"
                        }
                    ]
                },
                {
                    id: 20,
                    title: "¡JEFE: El Arquitecto del Caos!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "El Arquitecto del Caos ha desordenado todas tus materias. ¡Usa la arquitectura para vencerlo!",
                            code: "// BATALLA DE ARQUITECTURA"
                        },
                        {
                            type: "ordenar-bloques",
                            question: "RONDA 1: El jefe crea copias falsas. Agrupa a los 'Enemigos' reales:",
                            blocks: ["materia Real;", "ley Etiqueta(Enemigo);"],
                            answer: ["materia Real;", "ley Etiqueta(Enemigo);"]
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA 2: ¡Viene un ataque desde arriba! Pon el 'Escudo' sobre el jugador (capa alta):",
                            codeTemplate: "ley Capa([BLOQUE]);",
                            blocks: ["50", "0", "-1"],
                            answer: "50"
                        },
                        {
                            type: "opcion-multiple",
                            question: "RONDA 3: ¡El golpe final! Necesitas muchos proyectiles rápido. ¿Qué técnica usas?",
                            options: [
                                { text: "Crear y borrar siempre", correct: false },
                                { text: "Pooling (Reciclaje)", correct: true }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: "Leyes Universales",
            color: "#FFC300",
            courses: [
                {
                    id: 21,
                    title: "Raycasts: Ojos Invisibles",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un Raycast es un rayo invisible que el motor lanza desde una posición hacia una dirección. Si el rayo toca algo, te devuelve información sobre qué tocó. Es fundamental para que los enemigos 'vean' al jugador o para detectar si hay suelo frente a nosotros.",
                            code: "variable hit = lanzar_rayo(posicion, derecha, 500);\nsi (hit.toco_algo) {\n  // Hacer algo\n}"
                        },
                        {
                            type: "modo-debug",
                            question: "El script no detecta colisiones porque falta el comando de rayo. Encuentra el error en la lógica de detección:",
                            codeLines: ["variable hit = (posicion, abajo, 100);", "si (hit.toco_suelo) { saltar(); }"],
                            errorLine: 0,
                            explanation: "Faltó llamar a la función 'lanzar_rayo'. El motor no sabe qué hacer solo con los paréntesis.",
                            solution: "variable hit = lanzar_rayo(posicion, abajo, 100);"
                        }
                    ]
                },
                {
                    id: 22,
                    title: "Triggers: Zonas Mágicas",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un 'Trigger' es una ley de colisión que detecta cuando algo entra en su área pero no bloquea el movimiento. Se usa para monedas, portales o zonas donde se activa una trampa.",
                            code: "materia Moneda;\nley Trigger;\n\nalEntrar(otro) {\n  destruir(estaMateria);\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Cuál es la diferencia entre un 'Solido' y un 'Trigger'?",
                            options: [
                                { text: "El Trigger rebota y el Solido no", correct: false },
                                { text: "El Solido bloquea el paso, el Trigger solo detecta", correct: true },
                                { text: "El Solido es solo para paredes", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 23,
                    title: "Impulsos: ¡A Volar!",
                    steps: [
                        {
                            type: "teoria",
                            content: "Para mover cosas físicamente usamos impulsos. A diferencia de cambiar la posición directamente, un impulso aplica una fuerza instantánea que respeta la masa y la gravedad.",
                            code: "ley Fisica;\n// Aplicar fuerza hacia arriba\nfisica.impulso(0, -500);"
                        },
                        {
                            type: "completar-codigo",
                            question: "Aplica un impulso hacia la derecha (X=200, Y=0):",
                            codeTemplate: "fisica.impulso([BLOQUE]);",
                            blocks: ["200, 0", "0, -200", "arriba"],
                            answer: "200, 0"
                        }
                    ]
                },
                {
                    id: 24,
                    title: "Gravedad Local",
                    steps: [
                        {
                            type: "teoria",
                            content: "Cada materia puede tener su propia escala de gravedad. Si quieres un objeto que caiga lento como una pluma o uno que flote, cambias su 'escala_gravedad'.",
                            code: "materia Pluma;\nley Fisica;\nfisica.escala_gravedad = 0.1;"
                        },
                        {
                            type: "modo-debug",
                            question: "El objeto cae demasiado rápido. Corrige el valor para que flote un poco:",
                            codeLines: ["materia Globo;", "fisica.escala_gravedad = 10.0;"],
                            errorLine: 1,
                            explanation: "Un valor de 10.0 hace que caiga 10 veces más rápido que lo normal.",
                            solution: "fisica.escala_gravedad = 0.2;"
                        }
                    ]
                },
                {
                    id: 25,
                    title: "Fricción y Rebote",
                    steps: [
                        {
                            type: "teoria",
                            content: "La fricción hace que los objetos se detengan al deslizarse, y el rebote (restitución) define qué tanto saltan al chocar. Valores de rebote cercanos a 1 harán que el objeto nunca deje de saltar.",
                            code: "ley MaterialFisico(friccion: 0.5, rebote: 0.8);"
                        },
                        {
                            type: "ordenar-bloques",
                            question: "Crea un material muy resbaladizo (fricción 0) y que rebote mucho (rebote 1):",
                            blocks: ["ley MaterialFisico(", "friccion: 0,", "rebote: 1", ");"],
                            answer: ["ley MaterialFisico(", "friccion: 0,", "rebote: 1", ");"]
                        }
                    ]
                },
                {
                    id: 26,
                    title: "Sonido Espacial",
                    steps: [
                        {
                            type: "teoria",
                            content: "En Creative Engine, si aplicas la ley 'Audio' a una materia, el sonido se vuelve espacial. Esto significa que si el objeto está a la izquierda del jugador, el usuario lo escuchará por el auricular izquierdo.",
                            code: "materia Radio;\nley Audio(\"musica.mp3\");\naudio.reproducir();"
                        },
                        {
                            type: "completar-codigo",
                            question: "Haz que la radio empiece a sonar:",
                            codeTemplate: "audio.[BLOQUE]();",
                            blocks: ["reproducir", "parar", "volumen"],
                            answer: "reproducir"
                        }
                    ]
                },
                {
                    id: 27,
                    title: "Sistemas de Partículas",
                    steps: [
                        {
                            type: "teoria",
                            content: "Las partículas son cientos de pequeños cuadritos o imágenes que se mueven rápido para simular fuego, humo o chispas. Usamos la ley 'Particulas' para configurarlas.",
                            code: "ley Particulas(tipo: Fuego);\nparticulas.emitir();"
                        },
                        {
                            type: "practica",
                            question: "¿Cómo se llama la ley para crear efectos visuales como humo?",
                            answer: "ley Particulas"
                        }
                    ]
                },
                {
                    id: 28,
                    title: "Filtros de Pantalla",
                    steps: [
                        {
                            type: "teoria",
                            content: "Podemos aplicar leyes a la 'Camara' para cambiar cómo se ve todo el juego. Por ejemplo, un filtro de 'Sepia' para flashbacks o 'Oscuro' para cuevas.",
                            code: "materia CamaraPrincipal;\nley Filtro(Gris);"
                        },
                        {
                            type: "opcion-multiple",
                            question: "Si aplicas un Filtro a una materia normal (no a la Cámara), ¿qué sucede?",
                            options: [
                                { text: "Solo esa materia cambia de color", correct: true },
                                { text: "Todo el juego se pone de ese color", correct: false },
                                { text: "El motor se detiene", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 29,
                    title: "Capas de Velocidad (Parallax)",
                    steps: [
                        {
                            type: "teoria",
                            content: "El Parallax es el efecto donde las montañas del fondo se mueven más lento que el suelo, dando sensación de profundidad. Usamos la ley 'VelocidadCapa'.",
                            code: "materia Montañas;\nley VelocidadCapa(0.2); // 20% de la velocidad real"
                        },
                        {
                            type: "completar-codigo",
                            question: "Haz que las nubes se muevan a la mitad de velocidad que el jugador:",
                            codeTemplate: "ley VelocidadCapa([BLOQUE]);",
                            blocks: ["0.5", "1.0", "2.0"],
                            answer: "0.5"
                        }
                    ]
                },
                {
                    id: 30,
                    title: "¡JEFE: El Guardián de la Física!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "El Guardián controla las leyes del universo. ¡Usa la física para desestabilizarlo!",
                            code: "// MODO FÍSICA AVANZADA"
                        },
                        {
                            type: "modo-debug",
                            question: "RONDA 1: El jefe te ha lanzado un rayo pero el script tiene un error de detección. ¡Corrígelo!",
                            codeLines: ["variable d = rayo(yo, jefe, 100);", "si (d.toco) { morir(); }"],
                            errorLine: 0,
                            explanation: "El comando correcto es 'lanzar_rayo'.",
                            solution: "variable d = lanzar_rayo(yo, jefe, 100);"
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA 2: ¡Lánzale un contraataque con mucha fuerza!",
                            codeTemplate: "fisica.impulso([BLOQUE]);",
                            blocks: ["0, -1000", "1000, 0", "0, 0"],
                            answer: "1000, 0"
                        },
                        {
                            type: "opcion-multiple",
                            question: "RONDA 3: ¡El jefe es inmune a los golpes! ¿Qué ley usas para que atraviese una trampa sin chocar?",
                            options: [
                                { text: "ley Solido;", correct: false },
                                { text: "ley Trigger;", correct: true }
                            ]
                        }
                    ]
                }
            ]
        },
        { id: 4, name: "Sinfonía de Eventos", color: "#FF5733", courses: [] },
        { id: 5, name: "El Poder de Carl IA", color: "#C70039", courses: [] },
        { id: 6, name: "Seguridad y Optimización", color: "#900C3F", courses: [] },
        { id: 7, name: "Estructuras de Datos CES", color: "#581845", courses: [] },
        { id: 8, name: "Gráficos Avanzados", color: "#1A5276", courses: [] },
        { id: 9, name: "Redes y Multijugador", color: "#1D8348", courses: [] },
        { id: 10, name: "Maestría Creativa", color: "#F1C40F", courses: [] }
    ]
};

// Procedural generation for the remaining 70 courses
for (let i = 3; i < window.courseData.stages.length; i++) {
    const stage = window.courseData.stages[i];
    if (stage.courses.length === 0) {
        for (let j = 1; j <= 10; j++) {
            const courseId = (i * 10) + j;
            stage.courses.push({
                id: courseId,
                title: `Módulo ${courseId}: Avanzando en ${stage.name}`,
                steps: [
                    {
                        type: "teoria",
                        content: `Bienvenido al módulo ${courseId}. En esta lección profundizaremos en conceptos avanzados de ${stage.name}.`,
                        code: `// Módulo ${courseId} en desarrollo\nve motor;`
                    },
                    {
                        type: "practica",
                        question: "¿Estás listo para continuar?",
                        answer: "si"
                    }
                ]
            });
        }
    }
}
