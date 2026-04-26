/* ==============================
   Course Data - The Scripting Path (CES)
   Updated with High-Quality content and Harder Bosses
============================== */

window.courseData = {
    stages: [
        {
            id: 1,
            name: "Fundamentos y Control",
            color: "#7ED957",
            courses: [
                {
                    id: 1,
                    title: "Activación: ve motor;",
                    steps: [
                        {
                            type: "teoria",
                            content: "Todo script en Creative Engine debe comenzar con 've motor;'. Esta línea es obligatoria para que el motor reconozca y ejecute tu código.",
                            code: "ve motor;"
                        },
                        {
                            type: "practica",
                            question: "Escribe la línea obligatoria para activar el script:",
                            answer: "ve motor;"
                        }
                    ]
                },
                {
                    id: 2,
                    title: "Visibilidad: publico",
                    steps: [
                        {
                            type: "teoria",
                            content: "La palabra clave 'publico' permite que una variable sea visible y editable desde el Inspector del editor, sin necesidad de tocar el código.",
                            code: "publico numero velocidad = 10;"
                        },
                        {
                            type: "completar-codigo",
                            question: "Haz que la variable 'salto' sea visible en el Inspector:",
                            codeTemplate: "[BLOQUE] numero salto = 5;",
                            blocks: ["publico", "variable", "dato"],
                            answer: "publico"
                        }
                    ]
                },
                {
                    id: 3,
                    title: "Datos Internos: variable",
                    steps: [
                        {
                            type: "teoria",
                            content: "Usamos 'variable' para definir datos que solo el script actual puede usar. No aparecerán en el Inspector del editor.",
                            code: "variable secreto = 123;"
                        },
                        {
                            type: "practica",
                            question: "Declara una variable interna llamada 'energia' con valor 100:",
                            answer: "variable energia = 100;"
                        }
                    ]
                },
                {
                    id: 4,
                    title: "Decisiones: si (condición)",
                    steps: [
                        {
                            type: "teoria",
                            content: "El bloque 'si' ejecuta el código entre llaves solo si la condición es verdadera.",
                            code: "si (vida <= 0) {\n  imprimir(\"Game Over\");\n}"
                        },
                        {
                            type: "completar-codigo",
                            question: "Si tenemos la llave, abrimos la puerta:",
                            codeTemplate: "[BLOQUE] (tieneLlave) { abrir(); }",
                            blocks: ["si", "mientras", "para"],
                            answer: "si"
                        }
                    ]
                },
                {
                    id: 5,
                    title: "Alternativas: sino",
                    steps: [
                        {
                            type: "teoria",
                            content: "Se usa 'sino' después de un 'si' para ejecutar código cuando la condición inicial no se cumple.",
                            code: "si (puntos > 10) {\n  ganar();\n} sino {\n  intentar();\n}"
                        },
                        {
                            type: "practica",
                            question: "Escribe la palabra clave para la alternativa de un 'si':",
                            answer: "sino"
                        }
                    ]
                },
                {
                    id: 6,
                    title: "Bucles: mientras",
                    steps: [
                        {
                            type: "teoria",
                            content: "Repite un bloque de código 'mientras' una condición sea verdadera. ¡Cuidado con los bucles infinitos!",
                            code: "mientras (cargando) {\n  esperar(1);\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué hace el comando 'mientras'?",
                            options: [
                                { text: "Ejecuta una vez", correct: false },
                                { text: "Repite mientras sea verdad", correct: true },
                                { text: "Detiene el juego", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 7,
                    title: "Contadores: para",
                    steps: [
                        {
                            type: "teoria",
                            content: "El bucle 'para' sirve para repetir algo un número exacto de veces usando un contador.",
                            code: "para (variable i = 0; i < 5; i = i + 1) {\n  imprimir(i);\n}"
                        },
                        {
                            type: "completar-codigo",
                            question: "Inicia un bucle para contar:",
                            codeTemplate: "[BLOQUE] (variable i=0; i<10; i++)",
                            blocks: ["para", "cada", "si"],
                            answer: "para"
                        }
                    ]
                },
                {
                    id: 8,
                    title: "Salida: retornar",
                    steps: [
                        {
                            type: "teoria",
                            content: "Usa 'retornar' para salir de una función inmediatamente y, opcionalmente, devolver un valor.",
                            code: "si (error) retornar;"
                        },
                        {
                            type: "practica",
                            question: "Escribe el comando para salir de una función:",
                            answer: "retornar"
                        }
                    ]
                },
                {
                    id: 9,
                    title: "Lógica: y / o / no",
                    steps: [
                        {
                            type: "teoria",
                            content: "Operadores para combinar condiciones: 'y' (ambas deben ser verdad), 'o' (al menos una), 'no' (invierte la verdad).",
                            code: "si (tieneLlave y estaCerca) { ... }"
                        },
                        {
                            type: "practica",
                            question: "Escribe el operador para que DOS condiciones deban ser verdad:",
                            answer: "y"
                        }
                    ]
                },
                {
                    id: 10,
                    title: "¡JEFE: El Bug de Control!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "¡El Bug de Control ha bloqueado el flujo del programa! Usa los fundamentos para restaurarlo.",
                            code: "// DEPURACIÓN REQUERIDA"
                        },
                        {
                            type: "practica",
                            question: "RONDA 1: Conecta el script al motor.",
                            answer: "ve motor;"
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA 2: El jefe solo es vulnerable si tienes energía Y estás cerca:",
                            codeTemplate: "si (tengoEnergia [BLOQUE] cercaDelJefe)",
                            blocks: ["y", "o", "no"],
                            answer: "y"
                        },
                        {
                            type: "ordenar-bloques",
                            question: "RONDA 3: ¡Finaliza el bucle de ataque!",
                            blocks: ["para (i=0; i<3; i++) {", "atacar();", "}"],
                            answer: ["para (i=0; i<3; i++) {", "atacar();", "}"]
                        }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: "El Inspector",
            color: "#00AAFF",
            courses: [
                {
                    id: 11,
                    title: "Campos Numéricos",
                    steps: [
                        {
                            type: "teoria",
                            content: "Para que el editor muestre un campo de números con deslizador, usa 'publico numero'.",
                            code: "publico numero fuerza = 50;"
                        },
                        {
                            type: "practica",
                            question: "Crea una variable pública numérica llamada 'salto':",
                            answer: "publico numero salto;"
                        }
                    ]
                },
                {
                    id: 12,
                    title: "Cajas de Texto",
                    steps: [
                        {
                            type: "teoria",
                            content: "Usa 'publico texto' para crear una caja donde escribir nombres o diálogos en el editor.",
                            code: "publico texto nombreJugador = \"Carl\";"
                        },
                        {
                            type: "completar-codigo",
                            question: "Define un campo de texto para diálogos:",
                            codeTemplate: "publico [BLOQUE] saludo = \"Hola\";",
                            blocks: ["texto", "numero", "booleano"],
                            answer: "texto"
                        }
                    ]
                },
                {
                    id: 13,
                    title: "Interruptores: booleano",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un 'publico booleano' crea un Checkbox (interruptor) de sí/no en el Inspector.",
                            code: "publico booleano esInmortal = falso;"
                        },
                        {
                            type: "practica",
                            question: "Crea un interruptor público llamado 'estaActivo':",
                            answer: "publico booleano estaActivo;"
                        }
                    ]
                },
                {
                    id: 14,
                    title: "Referencias a Materia",
                    steps: [
                        {
                            type: "teoria",
                            content: "Puedes arrastrar otros objetos de la escena al Inspector usando 'publico Materia'.",
                            code: "publico Materia objetivo;"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Para qué sirve 'publico Materia'?",
                            options: [
                                { text: "Para crear un nuevo objeto", correct: false },
                                { text: "Para referenciar un objeto de la escena", correct: true },
                                { text: "Para borrar un objeto", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 15,
                    title: "Moldes: publico Prefab",
                    steps: [
                        {
                            type: "teoria",
                            content: "Usa 'publico Prefab' para asignar una plantilla (.ceprefab) desde tus archivos al script.",
                            code: "publico Prefab enemigoPrefab;"
                        },
                        {
                            type: "practica",
                            question: "Declara un campo público para un molde llamado 'bala':",
                            answer: "publico Prefab bala;"
                        }
                    ]
                },
                {
                    id: 16,
                    title: "Imágenes: publico Sprite",
                    steps: [
                        {
                            type: "teoria",
                            content: "Para cambiar imágenes desde el editor, usa 'publico Sprite'.",
                            code: "publico Sprite skinNueva;"
                        },
                        {
                            type: "completar-codigo",
                            question: "Variable para arrastrar una imagen:",
                            codeTemplate: "publico [BLOQUE] dibujo;",
                            blocks: ["Sprite", "Color", "Audio"],
                            answer: "Sprite"
                        }
                    ]
                },
                {
                    id: 17,
                    title: "Sonidos: publico Audio",
                    steps: [
                        {
                            type: "teoria",
                            content: "Usa 'publico Audio' para asignar archivos de sonido (.mp3, .wav) al objeto.",
                            code: "publico Audio sonidoExplosion;"
                        },
                        {
                            type: "practica",
                            question: "Escribe la línea para un campo de audio llamado 'musica':",
                            answer: "publico Audio musica;"
                        }
                    ]
                },
                {
                    id: 18,
                    title: "Selector de Color",
                    steps: [
                        {
                            type: "teoria",
                            content: "Usa 'publico Color' para abrir un selector visual en el Inspector.",
                            code: "publico Color tinte = \"#FF0000\";"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué aparece en el editor con 'publico Color'?",
                            options: [
                                { text: "Una caja de texto", correct: false },
                                { text: "Un selector visual de colores", correct: true },
                                { text: "Una lista de números", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 19,
                    title: "Resumen de Visibilidad",
                    steps: [
                        {
                            type: "teoria",
                            content: "Recuerda: 'publico' sale en el Inspector, 'variable' se queda oculto en el código.",
                            code: "publico numero visible = 1;\nvariable oculto = 2;"
                        },
                        {
                            type: "modo-debug",
                            question: "¡Error! Queremos ver 'fuerza' en el editor, pero está oculta. Corrígelo:",
                            codeLines: ["variable fuerza = 10;"],
                            errorLine: 0,
                            explanation: "Debes usar 'publico' para que aparezca en el Inspector.",
                            solution: "publico numero fuerza = 10;"
                        }
                    ]
                },
                {
                    id: 20,
                    title: "¡JEFE: El Inspector del Caos!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "¡El Inspector ha sido saboteado! Define los campos correctos para recuperar el control.",
                            code: "// INSPECTOR BLOQUEADO"
                        },
                        {
                            type: "practica",
                            question: "RONDA 1: Crea un campo para que el diseñador elija el color del jefe:",
                            answer: "publico Color colorJefe;"
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA 2: Asigna el molde del súbdito:",
                            codeTemplate: "publico [BLOQUE] subditoPrefab;",
                            blocks: ["Prefab", "Materia", "Sprite"],
                            answer: "Prefab"
                        },
                        {
                            type: "practica",
                            question: "RONDA 3: Crea un interruptor para activar el modo difícil:",
                            answer: "publico booleano modoDificil;"
                        }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: "Tipos de Datos",
            color: "#FFC300",
            courses: [
                {
                    id: 21,
                    title: "Números (numero)",
                    steps: [
                        {
                            type: "teoria",
                            content: "El tipo 'numero' guarda cifras con o sin decimales.",
                            code: "numero vida = 100;\nnumero pi = 3.14;"
                        },
                        {
                            type: "practica",
                            question: "Escribe el tipo de dato para el número 42:",
                            answer: "numero"
                        }
                    ]
                },
                {
                    id: 22,
                    title: "Texto (texto)",
                    steps: [
                        {
                            type: "teoria",
                            content: "El tipo 'texto' guarda palabras y letras siempre entre comillas.",
                            code: "texto mensaje = \"Hola Mundo\";"
                        },
                        {
                            type: "completar-codigo",
                            question: "Define una variable de texto:",
                            codeTemplate: "[BLOQUE] saludo = \"Bienvenido\";",
                            blocks: ["texto", "numero", "frase"],
                            answer: "texto"
                        }
                    ]
                },
                {
                    id: 23,
                    title: "Lógica (booleano)",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un 'booleano' solo puede ser 'verdadero' o 'falso'.",
                            code: "booleano estaVivo = verdadero;"
                        },
                        {
                            type: "practica",
                            question: "Escribe el tipo de dato que es verdadero o falso:",
                            answer: "booleano"
                        }
                    ]
                },
                {
                    id: 24,
                    title: "Objetos (Materia)",
                    steps: [
                        {
                            type: "teoria",
                            content: "El tipo 'Materia' representa cualquier objeto físico o lógico dentro de tu juego.",
                            code: "Materia jugador = buscar(\"Carl\");"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué representa una 'Materia'?",
                            options: [
                                { text: "Un archivo de código", correct: false },
                                { text: "Un objeto en la escena", correct: true },
                                { text: "Un número decimal", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 25,
                    title: "Coordenadas (Vector2)",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un 'Vector2' guarda dos números (x, y). Se usa para posiciones, velocidades o tamaños.",
                            code: "variable punto = nuevo Vector2(100, 50);"
                        },
                        {
                            type: "practica",
                            question: "Escribe el tipo de dato para un punto (x, y):",
                            answer: "Vector2"
                        }
                    ]
                },
                {
                    id: 26,
                    title: "Colores (Color)",
                    steps: [
                        {
                            type: "teoria",
                            content: "El tipo 'Color' guarda información cromática, usualmente en formato Hexadecimal o RGB.",
                            code: "Color rojo = \"#FF0000\";"
                        },
                        {
                            type: "completar-codigo",
                            question: "Crea un color verde:",
                            codeTemplate: "[BLOQUE] verde = \"#00FF00\";",
                            blocks: ["Color", "Sprite", "Fisica"],
                            answer: "Color"
                        }
                    ]
                },
                {
                    id: 27,
                    title: "Imágenes (Sprite)",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un 'Sprite' es una imagen 2D que el motor puede dibujar.",
                            code: "Sprite miDibujo;"
                        },
                        {
                            type: "practica",
                            question: "Escribe el tipo de dato para una imagen:",
                            answer: "Sprite"
                        }
                    ]
                },
                {
                    id: 28,
                    title: "Audio",
                    steps: [
                        {
                            type: "teoria",
                            content: "El tipo 'Audio' guarda un archivo de sonido listo para ser reproducido.",
                            code: "Audio cancion;"
                        },
                        {
                            type: "practica",
                            question: "Escribe el tipo de dato para un sonido:",
                            answer: "Audio"
                        }
                    ]
                },
                {
                    id: 29,
                    title: "Moldes (Prefab)",
                    steps: [
                        {
                            type: "teoria",
                            content: "Un 'Prefab' es un objeto guardado como plantilla para crear copias idénticas.",
                            code: "Prefab rocaPrefab;"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué es un Prefab?",
                            options: [
                                { text: "Un error de código", correct: false },
                                { text: "Una plantilla o molde de objeto", correct: true },
                                { text: "Un tipo de número", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 30,
                    title: "¡JEFE: La Fuga de Datos!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "¡Los tipos de datos se están mezclando! Clasifica la información para estabilizar el sistema.",
                            code: "// DATOS CORRUPTOS"
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA 1: El nombre del jefe es un:",
                            codeTemplate: "[BLOQUE] nombre = \"Zorg\";",
                            blocks: ["texto", "numero", "booleano"],
                            answer: "texto"
                        },
                        {
                            type: "practica",
                            question: "RONDA 2: El punto de ataque (x, y) es un:",
                            answer: "Vector2"
                        },
                        {
                            type: "opcion-multiple",
                            question: "RONDA 3: 'jefe.estaVivo = verdadero'. ¿Qué tipo es 'estaVivo'?",
                            options: [
                                { text: "numero", correct: false },
                                { text: "booleano", correct: true },
                                { text: "Sprite", correct: false }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 4,
            name: "Componentes del Motor",
            color: "#FF5733",
            courses: [
                {
                    id: 31,
                    title: "Transform: posición",
                    steps: [
                        {
                            type: "teoria",
                            content: "El componente 'posicion' (o transform) controla dónde está el objeto, su rotación y su escala.",
                            code: "posicion.x = 200;\nrotacion = 90;"
                        },
                        {
                            type: "practica",
                            question: "Escribe el nombre del componente que controla el lugar del objeto:",
                            answer: "posicion"
                        }
                    ]
                },
                {
                    id: 32,
                    title: "Dibujo: renderizadorDeSprite",
                    steps: [
                        {
                            type: "teoria",
                            content: "Controla cómo se ve el objeto: su imagen (sprite), color y opacidad.",
                            code: "renderizadorDeSprite.color = \"#FF0000\";"
                        },
                        {
                            type: "completar-codigo",
                            question: "Cambia la imagen del objeto:",
                            codeTemplate: "[BLOQUE].sprite = nuevaImagen;",
                            blocks: ["renderizadorDeSprite", "posicion", "fisica"],
                            answer: "renderizadorDeSprite"
                        }
                    ]
                },
                {
                    id: 33,
                    title: "Físicas: fisica / rigidbody2D",
                    steps: [
                        {
                            type: "teoria",
                            content: "Otorga peso, gravedad y permite aplicar fuerzas al objeto.",
                            code: "fisica.gravityScale = 1.0;"
                        },
                        {
                            type: "practica",
                            question: "Escribe el nombre del componente de físicas:",
                            answer: "fisica"
                        }
                    ]
                },
                {
                    id: 34,
                    title: "Movimiento: animador",
                    steps: [
                        {
                            type: "teoria",
                            content: "Controla los clips de animación (caminar, saltar, atacar).",
                            code: "animador.play(\"Caminar\");"
                        },
                        {
                            type: "completar-codigo",
                            question: "Ejecuta la animación de 'Salto':",
                            codeTemplate: "animador.[BLOQUE](\"Salto\");",
                            blocks: ["play", "stop", "variable"],
                            answer: "play"
                        }
                    ]
                },
                {
                    id: 35,
                    title: "Sonido: fuenteDeAudio",
                    steps: [
                        {
                            type: "teoria",
                            content: "Permite que el objeto emita sonidos en el mundo del juego.",
                            code: "fuenteDeAudio.play(miSonido);"
                        },
                        {
                            type: "practica",
                            question: "Escribe el componente para reproducir audios:",
                            answer: "fuenteDeAudio"
                        }
                    ]
                },
                {
                    id: 36,
                    title: "Choques: colisionadorCaja2D",
                    steps: [
                        {
                            type: "teoria",
                            content: "Define la forma física (caja, círculo) para que el objeto pueda chocar con otros.",
                            code: "// Componente: colisionadorCaja2D"
                        },
                        {
                            type: "practica",
                            question: "Escribe el nombre del componente de colisión cuadrada:",
                            answer: "colisionadorCaja2D"
                        }
                    ]
                },
                {
                    id: 37,
                    title: "Interfaz: textoUI / imagenUI",
                    steps: [
                        {
                            type: "teoria",
                            content: "Elementos especiales que se dibujan sobre la pantalla (puntos, vida, inventario).",
                            code: "textoUI.text = \"Puntos: 0\";"
                        },
                        {
                            type: "completar-codigo",
                            question: "Cambia el texto de la interfaz:",
                            codeTemplate: "[BLOQUE].text = \"Hola\";",
                            blocks: ["textoUI", "posicion", "boton"],
                            answer: "textoUI"
                        }
                    ]
                },
                {
                    id: 38,
                    title: "Cámaras y Luces",
                    steps: [
                        {
                            type: "teoria",
                            content: "El componente 'camara' es el ojo del jugador. 'luzPuntual2D' ilumina una zona específica.",
                            code: "camara.estaActivado = verdadero;"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué componente usarías para que el jugador vea el mundo?",
                            options: [
                                { text: "camara", correct: true },
                                { text: "luzPuntual2D", correct: false },
                                { text: "boton", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 39,
                    title: "Efectos: particulas",
                    steps: [
                        {
                            type: "teoria",
                            content: "Crea efectos visuales como explosiones, humo o lluvia.",
                            code: "particulas.estaActivado = verdadero;"
                        },
                        {
                            type: "practica",
                            question: "Componente para crear chispas o fuego:",
                            answer: "particulas"
                        }
                    ]
                },
                {
                    id: 40,
                    title: "¡JEFE: El Guardián del Componente!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "¡El Guardián ha desactivado los componentes esenciales! Reinstáuralos para luchar.",
                            code: "// ALERTA: COMPONENTES PERDIDOS"
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA 1: Devuelve la masa al jugador:",
                            codeTemplate: "[BLOQUE].gravityScale = 1.0;",
                            blocks: ["fisica", "posicion", "animador"],
                            answer: "fisica"
                        },
                        {
                            type: "practica",
                            question: "RONDA 2: El jefe es invisible. Activa el componente de dibujo:",
                            answer: "renderizadorDeSprite.estaActivado = verdadero"
                        },
                        {
                            type: "ordenar-bloques",
                            question: "RONDA 3: ¡Ataque final con sonido!",
                            blocks: ["fuenteDeAudio.play(ataque);", "animador.play(\"Golpe\");"],
                            answer: ["fuenteDeAudio.play(ataque);", "animador.play(\"Golpe\");"]
                        }
                    ]
                }
            ]
        },
        {
            id: 5,
            name: "Eventos de Ciclo de Vida",
            color: "#C70039",
            courses: [
                {
                    id: 41,
                    title: "Nacimiento: alEmpezar()",
                    steps: [
                        {
                            type: "teoria",
                            content: "Este evento ocurre una sola vez cuando el objeto aparece en el juego. Ideal para configuración inicial.",
                            code: "alEmpezar() {\n  imprimir(\"¡He nacido!\");\n}"
                        },
                        {
                            type: "practica",
                            question: "Escribe el nombre del evento que ocurre al iniciar:",
                            answer: "alEmpezar"
                        }
                    ]
                },
                {
                    id: 42,
                    title: "Ritmo: alActualizar(delta)",
                    steps: [
                        {
                            type: "teoria",
                            content: "Ocurre en cada frame (60 veces por segundo). El parámetro 'delta' es el tiempo real transcurrido.",
                            code: "alActualizar(delta) {\n  posicion.x += 100 * delta;\n}"
                        },
                        {
                            type: "completar-codigo",
                            question: "Mueve el objeto en cada instante:",
                            codeTemplate: "[BLOQUE](delta) { ... }",
                            blocks: ["alActualizar", "alEmpezar", "alHacerClick"],
                            answer: "alActualizar"
                        }
                    ]
                },
                {
                    id: 43,
                    title: "Física: actualizarFijo(delta)",
                    steps: [
                        {
                            type: "teoria",
                            content: "Se usa para cálculos físicos estables. Ocurre a intervalos de tiempo constantes.",
                            code: "actualizarFijo(delta) {\n  fisica.applyForce(fuerza);\n}"
                        },
                        {
                            type: "practica",
                            question: "Escribe el evento para físicas constantes:",
                            answer: "actualizarFijo"
                        }
                    ]
                },
                {
                    id: 44,
                    title: "Interacción: alHacerClick()",
                    steps: [
                        {
                            type: "teoria",
                            content: "Se activa cuando el usuario clica con el ratón o toca el objeto en pantalla.",
                            code: "alHacerClick() {\n  destruir(materia);\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Cuándo se dispara 'alHacerClick'?",
                            options: [
                                { text: "Al chocar con una pared", correct: false },
                                { text: "Al tocar el objeto", correct: true },
                                { text: "Al empezar el nivel", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 45,
                    title: "Choque: alEntrarEnColision(otro)",
                    steps: [
                        {
                            type: "teoria",
                            content: "Ocurre al chocar físicamente con otro objeto. 'otro' contiene la información del objeto impactado.",
                            code: "alEntrarEnColision(otro) {\n  si (otro.tieneTag(\"Suelo\")) { ... }\n}"
                        },
                        {
                            type: "practica",
                            question: "Escribe el evento que detecta un choque sólido:",
                            answer: "alEntrarEnColision"
                        }
                    ]
                },
                {
                    id: 46,
                    title: "Sensores: alEntrarEnTrigger(otro)",
                    steps: [
                        {
                            type: "teoria",
                            content: "Se activa cuando algo entra en una zona de sensor invisible (Trigger).",
                            code: "alEntrarEnTrigger(otro) {\n  imprimir(\"¡Zona alcanzada!\");\n}"
                        },
                        {
                            type: "completar-codigo",
                            question: "Detecta cuando el jugador entra en la meta:",
                            codeTemplate: "[BLOQUE](otro) { ganar(); }",
                            blocks: ["alEntrarEnTrigger", "alEntrarEnColision", "alHacerClick"],
                            answer: "alEntrarEnTrigger"
                        }
                    ]
                },
                {
                    id: 47,
                    title: "Mensajería: alRecibir",
                    steps: [
                        {
                            type: "teoria",
                            content: "Este evento escucha una señal enviada por otro script usando 'difundir'.",
                            code: "alRecibir(\"ABRIR\", () => { abrirPuerta(); });"
                        },
                        {
                            type: "practica",
                            question: "Escribe el comando para escuchar un mensaje:",
                            answer: "alRecibir"
                        }
                    ]
                },
                {
                    id: 48,
                    title: "Rendimiento: alBajoRendimiento",
                    steps: [
                        {
                            type: "teoria",
                            content: "Evento especial que se activa si el juego va lento, permitiendo desactivar efectos costosos.",
                            code: "alBajoRendimiento(nivel) {\n  particulas.estaActivado = falso;\n}"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Para qué sirve 'alBajoRendimiento'?",
                            options: [
                                { text: "Para ganar más puntos", correct: false },
                                { text: "Para optimizar el juego si hay lag", correct: true },
                                { text: "Para cerrar el juego", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 49,
                    title: "Final de Contacto: alSalirDeColision",
                    steps: [
                        {
                            type: "teoria",
                            content: "Ocurre exactamente en el momento en que dos objetos dejan de tocarse.",
                            code: "alSalirDeColision(otro) {\n  enAire = verdadero;\n}"
                        },
                        {
                            type: "practica",
                            question: "Escribe el evento que detecta cuando dejas de tocar algo:",
                            answer: "alSalirDeColision"
                        }
                    ]
                },
                {
                    id: 50,
                    title: "¡JEFE: El Sincronizador de Almas!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "¡El Sincronizador ha desfasado los eventos del tiempo! Restaura el ciclo vital.",
                            code: "// ERROR DE SINCRONIZACIÓN"
                        },
                        {
                            type: "modo-debug",
                            question: "RONDA 1: El jefe no aparece porque el evento está mal escrito:",
                            codeLines: ["alNacer() {", "  estaActivado = verdadero;", "}"],
                            errorLine: 0,
                            explanation: "El evento correcto es 'alEmpezar'.",
                            solution: "alEmpezar() {"
                        },
                        {
                            type: "practica",
                            question: "RONDA 2: Ataca al jefe en cada instante (frame):",
                            answer: "alActualizar(delta)"
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA 3: El jefe detecta tu golpe mediante un choque sólido:",
                            codeTemplate: "[BLOQUE](arma) { jefe.recibirDano(); }",
                            blocks: ["alEntrarEnColision", "alEntrarEnTrigger", "alHacerClick"],
                            answer: "alEntrarEnColision"
                        }
                    ]
                }
            ]
        },
        {
            id: 6,
            name: "API del Motor",
            color: "#900C3F",
            courses: [
                {
                    id: 51,
                    title: "Consola: imprimir()",
                    steps: [
                        {
                            type: "teoria",
                            content: "Muestra información o mensajes en la consola de ayuda para depurar tu código.",
                            code: "imprimir(\"Sistema listo\");"
                        },
                        {
                            type: "practica",
                            question: "Escribe el comando para mandar un mensaje a la consola:",
                            answer: "imprimir"
                        }
                    ]
                },
                {
                    id: 52,
                    title: "Borrar: destruir()",
                    steps: [
                        {
                            type: "teoria",
                            content: "Elimina una Materia del juego permanentemente para liberar memoria.",
                            code: "destruir(materia);"
                        },
                        {
                            type: "completar-codigo",
                            question: "Elimina al enemigo al morir:",
                            codeTemplate: "[BLOQUE](enemigo);",
                            blocks: ["destruir", "crear", "buscar"],
                            answer: "destruir"
                        }
                    ]
                },
                {
                    id: 53,
                    title: "Generar: crear()",
                    steps: [
                        {
                            type: "teoria",
                            content: "Genera un nuevo objeto en el mundo a partir de un molde (Prefab).",
                            code: "crear(balaPrefab);"
                        },
                        {
                            type: "practica",
                            question: "Comando para instanciar un Prefab:",
                            answer: "crear"
                        }
                    ]
                },
                {
                    id: 54,
                    title: "Localizar: buscar()",
                    steps: [
                        {
                            type: "teoria",
                            content: "Encuentra un objeto en la escena por su nombre exacto.",
                            code: "buscar(\"Jugador\");"
                        },
                        {
                            type: "practica",
                            question: "Encuentra el objeto llamado 'Tesoro':",
                            answer: "buscar(\"Tesoro\")"
                        }
                    ]
                },
                {
                    id: 55,
                    title: "Listar: buscarTodosConTag()",
                    steps: [
                        {
                            type: "teoria",
                            content: "Devuelve una lista de todos los objetos que tengan una etiqueta específica.",
                            code: "buscarTodosConTag(\"Enemigo\");"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Qué devuelve 'buscarTodosConTag'?",
                            options: [
                                { text: "Un solo objeto", correct: false },
                                { text: "Una lista de objetos", correct: true },
                                { text: "Un número", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 56,
                    title: "Distancia: distancia()",
                    steps: [
                        {
                            type: "teoria",
                            content: "Calcula cuántos píxeles de separación hay entre dos puntos o materias.",
                            code: "variable d = distancia(posicion, meta.posicion);"
                        },
                        {
                            type: "practica",
                            question: "Comando para medir espacio entre objetos:",
                            answer: "distancia"
                        }
                    ]
                },
                {
                    id: 57,
                    title: "Señales: difundir()",
                    steps: [
                        {
                            type: "teoria",
                            content: "Envía un mensaje o señal a todos los objetos del juego simultáneamente.",
                            code: "difundir(\"VICTORIA\");"
                        },
                        {
                            type: "completar-codigo",
                            question: "Envía la señal 'EMPEZAR':",
                            codeTemplate: "[BLOQUE](\"EMPEZAR\");",
                            blocks: ["difundir", "imprimir", "buscar"],
                            answer: "difundir"
                        }
                    ]
                },
                {
                    id: 58,
                    title: "Pausas: esperar()",
                    steps: [
                        {
                            type: "teoria",
                            content: "Detiene la ejecución del script actual durante un número de segundos.",
                            code: "esperar(2); // Pausa de 2 segundos"
                        },
                        {
                            type: "practica",
                            question: "Escribe el comando para esperar 5 segundos:",
                            answer: "esperar(5);"
                        }
                    ]
                },
                {
                    id: 59,
                    title: "Ritmo: cada()",
                    steps: [
                        {
                            type: "teoria",
                            content: "Ejecuta un bloque de código repetidamente en intervalos de tiempo.",
                            code: "cada(1) { sumarSegundo(); }"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Diferencia entre esperar() y cada()?",
                            options: [
                                { text: "esperar() repite, cada() pausa", correct: false },
                                { text: "esperar() pausa una vez, cada() repite siempre", correct: true },
                                { text: "Son iguales", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 60,
                    title: "¡JEFE: El Maestro de la API!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "¡El Maestro de la API exige un uso perfecto de los comandos! Demuestra tu dominio.",
                            code: "// API CHALLENGE"
                        },
                        {
                            type: "practica",
                            question: "RONDA 1: Encuentra al jefe llamado 'Zorg' en la escena:",
                            answer: "buscar(\"Zorg\")"
                        },
                        {
                            type: "completar-codigo",
                            question: "RONDA 2: Crea un aliado de refuerzo:",
                            codeTemplate: "[BLOQUE](aliadoPrefab);",
                            blocks: ["crear", "destruir", "imprimir"],
                            answer: "crear"
                        },
                        {
                            type: "ordenar-bloques",
                            question: "RONDA 3: ¡Finaliza con una pausa y destrucción!",
                            blocks: ["esperar(1);", "destruir(jefe);"],
                            answer: ["esperar(1);", "destruir(jefe);"]
                        }
                    ]
                }
            ]
        },
        {
            id: 7,
            name: "Nivel 1: Los Fundamentos",
            color: "#581845",
            courses: [
                {
                    id: 61,
                    title: "¡Hola Mundo!",
                    steps: [
                        {
                            type: "teoria",
                            content: "En este nivel aplicaremos todo lo aprendido en scripts reales. Empecemos con un saludo formal.",
                            code: "ve motor;\nalEmpezar() {\n  imprimir(\"¡Hola Mundo! El sistema está listo.\");\n}"
                        },
                        {
                            type: "practica",
                            question: "Escribe el script completo para imprimir 'Iniciando':",
                            answer: "ve motor; alEmpezar() { imprimir('Iniciando'); }"
                        },
                        {
                            type: "opcion-multiple",
                            question: "¿Por qué es importante 've motor;'?",
                            options: [
                                { text: "Para que el juego se vea mejor", correct: false },
                                { text: "Para activar el script dentro del motor", correct: true },
                                { text: "Para borrar el código", correct: false }
                            ]
                        }
                    ]
                },
                {
                    id: 62,
                    title: "El Inspector en Acción",
                    steps: [
                        {
                            type: "teoria",
                            content: "Usar variables públicas nos permite personalizar el comportamiento desde el editor.",
                            code: "publico texto miNombre = \"Héroe\";\nalEmpezar() {\n  imprimir(\"Bienvenido, \" + miNombre);\n}"
                        },
                        {
                            type: "practica",
                            question: "Crea una variable pública de texto llamada 'clase' y saluda con ella:",
                            answer: "publico texto clase; alEmpezar() { imprimir('Tu clase es: ' + clase); }"
                        }
                    ]
                },
                {
                    id: 63,
                    title: "Contador de Vida",
                    steps: [
                        {
                            type: "teoria",
                            content: "La salud es vital. Aprende a manipular variables numéricas.",
                            code: "publico numero vida = 100;\nquitarVida() {\n  vida = vida - 10;\n}"
                        },
                        {
                            type: "practica",
                            question: "Define la vida en 100 y crea una función 'sanar' que sume 20:",
                            answer: "publico numero vida = 100; sanar() { vida = vida + 20; }"
                        }
                    ]
                },
                {
                    id: 64,
                    title: "Interruptor de Luz",
                    steps: [
                        {
                            type: "teoria",
                            content: "Los booleanos permiten crear mecánicas de encendido y apagado.",
                            code: "publico booleano luz = verdadero;\nalHacerClick() {\n  luz = !luz;\n}"
                        },
                        {
                            type: "practica",
                            question: "Invierte el valor de 'encendido' al hacer clic:",
                            answer: "alHacerClick() { encendido = !encendido; }"
                        }
                    ]
                },
                {
                    id: 65,
                    title: "Movimiento X",
                    steps: [
                        {
                            type: "teoria",
                            content: "El movimiento es el alma del juego. Usa 'alActualizar' para mover objetos.",
                            code: "alActualizar(delta) {\n  posicion.x = posicion.x + 2;\n}"
                        },
                        {
                            type: "practica",
                            question: "Mueve 5 unidades en X en cada frame usando delta:",
                            answer: "alActualizar(delta) { posicion.x = posicion.x + 5 * delta; }"
                        }
                    ]
                },
                {
                    id: 66,
                    title: "Seguir al Mouse",
                    steps: [
                        {
                            type: "teoria",
                            content: "Interacción directa: haz que el objeto siga al puntero.",
                            code: "alActualizar(delta) {\n  variable raton = obtenerPosicionMouse();\n  posicion.x = raton.x;\n  posicion.y = raton.y;\n}"
                        },
                        {
                            type: "practica",
                            question: "Escribe el comando para obtener la posición del mouse:",
                            answer: "obtenerPosicionMouse()"
                        }
                    ]
                },
                {
                    id: 67,
                    title: "Color al Azar",
                    steps: [
                        {
                            type: "teoria",
                            content: "La aleatoriedad da vida a los efectos visuales.",
                            code: "renderizadorDeSprite.color = nuevo Color(azar(0,255), azar(0,255), azar(0,255));"
                        },
                        {
                            type: "practica",
                            question: "Pon un color al azar al hacer clic:",
                            answer: "alHacerClick() { renderizadorDeSprite.color = nuevo Color(azar(0,255), azar(0,255), azar(0,255)); }"
                        }
                    ]
                },
                {
                    id: 68,
                    title: "El Reloj de Espera",
                    steps: [
                        {
                            type: "teoria",
                            content: "Controla el tiempo con corrutinas (esperar).",
                            code: "alEmpezar() {\n  imprimir(\"Cargando...\");\n  esperar(3);\n  imprimir(\"Listo\");\n}"
                        },
                        {
                            type: "practica",
                            question: "Espera 2 segundos y luego destruye la materia:",
                            answer: "esperar(2); destruir(materia);"
                        }
                    ]
                },
                {
                    id: 69,
                    title: "Bucle Repetitivo",
                    steps: [
                        {
                            type: "teoria",
                            content: "Ejecuta acciones periódicas sin saturar el sistema.",
                            code: "alEmpezar() {\n  cada(1) {\n    imprimir(\"Tic\");\n  }\n}"
                        },
                        {
                            type: "practica",
                            question: "Crea un bucle que imprima 'BUM' cada 0.5 segundos:",
                            answer: "cada(0.5) { imprimir('BUM'); }"
                        }
                    ]
                },
                {
                    id: 70,
                    title: "¡JEFE: Los 25 Fundamentos!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "¡RONDA FINAL DEL NIVEL 1! El jefe es un error crítico del sistema. ¡Depúralo!",
                            code: "// FINAL LEVEL 1 BOSS"
                        },
                        {
                            type: "practica",
                            question: "RONDA 1: Conecta al motor e imprime 'START':",
                            answer: "ve motor; alEmpezar() { imprimir('START'); }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 2: El jefe te ataca cada 1.5 segundos. ¡Esquiva!",
                            answer: "cada(1.5) { esquivar(); }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 3: Autodestruye al jefe al clicarlo:",
                            answer: "alHacerClick() { destruir(materia); }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 4: Crea una variable pública 'poder' y úsala para atacar:",
                            answer: "publico numero poder; alActualizar(delta) { atacar(poder); }"
                        },
                        {
                            type: "practica",
                            question: "RONDA FINAL: Espera 1 segundo y carga la escena 'Victoria':",
                            answer: "esperar(1); cargarEscena('Victoria');"
                        }
                    ]
                }
            ]
        },
        {
            id: 8,
            name: "Nivel 2: Mecánicas Intermedias",
            color: "#1A5276",
            courses: [
                {
                    id: 71,
                    title: "Control 4 Direcciones",
                    steps: [
                        {
                            type: "teoria",
                            content: "Movimiento completo usando las teclas WASD para juegos Top-Down.",
                            code: "si (teclaPresionada(\"w\")) posicion.y -= vel * delta;"
                        },
                        {
                            type: "practica",
                            question: "Escribe el código para mover a la derecha con 'd':",
                            answer: "si (teclaPresionada('d')) { posicion.x += velocidad * delta; }"
                        },
                        {
                            type: "modo-debug",
                            question: "¡El personaje no se mueve a la izquierda! Corrígelo:",
                            codeLines: ["si (teclaPresionada('a')) {", "  posicion.x += 100 * delta;", "}"],
                            errorLine: 1,
                            explanation: "Para ir a la izquierda debes restar en X, no sumar.",
                            solution: "posicion.x -= 100 * delta;"
                        }
                    ]
                },
                {
                    id: 72,
                    title: "Lanzar Proyectiles",
                    steps: [
                        {
                            type: "teoria",
                            content: "Crea objetos en tiempo real (instanciación) para disparar.",
                            code: "variable b = crear(bala);\nb.posicion = posicion;"
                        },
                        {
                            type: "practica",
                            question: "Crea un 'proyectil' al presionar 'f':",
                            answer: "si (teclaRecienPresionada('f')) { crear(proyectil); }"
                        }
                    ]
                },
                {
                    id: 73,
                    title: "Rebote Físico",
                    steps: [
                        {
                            type: "teoria",
                            content: "Accede a la velocidad física para crear efectos de rebote.",
                            code: "alEntrarEnColision(otro) {\n  fisica.velocity.y = -10;\n}"
                        },
                        {
                            type: "practica",
                            question: "Al chocar, pon la velocidad X en 15:",
                            answer: "alEntrarEnColision(otro) { fisica.velocity.x = 15; }"
                        }
                    ]
                },
                {
                    id: 74,
                    title: "Seguir al Jugador",
                    steps: [
                        {
                            type: "teoria",
                            content: "Usa 'lerp' (interpolación lineal) para un movimiento suave de IA.",
                            code: "posicion.x = lerp(posicion.x, jugador.x, 0.05);"
                        },
                        {
                            type: "practica",
                            question: "Busca al 'Heroe' y síguelo en X suavemente (0.1):",
                            answer: "heroe = buscar('Heroe'); posicion.x = lerp(posicion.x, heroe.x, 0.1);"
                        }
                    ]
                },
                {
                    id: 75,
                    title: "Recolectar Objetos",
                    steps: [
                        {
                            type: "teoria",
                            content: "Usa Tags para identificar qué objeto has tocado.",
                            code: "si (otro.tieneTag(\"Moneda\")) destruir(otro);"
                        },
                        {
                            type: "practica",
                            question: "Si chocas con 'Veneno', resta 50 de vida:",
                            answer: "si (otro.tieneTag('Veneno')) { vida = vida - 50; }"
                        }
                    ]
                },
                {
                    id: 76,
                    title: "Reproducir Audio",
                    steps: [
                        {
                            type: "teoria",
                            content: "Dale voz a tu juego con el componente de audio.",
                            code: "fuenteDeAudio.play(sonido);"
                        },
                        {
                            type: "practica",
                            question: "Al chocar con 'Muro', suena 'golpe':",
                            answer: "alEntrarEnColision(otro) { si (otro.tieneTag('Muro')) { fuenteDeAudio.play(golpe); } }"
                        }
                    ]
                },
                {
                    id: 77,
                    title: "Control de Animación",
                    steps: [
                        {
                            type: "teoria",
                            content: "Cambia el estado visual del personaje según sus acciones.",
                            code: "animador.play(\"Caminar\");"
                        },
                        {
                            type: "practica",
                            question: "Si saltas, pon la animación 'Salto':",
                            answer: "si (saltando) { animador.play('Salto'); }"
                        }
                    ]
                },
                {
                    id: 78,
                    title: "Zonas Seguras (Trigger)",
                    steps: [
                        {
                            type: "teoria",
                            content: "Detección sin choque físico para áreas de evento (monedas, metas).",
                            code: "alEntrarEnTrigger(otro) { ... }"
                        },
                        {
                            type: "practica",
                            question: "Si entras en el trigger 'Meta', imprime 'GANASTE':",
                            answer: "alEntrarEnTrigger(otro) { si (otro.tieneTag('Meta')) { imprimir('GANASTE'); } }"
                        }
                    ]
                },
                {
                    id: 79,
                    title: "Barra de Vida (UI)",
                    steps: [
                        {
                            type: "teoria",
                            content: "Actualizar la interfaz de usuario para informar al jugador.",
                            code: "textoUI.text = \"HP: \" + vida;"
                        },
                        {
                            type: "practica",
                            question: "Actualiza el textoUI con los 'puntos':",
                            answer: "textoUI.text = 'Puntos: ' + puntos;"
                        }
                    ]
                },
                {
                    id: 80,
                    title: "¡JEFE: Mecánicas Intermedias!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "¡El jefe ha evolucionado! Ahora requiere lógica combinada para ser derrotado.",
                            code: "// BOSS FIGHT LVL 2: THE REVENGE"
                        },
                        {
                            type: "practica",
                            question: "RONDA 1: Salta al presionar 'Espacio' con un impulso de 15:",
                            answer: "si (teclaRecienPresionada('Space')) { fisica.applyImpulse(nuevo Vector2(0, -15)); }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 2: Suena 'alarma' si el jefe entra en tu sensor 'Deteccion':",
                            answer: "alEntrarEnTrigger(otro) { si (otro.tieneTag('Deteccion')) { fuenteDeAudio.play(alarma); } }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 3: El jefe es vulnerable si 'luzActiva' es falso. ¡Ataca!",
                            answer: "si (no luzActiva) { atacar(); }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 4: Actualiza la vida del jefe en la UI ('JefeHP'):",
                            answer: "textoUI.text = 'HP: ' + jefeVida;"
                        },
                        {
                            type: "practica",
                            question: "RONDA FINAL: Si el jefe muere, carga escena 'Creditos':",
                            answer: "si (jefeVida <= 0) { cargarEscena('Creditos'); }"
                        }
                    ]
                }
            ]
        },
        {
            id: 9,
            name: "Nivel 3: Sistemas Avanzados",
            color: "#1D8348",
            courses: [
                {
                    id: 81,
                    title: "IA con Raycast",
                    steps: [
                        {
                            type: "teoria",
                            content: "Dota a tus enemigos de visión real usando rayos invisibles.",
                            code: "variable hit = lanzarRayo(posicion, dir, 500);"
                        },
                        {
                            type: "practica",
                            question: "Lanza un rayo a la derecha de 200px y ataca si choca con algo:",
                            answer: "variable h = lanzarRayo(posicion, Vector2.derecha, 200); si (h != nulo) { atacar(); }"
                        }
                    ]
                },
                {
                    id: 82,
                    title: "Ciclo Día/Noche",
                    steps: [
                        {
                            type: "teoria",
                            content: "Usa la luz ambiental para cambiar la atmósfera dinámicamente.",
                            code: "establecerLuzAmbiental(\"#111133\");"
                        },
                        {
                            type: "practica",
                            question: "Pon la luz ambiental en negro (#000000) al empezar:",
                            answer: "alEmpezar() { establecerLuzAmbiental('#000000'); }"
                        }
                    ]
                },
                {
                    id: 83,
                    title: "Inventario con Datos",
                    steps: [
                        {
                            type: "teoria",
                            content: "Gestiona listas de objetos complejos (JSON) para inventarios pro.",
                            code: "mochila.empujar({ nombre: \"Espada\", daño: 10 });"
                        },
                        {
                            type: "practica",
                            question: "Añade un objeto con 'id: 1' a la lista 'inventario':",
                            answer: "inventario.empujar({ id: 1 });"
                        }
                    ]
                },
                {
                    id: 84,
                    title: "Máquina de Estados",
                    steps: [
                        {
                            type: "teoria",
                            content: "Organiza la lógica de IA compleja dividiéndola en estados.",
                            code: "si (estado == \"ATAQUE\") { perseguir(); }"
                        },
                        {
                            type: "practica",
                            question: "Si el estado es 'QUIETO', pon la animación 'Idle':",
                            answer: "si (estado == 'QUIETO') { animador.play('Idle'); }"
                        }
                    ]
                },
                {
                    id: 85,
                    title: "Partículas por Código",
                    steps: [
                        {
                            type: "teoria",
                            content: "Genera explosiones dinámicas instanciando múltiples partículas.",
                            code: "para(i=0; i<10; i++) { crear(chispa); }"
                        },
                        {
                            type: "practica",
                            question: "Crea un bucle que genere 20 'fuego':",
                            answer: "para (variable i = 0; i < 20; i = i + 1) { crear(fuego); }"
                        }
                    ]
                },
                {
                    id: 86,
                    title: "Cámara Suave",
                    steps: [
                        {
                            type: "teoria",
                            content: "El suavizado lerp es el secreto de una cámara profesional.",
                            code: "posicion.x = lerp(posicion.x, obj.x, 0.1);"
                        },
                        {
                            type: "practica",
                            question: "Sigue al 'objetivo' en Y con suavidad de 0.05:",
                            answer: "posicion.y = lerp(posicion.y, objetivo.y, 0.05);"
                        }
                    ]
                },
                {
                    id: 87,
                    title: "Daño Progresivo",
                    steps: [
                        {
                            type: "teoria",
                            content: "Mecánicas de veneno o lava que quitan vida rítmicamente.",
                            code: "cada(1) { vida -= 5; }"
                        },
                        {
                            type: "practica",
                            question: "Cada 2 segundos, suma 10 de vida si 'vida < 100':",
                            answer: "cada(2) { si (vida < 100) { vida = vida + 10; } }"
                        }
                    ]
                },
                {
                    id: 88,
                    title: "Combos de Ataque",
                    steps: [
                        {
                            type: "teoria",
                            content: "Usa el tiempo de juego para detectar ataques rápidos seguidos.",
                            code: "si (ahora - ultimo < 0.5) combo++;"
                        },
                        {
                            type: "practica",
                            question: "Si el tiempo actual menos 'ultimoGolpe' es menor a 0.3, suma combo:",
                            answer: "si (tiempoJuego - ultimoGolpe < 0.3) { combo = combo + 1; }"
                        }
                    ]
                },
                {
                    id: 89,
                    title: "Diálogos con Páginas",
                    steps: [
                        {
                            type: "teoria",
                            content: "Sistemas de NPC que hablan por partes usando listas.",
                            code: "textoUI.text = lineas[indice];"
                        },
                        {
                            type: "practica",
                            question: "Muestra el texto de la lista 'mensajes' en el índice 'p':",
                            answer: "textoUI.text = mensajes[p];"
                        }
                    ]
                },
                {
                    id: 90,
                    title: "¡JEFE: Sistemas Avanzados!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "¡EL MAESTRO DE LOS SISTEMAS! Esta batalla pondrá a prueba tu lógica más profunda.",
                            code: "// MASTER BOSS: SYSTEM OVERLOAD"
                        },
                        {
                            type: "practica",
                            question: "RONDA 1: Detecta al jugador con rayo (500px) y cambia a estado 'CAZA':",
                            answer: "v = lanzarRayo(posicion, dir, 500); si (v != nulo) { estado = 'CAZA'; }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 2: Si el estado es 'CAZA', sigue al jugador con lerp (0.2):",
                            answer: "si (estado == 'CAZA') { posicion.x = lerp(posicion.x, jugador.x, 0.2); }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 3: El jefe lanza 10 partículas de 'magia' al ser herido:",
                            answer: "para (i=0; i<10; i=i+1) { crear(magia); }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 4: Pon el mundo en rojo (#FF0000) si el jefe tiene < 10 de vida:",
                            answer: "si (vida < 10) { establecerLuzAmbiental('#FF0000'); }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 5: Si el jefe muere, espera 3 segundos y difunde 'GANASTE':",
                            answer: "si (vida <= 0) { esperar(3); difundir('GANASTE'); }"
                        },
                        {
                            type: "practica",
                            question: "RONDA FINAL: Destruye al jefe y limpia la consola:",
                            answer: "destruir(materia); imprimir('Sistema Limpio');"
                        }
                    ]
                }
            ]
        },
        {
            id: 10,
            name: "Nivel 4: Sistemas Expertos",
            color: "#F1C40F",
            courses: [
                {
                    id: 91,
                    title: "Retroceso (Recoil)",
                    steps: [
                        {
                            type: "teoria",
                            content: "Agrega realismo aplicando impulsos contrarios al disparar.",
                            code: "fisica.applyImpulse(nuevo Vector2(-5, 0));"
                        },
                        {
                            type: "practica",
                            question: "Al disparar ('f'), aplica un impulso de -10 en X:",
                            answer: "si (teclaRecienPresionada('f')) { fisica.applyImpulse(nuevo Vector2(-10, 0)); }"
                        }
                    ]
                },
                {
                    id: 92,
                    title: "Regeneración de Vida",
                    steps: [
                        {
                            type: "teoria",
                            content: "Lógica de sanación automática para juegos de aventura.",
                            code: "cada(2) { si (vida < 100) vida += 2; }"
                        },
                        {
                            type: "practica",
                            question: "Suma 5 de vida cada 1 segundo si no has muerto (vida > 0):",
                            answer: "cada(1) { si (vida > 0) { vida = vida + 5; } }"
                        }
                    ]
                },
                {
                    id: 93,
                    title: "IA Evasiva",
                    steps: [
                        {
                            type: "teoria",
                            content: "Haz que los enemigos teman al jugador y mantengan su distancia.",
                            code: "si (distancia < 200) huir();"
                        },
                        {
                            type: "practica",
                            question: "Si la distancia con 'jugador' es menor a 300, corre a la izquierda:",
                            answer: "si (distancia(posicion, jugador.posicion) < 300) { posicion.x -= 200 * delta; }"
                        }
                    ]
                },
                {
                    id: 94,
                    title: "Sistema de Niveles (XP)",
                    steps: [
                        {
                            type: "teoria",
                            content: "Mecánicas de RPG: gana experiencia y sube de nivel.",
                            code: "si (xp >= 100) { nivel++; xp = 0; }"
                        },
                        {
                            type: "practica",
                            question: "Si XP llega a 500, nivel = 2 y suena 'subirNivel':",
                            answer: "si (xp >= 500) { nivel = 2; fuenteDeAudio.play(subirNivel); }"
                        }
                    ]
                },
                {
                    id: 95,
                    title: "Puntos de Control",
                    steps: [
                        {
                            type: "teoria",
                            content: "Guarda estados para que el jugador no pierda todo su progreso.",
                            code: "posicionRespawn = otro.posicion;"
                        },
                        {
                            type: "practica",
                            question: "Al entrar en trigger 'Check', guarda la posición en 'spawn':",
                            answer: "alEntrarEnTrigger(otro) { si (otro.tieneTag('Check')) { spawn = otro.posicion; } }"
                        }
                    ]
                },
                {
                    id: 96,
                    title: "Plataformas que Caen",
                    steps: [
                        {
                            type: "teoria",
                            content: "Crea retos de parkour desactivando plataformas tras ser pisadas.",
                            code: "esperar(1); estaActivado = falso;"
                        },
                        {
                            type: "practica",
                            question: "Al chocar con 'Trampa', espera 0.5s y desactívate:",
                            answer: "alEntrarEnColision(otro) { si (otro.tieneTag('Trampa')) { esperar(0.5); estaActivado = falso; } }"
                        }
                    ]
                },
                {
                    id: 97,
                    title: "Cambio de Personaje",
                    steps: [
                        {
                            type: "teoria",
                            content: "Sistemas de equipo donde controlas a varios héroes.",
                            code: "héroe1.estaActivado = !héroe1.estaActivado;"
                        },
                        {
                            type: "practica",
                            question: "Al pulsar 'tab', alterna activación entre 'p1' y 'p2':",
                            answer: "si (teclaRecienPresionada('Tab')) { p1.estaActivado = !p1.estaActivado; p2.estaActivado = !p2.estaActivado; }"
                        }
                    ]
                },
                {
                    id: 98,
                    title: "Sistemas de Agua",
                    steps: [
                        {
                            type: "teoria",
                            content: "Física de fluidos reduciendo la gravedad y aplicando empuje.",
                            code: "otro.fisica.gravityScale = 0.2;"
                        },
                        {
                            type: "practica",
                            question: "Si entras en trigger 'Agua', pon gravedad en 0.3:",
                            answer: "alEntrarEnTrigger(otro) { si (otro.tieneTag('Agua')) { fisica.gravityScale = 0.3; } }"
                        }
                    ]
                },
                {
                    id: 99,
                    title: "Optimización Pro",
                    steps: [
                        {
                            type: "teoria",
                            content: "Mantén tu juego a 60 FPS desactivando lo innecesario.",
                            code: "alBajoRendimiento(nivel) { particulas.estaActivado = falso; }"
                        },
                        {
                            type: "practica",
                            question: "Si el rendimiento es bajo (nivel 2), desactiva las 'luces':",
                            answer: "alBajoRendimiento(nivel) { si (nivel == 2) { luces.estaActivado = falso; } }"
                        }
                    ]
                },
                {
                    id: 100,
                    title: "¡JEFE FINAL: El Maestro del Libro!",
                    isBoss: true,
                    steps: [
                        {
                            type: "teoria",
                            content: "¡HAS LLEGADO AL FINAL DEL LIBRO! Solo el verdadero Maestro de CES puede superar esta prueba final.",
                            code: "// THE ULTIMATE CHALLENGE: THE AUTHOR"
                        },
                        {
                            type: "practica",
                            question: "RONDA 1: Conecta al motor, saluda y prepara tu escudo (booleano):",
                            answer: "ve motor; alEmpezar() { imprimir('LISTO'); escudo = verdadero; }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 2: El jefe dispara 'rayos' cada 0.8 segundos. ¡Refleja!",
                            answer: "cada(0.8) { reflejar(); }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 3: Si la distancia es < 100, aplica un impulso de escape de 20:",
                            answer: "si (distancia(posicion, jefe.posicion) < 100) { fisica.applyImpulse(nuevo Vector2(-20, 0)); }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 4: Cuando el jefe baje de 50 vida, suena 'fase2' y pon luz roja:",
                            answer: "si (vida < 50) { fuenteDeAudio.play(fase2); establecerLuzAmbiental('#FF0000'); }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 5: Ataca al jefe en cada frame si 'teclaPresionada' es 'z':",
                            answer: "alActualizar(delta) { si (teclaPresionada('z')) { atacar(); } }"
                        },
                        {
                            type: "practica",
                            question: "RONDA 6: Genera una explosión de 50 partículas al ganar:",
                            answer: "para (i=0; i<50; i=i+1) { crear(particula); }"
                        },
                        {
                            type: "practica",
                            question: "RONDA FINAL: Difunde 'LIBRO_COMPLETADO', espera 5s y carga escena 'Graduacion':",
                            answer: "difundir('LIBRO_COMPLETADO'); esperar(5); cargarEscena('Graduacion');"
                        }
                    ]
                }
            ]
        },
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

// Procedural generation for the remaining empty stages (if any)
for (let i = 0; i < window.courseData.stages.length; i++) {
    const stage = window.courseData.stages[i];
    if (stage.courses.length === 0) {
        for (let j = 1; j <= 10; j++) {
            const courseId = (stage.id * 10) + j;
            stage.courses.push({
                id: courseId,
                title: `Módulo ${courseId}: Avanzando en ${stage.name}`,
                isBoss: j === 10,
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
