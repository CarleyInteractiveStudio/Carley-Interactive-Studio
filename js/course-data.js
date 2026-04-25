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
                            content: "Un Raycast es un rayo invisible que el motor lanza en una dirección. Si toca algo, devuelve información (hit). Se usa para 'ver' si hay suelo, detectar enemigos a distancia o interactuar con objetos lejanos.",
                            code: "variable hit = lanzar_rayo(posicion, derecha, 500);\nsi (hit.toco_algo) {\n  // Hacer algo si detecta algo a 500 unidades\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué devuelve la función 'lanzar_rayo'?",
                            options: [
                                { text: "El nombre de la materia", correct: false },
                                { text: "Un objeto con información del impacto (hit)", correct: true },
                                { text: "Verdadero o Falso directamente", correct: false }
                            ]
                        },
                        {
                            type: "modo-debug",
                            question: "El script no detecta colisiones porque falta el comando de rayo. Encuentra el error en la lógica de detección:",
                            codeLines: ["variable hit = (posicion, abajo, 100);", "si (hit.toco_suelo) { saltar(); }"],
                            errorLine: 0,
                            explanation: "Faltó llamar a la función 'lanzar_rayo'. El motor no sabe qué hacer solo con los parámetros entre paréntesis.",
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
                            content: "Un 'Trigger' es una ley de colisión que detecta cuando algo entra en su área pero no bloquea el movimiento. Es el 'sensor' perfecto para monedas, portales o trampas invisibles.",
                            code: "materia Moneda;\nley Trigger;\n\nalEntrar(otro) {\n  destruir(estaMateria);\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Cuál es la diferencia fundamental entre un 'Solido' y un 'Trigger'?",
                            options: [
                                { text: "El Trigger es para enemigos y el Solido para paredes", correct: false },
                                { text: "El Solido bloquea físicamente, el Trigger solo detecta el paso", correct: true },
                                { text: "No hay diferencia, son sinónimos", correct: false }
                            ]
                        },
                        {
                            type: "practica",
                            question: "Escribe el nombre del evento que se dispara cuando una materia entra en un Trigger:",
                            answer: "alEntrar"
                        }
                    ]
                },
                {
                    id: 23,
                    title: "Impulsos: El Arte del Movimiento",
                    steps: [
                        {
                            type: "teoria",
                            content: "Para mover materias con física usamos 'impulso'. A diferencia de cambiar la posición bruscamente, el impulso aplica una fuerza que tiene en cuenta la masa del objeto, creando un movimiento natural.",
                            code: "ley Fisica;\n// Aplicar fuerza (X, Y)\nfisica.impulso(0, -500); // Salto"
                        },
                        {
                            type: "completar-codigo",
                            question: "Aplica un impulso hacia la derecha (X=300) sin afectar la vertical:",
                            codeTemplate: "fisica.impulso([BLOQUE]);",
                            blocks: ["300, 0", "0, 300", "300, 300"],
                            answer: "300, 0"
                        },
                        {
                            type: "practica",
                            question: "Escribe el comando completo para dar un impulso diagonal hacia arriba-derecha (400, -400):",
                            answer: "fisica.impulso(400, -400);"
                        }
                    ]
                },
                {
                    id: 24,
                    title: "Gravedad Personalizada",
                    steps: [
                        {
                            type: "teoria",
                            content: "En Creative Engine, la gravedad no es igual para todos. Puedes ajustar la 'escala_gravedad' de cada materia. 1.0 es normal, 0.5 es como estar en la Luna, y 0 es flotar en el espacio.",
                            code: "materia Globo;\nley Fisica;\nfisica.escala_gravedad = 0.2; // Cae muy lento"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué sucede si pones 'fisica.escala_gravedad = 0;'?",
                            options: [
                                { text: "El objeto cae instantáneamente", correct: false },
                                { text: "El objeto no cae, se queda flotando", correct: true },
                                { text: "El objeto sale disparado hacia arriba", correct: false }
                            ]
                        },
                        {
                            type: "modo-debug",
                            question: "¡El objeto cae 10 veces más rápido que la realidad! Corrige el error:",
                            codeLines: ["materia PiedraPesada;", "fisica.escala_gravedad = 10.0;"],
                            errorLine: 1,
                            explanation: "Un valor de 10.0 multiplica la gravedad normal por 10.",
                            solution: "fisica.escala_gravedad = 1.0;"
                        }
                    ]
                },
                {
                    id: 25,
                    title: "Fricción y Rebote",
                    steps: [
                        {
                            type: "teoria",
                            content: "Las superficies tienen propiedades. La 'fricción' determina cuánto resbala (0 es hielo, 1 es lija). El 'rebote' (restitución) determina cuánto rebota (0 no rebota, 1 rebota infinitamente).",
                            code: "ley MaterialFisico(friccion: 0.1, rebote: 0.9);"
                        },
                        {
                            type: "ordenar-bloques",
                            question: "Configura un suelo de hielo (fricción 0) que no rebote nada (rebote 0):",
                            blocks: ["ley MaterialFisico(", "friccion: 0,", "rebote: 0", ");"],
                            answer: ["ley MaterialFisico(", "friccion: 0,", "rebote: 0", ");"]
                        },
                        {
                            type: "completar-codigo",
                            question: "Queremos una pelota que rebote al máximo:",
                            codeTemplate: "ley MaterialFisico(friccion: 0.5, rebote: [BLOQUE]);",
                            blocks: ["1.0", "0.0", "-1.0"],
                            answer: "1.0"
                        }
                    ]
                },
                {
                    id: 26,
                    title: "Audio Inmersivo",
                    steps: [
                        {
                            type: "teoria",
                            content: "El audio en CES es espacial por defecto si se aplica a una materia. Si la materia está lejos a la derecha, el sonido vendrá de la derecha. Puedes controlar el volumen y si se repite (loop).",
                            code: "ley Audio(\"fuego.mp3\");\naudio.volumen = 0.5;\naudio.reproducir();"
                        },
                        {
                            type: "completar-codigo",
                            question: "Activa el sonido de la materia:",
                            codeTemplate: "audio.[BLOQUE]();",
                            blocks: ["reproducir", "volumen", "pausa"],
                            answer: "reproducir"
                        },
                        {
                            type: "practica",
                            question: "Escribe la línea para bajar el volumen al 20% (0.2):",
                            answer: "audio.volumen = 0.2;"
                        }
                    ]
                },
                {
                    id: 27,
                    title: "Magia Visual: Partículas",
                    steps: [
                        {
                            type: "teoria",
                            content: "Las partículas dan vida al juego: chispas, explosiones o lluvia. Se definen por un tipo y deben 'emitirse' para que se vean en pantalla.",
                            code: "ley Particulas(tipo: Humo);\nparticulas.emitir();"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué comando hace que las partículas empiecen a salir?",
                            options: [
                                { text: "particulas.mostrar();", correct: false },
                                { text: "particulas.emitir();", correct: true },
                                { text: "particulas.crear();", correct: false }
                            ]
                        },
                        {
                            type: "practica",
                            question: "Escribe la ley para crear partículas de tipo 'Explosion':",
                            answer: "ley Particulas(tipo: Explosion);"
                        }
                    ]
                },
                {
                    id: 28,
                    title: "Filtros de Atmósfera",
                    steps: [
                        {
                            type: "teoria",
                            content: "Los filtros cambian la estética global o local. Aplicados a la 'CamaraPrincipal', afectan a todo lo que el jugador ve, creando climas únicos.",
                            code: "materia CamaraPrincipal;\nley Filtro(Pixelado);"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué pasa si aplicas un Filtro(Rojo) directamente al Jugador?",
                            options: [
                                { text: "Todo el mundo se ve rojo", correct: false },
                                { text: "Solo el jugador se ve de color rojo", correct: true },
                                { text: "El juego se detiene por error", correct: false }
                            ]
                        },
                        {
                            type: "completar-codigo",
                            question: "Crea un efecto de flashback antiguo en toda la pantalla:",
                            codeTemplate: "materia CamaraPrincipal;\nley Filtro([BLOQUE]);",
                            blocks: ["Sepia", "Normal", "Invisible"],
                            answer: "Sepia"
                        }
                    ]
                },
                {
                    id: 29,
                    title: "Profundidad: Parallax",
                    steps: [
                        {
                            type: "teoria",
                            content: "El Parallax simula profundidad haciendo que las capas lejanas se muevan más lento. Un valor de 0.1 significa que se mueve al 10% de la velocidad de la cámara.",
                            code: "materia Montañas_Lejanas;\nley VelocidadCapa(0.1);"
                        },
                        {
                            type: "completar-codigo",
                            question: "Haz que una capa se mueva a la misma velocidad exacta que el jugador (100%):",
                            codeTemplate: "ley VelocidadCapa([BLOQUE]);",
                            blocks: ["1.0", "0.0", "0.5"],
                            answer: "1.0"
                        },
                        {
                            type: "practica",
                            question: "Configura una capa de fondo para que sea casi estática (velocidad 0.05):",
                            answer: "ley VelocidadCapa(0.05);"
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
                            content: "El Guardián manipula las leyes para confundirte. ¡Demuestra que dominas el universo físico!",
                            code: "// NIVEL DE AMENAZA: MÁXIMO"
                        },
                        {
                            type: "modo-debug",
                            question: "RONDA 1: El jefe usa un rayo invisible. ¡Detecta su posición correctamente!",
                            codeLines: ["variable d = rayo(yo, jefe, 100);", "si (d.toco) { esquivar(); }"],
                            errorLine: 0,
                            explanation: "Debes usar 'lanzar_rayo' para que el motor ejecute la acción.",
                            solution: "variable d = lanzar_rayo(yo, jefe, 100);"
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA 2: El suelo se ha vuelto resbaladizo. ¡Aumenta tu fricción para no caer!",
                            codeTemplate: "ley MaterialFisico(friccion: [BLOQUE], rebote: 0);",
                            blocks: ["1.0", "0.0", "0.5"],
                            answer: "1.0"
                        },
                        {
                            type: "opcion-multiple",
                            question: "RONDA 3: ¡El jefe te lanza al espacio! ¿Qué valor de gravedad te mantendrá en el suelo?",
                            options: [
                                { text: "fisica.escala_gravedad = 0;", correct: false },
                                { text: "fisica.escala_gravedad = 2.0;", correct: true },
                                { text: "fisica.escala_gravedad = -1.0;", correct: false }
                            ]
                        },
                        {
                            type: "practica",
                            question: "RONDA FINAL: ¡El golpe de gracia! Aplica un impulso de 2000 hacia adelante (X):",
                            answer: "fisica.impulso(2000, 0);"
                        }
                    ]
                }
            ]
        },
        {
            id: 4,
            name: "Sinfonía de Eventos",
            color: "#FF5733",
            courses: [
                {
                    id: 31,
                    title: "Nacimiento: alEmpezar",
                    steps: [
                        {
                            type: "teoria",
                            content: "Todo en CES tiene un inicio. El evento 'alEmpezar()' se ejecuta una única vez en el momento en que la materia aparece en el mundo. Es el lugar ideal para configurar nombres, vidas iniciales o posiciones fijas.",
                            code: "alEmpezar() {\n  imprimir(\"¡He nacido!\");\n  vida = 100;\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Cuántas veces se ejecuta el código dentro de 'alEmpezar'?",
                            options: [
                                { text: "En cada frame (60 veces/seg)", correct: false },
                                { text: "Una sola vez al inicio", correct: true },
                                { text: "Cada vez que chocamos", correct: false }
                            ]
                        },
                        {
                            type: "practica",
                            question: "Escribe el nombre del evento que ocurre al nacer la materia:",
                            answer: "alEmpezar"
                        }
                    ]
                },
                {
                    id: 32,
                    title: "El Latido: alActualizar",
                    steps: [
                        {
                            type: "teoria",
                            content: "Para que un juego se sienta vivo, las cosas deben cambiar constantemente. 'alActualizar(delta)' ocurre en cada frame. El valor 'delta' es el tiempo que pasó desde el último frame, vital para que el movimiento sea fluido.",
                            code: "alActualizar(delta) {\n  posicion.x += 200 * delta;\n}"
                        },
                        {
                            type: "completar-codigo",
                            question: "Mueve la materia constantemente en cada frame:",
                            codeTemplate: "[BLOQUE](delta) { ... }",
                            blocks: ["alActualizar", "alEmpezar", "alHacerClick"],
                            answer: "alActualizar"
                        },
                        {
                            type: "modo-debug",
                            question: "El personaje se mueve a saltos porque no usa el tiempo real (delta). ¡Corrígelo!",
                            codeLines: ["alActualizar(delta) {", "  posicion.x += 10;", "}"],
                            errorLine: 1,
                            explanation: "Debes multiplicar por 'delta' para que el movimiento dependa del tiempo y no de los FPS.",
                            solution: "posicion.x += 10 * delta;"
                        }
                    ]
                },
                {
                    id: 33,
                    title: "Contacto Físico: Colisiones",
                    steps: [
                        {
                            type: "teoria",
                            content: "Cuando dos objetos sólidos chocan, el motor dispara 'alEntrarEnColision(otro)'. El parámetro 'otro' nos da acceso a la materia con la que chocamos para leer sus tags o destruirla.",
                            code: "alEntrarEnColision(otro) {\n  si (otro.tieneTag(\"Peligro\")) {\n    destruir(materia);\n  }\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué representa el parámetro 'otro' en el evento de colisión?",
                            options: [
                                { text: "Nuestra propia materia", correct: false },
                                { text: "La materia contra la que chocamos", correct: true },
                                { text: "La velocidad del impacto", correct: false }
                            ]
                        },
                        {
                            type: "completar-codigo",
                            question: "Detecta el inicio del choque:",
                            codeTemplate: "[BLOQUE](otro) { ... }",
                            blocks: ["alEntrarEnColision", "alSalirDeColision", "alHacerClick"],
                            answer: "alEntrarEnColision"
                        }
                    ]
                },
                {
                    id: 34,
                    title: "Zonas de Sensor (Trigger)",
                    steps: [
                        {
                            type: "teoria",
                            content: "A veces queremos detectar que el jugador pasó por un lugar sin detener su movimiento (como una moneda o una meta). Para eso usamos Triggers y el evento 'alEntrarEnTrigger'.",
                            code: "alEntrarEnTrigger(otro) {\n  si (otro.tieneTag(\"Jugador\")) {\n    imprimir(\"¡Meta alcanzada!\");\n  }\n}"
                        },
                        {
                            type: "practica",
                            question: "¿Cómo se llama el evento para detectar que algo entra en un sensor invisible?",
                            answer: "alEntrarEnTrigger"
                        },
                        {
                            type: "ordenar-bloques",
                            question: "Crea la lógica para recoger una moneda al entrar en su sensor:",
                            blocks: ["alEntrarEnTrigger(otro) {", "destruir(materia);", "}"],
                            answer: ["alEntrarEnTrigger(otro) {", "destruir(materia);", "}"]
                        }
                    ]
                },
                {
                    id: 35,
                    title: "Interacción: alHacerClick",
                    steps: [
                        {
                            type: "teoria",
                            content: "El evento 'alHacerClick()' permite interactuar directamente con los objetos usando el ratón o la pantalla táctil. Es esencial para botones, interruptores o diálogos de NPCs.",
                            code: "alHacerClick() {\n  renderizadorDeSprite.color = \"Azul\";\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "Si quieres que un cofre se abra al tocarlo, ¿qué evento usarías?",
                            options: [
                                { text: "alEntrarEnColision", correct: false },
                                { text: "alHacerClick", correct: true },
                                { text: "alActualizar", correct: false }
                            ]
                        },
                        {
                            type: "practica",
                            question: "Escribe el comando para destruir un objeto al clicarlo:",
                            answer: "alHacerClick() { destruir(materia); }"
                        }
                    ]
                },
                {
                    id: 36,
                    title: "Telepatía: Difundir y Recibir",
                    steps: [
                        {
                            type: "teoria",
                            content: "Las materias pueden comunicarse a distancia. Con 'difundir' envías un mensaje a todo el juego, y con 'alRecibir' escuchas mensajes específicos para actuar.",
                            code: "// En el interruptor\ndifundir(\"ABRIR_PUERTA\");\n\n// En la puerta\nalRecibir(\"ABRIR_PUERTA\", () => { destruir(materia); });"
                        },
                        {
                            type: "completar-codigo",
                            question: "Envía una señal global llamada 'VICTORIA':",
                            codeTemplate: "[BLOQUE](\"VICTORIA\");",
                            blocks: ["difundir", "alRecibir", "imprimir"],
                            answer: "difundir"
                        },
                        {
                            type: "modo-debug",
                            question: "La puerta no se abre porque el nombre del mensaje no coincide. ¡Corrígelo!",
                            codeLines: ["// Interruptor envía: \"OPEN\"", "alRecibir(\"ABRIR\", () => { ... });"],
                            errorLine: 1,
                            explanation: "El nombre del mensaje en 'alRecibir' debe ser idéntico al enviado por 'difundir'.",
                            solution: "alRecibir(\"OPEN\", () => { ... });"
                        }
                    ]
                },
                {
                    id: 37,
                    title: "El Maestro del Tiempo: esperar",
                    steps: [
                        {
                            type: "teoria",
                            content: "A veces necesitamos que algo no pase de inmediato. El comando 'esperar(segundos)' pausa la ejecución de ese script específico sin detener el resto del juego.",
                            code: "alHacerClick() {\n  imprimir(\"Bomba activada...\");\n  esperar(3);\n  imprimir(\"¡BOOM!\");\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué sucede con el resto del juego mientras un script está en 'esperar'?",
                            options: [
                                { text: "Todo se congela", correct: false },
                                { text: "El resto del juego sigue funcionando normalmente", correct: true },
                                { text: "Se cierra el juego por error", correct: false }
                            ]
                        },
                        {
                            type: "practica",
                            question: "Escribe la línea para esperar medio segundo (0.5):",
                            answer: "esperar(0.5);"
                        }
                    ]
                },
                {
                    id: 38,
                    title: "Ritmo Repetitivo: cada",
                    steps: [
                        {
                            type: "teoria",
                            content: "Si quieres que algo se repita cada cierto tiempo (como generar un enemigo cada 2 segundos), usamos el bloque 'cada(segundos)'.",
                            code: "alEmpezar() {\n  cada(2) {\n    crear(EnemigoPrefab);\n  }\n}"
                        },
                        {
                            type: "completar-codigo",
                            question: "Haz que el jugador pierda vida cada segundo:",
                            codeTemplate: "[BLOQUE](1) { vida -= 5; }",
                            blocks: ["cada", "esperar", "alActualizar"],
                            answer: "cada"
                        },
                        {
                            type: "ordenar-bloques",
                            question: "Crea un spawner que funcione cada 5 segundos:",
                            blocks: ["cada(5) {", "crear(Bala);", "}"],
                            answer: ["cada(5) {", "crear(Bala);", "}"]
                        }
                    ]
                },
                {
                    id: 39,
                    title: "Física Precisa: actualizarFijo",
                    steps: [
                        {
                            type: "teoria",
                            content: "A diferencia de 'alActualizar', el evento 'actualizarFijo' ocurre en intervalos constantes de tiempo. Es el lugar perfecto para aplicar fuerzas físicas manuales para que el comportamiento sea siempre igual.",
                            code: "actualizarFijo(delta) {\n  fisica.applyForce(nuevo Vector2(0, -10));\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Por qué usarías 'actualizarFijo' en lugar de 'alActualizar'?",
                            options: [
                                { text: "Para cálculos matemáticos pesados", correct: false },
                                { text: "Para movimientos físicos que deben ser estables y precisos", correct: true },
                                { text: "Para detectar clics del ratón", correct: false }
                            ]
                        },
                        {
                            type: "practica",
                            question: "Escribe el nombre del evento para físicas constantes:",
                            answer: "actualizarFijo"
                        }
                    ]
                },
                {
                    id: 40,
                    title: "¡JEFE: El Sincronizador de Almas!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "¡El Sincronizador de Almas ha congelado el tiempo! Debes usar todos tus conocimientos sobre eventos para restaurar el ritmo del universo.",
                            code: "// ALERTA: DESINCRONIZACIÓN DETECTADA"
                        },
                        {
                            type: "modo-debug",
                            question: "RONDA 1: El jefe es invisible porque falta el evento de inicio. ¡Repáralo!",
                            codeLines: ["alNacer() {", "  estaActivado = verdadero;", "}"],
                            errorLine: 0,
                            explanation: "El evento correcto según el libro es 'alEmpezar'.",
                            solution: "alEmpezar() {"
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA 2: ¡El jefe lanza un ataque rítmico! Esquiva cada 0.5 segundos:",
                            codeTemplate: "[BLOQUE](0.5) { esquivar(); }",
                            blocks: ["cada", "esperar", "ciclo"],
                            answer: "cada"
                        },
                        {
                            type: "opcion-multiple",
                            question: "RONDA 3: ¡El golpe final requiere coordinación! ¿Qué evento usarías para que todos los aliados ataquen a la vez?",
                            options: [
                                { text: "alHacerClick", correct: false },
                                { text: "difundir(\"ATAQUE_TOTAL\")", correct: true },
                                { text: "alActualizar", correct: false }
                            ]
                        },
                        {
                            type: "practica",
                            question: "RONDA 4: Espera 1.2 segundos para encontrar el punto débil del jefe:",
                            answer: "esperar(1.2);"
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA FINAL: ¡Destrúyelo al tocar su núcleo!",
                            codeTemplate: "[BLOQUE]() { destruir(otro); }",
                            blocks: ["alHacerClick", "alEmpezar", "alMorir"],
                            answer: "alHacerClick"
                        }
                    ]
                }
            ]
        },
        {
            id: 5,
            name: "El Poder de Carl IA",
            color: "#C70039",
            courses: [
                {
                    id: 41,
                    title: "Despertando a Carl",
                    steps: [
                        {
                            type: "teoria",
                            content: "Carl IA no es solo un chat, es una herramienta que puede leer tu escena y ayudarte a programar. Para invocar su ayuda desde código, usamos el comando 'carl'.",
                            code: "carl.ayuda(\"Haz que este objeto salte\");"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué puede hacer Carl IA por ti?",
                            options: [
                                { text: "Solo responder preguntas", correct: false },
                                { text: "Crear objetos y escribir scripts por ti", correct: true },
                                { text: "Jugar el juego por ti", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 42,
                    title: "Análisis de Escena",
                    steps: [
                        {
                            type: "teoria",
                            content: "Carl puede analizar cuántas materias hay en tu escena y decirte si falta alguna ley importante como 'Fisica'.",
                            code: "carl.analizar_escena();"
                        },
                        {
                            type: "completar-codigo",
                            question: "Pide a Carl que analice la escena:",
                            codeTemplate: "carl.[BLOQUE]();",
                            blocks: ["analizar_escena", "borrar", "dormir"],
                            answer: "analizar_escena"
                        }
                    ]
                }
            ]
        },
        { id: 6, name: "Seguridad y Optimización", color: "#900C3F", courses: [] },
        { id: 7, name: "Estructuras de Datos CES", color: "#581845", courses: [] },
        { id: 8, name: "Gráficos Avanzados", color: "#1A5276", courses: [] },
        { id: 9, name: "Redes y Multijugador", color: "#1D8348", courses: [] },
        { id: 10, name: "Maestría Creativa", color: "#F1C40F", courses: [] },
        {
            id: 11,
            name: "EXAMEN DE CERTIFICACIÓN",
            color: "gold",
            courses: [
                {
                    id: 101,
                    title: "Teoría: El Ecosistema CES",
                    steps: [
                        {
                            type: "opcion-multiple",
                            question: "Para que un script funcione en Creative Engine, ¿cuál es la primera línea obligatoria?",
                            options: [
                                { text: "materia Script;", correct: false },
                                { text: "ve motor;", correct: true },
                                { text: "iniciar motor;", correct: false }
                            ]
                        },
                        {
                            type: "opcion-multiple",
                            question: "Si quieres buscar una materia específica en todo el proyecto, usas:",
                            options: [
                                { text: "buscar(\"nombre\");", correct: true },
                                { text: "ley Buscar;", correct: false },
                                { text: "variable x = \"nombre\";", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 102,
                    title: "Práctica: Arquitectura y Capas",
                    steps: [
                        {
                            type: "completar-codigo",
                            question: "Pon una materia en la capa más profunda (detrás de todo):",
                            codeTemplate: "ley Capa([BLOQUE]);",
                            blocks: ["-100", "0", "100"],
                            answer: "-100"
                        },
                        {
                            type: "ordenar-bloques",
                            question: "Crea una materia 'Hijo' dentro de 'Padre' usando jerarquía:",
                            blocks: ["materia Padre {", "materia Hijo;", "}"],
                            answer: ["materia Padre {", "materia Hijo;", "}"]
                        }
                    ]
                },
                {
                    id: 103,
                    title: "Desafío de Física y Sensores",
                    steps: [
                        {
                            type: "modo-debug",
                            question: "Encuentra el error en la detección de colisión fantasma (Trigger):",
                            codeLines: ["materia Zona;", "ley Solido;", "alEntrar(otro) { ... }"],
                            errorLine: 1,
                            explanation: "Para detectar sin bloquear el paso se debe usar 'ley Trigger', no 'ley Solido'.",
                            solution: "ley Trigger;"
                        },
                        {
                            type: "completar-codigo",
                            question: "Aplica un impulso de salto potente (Eje Y negativo):",
                            codeTemplate: "fisica.impulso(0, [BLOQUE]);",
                            blocks: ["-1000", "1000", "0"],
                            answer: "-1000"
                        }
                    ]
                }
            ]
        }
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
