/* ==============================
   Course Data - The Scripting Path (CES)
   Full Implementation: 100 Master Codes + 6 Foundation Stages
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
                        { type: "teoria", content: "Todo script en Creative Engine debe comenzar con 've motor;'. Esta línea es obligatoria para que el motor reconozca y ejecute tu código.", code: "ve motor;" },
                        { type: "practica", question: "Escribe la línea obligatoria para activar el script:", answer: "ve motor;" }
                    ]
                },
                {
                    id: 2,
                    title: "Visibilidad: publico",
                    steps: [
                        { type: "teoria", content: "La palabra clave 'publico' permite que una variable sea visible y editable desde el Inspector del editor.", code: "publico numero velocidad = 10;" },
                        { type: "completar-codigo", question: "Haz que la variable 'salto' sea visible en el Inspector:", codeTemplate: "[BLOQUE] numero salto = 5;", blocks: ["publico", "variable", "dato"], answer: "publico" }
                    ]
                },
                {
                    id: 3,
                    title: "Datos Internos: variable",
                    steps: [
                        { type: "teoria", content: "Usamos 'variable' para definir datos que solo el script actual puede usar.", code: "variable secreto = 123;" },
                        { type: "practica", question: "Declara una variable interna llamada 'energia' con valor 100:", answer: "variable energia = 100;" }
                    ]
                },
                {
                    id: 4,
                    title: "Decisiones: si (condición)",
                    steps: [
                        { type: "teoria", content: "El bloque 'si' ejecuta el código entre llaves solo si la condición es verdadera.", code: "si (vida <= 0) {\n  imprimir(\"Game Over\");\n}" },
                        { type: "completar-codigo", question: "Si tenemos la llave, abrimos la puerta:", codeTemplate: "[BLOQUE] (tieneLlave) { abrir(); }", blocks: ["si", "mientras", "para"], answer: "si" }
                    ]
                },
                {
                    id: 5,
                    title: "Alternativas: sino",
                    steps: [
                        { type: "teoria", content: "Se usa 'sino' después de un 'si' para ejecutar código cuando la condición inicial no se cumple.", code: "si (puntos > 10) {\n  ganar();\n} sino {\n  intentar();\n}" },
                        { type: "practica", question: "Escribe la palabra clave para la alternativa de un 'si':", answer: "sino" }
                    ]
                },
                {
                    id: 6,
                    title: "Bucles: mientras",
                    steps: [
                        { type: "teoria", content: "Repite un bloque de código 'mientras' una condición sea verdadera.", code: "mientras (cargando) {\n  esperar(1);\n}" },
                        { type: "opcion-multiple", question: "¿Qué hace el comando 'mientras'?", options: [{ text: "Ejecuta una vez", correct: false }, { text: "Repite mientras sea verdad", correct: true }, { text: "Detiene el juego", correct: false }] }
                    ]
                },
                {
                    id: 7,
                    title: "Contadores: para",
                    steps: [
                        { type: "teoria", content: "El bucle 'para' sirve para repetir algo un número exacto de veces usando un contador.", code: "para (variable i = 0; i < 5; i = i + 1) {\n  imprimir(i);\n}" },
                        { type: "completar-codigo", question: "Inicia un bucle para contar:", codeTemplate: "[BLOQUE] (variable i=0; i<10; i++)", blocks: ["para", "cada", "si"], answer: "para" }
                    ]
                },
                {
                    id: 8,
                    title: "Salida: retornar",
                    steps: [
                        { type: "teoria", content: "Usa 'retornar' para salir de una función inmediatamente y, opcionalmente, devolver un valor.", code: "si (error) retornar;" },
                        { type: "practica", question: "Escribe el comando para salir de una función:", answer: "retornar" }
                    ]
                },
                {
                    id: 9,
                    title: "Lógica: y / o / no",
                    steps: [
                        { type: "teoria", content: "Operadores para combinar condiciones: 'y', 'o', 'no'.", code: "si (tieneLlave y estaCerca) { ... }" },
                        { type: "practica", question: "Escribe el operador para que DOS condiciones deban ser verdad:", answer: "y" }
                    ]
                },
                {
                    id: 10,
                    title: "¡JEFE: El Bug de Control!",
                    isBoss: true,
                    steps: [
                        { type: "teoria", content: "¡El Bug de Control ha bloqueado el flujo del programa! Usa los fundamentos para restaurarlo.", code: "// DEPURACIÓN REQUERIDA" },
                        { type: "practica", question: "RONDA 1: Conecta el script al motor.", answer: "ve motor;" },
                        { type: "completar-codigo", question: "RONDA 2: El jefe solo es vulnerable si tienes energía Y estás cerca:", codeTemplate: "si (tengoEnergia [BLOQUE] cercaDelJefe)", blocks: ["y", "o", "no"], answer: "y" },
                        { type: "ordenar-bloques", question: "RONDA 3: ¡Finaliza el bucle de ataque!", blocks: ["para (i=0; i<3; i++) {", "atacar();", "}"], answer: ["para (i=0; i<3; i++) {", "atacar();", "}"] }
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
                        { type: "teoria", content: "Para que el editor muestre un campo de números con deslizador, usa 'publico numero'.", code: "publico numero fuerza = 50;" },
                        { type: "practica", question: "Crea una variable pública numérica llamada 'salto':", answer: "publico numero salto;" }
                    ]
                },
                { id: 12, title: "Cajas de Texto", steps: [{ type: "teoria", content: "Usa 'publico texto' para crear una caja donde escribir nombres o diálogos en el editor.", code: "publico texto nombreJugador = \"Carl\";" }, { type: "completar-codigo", question: "Define un campo de texto para diálogos:", codeTemplate: "publico [BLOQUE] saludo = \"Hola\";", blocks: ["texto", "numero", "booleano"], answer: "texto" }] },
                { id: 13, title: "Interruptores: booleano", steps: [{ type: "teoria", content: "Un 'publico booleano' crea un Checkbox (interruptor) de sí/no en el Inspector.", code: "publico booleano esInmortal = falso;" }, { type: "practica", question: "Crea un interruptor público llamado 'estaActivo':", answer: "publico booleano estaActivo;" }] },
                { id: 14, title: "Referencias a Materia", steps: [{ type: "teoria", content: "Puedes arrastrar otros objetos de la escena al Inspector usando 'publico Materia'.", code: "publico Materia objetivo;" }, { type: "opcion-multiple", question: "¿Para qué sirve 'publico Materia'?", options: [{ text: "Para crear un nuevo objeto", correct: false }, { text: "Para referenciar un objeto de la escena", correct: true }, { text: "Para borrar un objeto", correct: false }] }] },
                { id: 15, title: "Moldes: publico Prefab", steps: [{ type: "teoria", content: "Usa 'publico Prefab' para asignar una plantilla (.ceprefab) desde tus archivos al script.", code: "publico Prefab enemigoPrefab;" }, { type: "practica", question: "Declara un campo público para un molde llamado 'bala':", answer: "publico Prefab bala;" }] },
                { id: 16, title: "Imágenes: publico Sprite", steps: [{ type: "teoria", content: "Para cambiar imágenes desde el editor, usa 'publico Sprite'.", code: "publico Sprite skinNueva;" }, { type: "completar-codigo", question: "Variable para arrastrar una imagen:", codeTemplate: "publico [BLOQUE] dibujo;", blocks: ["Sprite", "Color", "Audio"], answer: "Sprite" }] },
                { id: 17, title: "Sonidos: publico Audio", steps: [{ type: "teoria", content: "Usa 'publico Audio' para asignar archivos de sonido (.mp3, .wav) al objeto.", code: "publico Audio sonidoExplosion;" }, { type: "practica", question: "Escribe la línea para un campo de audio llamado 'musica':", answer: "publico Audio musica;" }] },
                { id: 18, title: "Selector de Color", steps: [{ type: "teoria", content: "Usa 'publico Color' para abrir un selector visual en el Inspector.", code: "publico Color tinte = \"#FF0000\";" }, { type: "opcion-multiple", question: "¿Qué aparece en el editor con 'publico Color'?", options: [{ text: "Una caja de texto", correct: false }, { text: "Un selector visual de colores", correct: true }, { text: "Una lista de números", correct: false }] }] },
                { id: 19, title: "Resumen de Visibilidad", steps: [{ type: "teoria", content: "Recuerda: 'publico' sale en el Inspector, 'variable' se queda oculto en el código.", code: "publico numero visible = 1;\nvariable oculto = 2;" }, { type: "modo-debug", question: "¡Error! Queremos ver 'fuerza' en el editor, pero está oculta. Corrígelo:", codeLines: ["variable fuerza = 10;"], errorLine: 0, explanation: "Debes usar 'publico' para que aparezca en el Inspector.", solution: "publico numero fuerza = 10;" }] },
                {
                    id: 20,
                    title: "¡JEFE: El Inspector del Caos!",
                    isBoss: true,
                    steps: [
                        { type: "teoria", content: "¡El Inspector ha sido saboteado! Define los campos correctos para recuperar el control.", code: "// INSPECTOR BLOQUEADO" },
                        { type: "practica", question: "RONDA 1: Crea un campo para que el diseñador elija el color del jefe:", answer: "publico Color colorJefe;" },
                        { type: "completar-codigo", question: "RONDA 2: Asigna el molde del súbdito:", codeTemplate: "publico [BLOQUE] subditoPrefab;", blocks: ["Prefab", "Materia", "Sprite"], answer: "Prefab" },
                        { type: "practica", question: "RONDA 3: Crea un interruptor para activar el modo difícil:", answer: "publico booleano modoDificil;" }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: "Tipos de Datos",
            color: "#FFC300",
            courses: [
                { id: 21, title: "Números (numero)", steps: [{ type: "teoria", content: "El tipo 'numero' guarda cifras con o sin decimales.", code: "numero vida = 100;\nnumero pi = 3.14;" }, { type: "practica", question: "Escribe el tipo de dato para el número 42:", answer: "numero" }] },
                { id: 22, title: "Texto (texto)", steps: [{ type: "teoria", content: "El tipo 'texto' guarda palabras y letras siempre entre comillas.", code: "texto mensaje = \"Hola Mundo\";" }, { type: "completar-codigo", question: "Define una variable de texto:", codeTemplate: "[BLOQUE] saludo = \"Bienvenido\";", blocks: ["texto", "numero", "frase"], answer: "texto" }] },
                { id: 23, title: "Lógica (booleano)", steps: [{ type: "teoria", content: "Un 'booleano' solo puede ser 'verdadero' o 'falso'.", code: "booleano estaVivo = verdadero;" }, { type: "practica", question: "Escribe el tipo de dato que es verdadero o falso:", answer: "booleano" }] },
                { id: 24, title: "Objetos (Materia)", steps: [{ type: "teoria", content: "El tipo 'Materia' representa cualquier objeto físico o lógico dentro de tu juego.", code: "Materia jugador = buscar(\"Carl\");" }, { type: "opcion-multiple", question: "¿Qué representa una 'Materia'?", options: [{ text: "Un archivo de código", correct: false }, { text: "Un objeto en la escena", correct: true }, { text: "Un número decimal", correct: false }] }] },
                { id: 25, title: "Coordenadas (Vector2)", steps: [{ type: "teoria", content: "Un 'Vector2' guarda dos números (x, y). Se usa para posiciones, velocidades o tamaños.", code: "variable punto = nuevo Vector2(100, 50);" }, { type: "practica", question: "Escribe el tipo de dato para un punto (x, y):", answer: "Vector2" }] },
                { id: 26, title: "Colores (Color)", steps: [{ type: "teoria", content: "El tipo 'Color' guarda información cromática.", code: "Color rojo = \"#FF0000\";" }, { type: "completar-codigo", question: "Crea un color verde:", codeTemplate: "[BLOQUE] verde = \"#00FF00\";", blocks: ["Color", "Sprite", "Fisica"], answer: "Color" }] },
                { id: 27, title: "Imágenes (Sprite)", steps: [{ type: "teoria", content: "Un 'Sprite' es una imagen 2D que el motor puede dibujar.", code: "Sprite miDibujo;" }, { type: "practica", question: "Escribe el tipo de dato para una imagen:", answer: "Sprite" }] },
                { id: 28, title: "Audio", steps: [{ type: "teoria", content: "El tipo 'Audio' guarda un archivo de sonido.", code: "Audio cancion;" }, { type: "practica", question: "Escribe el tipo de dato para un sonido:", answer: "Audio" }] },
                { id: 29, title: "Moldes (Prefab)", steps: [{ type: "teoria", content: "Un 'Prefab' es un objeto guardado como plantilla.", code: "Prefab rocaPrefab;" }, { type: "opcion-multiple", question: "¿Qué es un Prefab?", options: [{ text: "Un error de código", correct: false }, { text: "Una plantilla o molde de objeto", correct: true }, { text: "Un tipo de número", correct: false }] }] },
                {
                    id: 30,
                    title: "¡JEFE: La Fuga de Datos!",
                    isBoss: true,
                    steps: [
                        { type: "teoria", content: "¡Los tipos de datos se están mezclando! Clasifica la información para estabilizar el sistema.", code: "// DATOS CORRUPTOS" },
                        { type: "completar-codigo", question: "RONDA 1: El nombre del jefe es un:", codeTemplate: "[BLOQUE] nombre = \"Zorg\";", blocks: ["texto", "numero", "booleano"], answer: "texto" },
                        { type: "practica", question: "RONDA 2: El punto de ataque (x, y) es un:", answer: "Vector2" },
                        { type: "opcion-multiple", question: "RONDA 3: 'jefe.estaVivo = verdadero'. ¿Qué tipo es 'estaVivo'?", options: [{ text: "numero", correct: false }, { text: "booleano", correct: true }, { text: "Sprite", correct: false }] }
                    ]
                }
            ]
        },
        {
            id: 4,
            name: "Componentes del Motor",
            color: "#FF5733",
            courses: [
                { id: 31, title: "Transform: posición", steps: [{ type: "teoria", content: "El componente 'posicion' controla dónde está el objeto, su rotación y su escala.", code: "posicion.x = 200;\nrotacion = 90;" }, { type: "practica", question: "Escribe el nombre del componente que controla el lugar del objeto:", answer: "posicion" }] },
                { id: 32, title: "Dibujo: renderizadorDeSprite", steps: [{ type: "teoria", content: "Controla cómo se ve el objeto: su imagen (sprite), color y opacidad.", code: "renderizadorDeSprite.color = \"#FF0000\";" }, { type: "completar-codigo", question: "Cambia la imagen del objeto:", codeTemplate: "[BLOQUE].sprite = nuevaImagen;", blocks: ["renderizadorDeSprite", "posicion", "fisica"], answer: "renderizadorDeSprite" }] },
                { id: 33, title: "Físicas: fisica", steps: [{ type: "teoria", content: "Otorga peso, gravedad y permite aplicar fuerzas al objeto.", code: "fisica.gravityScale = 1.0;" }, { type: "practica", question: "Escribe el nombre del componente de físicas:", answer: "fisica" }] },
                { id: 34, title: "Movimiento: animador", steps: [{ type: "teoria", content: "Controla los clips de animación.", code: "animador.play(\"Caminar\");" }, { type: "completar-codigo", question: "Ejecuta la animación de 'Salto':", codeTemplate: "animador.[BLOQUE](\"Salto\");", blocks: ["play", "stop", "variable"], answer: "play" }] },
                { id: 35, title: "Sonido: fuenteDeAudio", steps: [{ type: "teoria", content: "Permite que el objeto emita sonidos.", code: "fuenteDeAudio.play(miSonido);" }, { type: "practica", question: "Escribe el componente para reproducir audios:", answer: "fuenteDeAudio" }] },
                { id: 36, title: "Choques: colisionadorCaja2D", steps: [{ type: "teoria", content: "Define la forma física para que el objeto pueda chocar.", code: "// Componente: colisionadorCaja2D" }, { type: "practica", question: "Escribe el nombre del componente de colisión cuadrada:", answer: "colisionadorCaja2D" }] },
                { id: 37, title: "Interfaz: textoUI", steps: [{ type: "teoria", content: "Elementos que se dibujan sobre la pantalla.", code: "textoUI.text = \"Puntos: 0\";" }, { type: "completar-codigo", question: "Cambia el texto de la interfaz:", codeTemplate: "[BLOQUE].text = \"Hola\";", blocks: ["textoUI", "posicion", "boton"], answer: "textoUI" }] },
                { id: 38, title: "Cámaras y Luces", steps: [{ type: "teoria", content: "El componente 'camara' es el ojo del jugador.", code: "camara.estaActivado = verdadero;" }, { type: "opcion-multiple", question: "¿Qué componente usarías para que el jugador vea el mundo?", options: [{ text: "camara", correct: true }, { text: "luzPuntual2D", correct: false }, { text: "boton", correct: false }] }] },
                { id: 39, title: "Efectos: particulas", steps: [{ type: "teoria", content: "Crea efectos visuales como explosiones o humo.", code: "particulas.estaActivado = verdadero;" }, { type: "practica", question: "Componente para crear chispas o fuego:", answer: "particulas" }] },
                {
                    id: 40,
                    title: "¡JEFE: El Guardián del Componente!",
                    isBoss: true,
                    steps: [
                        { type: "teoria", content: "¡El Guardián ha desactivado los componentes esenciales! Reinstáuralos para luchar.", code: "// ALERTA: COMPONENTES PERDIDOS" },
                        { type: "completar-codigo", question: "RONDA 1: Devuelve la masa al jugador:", codeTemplate: "[BLOQUE].gravityScale = 1.0;", blocks: ["fisica", "posicion", "animador"], answer: "fisica" },
                        { type: "practica", question: "RONDA 2: El jefe es invisible. Activa el componente de dibujo:", answer: "renderizadorDeSprite.estaActivado = verdadero" },
                        { type: "ordenar-bloques", question: "RONDA 3: ¡Ataque final con sonido!", blocks: ["fuenteDeAudio.play(ataque);", "animador.play(\"Golpe\");"], answer: ["fuenteDeAudio.play(ataque);", "animador.play(\"Golpe\");"]
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
                { id: 41, title: "Nacimiento: alEmpezar()", steps: [{ type: "teoria", content: "Ocurre una sola vez cuando el objeto nace.", code: "alEmpezar() {\n  imprimir(\"¡He nacido!\");\n}" }, { type: "practica", question: "Escribe el nombre del evento que ocurre al iniciar:", answer: "alEmpezar" }] },
                { id: 42, title: "Ritmo: alActualizar(delta)", steps: [{ type: "teoria", content: "Ocurre en cada frame. 'delta' es el tiempo transcurrido.", code: "alActualizar(delta) {\n  posicion.x += 100 * delta;\n}" }, { type: "completar-codigo", question: "Mueve el objeto en cada instante:", codeTemplate: "[BLOQUE](delta) { ... }", blocks: ["alActualizar", "alEmpezar", "alHacerClick"], answer: "alActualizar" }] },
                { id: 43, title: "Física: actualizarFijo(delta)", steps: [{ type: "teoria", content: "Se usa para cálculos físicos estables.", code: "actualizarFijo(delta) {\n  fisica.applyForce(fuerza);\n}" }, { type: "practica", question: "Escribe el evento para físicas constantes:", answer: "actualizarFijo" }] },
                { id: 44, title: "Interacción: alHacerClick()", steps: [{ type: "teoria", content: "Se dispara al tocar el objeto.", code: "alHacerClick() {\n  destruir(materia);\n}" }, { type: "opcion-multiple", question: "¿Cuándo se dispara 'alHacerClick'?", options: [{ text: "Al chocar con una pared", correct: false }, { text: "Al tocar el objeto", correct: true }, { text: "Al empezar el nivel", correct: false }] }] },
                { id: 45, title: "Choque: alEntrarEnColision(otro)", steps: [{ type: "teoria", content: "Ocurre al chocar físicamente.", code: "alEntrarEnColision(otro) {\n  si (otro.tieneTag(\"Suelo\")) { ... }\n}" }, { type: "practica", question: "Escribe el evento que detecta un choque sólido:", answer: "alEntrarEnColision" }] },
                { id: 46, title: "Sensores: alEntrarEnTrigger(otro)", steps: [{ type: "teoria", content: "Se activa al entrar en un sensor invisible.", code: "alEntrarEnTrigger(otro) {\n  imprimir(\"¡Zona alcanzada!\");\n}" }, { type: "completar-codigo", question: "Detecta cuando el jugador entra en la meta:", codeTemplate: "[BLOQUE](otro) { ganar(); }", blocks: ["alEntrarEnTrigger", "alEntrarEnColision", "alHacerClick"], answer: "alEntrarEnTrigger" }] },
                { id: 47, title: "Mensajería: alRecibir", steps: [{ type: "teoria", content: "Escucha una señal enviada con 'difundir'.", code: "alRecibir(\"ABRIR\", () => { abrirPuerta(); });" }, { type: "practica", question: "Escribe el comando para escuchar un mensaje:", answer: "alRecibir" }] },
                { id: 48, title: "Rendimiento: alBajoRendimiento", steps: [{ type: "teoria", content: "Se activa si el juego va lento.", code: "alBajoRendimiento(nivel) {\n  particulas.estaActivado = falso;\n}" }, { type: "opcion-multiple", question: "¿Para qué sirve 'alBajoRendimiento'?", options: [{ text: "Para ganar más puntos", correct: false }, { text: "Para optimizar el juego si hay lag", correct: true }, { text: "Para cerrar el juego", correct: false }] }] },
                { id: 49, title: "Final de Contacto: alSalirDeColision", steps: [{ type: "teoria", content: "Ocurre al dejar de tocar un objeto.", code: "alSalirDeColision(otro) {\n  enAire = verdadero;\n}" }, { type: "practica", question: "Escribe el evento que detecta cuando dejas de tocar algo:", answer: "alSalirDeColision" }] },
                {
                    id: 50,
                    title: "¡JEFE: El Sincronizador de Almas!",
                    isBoss: true,
                    steps: [
                        { type: "teoria", content: "¡El Sincronizador ha desfasado los eventos! Restaura el ciclo vital.", code: "// ERROR DE SINCRONIZACIÓN" },
                        { type: "modo-debug", question: "RONDA 1: El jefe no aparece porque el evento está mal escrito:", codeLines: ["alNacer() {", "  estaActivado = verdadero;", "}"], errorLine: 0, explanation: "El evento correcto es 'alEmpezar'.", solution: "alEmpezar() {" },
                        { type: "practica", question: "RONDA 2: Ataca al jefe en cada instante (frame):", answer: "alActualizar(delta)" },
                        { type: "completar-codigo", question: "RONDA 3: El jefe detecta tu golpe mediante un choque sólido:", codeTemplate: "[BLOQUE](arma) { jefe.recibirDano(); }", blocks: ["alEntrarEnColision", "alEntrarEnTrigger", "alHacerClick"], answer: "alEntrarEnColision" }
                    ]
                }
            ]
        },
        {
            id: 6,
            name: "API del Motor",
            color: "#900C3F",
            courses: [
                { id: 51, title: "Consola: imprimir()", steps: [{ type: "teoria", content: "Muestra mensajes en la consola de ayuda.", code: "imprimir(\"Sistema listo\");" }, { type: "practica", question: "Escribe el comando para mandar un mensaje a la consola:", answer: "imprimir" }] },
                { id: 52, title: "Borrar: destruir()", steps: [{ type: "teoria", content: "Elimina una Materia permanentemente.", code: "destruir(materia);" }, { type: "completar-codigo", question: "Elimina al enemigo al morir:", codeTemplate: "[BLOQUE](enemigo);", blocks: ["destruir", "crear", "buscar"], answer: "destruir" }] },
                { id: 53, title: "Generar: crear()", steps: [{ type: "teoria", content: "Genera un objeto a partir de un Prefab.", code: "crear(balaPrefab);" }, { type: "practica", question: "Comando para instanciar un Prefab:", answer: "crear" }] },
                { id: 54, title: "Localizar: buscar()", steps: [{ type: "teoria", content: "Encuentra un objeto por su nombre exacto.", code: "buscar(\"Jugador\");" }, { type: "practica", question: "Encuentra el objeto llamado 'Tesoro':", answer: "buscar(\"Tesoro\")" }] },
                { id: 55, title: "Listar: buscarTodosConTag()", steps: [{ type: "teoria", content: "Devuelve todos los objetos con una etiqueta.", code: "buscarTodosConTag(\"Enemigo\");" }, { type: "opcion-multiple", question: "¿Qué devuelve 'buscarTodosConTag'?", options: [{ text: "Un solo objeto", correct: false }, { text: "Una lista de objetos", correct: true }, { text: "Un número", correct: false }] }] },
                { id: 56, title: "Distancia: distancia()", steps: [{ type: "teoria", content: "Calcula el espacio entre dos puntos.", code: "variable d = distancia(posicion, meta.posicion);" }, { type: "practica", question: "Comando para medir espacio entre objetos:", answer: "distancia" }] },
                { id: 57, title: "Señales: difundir()", steps: [{ type: "teoria", content: "Envía un mensaje a todos los objetos.", code: "difundir(\"VICTORIA\");" }, { type: "completar-codigo", question: "Envía la señal 'EMPEZAR':", codeTemplate: "[BLOQUE](\"EMPEZAR\");", blocks: ["difundir", "imprimir", "buscar"], answer: "difundir" }] },
                { id: 58, title: "Pausas: esperar()", steps: [{ type: "teoria", content: "Detiene el script durante unos segundos.", code: "esperar(2);" }, { type: "practica", question: "Escribe el comando para esperar 5 segundos:", answer: "esperar(5);" }] },
                { id: 59, title: "Ritmo: cada()", steps: [{ type: "teoria", content: "Ejecuta un bloque repetidamente.", code: "cada(1) { sumarSegundo(); }" }, { type: "opcion-multiple", question: "¿Diferencia entre esperar() y cada()?", options: [{ text: "esperar() repite, cada() pausa", correct: false }, { text: "esperar() pausa una vez, cada() repite siempre", correct: true }, { text: "Son iguales", correct: false }] }] },
                {
                    id: 60,
                    title: "¡JEFE: El Maestro de la API!",
                    isBoss: true,
                    steps: [
                        { type: "teoria", content: "¡El Maestro exige comandos perfectos! Demuestra tu dominio.", code: "// API CHALLENGE" },
                        { type: "practica", question: "RONDA 1: Encuentra al jefe llamado 'Zorg' en la escena:", answer: "buscar(\"Zorg\")" },
                        { type: "completar-codigo", question: "RONDA 2: Crea un aliado de refuerzo:", codeTemplate: "[BLOQUE](aliadoPrefab);", blocks: ["crear", "destruir", "imprimir"], answer: "crear" },
                        { type: "ordenar-bloques", question: "RONDA 3: ¡Finaliza con una pausa y destrucción!", blocks: ["esperar(1);", "destruir(jefe);"], answer: ["esperar(1);", "destruir(jefe);"] }
                    ]
                }
            ]
        },
        {
            id: 7,
            name: "Iniciación: Códigos 1-10",
            color: "#581845",
            courses: [
                { id: 61, title: "C1: ¡Hola Mundo!", steps: [{ type: "teoria", content: "El primer paso: mostrar un mensaje al inicio.", code: "ve motor; alEmpezar() { imprimir(\"¡Hola Mundo!\"); }" }, { type: "practica", question: "Escribe el script completo para imprimir 'Iniciando':", answer: "ve motor; alEmpezar() { imprimir('Iniciando'); }" }] },
                { id: 62, title: "C2: Variable Pública", steps: [{ type: "teoria", content: "Crea variables editables desde el Inspector.", code: "publico texto miNombre = \"Héroe\";" }, { type: "practica", question: "Crea una variable pública de texto llamada 'clase':", answer: "publico texto clase;" }] },
                { id: 63, title: "C3: Contador de Vida", steps: [{ type: "teoria", content: "Manipula números para la salud.", code: "vida = vida - 10;" }, { type: "practica", question: "Define vida en 100 y crea una acción 'quitar' que reste 10:", answer: "publico numero vida = 100; quitar() { vida = vida - 10; }" }] },
                { id: 64, title: "C4: Interruptor", steps: [{ type: "teoria", content: "Invierte estados con el operador NOT (!).", code: "luz = !luz;" }, { type: "practica", question: "Al hacer clic, invierte el valor de 'activo':", answer: "alHacerClick() { activo = !activo; }" }] },
                { id: 65, title: "C5: Movimiento X", steps: [{ type: "teoria", content: "Suma a la posición X para moverte.", code: "posicion.x = posicion.x + 2;" }, { type: "practica", question: "Mueve 5 unidades en X cada frame:", answer: "alActualizar(delta) { posicion.x = posicion.x + 5; }" }] },
                { id: 66, title: "C6: Seguir Mouse", steps: [{ type: "teoria", content: "Usa obtenerPosicionMouse() para interactuar.", code: "raton = obtenerPosicionMouse();" }, { type: "practica", question: "Pon tu X donde está el mouse:", answer: "alActualizar(delta) { m = obtenerPosicionMouse(); posicion.x = m.x; }" }] },
                { id: 67, title: "C7: Color al Azar", steps: [{ type: "teoria", content: "Usa azar(0, 255) para colores dinámicos.", code: "nuevo Color(azar(0,255), azar(0,255), azar(0,255))" }, { type: "practica", question: "Cambia el color del sprite a uno aleatorio al clicar:", answer: "alHacerClick() { renderizadorDeSprite.color = nuevo Color(azar(0,255), azar(0,255), azar(0,255)); }" }] },
                { id: 68, title: "C8: Reloj de Espera", steps: [{ type: "teoria", content: "Usa corrutinas para pausas temporales.", code: "esperar(3);" }, { type: "practica", question: "Espera 2 segundos y carga escena 'Menu':", answer: "esperar(2); cargarEscena('Menu');" }] },
                { id: 69, title: "C9: Bucle Repetitivo", steps: [{ type: "teoria", content: "Acciones rítmicas constantes.", code: "cada(1) { ... }" }, { type: "practica", question: "Imprime 'LATIDO' cada 0.5 segundos:", answer: "cada(0.5) { imprimir('LATIDO'); }" }] },
                {
                    id: 70,
                    title: "¡JEFE: Códigos Maestros 1-10!",
                    isBoss: true,
                    steps: [
                        { type: "practica", question: "RONDA 1: Conecta al motor e imprime 'GO':", answer: "ve motor; alEmpezar() { imprimir('GO'); }" },
                        { type: "practica", question: "RONDA 2: Crea un interruptor público de luz:", answer: "publico booleano luz;" },
                        { type: "practica", question: "RONDA 3: Al clicar, invierte la luz y espera 1s:", answer: "alHacerClick() { luz = !luz; esperar(1); }" },
                        { type: "practica", question: "RONDA 4: Mueve al jefe en X sumando 10 cada instante:", answer: "alActualizar(delta) { posicion.x = posicion.x + 10; }" },
                        { type: "practica", question: "RONDA 5: Destruye al jefe y manda señal 'FIN':", answer: "destruir(materia); difundir('FIN');" }
                    ]
                }
            ]
        },
        {
            id: 8,
            name: "Iniciación: Códigos 11-20",
            color: "#1A5276",
            courses: [
                { id: 71, title: "C11: Efecto Pulso", steps: [{ type: "teoria", content: "Usa seno() para oscilaciones suaves.", code: "escala = 1 + seno(tiempoJuego * 5) * 0.2;" }, { type: "practica", question: "Aplica escala suave en X e Y:", answer: "alActualizar(delta) { s = 1 + seno(tiempoJuego); transform.scale.x = s; transform.scale.y = s; }" }] },
                { id: 72, title: "C12: Rotación Molino", steps: [{ type: "teoria", content: "Giro constante usando delta.", code: "rotacion = rotacion + 100 * delta;" }, { type: "practica", question: "Gira 50 grados por segundo:", answer: "alActualizar(delta) { rotacion = rotacion + 50 * delta; }" }] },
                { id: 73, title: "C13: Teletransporte", steps: [{ type: "teoria", content: "Mueve un objeto a coordenadas exactas.", code: "posicion.x = 0; posicion.y = 0;" }, { type: "practica", question: "Al clicar, ve al punto (500, 500):", answer: "alHacerClick() { posicion.x = 500; posicion.y = 500; }" }] },
                { id: 74, title: "C14: Mostrar/Ocultar", steps: [{ type: "teoria", content: "Activa o desactiva objetos totalmente.", code: "estaActivado = !estaActivado;" }, { type: "practica", question: "Crea una acción 'toggle' que invierta la activación:", answer: "toggle() { estaActivado = !estaActivado; }" }] },
                { id: 75, title: "C15: Saludo por Tag", steps: [{ type: "teoria", content: "Filtra colisiones usando etiquetas.", code: "si (otro.tieneTag(\"Jugador\")) { ... }" }, { type: "practica", question: "Si chocas con 'Muro', imprime 'PUM':", answer: "alEntrarEnColision(otro) { si (otro.tieneTag('Muro')) { imprimir('PUM'); } }" }] },
                { id: 76, title: "C16: Variable Privada", steps: [{ type: "teoria", content: "Variables que no salen en el Inspector.", code: "variable secreto = 0;" }, { type: "practica", question: "Declara la variable interna 'puntos' en 0:", answer: "variable puntos = 0;" }] },
                { id: 77, title: "C17: Espejo (Volteo)", steps: [{ type: "teoria", content: "Gira visualmente el sprite.", code: "voltearH = verdadero;" }, { type: "practica", question: "Si pulsas 'ArrowLeft', voltea horizontalmente:", answer: "si (teclaPresionada('ArrowLeft')) { voltearH = verdadero; }" }] },
                { id: 78, title: "C18: Consola Limpia", steps: [{ type: "teoria", content: "Usa mensajes de inicio para depurar.", code: "imprimir(\"--- START ---\");" }, { type: "practica", question: "Imprime separadores al empezar:", answer: "alEmpezar() { imprimir('---'); }" }] },
                { id: 79, title: "C19: Comentarios", steps: [{ type: "teoria", content: "Notas para humanos que el motor ignora.", code: "// Comentario\n/* Bloque */" }, { type: "practica", question: "Escribe un comentario de una línea que diga 'hola':", answer: "// hola" }] },
                {
                    id: 80,
                    title: "¡JEFE: Códigos Maestros 11-20!",
                    isBoss: true,
                    steps: [
                        { type: "practica", question: "RONDA 1: Al nacer, imprime 'INICIO' y voltea el sprite:", answer: "alEmpezar() { imprimir('INICIO'); voltearH = verdadero; }" },
                        { type: "practica", question: "RONDA 2: Si el que choca es 'Bala', desactívate:", answer: "alEntrarEnColision(otro) { si (otro.tieneTag('Bala')) { estaActivado = falso; } }" },
                        { type: "practica", question: "RONDA 3: Crea una rotación constante de 200:", answer: "alActualizar(delta) { rotacion = rotacion + 200 * delta; }" },
                        { type: "practica", question: "RONDA 4: Al clicar, ve al origen (0,0) y comenta 'teleport':", answer: "alHacerClick() { posicion.x = 0; posicion.y = 0; // teleport }" },
                        { type: "practica", question: "RONDA 5: Aplica escala seno(tiempo) para pulsar:", answer: "alActualizar(delta) { transform.scale.x = seno(tiempoJuego); }" }
                    ]
                }
            ]
        },
        {
            id: 9,
            name: "Iniciación: Códigos 21-30",
            color: "#1D8348",
            courses: [
                { id: 81, title: "C21: Tecla Única", steps: [{ type: "teoria", content: "Detecta solo el primer instante del pulso.", code: "teclaRecienPresionada(\"Space\")" }, { type: "practica", question: "Si pulsas recién 'Enter', imprime 'OK':", answer: "si (teclaRecienPresionada('Enter')) { imprimir('OK'); }" }] },
                { id: 82, title: "C22: Opacidad Fantasma", steps: [{ type: "teoria", content: "Vuelve transparente un objeto.", code: "renderizadorDeSprite.opacity = 0.5;" }, { type: "practica", question: "Pon opacidad en 0.2 al empezar:", answer: "alEmpezar() { renderizadorDeSprite.opacity = 0.2; }" }] },
                { id: 83, title: "C23: Distancia Simple", steps: [{ type: "teoria", content: "Mide separación en píxeles.", code: "d = distancia(posicion, obj.posicion);" }, { type: "practica", question: "Si distancia a 'objetivo' es < 100, imprime 'CERCA':", answer: "si (distancia(posicion, objetivo.posicion) < 100) { imprimir('CERCA'); }" }] },
                { id: 84, title: "C24: Gravedad Falsa", steps: [{ type: "teoria", content: "Crea caídas sin motor físico.", code: "si (posicion.y < 500) posicion.y += 5;" }, { type: "practica", question: "Sube poco a poco en Y cada frame:", answer: "alActualizar(delta) { posicion.y = posicion.y - 2; }" }] },
                { id: 85, title: "C25: Nombre Objeto", steps: [{ type: "teoria", content: "Accede al nombre de la jerarquía.", code: "imprimir(\"Soy: \" + nombre);" }, { type: "practica", question: "Imprime tu nombre al nacer:", answer: "alEmpezar() { imprimir(nombre); }" }] },
                { id: 86, title: "C26: Control WASD", steps: [{ type: "teoria", content: "Movimiento básico en 4 direcciones.", code: "si (teclaPresionada(\"w\")) posicion.y -= 10;" }, { type: "practica", question: "Mueve abajo con 's':", answer: "si (teclaPresionada('s')) { posicion.y += 10; }" }] },
                { id: 87, title: "C27: Crear Proyectil", steps: [{ type: "teoria", content: "Usa crear() para instanciar plantillas.", code: "b = crear(prefab); b.posicion = posicion;" }, { type: "practica", question: "Crea 'bala' en tu posición al clicar:", answer: "alHacerClick() { b = crear(bala); b.posicion = posicion; }" }] },
                { id: 88, title: "C28: Rebote Físico", steps: [{ type: "teoria", content: "Cambia velocidades instantáneas.", code: "fisica.velocity.y = -10;" }, { type: "practica", question: "Pon velocidad X en -20 al chocar:", answer: "alEntrarEnColision(otro) { fisica.velocity.x = -20; }" }] },
                { id: 89, title: "C29: Seguir Jugador", steps: [{ type: "teoria", content: "Busca y persigue suavemente.", code: "j = buscar(\"Jugador\");" }, { type: "practica", question: "Busca 'Carl' y pon tu X como la suya:", answer: "carl = buscar('Carl'); posicion.x = carl.x;" }] },
                {
                    id: 90,
                    title: "¡JEFE: Códigos Maestros 21-30!",
                    isBoss: true,
                    steps: [
                        { type: "practica", question: "RONDA 1: Si pulsas recién 'f', crea un 'rayo':", answer: "si (teclaRecienPresionada('f')) { crear(rayo); }" },
                        { type: "practica", question: "RONDA 2: El jefe se vuelve fantasma (opacidad 0.3):", answer: "renderizadorDeSprite.opacity = 0.3;" },
                        { type: "practica", question: "RONDA 3: Si la distancia al jefe es < 50, vida = 0:", answer: "si (distancia(posicion, jefe.posicion) < 50) { vida = 0; }" },
                        { type: "practica", question: "RONDA 4: Haz que el jefe caiga sumando 2 a su Y:", answer: "posicion.y = posicion.y + 2;" },
                        { type: "practica", question: "RONDA 5: Imprime el nombre del jefe y destrúyelo:", answer: "imprimir(nombre); destruir(materia);" }
                    ]
                }
            ]
        },
        {
            id: 10,
            name: "Desarrollo: Códigos 31-40",
            color: "#FF5733",
            courses: [
                { id: 91, title: "C31: Audio al Tocar", steps: [{ type: "teoria", content: "Sonidos interactivos.", code: "fuenteDeAudio.play(clip);" }, { type: "practica", question: "Al clicar, suena 'beep':", answer: "alHacerClick() { fuenteDeAudio.play(beep); }" }] },
                { id: 92, title: "C32: Control Animador", steps: [{ type: "teoria", content: "Cambia animaciones por código.", code: "animador.play(\"Run\");" }, { type: "practica", question: "Si pulsas 'd', pon 'Run', sino 'Idle':", answer: "si (teclaPresionada('d')) { animador.play('Run'); } sino { animador.play('Idle'); }" }] },
                { id: 93, title: "C33: Área de Daño", steps: [{ type: "teoria", content: "Detección con triggers.", code: "alEntrarEnTrigger(otro)" }, { type: "practica", question: "Si el que entra tiene tag 'Lava', muere:", answer: "alEntrarEnTrigger(otro) { si (otro.tieneTag('Lava')) { destruir(materia); } }" }] },
                { id: 94, title: "C34: Barra Vida UI", steps: [{ type: "teoria", content: "Feedback visual en pantalla.", code: "textoUI.text = \"HP: \" + v;" }, { type: "practica", question: "Actualiza el texto de salud:", answer: "actualizarSalud(v) { textoUI.text = 'Salud: ' + v; }" }] },
                { id: 95, title: "C35: Portal Escena", steps: [{ type: "teoria", content: "Cambio de niveles.", code: "cargarEscena(\"Boss\");" }, { type: "practica", question: "Si chocas con 'Fin', carga 'Creditos':", answer: "alEntrarEnColision(otro) { si (otro.tieneTag('Fin')) { cargarEscena('Creditos'); } }" }] },
                { id: 96, title: "C36: Botón Menú", steps: [{ type: "teoria", content: "Interfaz clicable.", code: "alHacerClick() { abrir(); }" }, { type: "practica", question: "Al clicar el botón, imprime 'START':", answer: "alHacerClick() { imprimir('START'); }" }] },
                { id: 97, title: "C37: Mirar al Mouse", steps: [{ type: "teoria", content: "Calcula ángulos de rotación.", code: "atan2(m.y - y, m.x - x)" }, { type: "practica", question: "Obtén el mouse y calcula el ángulo:", answer: "m = obtenerPosicionMouse(); angulo = atan2(m.y - posicion.y, m.x - posicion.x);" }] },
                { id: 98, title: "C38: Inventario Lista", steps: [{ type: "teoria", content: "Listas para guardar objetos.", code: "mochila.empujar(item);" }, { type: "practica", question: "Añade 'espada' a la lista 'objetos':", answer: "objetos.empujar('espada');" }] },
                { id: 99, title: "C39: Spawner Enemigo", steps: [{ type: "teoria", content: "Generación infinita.", code: "cada(5) { crear(e); }" }, { type: "practica", question: "Crea 'aliado' cada 10 segundos:", answer: "cada(10) { crear(aliado); }" }] },
                {
                    id: 100,
                    title: "¡JEFE: Códigos Maestros 31-40!",
                    isBoss: true,
                    steps: [
                        { type: "practica", question: "RONDA 1: Reproduce 'grito' al nacer:", answer: "alEmpezar() { fuenteDeAudio.play(grito); }" },
                        { type: "practica", question: "RONDA 2: Si el jefe choca con 'Meta', carga 'Escena2':", answer: "alEntrarEnColision(otro) { si (otro.tieneTag('Meta')) { cargarEscena('Escena2'); } }" },
                        { type: "practica", question: "RONDA 3: Actualiza la barra con el nombre del jefe:", answer: "textoUI.text = 'Jefe: ' + nombre;" },
                        { type: "practica", question: "RONDA 4: El jefe te mira fijamente usando el ángulo del mouse:", answer: "m = obtenerPosicionMouse(); angulo = atan2(m.y - posicion.y, m.x - posicion.x); rotacion = angulo * 180 / 3.14;" },
                        { type: "practica", question: "RONDA 5: Crea un 'refuerzo' cada 2 segundos y añádelo a 'lista':", answer: "cada(2) { r = crear(refuerzo); lista.empujar(r); }" },
                        { type: "practica", question: "RONDA 6: Ataca si pulsas recién 'z' y el animador está en 'Idle':", answer: "si (teclaRecienPresionada('z')) { animador.play('Attack'); }" }
                    ]
                }
            ]
        },
        {
            id: 11,
            name: "Desarrollo: Códigos 41-50",
            color: "#C70039",
            courses: [
                { id: 101, title: "C41: Difusión Global", steps: [{ type: "teoria", content: "Grita señales a todos.", code: "difundir(\"OPEN\", { key: 1 });" }, { type: "practica", question: "Difunde 'START' con datos vacíos:", answer: "difundir('START', {});" }] },
                { id: 102, title: "C42: Escuchar Mensaje", steps: [{ type: "teoria", content: "Reacciona a señales remotas.", code: "alRecibir(\"OPEN\", (d) => { ... });" }, { type: "practica", question: "Al recibir 'WIN', imprime 'Victoria':", answer: "alRecibir('WIN', () => { imprimir('Victoria'); });" }] },
                { id: 103, title: "C43: Salto Físico", steps: [{ type: "teoria", content: "Impulsos reales con física.", code: "fisica.applyImpulse(nuevo Vector2(0, -15));" }, { type: "practica", question: "Salta con fuerza 10 en Y negativo:", answer: "fisica.applyImpulse(nuevo Vector2(0, -10));" }] },
                { id: 104, title: "C44: Límites Pantalla", steps: [{ type: "teoria", content: "Restringe el movimiento.", code: "si (x > 800) x = 800;" }, { type: "practica", question: "Si X es menor a 0, ponla en 0:", answer: "si (posicion.x < 0) { posicion.x = 0; }" }] },
                { id: 105, title: "C45: Plataforma Móvil", steps: [{ type: "teoria", content: "Patrones de ida y vuelta.", code: "x += 200 * dir * delta;" }, { type: "practica", question: "Si X > 500, cambia dirección a -1:", answer: "si (posicion.x > 500) { direccion = -1; }" }] },
                { id: 106, title: "C46: Bala Temporal", steps: [{ type: "teoria", content: "Limpieza automática de memoria.", code: "esperar(2); destruir(materia);" }, { type: "practica", question: "Nace, espera 1s y se destruye:", answer: "alEmpezar() { esperar(1); destruir(materia); }" }] },
                { id: 107, title: "C47: Velocidad Anim", steps: [{ type: "teoria", content: "Acelera o frena visuales.", code: "animador.speed = 2.0;" }, { type: "practica", question: "Pon velocidad del animador en 0.5:", answer: "animador.speed = 0.5;" }] },
                { id: 108, title: "C48: Detectar Suelo", steps: [{ type: "teoria", content: "Estados de contacto sólido.", code: "alEntrarEnColision(otro) { if(otro.tieneTag(\"Suelo\")) enSuelo = true; }" }, { type: "practica", question: "Si dejas de tocar 'Suelo', enSuelo = falso:", answer: "alSalirDeColision(otro) { si (otro.tieneTag('Suelo')) { enSuelo = falso; } }" }] },
                { id: 109, title: "C49: Texto Daño", steps: [{ type: "teoria", content: "Efecto de desvanecimiento.", code: "opacity -= 0.5 * delta;" }, { type: "practica", question: "Resta opacidad y sube en Y:", answer: "alActualizar(delta) { renderizadorDeSprite.opacity -= delta; posicion.y -= 10 * delta; }" }] },
                {
                    id: 110,
                    title: "¡JEFE: Códigos Maestros 41-50!",
                    isBoss: true,
                    steps: [
                        { type: "practica", question: "RONDA 1: Salta recién al pulsar 'Space' y no estar en el aire:", answer: "si (teclaRecienPresionada('Space') y enSuelo) { fisica.applyImpulse(nuevo Vector2(0,-10)); }" },
                        { type: "practica", question: "RONDA 2: Si X llega a 1000, difunde 'META_LOGRADA':", answer: "si (posicion.x >= 1000) { difundir('META_LOGRADA'); }" },
                        { type: "practica", question: "RONDA 3: Al recibir 'ATAQUE', pon velocidad anim en 3.0:", answer: "alRecibir('ATAQUE', () => { animador.speed = 3.0; });" },
                        { type: "practica", question: "RONDA 4: Haz que el jefe suba en Y 100 unidades y se autodestruya en 0.5s:", answer: "posicion.y -= 100; esperar(0.5); destruir(materia);" },
                        { type: "practica", question: "RONDA 5: Crea una 'explosión' y limita su X a 0:", answer: "crear(explosion); si (posicion.x < 0) { posicion.x = 0; }" }
                    ]
                }
            ]
        },
        {
            id: 12,
            name: "Maestría: Códigos 51-60",
            color: "#900C3F",
            courses: [
                { id: 111, title: "C51: Visión IA", steps: [{ type: "teoria", content: "Detección por Raycast.", code: "hit = lanzarRayo(pos, dir, 500);" }, { type: "practica", question: "Si el rayo choca con 'Heroe', ataca:", answer: "h = lanzarRayo(posicion, Vector2.derecha, 300); si (h != nulo y h.materia.tieneTag('Heroe')) { atacar(); }" }] },
                { id: 112, title: "C52: Ciclo Horario", steps: [{ type: "teoria", content: "Control de iluminación global.", code: "establecerLuzAmbiental(\"#113\");" }, { type: "practica", question: "Suma delta a 'hora' y si > 18 pon luz azul:", answer: "hora += delta; si (hora > 18) { establecerLuzAmbiental('#000033'); }" }] },
                { id: 113, title: "C53: Objetos JSON", steps: [{ type: "teoria", content: "Datos estructurados en listas.", code: "mochila.empujar({ id: 1, name: \"Axe\" });" }, { type: "practica", question: "Añade un objeto con 'puntos: 10' a 'lista':", answer: "lista.empujar({ puntos: 10 });" }] },
                { id: 114, title: "C54: Patrulla IA", steps: [{ type: "teoria", content: "Máquina de estados básica.", code: "si (estado == \"PAT\") x += 2;" }, { type: "practica", question: "Si estado es 'IDLE', no hagas nada, sino muévete:", answer: "si (estado == 'IDLE') { retornar; } sino { posicion.x += 5; }" }] },
                { id: 115, title: "C55: Explosión Partículas", steps: [{ type: "teoria", content: "Generación masiva con bucles.", code: "para(i=0; i<10; i++) crear(p);" }, { type: "practica", question: "Crea 15 'chispas' usando un bucle para:", answer: "para (variable i = 0; i < 15; i = i + 1) { crear(chispas); }" }] },
                { id: 116, title: "C56: Guardado Partida", steps: [{ type: "teoria", content: "Persistencia de datos.", code: "// El motor gestiona el guardado" }, { type: "practica", question: "Imprime 'DATOS GUARDADOS':", answer: "imprimir('DATOS GUARDADOS');" }] },
                { id: 117, title: "C57: Cámara Lerp", steps: [{ type: "teoria", content: "Suavizado de seguimiento.", code: "x = lerp(x, target.x, 0.1);" }, { type: "practica", question: "Interpola X hacia 'obj.x' con 0.2:", answer: "posicion.x = lerp(posicion.x, obj.x, 0.2);" }] },
                { id: 118, title: "C58: Daño Veneno", steps: [{ type: "teoria", content: "Efectos sobre el tiempo.", code: "cada(1) { vida -= 5; }" }, { type: "practica", question: "Cada segundo resta 5 de vida y si <= 0 muere:", answer: "cada(1) { vida = vida - 5; si (vida <= 0) { destruir(materia); } }" }] },
                { id: 119, title: "C59: Sistema Combo", steps: [{ type: "teoria", content: "Contador de ataques rápidos.", code: "si (now - last < 0.5) c++;" }, { type: "practica", question: "Si pulsas 'z', guarda el tiempo en 'u':", answer: "si (teclaRecienPresionada('z')) { u = tiempoJuego; }" }] },
                {
                    id: 120,
                    title: "¡JEFE: Códigos Maestros 51-60!",
                    isBoss: true,
                    steps: [
                        { type: "practica", question: "RONDA 1: Si un rayo de 200 choca con 'Bala', destrúyela:", answer: "h = lanzarRayo(posicion, dir, 200); si (h != nulo y h.materia.tieneTag('Bala')) { destruir(h.materia); }" },
                        { type: "practica", question: "RONDA 2: Cambia luz a negro y empieza un bucle de 0.1s:", answer: "establecerLuzAmbiental('#000'); cada(0.1) { latir(); }" },
                        { type: "practica", question: "RONDA 3: Añade un objeto herido { hp: 0 } a la 'mochila':", answer: "mochila.empujar({ hp: 0 });" },
                        { type: "practica", question: "RONDA 4: Interpola tu Y hacia la del mouse suavemente:", answer: "m = obtenerPosicionMouse(); posicion.y = lerp(posicion.y, m.y, 0.1);" },
                        { type: "practica", question: "RONDA 5: Crea 50 partículas y carga escena 'Nivel3':", answer: "para(i=0; i<50; i++) { crear(p); } cargarEscena('Nivel3');" }
                    ]
                }
            ]
        },
        {
            id: 13,
            name: "Maestría: Códigos 61-70",
            color: "#581845",
            courses: [
                { id: 121, title: "C61: Diálogo NPC", steps: [{ type: "teoria", content: "Muestra frases secuenciales.", code: "text = lines[idx]; idx++;" }, { type: "practica", question: "Muestra la frase en 'i' y suma 1 a 'i':", answer: "textoUI.text = frases[i]; i = i + 1;" }] },
                { id: 122, title: "C62: Fade Teleport", steps: [{ type: "teoria", content: "Transiciones visuales.", code: "difundir(\"OUT\"); wait(1); x=2000;" }, { type: "practica", question: "Grita 'NEGRO', espera 2s y ve a X=100:", answer: "difundir('NEGRO'); esperar(2); posicion.x = 100;" }] },
                { id: 123, title: "C63: Radar Enemigo", steps: [{ type: "teoria", content: "Busca grupos por etiquetas.", code: "list = buscarTodosConTag(\"E\");" }, { type: "practica", question: "Si la longitud de 'buscarTodosConTag' es > 0, avisa:", answer: "enms = buscarTodosConTag('Enemigo'); si (enms.longitud > 0) { imprimir('CUIDADO'); }" }] },
                { id: 124, title: "C64: Granada Arco", steps: [{ type: "teoria", content: "Físicas parabólicas.", code: "applyImpulse(nuevo Vector2(10,-15));" }, { type: "practica", question: "Crea 'granada' y dale un impulso (5, -10):", answer: "g = crear(granada); g.fisica.applyImpulse(nuevo Vector2(5, -10));" }] },
                { id: 125, title: "C65: Buff Aliado", steps: [{ type: "teoria", content: "Modifica scripts de otros objetos.", code: "otro.obtenerScript(\"Mov\").vel = 600;" }, { type: "practica", question: "Obtén el script 'Vida' de 'otro' y pon vida en 100:", answer: "s = otro.obtenerScript('Vida'); s.vida = 100;" }] },
                { id: 126, title: "C66: Bomba Área", steps: [{ type: "teoria", content: "Borrado masivo por Tag.", code: "para(i...) { destruir(lista[i]); }" }, { type: "practica", question: "Busca todas las 'Basura' y destruye la primera:", answer: "b = buscarTodosConTag('Basura'); destruir(b[0]);" }] },
                { id: 127, title: "C67: LookAt (Mirar)", steps: [{ type: "teoria", content: "Rotación automática hacia un punto.", code: "mirarA(objetivo.posicion);" }, { type: "practica", question: "Mira hacia la posición de 'Carl':", answer: "carl = buscar('Carl'); mirarA(carl.posicion);" }] },
                { id: 128, title: "C68: Generar Terreno", steps: [{ type: "teoria", content: "Creación de niveles por código.", code: "para(x=0; x<10; x++) crear(b);" }, { type: "practica", question: "Crea 5 'suelo' separados por 100px en X:", answer: "para (variable i = 0; i < 5; i = i + 1) { s = crear(suelo); s.posicion.x = i * 100; }" }] },
                { id: 129, title: "C69: Bomba Reloj", steps: [{ type: "teoria", content: "Contadores regresivos.", code: "cada(1) { t--; if(t==0) boom(); }" }, { type: "practica", question: "Resta 1 a 'cuenta' cada segundo:", answer: "cada(1) { cuenta = cuenta - 1; }" }] },
                {
                    id: 130,
                    title: "¡JEFE: Códigos Maestros 61-70!",
                    isBoss: true,
                    steps: [
                        { type: "practica", question: "RONDA 1: Busca todos los 'Enemigo' y si hay > 5 grita 'HUIR':", answer: "e = buscarTodosConTag('Enemigo'); si (e.longitud > 5) { difundir('HUIR'); }" },
                        { type: "practica", question: "RONDA 2: Crea un arco parabólico con impulso (10, -20):", answer: "g = crear(bomba); g.fisica.applyImpulse(nuevo Vector2(10, -20));" },
                        { type: "practica", question: "RONDA 3: Mira al jugador y cambia su script 'Poder' a 999:", answer: "j = buscar('Jugador'); mirarA(j.posicion); s = j.obtenerScript('Poder'); s.valor = 999;" },
                        { type: "practica", question: "RONDA 4: Genera 10 bloques de suelo y espera 3 segundos:", answer: "para(i=0; i<10; i++) { crear(suelo); } esperar(3);" },
                        { type: "practica", question: "RONDA 5: Cuenta atrás de 5s y explota al jefe:", answer: "cada(1) { t = t - 1; si(t <= 0) { destruir(materia); } }" }
                    ]
                }
            ]
        },
        {
            id: 14,
            name: "Maestría: Códigos 71-80",
            color: "#1A5276",
            courses: [
                { id: 131, title: "C71: Checkpoint", steps: [{ type: "teoria", content: "Guarda posiciones de reaparición.", code: "respawn = otro.posicion;" }, { type: "practica", question: "Si chocas con 'Bandera', guarda su posición:", answer: "alEntrarEnTrigger(otro) { si (otro.tieneTag('Bandera')) { r = otro.posicion; } }" }] },
                { id: 132, title: "C72: Puerta Llave", steps: [{ type: "teoria", content: "Condiciones de inventario.", code: "if(tag==\"Llave\") have=true;" }, { type: "practica", question: "Si chocas con 'Puerta' y tienes 'llave', destrúyela:", answer: "si (otro.tieneTag('Puerta') y llave) { destruir(otro); }" }] },
                { id: 133, title: "C73: Órbita Circular", steps: [{ type: "teoria", content: "Matemáticas de movimiento orbital.", code: "x = centro.x + cos(t) * r;" }, { type: "practica", question: "Usa coseno para X y seno para Y:", answer: "posicion.x = cos(tiempoJuego); posicion.y = seno(tiempoJuego);" }] },
                { id: 134, title: "C74: Fase Furia", steps: [{ type: "teoria", content: "Cambio de estado por vida baja.", code: "si (vida < 50) color = \"#F00\";" }, { type: "practica", question: "Si vida < 20, imprime 'AGUR' y pon opacidad 1:", answer: "si (vida < 20) { imprimir('AGUR'); renderizadorDeSprite.opacity = 1; }" }] },
                { id: 135, title: "C75: Música Combate", steps: [{ type: "teoria", content: "Control de banda sonora.", code: "audio.stop(); audio.play(boss);" }, { type: "practica", question: "Para la música y pon 'fuego' en bucle:", answer: "fuenteDeAudio.stop(); fuenteDeAudio.play(fuego); fuenteDeAudio.loop = verdadero;" }] },
                { id: 136, title: "C76: Retroceso Fuego", steps: [{ type: "teoria", content: "Fuerzas opuestas al disparo.", code: "applyImpulse(nuevo Vector2(-5,0));" }, { type: "practica", question: "Impulso de -2 en X al disparar:", answer: "si (teclaRecienPresionada('f')) { fisica.applyImpulse(nuevo Vector2(-2, 0)); }" }] },
                { id: 137, title: "C77: Regeneración", steps: [{ type: "teoria", content: "Sanación pasiva gradual.", code: "cada(2) { vida += 2; }" }, { type: "practica", question: "Suma 1 de vida cada segundo:", answer: "cada(1) { vida = vida + 1; }" }] },
                { id: 138, title: "C78: IA Temerosa", steps: [{ type: "teoria", content: "Huir si el jugador se acerca.", code: "if (dist < 300) x -= 5;" }, { type: "practica", question: "Si distancia < 200, mueve X positivamente:", answer: "si (distancia(posicion, j.posicion) < 200) { posicion.x += 10; }" }] },
                { id: 139, title: "C79: Sistema XP", steps: [{ type: "teoria", content: "Progreso de niveles RPG.", code: "xp += 10; if(xp>=100) lvl++;" }, { type: "practica", question: "Si 'puntos' >= 50, nivel = 2:", answer: "si (puntos >= 50) { nivel = 2; }" }] },
                {
                    id: 140,
                    title: "¡JEFE: Códigos Maestros 71-80!",
                    isBoss: true,
                    steps: [
                        { type: "practica", question: "RONDA 1: Si chocas con 'Pinchos', vuelve a 'checkpoint':", answer: "alEntrarEnColision(otro) { si (otro.tieneTag('Pinchos')) { posicion = checkpoint; } }" },
                        { type: "practica", question: "RONDA 2: Orbita alrededor del jefe con radio 300:", answer: "posicion.x = jefe.x + cos(tiempoJuego) * 300;" },
                        { type: "practica", question: "RONDA 3: Cuando el jefe tenga < 10 vida, pon música épica:", answer: "si (vida < 10) { fuenteDeAudio.play(epica); }" },
                        { type: "practica", question: "RONDA 4: Aplica retroceso de -10 en Y al saltar:", answer: "si (teclaRecienPresionada('Space')) { fisica.applyImpulse(nuevo Vector2(0, -10)); }" },
                        { type: "practica", question: "RONDA 5: Si XP llega a 1000, nivel sube y el jefe muere:", answer: "si (xp >= 1000) { nivel = nivel + 1; destruir(jefe); }" }
                    ]
                }
            ]
        },
        {
            id: 15,
            name: "Experto: Códigos 81-90",
            color: "#F1C40F",
            courses: [
                { id: 141, title: "C81: Item Dinámico", steps: [{ type: "teoria", content: "Mensajería para recolección.", code: "alRecibir(\"OBJET\", (d) => ...)" }, { type: "practica", question: "Al recibir 'COGER', añade datos a 'mochila':", answer: "alRecibir('COGER', (datos) => { mochila.empujar(datos); });" }] },
                { id: 142, title: "C82: Persecución Lerp", steps: [{ type: "teoria", content: "IA fluida y orgánica.", code: "x = lerp(x, target.x, 0.02);" }, { type: "practica", question: "Sigue al jugador en X con lerp 0.05:", answer: "posicion.x = lerp(posicion.x, jugador.x, 0.05);" }] },
                { id: 143, title: "C83: Diálogo Páginas", steps: [{ type: "teoria", content: "Gestión de múltiples textos.", code: "text = book[page]; page++;" }, { type: "practica", question: "Si 'pagina' < 5, muestra texto y suma página:", answer: "si (pagina < 5) { textoUI.text = libro[pagina]; pagina = pagina + 1; }" }] },
                { id: 144, title: "C84: Plataforma Fuga", steps: [{ type: "teoria", content: "Parkour temporal.", code: "wait(1); active = false;" }, { type: "practica", question: "Al chocar, espera 0.5s y desactiva:", answer: "alEntrarEnColision(otro) { esperar(0.5); estaActivado = falso; }" }] },
                { id: 145, title: "C85: Disparo Dirigido", steps: [{ type: "teoria", content: "Orientación de proyectiles.", code: "dir = flip ? -1 : 1; vel = 20 * dir;" }, { type: "practica", question: "Si voltearH, velocidad es -50, sino 50:", answer: "variable v = voltearH ? -50 : 50; b.fisica.velocity.x = v;" }] },
                { id: 146, title: "C86: Spawner Tiempo", steps: [{ type: "teoria", content: "Nacimiento aleatorio rítmico.", code: "cada(wait) { crear(enemy); }" }, { type: "practica", question: "Cada 5s crea 'zombi' en X aleatoria:", answer: "cada(5) { z = crear(zombi); z.posicion.x = azar(-100, 100); }" }] },
                { id: 147, title: "C87: Volumen Maestro", steps: [{ type: "teoria", content: "Control dinámico de decibelios.", code: "audio.volume = newVol;" }, { type: "practica", question: "Pon el volumen de audio en 0.8:", answer: "fuenteDeAudio.volume = 0.8;" }] },
                { id: 148, title: "C88: Recibir Golpe", steps: [{ type: "teoria", content: "Combate con retroceso y color.", code: "color = \"#F00\"; applyImpulse(dir);" }, { type: "practica", question: "Resta 10 de vida y pon color rojo:", answer: "vida = vida - 10; renderizadorDeSprite.color = '#FF0000';" }] },
                { id: 149, title: "C89: Switch Héroe", steps: [{ type: "teoria", content: "Cambio de personajes activos.", code: "p1.active = !p1.active; p2.active = !p2.active;" }, { type: "practica", question: "Al pulsar 'Tab', alterna 'p1' y 'p2':", answer: "si (teclaRecienPresionada('Tab')) { p1.estaActivado = !p1.estaActivado; p2.estaActivado = !p2.estaActivado; }" }] },
                {
                    id: 150,
                    title: "¡JEFE: Códigos Maestros 81-90!",
                    isBoss: true,
                    steps: [
                        { type: "practica", question: "RONDA 1: Interpola tu X hacia la del jefe (0.1) y mira hacia él:", answer: "posicion.x = lerp(posicion.x, jefe.x, 0.1); mirarA(jefe.posicion);" },
                        { type: "practica", question: "RONDA 2: Si el jefe choca contigo, resta 20 vida y aplica retroceso:", answer: "alEntrarEnColision(otro) { si(otro.tieneTag('Jefe')) { vida = vida - 20; fisica.applyImpulse(nuevo Vector2(-5,0)); } }" },
                        { type: "practica", question: "RONDA 3: Crea una 'bala' con dirección -20 si voltearH es verdadero:", answer: "b = crear(bala); v = voltearH ? -20 : 20; b.fisica.velocity.x = v;" },
                        { type: "practica", question: "RONDA 4: Alterna entre héroe 'Carl' y 'Robot' al presionar 'Tab':", answer: "si (teclaRecienPresionada('Tab')) { carl.estaActivado = !carl.estaActivado; robot.estaActivado = !robot.estaActivado; }" },
                        { type: "practica", question: "RONDA 5: Cada 3s crea un 'súbdito' y pon volumen música en 1.0:", answer: "cada(3) { crear(subdito); } fuenteDeAudio.volume = 1.0;" }
                    ]
                }
            ]
        },
        {
            id: 16,
            name: "Experto: Códigos 91-100",
            color: "#C70039",
            courses: [
                { id: 151, title: "C91: Coche Top-Down", steps: [{ type: "teoria", content: "Uso de APIs especializadas.", code: "vehiculo.acelerar();" }, { type: "practica", question: "Si pulsas 'w' acelera el coche:", answer: "si (teclaPresionada('w')) { controladorVehiculoTopDown.acelerar(); }" }] },
                { id: 152, title: "C92: Flotación Agua", steps: [{ type: "teoria", content: "Física de fluidos.", code: "gravityScale = 0.2;" }, { type: "practica", question: "Al entrar en trigger 'Agua', gravedad 0.3:", answer: "alEntrarEnTrigger(otro) { si (otro.tieneTag('Agua')) { fisica.gravityScale = 0.3; } }" }] },
                { id: 153, title: "C93: Menú Pausa", steps: [{ type: "teoria", content: "Control de flujo de UI.", code: "menu.active = !menu.active;" }, { type: "practica", question: "Si pulsas 'Escape', alterna 'panel':", answer: "si (teclaRecienPresionada('Escape')) { panel.estaActivado = !panel.estaActivado; }" }] },
                { id: 154, title: "C94: Raycast Avanzado", steps: [{ type: "teoria", content: "Detección direccional precisa.", code: "hit = lanzarRayo(pos, dir, 400);" }, { type: "practica", question: "Lanza rayo de 400px y si choca ataca:", answer: "h = lanzarRayo(posicion, direccion, 400); si (h != nulo) { atacar(); }" }] },
                { id: 155, title: "C95: Cinemática IK", steps: [{ type: "teoria", content: "Movimiento de huesos y brazos.", code: "gestorIK.target = obj.id;" }, { type: "practica", question: "Pon el target del IK en 'mano.id':", answer: "gestorIK2D.target = mano.id;" }] },
                { id: 156, title: "C96: Vuelo Helicóptero", steps: [{ type: "teoria", content: "Física de sustentación.", code: "heli.potencia += 10;" }, { type: "practica", question: "Suma 10 a potenciaMotor si pulsas 'w':", answer: "si (teclaPresionada('w')) { controladorDeHelicoptero.potenciaMotor += 10; }" }] },
                { id: 157, title: "C97: HP Jefe Dinámico", steps: [{ type: "teoria", content: "Vinculación de datos a barras UI.", code: "uiBar.val = boss.hp;" }, { type: "practica", question: "Actualiza 'uiBarra' con la vida del jefe:", answer: "uiBarra.valor = jefe.vida;" }] },
                { id: 158, title: "C98: Optimización FPS", steps: [{ type: "teoria", content: "Control de rendimiento.", code: "alBajoRendimiento(nivel) { ... }" }, { type: "practica", question: "Si nivel >= 2 desactiva 'particulas':", answer: "alBajoRendimiento(nivel) { si (nivel >= 2) { particulas.estaActivado = falso; } }" }] },
                { id: 159, title: "C99: Tienda Oro", steps: [{ type: "teoria", content: "Sistemas económicos.", code: "if(oro >= price) { oro -= price; buy(); }" }, { type: "practica", question: "Si oro >= 100, resta 100 y crea 'item':", answer: "si (oro >= 100) { oro = oro - 100; crear(item); }" }] },
                {
                    id: 160,
                    title: "¡JEFE FINAL: El Maestro del Libro!",
                    isBoss: true,
                    steps: [
                        { type: "practica", question: "RONDA 1: Conecta al motor, saluda y prepara tu escudo (booleano):", answer: "ve motor; alEmpezar() { imprimir('LISTO'); escudo = verdadero; }" },
                        { type: "practica", question: "RONDA 2: El jefe dispara 'rayos' cada 0.8 segundos. ¡Refleja!", answer: "cada(0.8) { reflejar(); }" },
                        { type: "practica", question: "RONDA 3: Si la distancia es < 100, aplica un impulso de escape de 20:", answer: "si (distancia(posicion, jefe.posicion) < 100) { fisica.applyImpulse(nuevo Vector2(-20, 0)); }" },
                        { type: "practica", question: "RONDA 4: Cuando el jefe baje de 50 vida, suena 'fase2' y pon luz roja:", answer: "si (vida < 50) { fuenteDeAudio.play(fase2); establecerLuzAmbiental('#FF0000'); }" },
                        { type: "practica", question: "RONDA 5: Ataca al jefe en cada frame si 'teclaPresionada' es 'z':", answer: "alActualizar(delta) { si (teclaPresionada('z')) { atacar(); } }" },
                        { type: "practica", question: "RONDA 6: Genera una explosión de 50 partículas al ganar:", answer: "para (i=0; i<50; i=i+1) { crear(particula); }" },
                        { type: "practica", question: "RONDA FINAL: Difundir 'LIBRO_COMPLETADO', esperar 5s y cargar 'Graduacion':", answer: "difundir('LIBRO_COMPLETADO'); esperar(5); cargarEscena('Graduacion');" }
                    ]
                }
            ]
        },
        {
            id: 17,
            name: "EXAMEN DE CERTIFICACIÓN",
            color: "gold",
            courses: [
                {
                    id: 161,
                    title: "Teoría Final",
                    steps: [
                        { type: "opcion-multiple", question: "¿Qué línea es obligatoria al inicio?", options: [{ text: "start;", correct: false }, { text: "ve motor;", correct: true }, { text: "motor on;", correct: false }] },
                        { type: "opcion-multiple", question: "¿Para qué sirve 'lerp'?", options: [{ text: "Para borrar objetos", correct: false }, { text: "Para suavizar movimientos", correct: true }, { text: "Para crear sonidos", correct: false }] },
                        { type: "opcion-multiple", question: "¿Qué evento detecta un sensor invisible?", options: [{ text: "alEntrarEnColision", correct: false }, { text: "alEntrarEnTrigger", correct: true }, { text: "alHacerClick", correct: false }] }
                    ]
                },
                {
                    id: 162,
                    title: "Práctica Experta",
                    steps: [
                        { type: "practica", question: "Escribe un bucle que cree 10 'balas':", answer: "para (variable i = 0; i < 10; i = i + 1) { crear(balas); }" },
                        { type: "practica", question: "Interpola X a 0 con suavidad 0.1:", answer: "posicion.x = lerp(posicion.x, 0, 0.1);" }
                    ]
                },
                {
                    id: 163,
                    title: "Desafío de Depuración",
                    steps: [
                        { type: "modo-debug", question: "Encuentra el error en el spawner:", codeLines: ["cada(1) {", "  crear_enemigo();", "}"], errorLine: 1, explanation: "El comando correcto es 'crear'.", solution: "  crear(enemigo);" },
                        { type: "completar-codigo", question: "Difunde la señal de fin:", codeTemplate: "[BLOQUE]('GAMEOVER');", blocks: ["difundir", "imprimir", "buscar"], answer: "difundir" }
                    ]
                },
                {
                    id: 164,
                    title: "Gran Reto Final: Arquitectura",
                    steps: [
                        { type: "practica", question: "Escribe un script completo que:\n1. Conecte al motor\n2. Cree una variable pública 'salud'\n3. Al nacer, imprima 'Iniciando sistema'", answer: "ve motor; publico numero salud = 100; alEmpezar() { imprimir('Iniciando sistema'); }" },
                        { type: "practica", question: "Escribe la lógica para que el objeto siga al mouse en X e Y usando lerp (suavizado 0.1):", answer: "alActualizar(delta) { m = obtenerPosicionMouse(); posicion.x = lerp(posicion.x, m.x, 0.1); posicion.y = lerp(posicion.y, m.y, 0.1); }" }
                    ]
                }
            ]
        }
    ]
};
