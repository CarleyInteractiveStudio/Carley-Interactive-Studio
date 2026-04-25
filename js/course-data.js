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
                            content: "¡Bienvenido! En Creative Engine, todo script debe comenzar con 've motor;'. Esta instrucción conecta tu código con el corazón del sistema. Sin ella, el motor ignorará tu script por completo.",
                            code: "// Conexión obligatoria\nve motor;"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Cuál es la primera línea obligatoria de cualquier script CES?",
                            options: [
                                { text: "iniciar motor;", correct: false },
                                { text: "ve motor;", correct: true },
                                { text: "publico numero vida;", correct: false }
                            ],
                            feedback: "Correcto. Es el puente indispensable entre tu código y el motor."
                        },
                        {
                            type: "practica",
                            question: "Escribe la instrucción necesaria para activar tu script:",
                            answer: "ve motor;"
                        }
                    ]
                },
                {
                    id: 2,
                    title: "Declaración: variable",
                    steps: [
                        {
                            type: "teoria",
                            content: "Usamos la palabra clave 'variable' para guardar información que solo este script podrá usar. Es ideal para datos internos que no necesitan ser vistos desde el editor.",
                            code: "variable secreto = 500;"
                        },
                        {
                            type: "completar-codigo",
                            question: "Declara una variable interna llamada 'puntos':",
                            codeTemplate: "[BLOQUE] puntos = 0;",
                            blocks: ["variable", "publico", "dato"],
                            answer: "variable"
                        },
                        {
                            type: "practica",
                            question: "Crea una variable llamada 'energia' con valor 100:",
                            answer: "variable energia = 100;"
                        }
                    ]
                },
                {
                    id: 3,
                    title: "El Inspector: publico",
                    steps: [
                        {
                            type: "teoria",
                            content: "Si quieres que una variable aparezca en el Inspector del editor para cambiar su valor sin tocar el código, usa 'publico' seguido del tipo de dato.",
                            code: "publico numero vida = 100;"
                        },
                        {
                            type: "ordenar-bloques",
                            question: "Crea una variable pública numérica para la velocidad:",
                            blocks: ["publico", "numero", "velocidad", "= 10;"],
                            answer: ["publico", "numero", "velocidad", "= 10;"]
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Para qué sirve la palabra clave 'publico'?",
                            options: [
                                { text: "Para que el código sea más rápido", correct: false },
                                { text: "Para ver y editar la variable desde el editor", correct: true },
                                { text: "Para que todos los jugadores la vean", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 4,
                    title: "Tipos de Datos",
                    steps: [
                        {
                            type: "teoria",
                            content: "CES reconoce varios tipos: 'numero' para cifras, 'texto' para palabras entre comillas, y 'booleano' para verdadero/falso.",
                            code: "publico texto miNombre = \"Héroe\";\npublico booleano estaVivo = verdadero;"
                        },
                        {
                            type: "completar-codigo",
                            question: "Define una variable pública para un interruptor:",
                            codeTemplate: "publico [BLOQUE] luzEncendida = falso;",
                            blocks: ["booleano", "numero", "texto"],
                            answer: "booleano"
                        },
                        {
                            type: "practica",
                            question: "Declara una variable pública de texto llamada 'saludo':",
                            answer: "publico texto saludo;"
                        }
                    ]
                },
                {
                    id: 5,
                    title: "Anatomía del Script",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un script se organiza en: 1. Cabecera (ve motor;), 2. Variables (publico/variable) y 3. Eventos (funciones automáticas).",
                            code: "ve motor;\n\npublico numero velocidad = 5;\n\nalEmpezar() { ... }"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Dónde deben declararse las variables públicas por norma general?",
                            options: [
                                { text: "Al final del script", correct: false },
                                { text: "Antes de los eventos", correct: true },
                                { text: "Dentro de alEmpezar", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 6,
                    title: "Eventos: alEmpezar",
                    steps: [
                        {
                            type: "teoria",
                            content: "El evento 'alEmpezar()' ocurre una única vez cuando el objeto nace en el juego. Es perfecto para configuraciones iniciales.",
                            code: "alEmpezar() {\n  imprimir(\"¡Iniciando sistema!\");\n}"
                        },
                        {
                            type: "practica",
                            question: "Escribe el nombre de la función que corre solo una vez al inicio:",
                            answer: "alEmpezar"
                        },
                        {
                            type: "completar-codigo",
                            question: "Lanza un mensaje a la consola al nacer:",
                            codeTemplate: "alEmpezar() { [BLOQUE](\"Hola\"); }",
                            blocks: ["imprimir", "ve", "variable"],
                            answer: "imprimir"
                        }
                    ]
                },
                {
                    id: 7,
                    title: "Ciclo Vital: alActualizar",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un juego ocurre a 60 frames por segundo. 'alActualizar(delta)' se ejecuta en cada uno de esos frames para procesar lógica constante.",
                            code: "alActualizar(delta) {\n  // Lógica constante aquí\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Cuántas veces se ejecuta 'alActualizar' en un segundo?",
                            options: [
                                { text: "1 vez", correct: false },
                                { text: "60 veces aproximadamente", correct: true },
                                { text: "Solo cuando clicamos", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 8,
                    title: "Lógica: si (condición)",
                    steps: [
                        {
                            type: "teoria",
                            content: "Para que el juego tome decisiones usamos 'si'. Solo ejecutará lo que hay entre llaves si la condición es verdadera.",
                            code: "si (vida <= 0) {\n  destruir(materia);\n}"
                        },
                        {
                            type: "completar-codigo",
                            question: "Si tenemos la llave, abrimos la puerta:",
                            codeTemplate: "[BLOQUE] (tieneLlave) { abrir(); }",
                            blocks: ["si", "mientras", "variable"],
                            answer: "si"
                        }
                    ]
                },
                {
                    id: 9,
                    title: "Comentarios de Código",
                    steps: [
                        {
                            type: "teoria",
                            content: "Usa '//' para notas de una línea. El motor ignora los comentarios; son solo para que los humanos entiendan el código.",
                            code: "// Esto es una nota interna\nve motor;"
                        },
                        {
                            type: "practica",
                            question: "Escribe el símbolo para iniciar un comentario de una línea:",
                            answer: "//"
                        }
                    ]
                },
                {
                    id: 10,
                    title: "¡JEFE FINAL: El Bug de Sintaxis!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "¡CUIDADO! Un Bug de Sintaxis está bloqueando el compilador. Usa tus fundamentos para depurar el sistema.",
                            code: "// MODO DEPURACIÓN ACTIVADO"
                        },
                        {
                            type: "practica",
                            question: "RONDA 1: Conecta el script al motor.",
                            answer: "ve motor;"
                        },
                        {
                            type: "opcion-multiple",
                            question: "RONDA 2: Necesitas una variable que el diseñador pueda cambiar desde el editor. ¿Cuál usas?",
                            options: [
                                { text: "variable salto = 10;", correct: false },
                                { text: "publico numero salto = 10;", correct: true }
                            ]
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA 3: ¡El golpe final! Haz que el código tome una decisión:",
                            codeTemplate: "[BLOQUE] (bugDetectado) { borrarBug(); }",
                            blocks: ["si", "para", "cada"],
                            answer: "si"
                        }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: "Leyes y Materias",
            color: "#00AAFF",
            courses: [
                {
                    id: 11,
                    title: "Tags: Clasificación",
                    steps: [
                        {
                            type: "teoria",
                            content: "Los Tags permiten agrupar objetos. En lugar de buscar nombres uno a uno, preguntamos por su etiqueta. Por ejemplo, una bala solo dañará a lo que tenga el tag 'Enemigo'.",
                            code: "si (otro.tieneTag(\"Enemigo\")) {\n  destruir(otro);\n}"
                        },
                        {
                            type: "completar-codigo",
                            question: "Verifica si el objeto que tocamos es una moneda:",
                            codeTemplate: "si (otro.[BLOQUE](\"Moneda\"))",
                            blocks: ["tieneTag", "nombre", "variable"],
                            answer: "tieneTag"
                        },
                        {
                            type: "practica",
                            question: "¿Cómo se llama el sistema para agrupar objetos por su función?",
                            answer: "Tag"
                        }
                    ]
                },
                {
                    id: 12,
                    title: "Jerarquía: Padre e Hijo",
                    steps: [
                        {
                            type: "teoria",
                            content: "En Creative Engine, los objetos pueden anidarse. Si mueves al Padre, los Hijos lo siguen automáticamente. Es vital para armas o extremidades del personaje.",
                            code: "// Concepto de Jerarquía\n// Objeto: Jugador -> Hijo: Espada"
                        },
                        {
                            type: "opcion-multiple",
                            question: "Si la espada es HIJA del jugador y el jugador gira, ¿qué hace la espada?",
                            options: [
                                { text: "Se queda quieta", correct: false },
                                { text: "Gira junto con el jugador", correct: true },
                                { text: "Desaparece", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 13,
                    title: "Sorting Layers",
                    steps: [
                        {
                            type: "teoria",
                            content: "El orden de dibujo se controla con las Sorting Layers. Un objeto en una capa superior siempre se dibujará por encima de uno en una inferior (ej: Jugador sobre el Fondo).",
                            code: "// En el Inspector:\n// Layer: Fondo (0)\n// Layer: Personaje (10)"
                        },
                        {
                            type: "completar-codigo",
                            question: "Si queremos que el enemigo esté detrás de los arbustos:",
                            codeTemplate: "Enemigo Layer: 0, Arbustos Layer: [BLOQUE]",
                            blocks: ["5", "0", "-1"],
                            answer: "5"
                        }
                    ]
                },
                {
                    id: 14,
                    title: "Prefabs: El Poder del Molde",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un Prefab es una Materia guardada como plantilla. Si diseñas una bala perfecta, la conviertes en Prefab para crear mil iguales sin repetir trabajo.",
                            code: "// Usamos 'crear' para instanciar plantillas\ncrear(balaPrefab);"
                        },
                        {
                            type: "practica",
                            question: "Escribe el comando para generar un objeto desde un Prefab:",
                            answer: "crear"
                        }
                    ]
                },
                {
                    id: 15,
                    title: "Visibilidad y Control",
                    steps: [
                        {
                            type: "teoria",
                            content: "Puedes apagar objetos totalmente usando 'estaActivado'. Si es falso, el objeto desaparece y sus scripts dejan de funcionar.",
                            code: "estaActivado = falso; // Desconexión total"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Cómo harías que un cofre desaparezca pero siga existiendo en la escena?",
                            options: [
                                { text: "estaActivado = falso;", correct: true },
                                { text: "destruir(materia);", correct: false },
                                { text: "borrar script;", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 16,
                    title: "Puntos de Anclaje (Anchors)",
                    steps: [
                        {
                            type: "teoria",
                            content: "Los Anchors definen el punto central o eje de un objeto. Son fundamentales para que los botones de la UI no se muevan de lugar al cambiar el tamaño de la pantalla.",
                            code: "// UI -> Anclar a la derecha"
                        },
                        {
                            type: "practica",
                            question: "¿Cómo se llama el sistema para que la UI sea responsiva?",
                            answer: "Anchor"
                        }
                    ]
                },
                {
                    id: 17,
                    title: "Cambio de Escena",
                    steps: [
                        {
                            type: "teoria",
                            content: "Los juegos se dividen en archivos '.ceScene'. Para viajar de una a otra, como pasar del menú al Nivel 1, usamos 'cargarEscena'.",
                            code: "cargarEscena(\"Mundo1\");"
                        },
                        {
                            type: "completar-codigo",
                            question: "Sal del menú hacia el juego:",
                            codeTemplate: "[BLOQUE](\"Nivel1\");",
                            blocks: ["cargarEscena", "ir", "buscar"],
                            answer: "cargarEscena"
                        }
                    ]
                },
                {
                    id: 18,
                    title: "Optimización: Pooling",
                    steps: [
                        {
                            type: "teoria",
                            content: "Crear y destruir objetos constantemente (como balas) consume mucha memoria. El Pooling consiste en ocultar y reutilizar objetos en lugar de borrarlos.",
                            code: "// Técnica: Desactivar -> Mover -> Reactivar"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Cuál es el objetivo principal del Object Pooling?",
                            options: [
                                { text: "Mejorar los gráficos", correct: false },
                                { text: "Ganar rendimiento y evitar tirones (lag)", correct: true },
                                { text: "Que el juego sea más difícil", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 19,
                    title: "Localización: buscar()",
                    steps: [
                        {
                            type: "teoria",
                            content: "Si necesitas encontrar un objeto específico que ya está en la escena por su nombre real, usas la función 'buscar'.",
                            code: "variable heroe = buscar(\"Carl\");"
                        },
                        {
                            type: "practica",
                            question: "Escribe el comando para encontrar un objeto llamado 'Tesoro':",
                            answer: "buscar(\"Tesoro\")"
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
                            content: "El Arquitecto ha desordenado las capas y jerarquías de tu escena. ¡Usa la organización para vencerlo!",
                            code: "// DESORDEN DETECTADO"
                        },
                        {
                            type: "ordenar-bloques",
                            question: "RONDA 1: Identifica al enemigo real entre las copias usando su etiqueta:",
                            blocks: ["si (otro.tieneTag(", "\"Enemigo\"", ")) { atacar(); }"],
                            answer: ["si (otro.tieneTag(", "\"Enemigo\"", ")) { atacar(); }"]
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA 2: Crea un refuerzo desde el molde (Prefab):",
                            codeTemplate: "[BLOQUE](aliadoPrefab);",
                            blocks: ["crear", "buscar", "cargarEscena"],
                            answer: "crear"
                        },
                        {
                            type: "opcion-multiple",
                            question: "RONDA 3: ¡El golpe final! Necesitas viajar a la guarida secreta. ¿Qué usas?",
                            options: [
                                { text: "estaActivado = verdadero;", correct: false },
                                { text: "cargarEscena(\"Guarida\");", correct: true }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: "Componentes Universales",
            color: "#FFC300",
            courses: [
                {
                    id: 21,
                    title: "Raycast: Ojos Invisibles",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un Raycast es un rayo invisible que el motor lanza en una dirección. Si toca algo, devuelve información (hit). Es la forma en que los enemigos 'ven' al jugador.",
                            code: "variable hit = lanzarRayo(posicion, Vector2.derecha, 500);\nsi (hit != nulo) {\n  imprimir(\"¡Objetivo detectado!\");\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué devuelve la función 'lanzarRayo' si no toca nada?",
                            options: [
                                { text: "falso", correct: false },
                                { text: "nulo", correct: true },
                                { text: "0", correct: false }
                            ]
                        },
                        {
                            type: "modo-debug",
                            question: "El script tiene un error de nombre de función según el libro. ¡Corrígelo!",
                            codeLines: ["variable hit = emitir_rayo(posicion, dir, 100);", "si (hit != nulo) { atacar(); }"],
                            errorLine: 0,
                            explanation: "La función oficial del libro es 'lanzarRayo'.",
                            solution: "variable hit = lanzarRayo(posicion, dir, 100);"
                        }
                    ]
                },
                {
                    id: 22,
                    title: "Sensores: Trigger",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un colisionador con 'Is Trigger' activado permite que los objetos lo atraviesen sin chocar físicamente, pero disparando eventos. Se usa para monedas o zonas de detección.",
                            code: "alEntrarEnTrigger(otro) {\n  si (otro.tieneTag(\"Jugador\")) {\n    sumarPuntos();\n  }\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué sucede físicamente con un objeto que es un Trigger?",
                            options: [
                                { text: "Rebota con mucha fuerza", correct: false },
                                { text: "Es atravesable como un fantasma", correct: true },
                                { text: "Es indestructible", correct: false }
                            ]
                        },
                        {
                            type: "practica",
                            question: "Escribe el evento que detecta cuando algo entra en el sensor:",
                            answer: "alEntrarEnTrigger"
                        }
                    ]
                },
                {
                    id: 23,
                    title: "Física: Impulso",
                    steps: [
                        {
                            type: "teoria",
                            content: "Para mover un objeto bruscamente usamos impulsos. 'fisica.applyImpulse' aplica una fuerza instantánea perfecta para saltos o explosiones.",
                            code: "si (teclaRecienPresionada(\"Space\")) {\n  fisica.applyImpulse(nuevo Vector2(0, -15));\n}"
                        },
                        {
                            type: "completar-codigo",
                            question: "Aplica un impulso hacia arriba:",
                            codeTemplate: "fisica.[BLOQUE](nuevo Vector2(0, -10));",
                            blocks: ["applyImpulse", "moverse", "saltar"],
                            answer: "applyImpulse"
                        },
                        {
                            type: "practica",
                            question: "Escribe el nombre del componente que maneja la gravedad y fuerzas:",
                            answer: "fisica"
                        }
                    ]
                },
                {
                    id: 24,
                    title: "Escala de Gravedad",
                    steps: [
                        {
                            type: "teoria",
                            content: "Puedes cambiar qué tan pesado se siente un objeto. 1.0 es normal, 0 es flotar en el espacio. Se ajusta mediante 'fisica.gravityScale'.",
                            code: "fisica.gravityScale = 0.5; // Gravedad lunar"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué valor de gravityScale haría que un objeto no caiga?",
                            options: [
                                { text: "1.0", correct: false },
                                { text: "0", correct: true },
                                { text: "9.8", correct: false }
                            ]
                        },
                        {
                            type: "modo-debug",
                            question: "¡El objeto cae demasiado rápido! Ajusta la gravedad a la normalidad (1.0):",
                            codeLines: ["fisica.gravityScale = 10.0;"],
                            errorLine: 0,
                            explanation: "10.0 es 10 veces más fuerte que la gravedad real.",
                            solution: "fisica.gravityScale = 1.0;"
                        }
                    ]
                },
                {
                    id: 25,
                    title: "Materiales Físicos",
                    steps: [
                        {
                            type: "teoria",
                            content: "En el Inspector puedes asignar materiales que definen la fricción y el rebote. La fricción 0 hace que todo resbale como hielo. El rebote 1 hace que nunca pare de saltar.",
                            code: "// Propiedades del componente Collider2D"
                        },
                        {
                            type: "ordenar-bloques",
                            question: "Diferencia entre propiedades:",
                            blocks: ["Fricción: Resbala,", "Rebote: Salta"],
                            answer: ["Fricción: Resbala,", "Rebote: Salta"]
                        },
                        {
                            type: "completar-codigo",
                            question: "Si quieres una pelota que rebote mucho, el valor debe ser cercano a:",
                            codeTemplate: "Rebote: [BLOQUE]",
                            blocks: ["1.0", "0.0", "-1.0"],
                            answer: "1.0"
                        }
                    ]
                },
                {
                    id: 26,
                    title: "Audio Espacial",
                    steps: [
                        {
                            type: "teoria",
                            content: "El componente 'fuenteDeAudio' permite emitir sonidos. Si es espacial, el motor ajustará el volumen dependiendo de qué tan cerca esté el jugador de la materia.",
                            code: "fuenteDeAudio.play(sonidoExplosion);"
                        },
                        {
                            type: "completar-codigo",
                            question: "Reproduce el archivo de audio:",
                            codeTemplate: "fuenteDeAudio.[BLOQUE](clip);",
                            blocks: ["play", "stop", "loop"],
                            answer: "play"
                        },
                        {
                            type: "practica",
                            question: "Escribe el nombre del componente de sonido:",
                            answer: "fuenteDeAudio"
                        }
                    ]
                },
                {
                    id: 27,
                    title: "Partículas Dinámicas",
                    steps: [
                        {
                            type: "teoria",
                            content: "El sistema de 'particulas' permite crear efectos como fuego o humo. Deben estar activadas para emitir.",
                            code: "particulas.estaActivado = verdadero;"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué componente usarías para hacer humo de una chimenea?",
                            options: [
                                { text: "SpriteRenderer", correct: false },
                                { text: "particulas", correct: true },
                                { text: "Rigidbody2D", correct: false }
                            ]
                        },
                        {
                            type: "practica",
                            question: "Escribe la propiedad para encender un sistema de partículas:",
                            answer: "estaActivado = verdadero"
                        }
                    ]
                },
                {
                    id: 28,
                    title: "Cámara y Filtros",
                    steps: [
                        {
                            type: "teoria",
                            content: "La 'camara' es el ojo del jugador. Puedes aplicar efectos de post-procesado como Bloom o Viñeta para mejorar la atmósfera visual.",
                            code: "// Efecto Bloom: Hace que las luces brillen"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué efecto oscurece los bordes de la pantalla?",
                            options: [
                                { text: "Bloom", correct: false },
                                { text: "Viñeta", correct: true },
                                { text: "Interpolación", correct: false }
                            ]
                        },
                        {
                            type: "completar-codigo",
                            question: "El componente que ve el mundo se llama:",
                            codeTemplate: "[BLOQUE]",
                            blocks: ["camara", "ojo", "monitor"],
                            answer: "camara"
                        }
                    ]
                },
                {
                    id: 29,
                    title: "Profundidad: Parallax",
                    steps: [
                        {
                            type: "teoria",
                            content: "El Parallax crea una ilusión de profundidad haciendo que las capas del fondo se muevan más lento que el frente. Es el secreto de los mejores juegos 2D.",
                            code: "// Fondo lejano -> Velocidad 0.1\n// Fondo cercano -> Velocidad 0.5"
                        },
                        {
                            type: "completar-codigo",
                            question: "Para que una montaña parezca estar muy lejos, su velocidad debe ser:",
                            codeTemplate: "Velocidad: [BLOQUE]",
                            blocks: ["0.1", "1.0", "5.0"],
                            answer: "0.1"
                        },
                        {
                            type: "practica",
                            question: "Escribe el nombre de la técnica de movimiento de fondos:",
                            answer: "Parallax"
                        }
                    ]
                },
                {
                    id: 30,
                    title: "¡JEFE: El Guardián del Componente!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "El Guardián está manipulando las leyes físicas de la escena. ¡Demuestra que dominas los componentes!",
                            code: "// ALERTA FÍSICA"
                        },
                        {
                            type: "modo-debug",
                            question: "RONDA 1: El jefe detecta al jugador con un rayo mal escrito. ¡Corrígelo!",
                            codeLines: ["variable hit = rayo(pos, dir, 50);", "si (hit != nulo) { capturar(); }"],
                            errorLine: 0,
                            explanation: "La función correcta es 'lanzarRayo'.",
                            solution: "variable hit = lanzarRayo(pos, dir, 50);"
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA 2: ¡El suelo ha perdido gravedad! Restáurala para el jefe:",
                            codeTemplate: "jefe.fisica.[BLOQUE] = 1.0;",
                            blocks: ["gravityScale", "peso", "fuerza"],
                            answer: "gravityScale"
                        },
                        {
                            type: "opcion-multiple",
                            question: "RONDA 3: ¡El jefe es un fantasma atravesable! ¿Qué propiedad tiene activa?",
                            options: [
                                { text: "Is Trigger", correct: true },
                                { text: "Is Solid", correct: false }
                            ]
                        },
                        {
                            type: "practica",
                            question: "RONDA FINAL: ¡Empújalo fuera de la escena! Aplica un impulso de -50 en X:",
                            answer: "fisica.applyImpulse(nuevo Vector2(-50, 0));"
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
                            content: "Todo en CES tiene un inicio. El evento 'alEmpezar()' se ejecuta una única vez en el momento en que el objeto aparece en el mundo. Es el lugar ideal para configurar nombres, vidas iniciales o posiciones fijas.",
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
                            question: "Mueve el objeto constantemente en cada frame:",
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
                            content: "Cuando dos objetos sólidos chocan, el motor dispara 'alEntrarEnColision(otro)'. El parámetro 'otro' nos da acceso al objeto con el que chocamos para leer sus tags o interactuar con él.",
                            code: "alEntrarEnColision(otro) {\n  si (otro.tieneTag(\"Peligro\")) {\n    destruir(otro);\n  }\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué representa el parámetro 'otro' en el evento de colisión?",
                            options: [
                                { text: "Nuestro propio objeto", correct: false },
                                { text: "El objeto contra el que chocamos", correct: true },
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
                            codeTemplate: "[BLOQUE]() { destruir(jefe); }",
                            blocks: ["alHacerClick", "alEmpezar", "alActualizar"],
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
                            content: "Carl puede analizar cuántos objetos hay en tu escena y decirte si falta algún componente importante como 'Fisica'.",
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
                                { text: "variable script;", correct: false },
                                { text: "ve motor;", correct: true },
                                { text: "iniciar motor;", correct: false }
                            ]
                        },
                        {
                            type: "opcion-multiple",
                            question: "Si quieres buscar un objeto específico en la escena, usas:",
                            options: [
                                { text: "buscar(\"nombre\");", correct: true },
                                { text: "encontrar(\"nombre\");", correct: false },
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
                            question: "Pon un objeto en la Sorting Layer más profunda (fondo):",
                            codeTemplate: "Sorting Layer: [BLOQUE]",
                            blocks: ["-100", "0", "100"],
                            answer: "-100"
                        },
                        {
                            type: "opcion-multiple",
                            question: "Si movemos a un objeto 'Padre', ¿qué sucede con su 'Hijo'?",
                            options: [
                                { text: "Se queda quieto", correct: false },
                                { text: "Lo sigue automáticamente", correct: true },
                                { text: "Se destruye", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 103,
                    title: "Desafío de Física y Sensores",
                    steps: [
                        {
                            type: "modo-debug",
                            question: "Encuentra el error en el sistema de detección invisible (Trigger):",
                            codeLines: ["Rigidbody2D.gravityScale = 0;", "Is Trigger = falso;", "alEntrarEnTrigger(otro) { ... }"],
                            errorLine: 1,
                            explanation: "Para que un sensor funcione, 'Is Trigger' debe ser verdadero.",
                            solution: "Is Trigger = verdadero;"
                        },
                        {
                            type: "completar-codigo",
                            question: "Aplica un impulso de salto potente usando la API correcta:",
                            codeTemplate: "fisica.[BLOQUE](nuevo Vector2(0, -15));",
                            blocks: ["applyImpulse", "salto", "posicion"],
                            answer: "applyImpulse"
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
