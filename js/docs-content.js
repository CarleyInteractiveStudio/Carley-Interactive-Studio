window.docsTranslations = {
    es: {
        "ce-docs-nav-cap0": "Cap 0: Primer Script",
        "ce-docs-nav-cap1": "Cap 1: Filosofía",
        "ce-docs-nav-cap2": "Cap 2: Anatomía",
        "ce-docs-nav-cap3": "Cap 3: Variables",
        "ce-docs-nav-cap4": "Cap 4: Ciclo de Vida",
        "ce-docs-nav-cap5": "Cap 5: Input y Físicas",
        "ce-docs-nav-cap6": "Cap 6: Diccionario API",
        "ce-docs-nav-cap7": "Cap 7: Mensajería",
        "ce-docs-nav-cap8": "Cap 8: Corrutinas",
        "ce-docs-nav-cap9": "Cap 9: Cookbook",
        "ce-docs-nav-cap10": "Cap 10: Optimización",
        "ce-docs-nav-cap11": "Cap 11: FAQ",

        "ce-docs-scripting-cap0-title": "Capítulo 0: Tu Primer Script en 60 Segundos",
        "ce-docs-scripting-cap0-desc": "¿Quieres ver resultados ya? Sigue estos pasos:\n1. En el Navegador de Assets, haz clic derecho y selecciona Nuevo > Script (CES). Ponle de nombre HolaMundo.ces.\n2. Haz doble clic para abrirlo y pega el código de abajo.\n3. Arrastra ese archivo desde la biblioteca hacia cualquier objeto en tu escena.\n4. ¡Dale a Play!",
        "ce-docs-scripting-cap0-code": "ve motor;\n\nalEmpezar() {\n    imprimir(\"¡El motor está vivo!\");\n}\n\nalActualizar(delta) {\n    rotacion += 100 * delta; // ¡Hará que el objeto gire!\n}",

        "ce-docs-scripting-cap1-title": "Capítulo 1: La Filosofía del Motor",
        "ce-docs-scripting-cap1-content": "Creative Engine nació bajo una premisa: El código debe ser legible para humanos y potente para máquinas. Hemos eliminado la necesidad de usar this., mtr. o prefijos redundantes. Si un objeto tiene vida, simplemente escribe 'vida'. Si quieres moverlo, escribe 'posicion'. La meta es que tu código parezca una descripción de lo que quieres que pase.",

        "ce-docs-scripting-cap2-title": "Capítulo 2: Anatomía de un Script",
        "ce-docs-scripting-cap2-content": "Todo script en Creative Engine comienza con una declaración de intención: 've motor;'. Esta línea no es opcional; es el puente que conecta tu archivo de texto con el corazón del motor. A partir de aquí, tu script se convierte en una 'Ley' que rige el comportamiento de una 'Materia' (objeto).",

        "ce-docs-scripting-cap3-title": "Capítulo 3: Variables y el Inspector Dinámico",
        "ce-docs-scripting-cap3-content": "El poder de Creative Engine reside en su Inspector. Al declarar variables como 'publico', estas aparecen mágicamente en la interfaz del editor, permitiéndote ajustar el juego mientras corre.",
        "ce-docs-scripting-cap3-types": "Tipos Soportados:\n- numero: Velocidades, fuerzas, salud.\n- texto: Nombres, diálogos o IDs.\n- booleano: verdadero o falso.\n- Materia: Referencia otros objetos.\n- Prefab: Crea objetos nuevos (balas, enemigos).\n- Audio / Sprite / Scene: Recursos del proyecto.",
        "ce-docs-scripting-cap3-code": "publico numero fuerzaSalto = 12;\npublico booleano puedeVolar = falso;\npublico Materia camaraObjetivo;",

        "ce-docs-scripting-cap4-title": "Capítulo 4: El Ritmo del Juego (Ciclo de Vida)",
        "ce-docs-scripting-cap4-events": "1. alEmpezar(): Configuración inicial. Una sola vez.\n2. alActualizar(delta): 60 veces por segundo. Lógica constante.\n3. actualizarFijo(delta): Para cálculos físicos constantes.\n4. alHacerClick(): Respuesta al toque del jugador.",

        "ce-docs-scripting-cap5-title": "Capítulo 5: Interacción Total (Input y Físicas)",
        "ce-docs-scripting-cap5-code": "alActualizar(delta) {\n    // Teclado\n    si (teclaPresionada(\"w\")) {\n        fisica.applyForce(0, -100);\n    }\n    // Mouse\n    si (botonMouseRecienPresionado(0)) {\n        variable pos = obtenerPosicionMouse();\n        imprimir(\"Clic en: \" + pos.x + \",\" + pos.y);\n    }\n}",

        "ce-docs-scripting-cap6-title": "Capítulo 6: El Diccionario de Componentes (Referencia API)",
        "ce-docs-scripting-cap6-content": "Accesos directos comunes:\n- posicion (Transform): Controla x, y, rotacion y escala.\n- fisica (Rigidbody2D): Newton. Usa applyImpulse y velocity.\n- vida (Health): damage(10) o heal(5).\n- animacion (Animator): play(\"Correr\").\n- audio (AudioSource): play() o stop().",

        "ce-docs-scripting-cap7-title": "Capítulo 7: Comunicación entre Objetos (Mensajería)",
        "ce-docs-scripting-cap7-emisor": "Emisor:\ndifundir(\"NivelCompletado\", { tiempo: 45 });",
        "ce-docs-scripting-cap7-receptor": "Receptor:\nalRecibir(\"NivelCompletado\", (datos) => {\n    imprimir(\"¡Logrado en \" + datos.tiempo + \" s!\");\n});",

        "ce-docs-scripting-cap8-title": "Capítulo 8: Magia Temporal (Corrutinas y Bucles)",
        "ce-docs-scripting-cap8-code1": "async alEmpezar() {\n    imprimir(\"3...\");\n    esperar(1);\n    imprimir(\"¡FUEGO!\");\n}",
        "ce-docs-scripting-cap8-code2": "alEmpezar() {\n    cada(5) {\n        crear monedaPrefab;\n    }\n}",

        "ce-docs-scripting-cap9-title": "Capítulo 9: El Recetario de Soluciones (Cookbook)",
        "ce-docs-scripting-cap9-mov": "Movimiento Pro:\nve motor;\npublico numero velocidad = 300;\npublico numero fuerzaSalto = 15;\n\nalActualizar(delta) {\n    variable horizontal = 0;\n    si (teclaPresionada(\"d\")) horizontal = 1;\n    si (teclaPresionada(\"a\")) horizontal = -1;\n    fisica.velocity.x = horizontal * (velocidad * delta);\n    si (horizontal != 0) {\n        voltearH = (horizontal < 0);\n        reproducir.Caminar();\n    } sino { reproducir.Idle(); }\n    si (teclaRecienPresionada(\"Space\") y estaTocandoTag(\"Suelo\")) {\n        fisica.applyImpulse(nuevo Vector2(0, -fuerzaSalto));\n    }\n}",

        "ce-docs-scripting-cap10-title": "Capítulo 10: Optimización y Mejores Prácticas",
        "ce-docs-scripting-cap10-tips": "1. Usa delta: Asegura velocidad constante en cualquier PC.\n2. Evita buscar() en alActualizar: Hazlo en alEmpezar.\n3. Pooling: Reutiliza balas en lugar de crear/destruir.\n4. Capas de Colisión: Optimiza choques en ajustes.",

        "ce-docs-scripting-cap11-title": "Capítulo 11: Solución de Problemas y FAQ",
        "ce-docs-scripting-cap11-content": "P: ¿Puedo usar JS normal?\nR: ¡Sí! CES es una capa sobre JS (Math.random(), etc).\nP: ¿Cómo destruyo el objeto?\nR: destruir(mtr); o destruir(materia);",

        "ce-docs-nav-vehicles": "Vehículos",
        "ce-docs-vehicles-title": "Vehículos y Controladores Avanzados",
        "ce-docs-helicopter-name": "HelicopterController (Helicóptero)",
        "ce-docs-helicopter-desc": "Simulación de vuelo lateral para helicópteros.",
        "ce-docs-helicopter-code": "controladorDeHelicoptero.potencia = 2500;\ncontroladorDeHelicoptero.vDespegue = 1200;",
        "ce-docs-plane-name": "PlaneController (Avión)",
        "ce-docs-plane-desc": "Física de sustentación aerodinámica y vuelo lateral.",
        "ce-docs-topdown-name": "VehicleTopDown (Vehículo Cenital)",
        "ce-docs-topdown-desc": "Control arcade para coches en vista desde arriba (Drift, Potencia).",

        "ce-docs-nav-anim-adv": "Animación Pro",
        "ce-docs-anim-adv-title": "Animación, Esqueleto e Iluminación",
        "ce-docs-skeleton-name": "SkeletonRenderer e IK",
        "ce-docs-skeleton-desc": "SkeletonRenderer: Mallas deformadas por huesos. IKManager2D: Cinemática inversa para que manos/pies sigan objetivos.",
        "ce-docs-light-name": "Iluminación 2D (Lights)",
        "ce-docs-light-desc": "PointLight2D (Puntual), SpotLight2D (Focal) y SpriteLight2D (Forma personalizada).",

        "ce-docs-carl-deep-title": "Modo de Planeación Profunda",
        "ce-docs-carl-deep-desc": "Carl analiza tareas complejas: Pregunta para aclarar metas, genera un [PLAN] estructurado y muestra el progreso en la pestaña Actividad.",
        "ce-docs-carl-autonomy-title": "Comandos Autónomos",
        "ce-docs-carl-autonomy-list": "- create_materia: Crea objetos.\n- add_component: Añade Leyes.\n- set_property: Modifica el Inspector.\n- download_file: Importa activos de internet.",
        "ce-docs-carl-chc-title": "CHC (Code Helper)",
        "ce-docs-carl-chc-desc": "Escribe en lenguaje humano y Carl lo traduce a código .ces válido al instante.",

        "ce-docs-libs-cap1-title": "Capítulo 1: El Poder de la Extensibilidad",
        "ce-docs-libs-cap1-content": "¿Por qué usar librerías?\n- Automatización: Crea botones que generen niveles.\n- APIs Propias: Añade funciones que se sientan nativas en CES.\n- Personalización: Cambia el flujo de trabajo del editor.",
        "ce-docs-libs-cap4-title": "Capítulo 4: Referencia API UI",
        "ce-docs-libs-cap4-content": "Elementos que puedes crear en tus paneles:\n- texto(contenido, opciones)\n- boton(etiqueta, callback)\n- input(etiqueta, callback)\n- slider(etiqueta, opciones, callback)\n- fila/columna: Para organizar la interfaz.",
        "ce-docs-libs-cap5-title": "Capítulo 5: Extensiones de Runtime",
        "ce-docs-libs-cap5-content": "Añade funciones que tus scripts .ces pueden usar mediante CreativeEngine.API.registrarRuntimeAPI.",
        "ce-docs-libs-cap8-title": "Capítulo 8: Instalación",
        "ce-docs-libs-cap8-content": "1. Arrastra el archivo .js o .celib al panel de Assets.\n2. El motor lo moverá a /lib.\n3. Actívala desde el menú Librerías.",

        "ce-docs-terminal-files-title": "Gestión de Archivos",
        "ce-docs-terminal-files-list": "- ls: Lista el contenido.\n- cd: Cambia de directorio.\n- mkdir: Crea una carpeta.\n- cat: Muestra contenido de archivos.",
        "ce-docs-terminal-inspect-title": "Inspección de Objetos",
        "ce-docs-terminal-inspect-list": "- find [nombre]: Busca por nombre y devuelve ID.\n- inspect [id]: Muestra propiedades JSON.\n- log [msj]: Imprime en consola.",
        "ce-docs-terminal-control-title": "Control de Juego",
        "ce-docs-terminal-control-list": "- play/stop/pause: Controla la ejecución.\n- scene [ruta]: Carga una escena inmediata."
    },
    en: {
        "ce-docs-nav-cap0": "Cap 0: First Script",
        "ce-docs-nav-cap1": "Cap 1: Philosophy",
        "ce-docs-nav-cap2": "Cap 2: Anatomy",
        "ce-docs-nav-cap3": "Cap 3: Variables",
        "ce-docs-nav-cap4": "Cap 4: Lifecycle",
        "ce-docs-nav-cap5": "Cap 5: Input & Physics",
        "ce-docs-nav-cap6": "Cap 6: API Dictionary",
        "ce-docs-nav-cap7": "Cap 7: Messaging",
        "ce-docs-nav-cap8": "Cap 8: Coroutines",
        "ce-docs-nav-cap9": "Cap 9: Cookbook",
        "ce-docs-nav-cap10": "Cap 10: Optimization",
        "ce-docs-nav-cap11": "Cap 11: FAQ",

        "ce-docs-scripting-cap0-title": "Chapter 0: Your First Script in 60 Seconds",
        "ce-docs-scripting-cap0-desc": "Want to see results now? Follow these steps:\n1. In the Asset Browser, right-click and select New > Script (CES). Name it HelloWorld.ces.\n2. Double-click to open and paste the code below.\n3. Drag that file from the library onto any object in your scene.\n4. Hit Play!",
        "ce-docs-scripting-cap0-code": "ve motor;\n\nonStart() {\n    print(\"The engine is alive!\");\n}\n\nonUpdate(delta) {\n    rotation += 100 * delta; // This will make the object spin!\n}",

        "ce-docs-scripting-cap1-title": "Chapter 1: The Engine's Philosophy",
        "ce-docs-scripting-cap1-content": "Creative Engine was born under one premise: Code must be human-readable and machine-powerful. We've removed the need for this., mtr. or redundant prefixes. If an object has health, simply write 'health'. If you want to move it, write 'position'. The goal is for your code to look like a description of what you want to happen.",

        "ce-docs-scripting-cap2-title": "Chapter 2: Anatomy of a Script",
        "ce-docs-scripting-cap2-content": "Every script in Creative Engine begins with a declaration of intent: 've motor;'. This line is not optional; it is the bridge that connects your text file to the heart of the engine. From here, your script becomes a 'Law' that governs the behavior of a 'Materia' (object).",

        "ce-docs-scripting-cap3-title": "Chapter 3: Variables and the Dynamic Inspector",
        "ce-docs-scripting-cap3-content": "The power of Creative Engine lies in its Inspector. By declaring variables as 'publico' (public), they magically appear in the editor interface, allowing you to adjust the game while it's running.",
        "ce-docs-scripting-cap3-types": "Supported Types:\n- number: Speeds, forces, health.\n- text: Names, dialogues or IDs.\n- boolean: true or false.\n- Materia: Reference other objects.\n- Prefab: Create new objects (bullets, enemies).\n- Audio / Sprite / Scene: Project resources.",
        "ce-docs-scripting-cap3-code": "publico number jumpForce = 12;\npublico boolean canFly = false;\npublico Materia targetCamera;",

        "ce-docs-scripting-cap4-title": "Chapter 4: The Game's Rhythm (Lifecycle)",
        "ce-docs-scripting-cap4-events": "1. onStart(): Initial config. Runs once.\n2. onUpdate(delta): 60 times per second. Constant logic.\n3. fixedUpdate(delta): For constant physical calculations.\n4. onClick(): Response to player touch.",

        "ce-docs-scripting-cap5-title": "Chapter 5: Total Interaction (Input and Physics)",
        "ce-docs-scripting-cap5-code": "onUpdate(delta) {\n    // Keyboard\n    if (isKeyPressed(\"w\")) {\n        physics.applyForce(0, -100);\n    }\n    // Mouse\n    if (isMouseButtonJustPressed(0)) {\n        variable pos = getMousePosition();\n        print(\"Click at: \" + pos.x + \",\" + pos.y);\n    }\n}",

        "ce-docs-scripting-cap6-title": "Chapter 6: The Component Dictionary (API Reference)",
        "ce-docs-scripting-cap6-content": "Common shortcuts:\n- position (Transform): Controls x, y, rotation and scale.\n- physics (Rigidbody2D): Newton. Use applyImpulse and velocity.\n- health (Health): damage(10) or heal(5).\n- animation (Animator): play(\"Run\").\n- audio (AudioSource): play() or stop().",

        "ce-docs-scripting-cap7-title": "Chapter 7: Object Communication (Messaging)",
        "ce-docs-scripting-cap7-emisor": "Emitter:\nbroadcast(\"LevelCompleted\", { time: 45 });",
        "ce-docs-scripting-cap7-receptor": "Receiver:\nonReceive(\"LevelCompleted\", (data) => {\n    print(\"Achieved in \" + data.time + \" s!\");\n});",

        "ce-docs-scripting-cap8-title": "Chapter 8: Temporal Magic (Coroutines and Loops)",
        "ce-docs-scripting-cap8-code1": "async onStart() {\n    print(\"3...\");\n    wait(1);\n    print(\"FIRE!\");\n}",
        "ce-docs-scripting-cap8-code2": "onStart() {\n    every(5) {\n        create coinPrefab;\n    }\n}",

        "ce-docs-scripting-cap9-title": "Chapter 9: The Cookbook (Solutions Recipe Book)",
        "ce-docs-scripting-cap9-mov": "Pro Movement:\nve motor;\npublico number speed = 300;\npublico number jumpForce = 15;\n\nonUpdate(delta) {\n    variable horizontal = 0;\n    if (isKeyPressed(\"d\")) horizontal = 1;\n    if (isKeyPressed(\"a\")) horizontal = -1;\n    physics.velocity.x = horizontal * (speed * delta);\n    if (horizontal != 0) {\n        flipH = (horizontal < 0);\n        play.Walk();\n    } else { play.Idle(); }\n    if (isKeyJustPressed(\"Space\") && isTouchingTag(\"Floor\")) {\n        physics.applyImpulse(new Vector2(0, -jumpForce));\n    }\n}",

        "ce-docs-scripting-cap10-title": "Chapter 10: Optimization and Best Practices",
        "ce-docs-scripting-cap10-tips": "1. Use delta: Ensures constant speed on any PC.\n2. Avoid find() in update: Do it in start.\n3. Pooling: Reuse bullets instead of create/destroy.\n4. Collision Layers: Optimize crashes in settings.",

        "ce-docs-scripting-cap11-title": "Chapter 11: Troubleshooting and FAQ",
        "ce-docs-scripting-cap11-content": "Q: Can I use normal JS?\nA: Yes! CES is a layer over JS (Math.random(), etc).\nQ: How do I destroy the object?\nA: destroy(mtr); or destroy(materia);",

        "ce-docs-nav-vehicles": "Vehicles",
        "ce-docs-vehicles-title": "Vehicles and Advanced Controllers",
        "ce-docs-helicopter-name": "HelicopterController",
        "ce-docs-helicopter-desc": "Side-scrolling flight simulation for helicopters.",
        "ce-docs-helicopter-code": "helicopterController.power = 2500;\nhelicopterController.vDespegue = 1200;",
        "ce-docs-plane-name": "PlaneController",
        "ce-docs-plane-desc": "Aerodynamic lift physics and side-scrolling flight.",
        "ce-docs-topdown-name": "VehicleTopDown",
        "ce-docs-topdown-desc": "Arcade control for cars in top-down view (Drift, Power).",

        "ce-docs-nav-anim-adv": "Pro Animation",
        "ce-docs-anim-adv-title": "Animation, Skeleton, and Lighting",
        "ce-docs-skeleton-name": "SkeletonRenderer and IK",
        "ce-docs-skeleton-desc": "SkeletonRenderer: Meshes deformed by bones. IKManager2D: Inverse kinematics for hands/feet to follow targets.",
        "ce-docs-light-name": "2D Lighting (Lights)",
        "ce-docs-light-desc": "PointLight2D, SpotLight2D, and SpriteLight2D (Custom shape).",

        "ce-docs-carl-deep-title": "Deep Planning Mode",
        "ce-docs-carl-deep-desc": "Carl analyzes complex tasks: Asks clarifying questions, generates a structured [PLAN], and shows progress in the Activity tab.",
        "ce-docs-carl-autonomy-title": "Autonomous Commands",
        "ce-docs-carl-autonomy-list": "- create_materia: Create objects.\n- add_component: Add Laws.\n- set_property: Modify Inspector.\n- download_file: Import internet assets.",
        "ce-docs-carl-chc-title": "CHC (Code Helper)",
        "ce-docs-carl-chc-desc": "Write in human language and Carl translates it to valid .ces code instantly.",

        "ce-docs-libs-cap1-title": "Chapter 1: The Power of Extensibility",
        "ce-docs-libs-cap1-content": "Why use libraries?\n- Automation: Create buttons that generate entire levels.\n- Custom APIs: Add functions that feel native in CES.\n- Customization: Change the editor workflow.",
        "ce-docs-libs-cap4-title": "Chapter 4: UI Generator API Reference",
        "ce-docs-libs-cap4-content": "Elements you can create in your panels:\n- text(content, options)\n- button(label, callback)\n- input(label, callback)\n- slider(label, options, callback)\n- row/column: To organize the interface.",
        "ce-docs-libs-cap5-title": "Chapter 5: Runtime Extensions",
        "ce-docs-libs-cap5-content": "Add functions that your .ces scripts can use via CreativeEngine.API.registerRuntimeAPI.",
        "ce-docs-libs-cap8-title": "Chapter 8: Installation",
        "ce-docs-libs-cap8-content": "1. Drag the .js or .celib file to the Assets panel.\n2. The engine will move it to /lib.\n3. Activate it from the Libraries menu.",

        "ce-docs-terminal-files-title": "File Management",
        "ce-docs-terminal-files-list": "- ls: List content.\n- cd: Change directory.\n- mkdir: Create a folder.\n- cat: Show file content.",
        "ce-docs-terminal-inspect-title": "Object Inspection",
        "ce-docs-terminal-inspect-list": "- find [name]: Search by name and return ID.\n- inspect [id]: Show JSON properties.\n- log [msg]: Print to console.",
        "ce-docs-terminal-control-title": "Game Control",
        "ce-docs-terminal-control-list": "- play/stop/pause: Control execution.\n- scene [path]: Load a scene immediately."
    },
    pt: {
        "ce-docs-nav-cap0": "Cap 0: Primeiro Script",
        "ce-docs-nav-cap1": "Cap 1: Filosofia",
        "ce-docs-nav-cap2": "Cap 2: Anatomia",
        "ce-docs-nav-cap3": "Cap 3: Variáveis",
        "ce-docs-nav-cap4": "Cap 4: Ciclo de Vida",
        "ce-docs-nav-cap5": "Cap 5: Input e Físicas",
        "ce-docs-nav-cap6": "Cap 6: Dicionário API",
        "ce-docs-nav-cap7": "Cap 7: Mensagens",
        "ce-docs-nav-cap8": "Cap 8: Corrotinas",
        "ce-docs-nav-cap9": "Cap 9: Cookbook",
        "ce-docs-nav-cap10": "Cap 10: Otimização",
        "ce-docs-nav-cap11": "Cap 11: FAQ",

        "ce-docs-scripting-cap0-title": "Capítulo 0: Seu Primeiro Script em 60 Segundos",
        "ce-docs-scripting-cap0-desc": "Quer ver resultados agora? Siga estes passos:\n1. No Navegador de Assets, clique com o botão direito e selecione Novo > Script (CES). Nomeie como OlaMundo.ces.\n2. Clique duas vezes para abrir e cole o código abaixo.\n3. Arraste esse arquivo da biblioteca para qualquer objeto na sua cena.\n4. Clique em Play!",
        "ce-docs-scripting-cap0-code": "ve motor;\n\nalEmpezar() {\n    imprimir(\"O motor está vivo!\");\n}\n\nalActualizar(delta) {\n    rotacao += 100 * delta; // Fará o objeto girar!\n}",

        "ce-docs-scripting-cap1-title": "Capítulo 1: A Filosofia do Motor",
        "ce-docs-scripting-cap1-content": "O Creative Engine nasceu sob uma premissa: O código deve ser legível para humanos e potente para máquinas. Eliminamos a necessidade de usar this., mtr. ou prefixos redundantes. Se um objeto tem vida, basta escrever 'vida'. Se quiser movê-lo, escreva 'posicao'. A meta é que o seu código pareça uma descrição do que você quer que aconteça.",

        "ce-docs-scripting-cap2-title": "Capítulo 2: Anatomia de um Script",
        "ce-docs-scripting-cap2-content": "Todo script no Creative Engine começa com uma declaração de intenção: 've motor;'. Esta linha não é opcional; é a ponte que conecta o seu arquivo de texto ao coração do motor.",

        "ce-docs-scripting-cap3-title": "Capítulo 3: Variáveis e o Inspetor Dinâmico",
        "ce-docs-scripting-cap3-content": "O poder do Creative Engine reside no seu Inspetor. Ao declarar variáveis como 'publico', elas aparecem magicamente na interface do editor.",
        "ce-docs-scripting-cap3-types": "Tipos Suportados:\n- numero: Velocidades, forças, saúde.\n- texto: Nomes, diálogos.\n- booleano: verdadeiro ou falso.\n- Materia: Referência outros objetos.\n- Prefab: Cria objetos novos.\n- Audio / Sprite / Scene: Recursos.",
        "ce-docs-scripting-cap3-code": "publico numero forçaSalto = 12;\npublico booleano podeVoar = falso;\npublico Materia camaraObjetivo;",

        "ce-docs-scripting-cap4-title": "Capítulo 4: O Ritmo do Jogo (Ciclo de Vida)",
        "ce-docs-scripting-cap4-events": "1. alEmpezar(): Configuração inicial.\n2. alActualizar(delta): 60 vezes por segundo.\n3. actualizarFijo(delta): Cálculos físicos.\n4. alHacerClick(): Toque do jogador.",

        "ce-docs-scripting-cap5-title": "Capítulo 5: Interacción Total (Input e Físicas)",
        "ce-docs-scripting-cap5-code": "alActualizar(delta) {\n    // Teclado\n    se (teclaPresionada(\"w\")) {\n        fisica.applyForce(0, -100);\n    }\n    // Mouse\n    se (botonMouseRecienPresionado(0)) {\n        variavel pos = obterPosicionMouse();\n        imprimir(\"Clique em: \" + pos.x + \",\" + pos.y);\n    }\n}",

        "ce-docs-scripting-cap6-title": "Capítulo 6: O Dicionário de Componentes (Referencia API)",
        "ce-docs-scripting-cap6-content": "Atalhos comuns:\n- posicion (Transform): x, y, rotacao, escala.\n- fisica (Rigidbody2D): Newton. applyImpulse e velocity.\n- saude (Health): damage(10) ou heal(5).\n- animador (Animator): play(\"Correr\").\n- audio (AudioSource): play() ou stop().",

        "ce-docs-scripting-cap7-title": "Capítulo 7: Comunicação entre Objetos (Mensagens)",
        "ce-docs-scripting-cap7-emisor": "Emissor:\ndifundir(\"NivelCompletado\", { tiempo: 45 });",
        "ce-docs-scripting-cap7-receptor": "Recetor:\nalRecibir(\"NivelCompletado\", (dados) => {\n    imprimir(\"Parabéns! \" + dados.tiempo + \" s!\");\n});",

        "ce-docs-scripting-cap8-title": "Capítulo 8: Magia Temporal (Corrotinas e Loops)",
        "ce-docs-scripting-cap8-code1": "async alEmpezar() {\n    imprimir(\"3...\");\n    aguardar(1);\n    imprimir(\"FOGO!\");\n}",
        "ce-docs-scripting-cap8-code2": "alEmpezar() {\n    cada(5) {\n        criar moedaPrefab;\n    }\n}",

        "ce-docs-scripting-cap9-title": "Capítulo 9: O Receituário de Soluções (Cookbook)",
        "ce-docs-scripting-cap9-mov": "Movimento Pro:\nve motor;\npublico numero velocidade = 300;\npublico numero forçaSalto = 15;\n\natualizar(delta) {\n    variavel horizontal = 0;\n    se (teclaPresionada(\"d\")) horizontal = 1;\n    se (teclaPresionada(\"a\")) horizontal = -1;\n    fisica.velocity.x = horizontal * (velocidade * delta);\n    se (horizontal != 0) {\n        inverterH = (horizontal < 0);\n        reproducir.Caminhar();\n    } senao { reproducir.Idle(); }\n    se (teclaRecienPresionada(\"Space\") e estaTocandoTag(\"Chão\")) {\n        fisica.applyImpulse(novo Vector2(0, -forçaSalto));\n    }\n}",

        "ce-docs-scripting-cap10-title": "Capítulo 10: Otimização e Melhores Práticas",
        "ce-docs-scripting-cap10-tips": "1. Use delta: Velocidade constante em qualquer PC.\n2. Evite buscar() em atualizar: Faça em começar.\n3. Pooling: Reutilize balas.\n4. Camadas de Colisão: Otimize choques.",

        "ce-docs-scripting-cap11-title": "Capítulo 11: Solução de Problemas e FAQ",
        "ce-docs-scripting-cap11-content": "P: Posso usar JS normal?\nR: Sim! O CES é uma camada sobre JS.\nP: Como destruo o objeto?\nR: destruir(mtr); ou destruir(materia);",

        "ce-docs-nav-vehicles": "Veículos",
        "ce-docs-vehicles-title": "Veículos e Controladores Avanzados",
        "ce-docs-helicopter-name": "HelicopterController (Helicóptero)",
        "ce-docs-helicopter-desc": "Simulação de voo lateral para helicópteros.",
        "ce-docs-helicopter-code": "controladorDeHelicoptero.potencia = 2500;\ncontroladorDeHelicoptero.vDespegue = 1200;",
        "ce-docs-plane-name": "PlaneController (Avião)",
        "ce-docs-plane-desc": "Física de sustentação aerodinâmica e voo lateral.",
        "ce-docs-topdown-name": "VehicleTopDown (Vehículo Cenital)",
        "ce-docs-topdown-desc": "Controle arcade para carros em vista superior.",

        "ce-docs-nav-anim-adv": "Animação Pro",
        "ce-docs-anim-adv-title": "Animação, Esqueleto e Iluminação",
        "ce-docs-skeleton-name": "SkeletonRenderer e IK",
        "ce-docs-skeleton-desc": "SkeletonRenderer: Malhas deformadas por ossos. IKManager2D: Cinemática inversa.",
        "ce-docs-light-name": "Iluminação 2D (Lights)",
        "ce-docs-light-desc": "PointLight2D, SpotLight2D e SpriteLight2D.",

        "ce-docs-carl-deep-title": "Modo de Planeamento Profundo",
        "ce-docs-carl-deep-desc": "Carl analisa tarefas complexas: gera um [PLAN] e mostra o progresso na aba Atividade.",
        "ce-docs-carl-autonomy-title": "Comandos Autónomos",
        "ce-docs-carl-autonomy-list": "- create_materia: Cria objetos.\n- add_component: Adiciona Leis.\n- set_property: Modifica Inspetor.\n- download_file: Importa ativos.",
        "ce-docs-carl-chc-title": "CHC (Code Helper)",
        "ce-docs-carl-chc-desc": "Escreva em linguagem humana e Carl traduz para código .ces instantaneamente.",

        "ce-docs-libs-cap1-title": "Capítulo 1: O Poder da Extensibilidade",
        "ce-docs-libs-cap1-content": "Por que usar livrarias?\n- Automatização: Crie botões que gerem níveis inteiros.\n- APIs Próprias: Adicione funções que pareçam nativas em CES.\n- Personalização: Altere o fluxo de trabalho do editor.",
        "ce-docs-libs-cap4-title": "Capítulo 4: Referência API UI",
        "ce-docs-libs-cap4-content": "Elementos que pode criar nos seus painéis:\n- texto(conteúdo, opções)\n- botao(etiqueta, callback)\n- input(etiqueta, callback)\n- slider(etiqueta, opções, callback)\n- fila/coluna: Para organizar a interface.",
        "ce-docs-libs-cap5-title": "Capítulo 5: Extensões de Runtime",
        "ce-docs-libs-cap5-content": "Adicione funções que os seus scripts .ces podem usar através de CreativeEngine.API.registrarRuntimeAPI.",
        "ce-docs-libs-cap8-title": "Capítulo 8: Instalação",
        "ce-docs-libs-cap8-content": "1. Arraste o arquivo .js ou .celib para o painel de Assets.\n2. O motor irá movê-lo para /lib.\n3. Ative-a a partir do menu Livrarias.",

        "ce-docs-terminal-files-title": "Gestão de Arquivos",
        "ce-docs-terminal-files-list": "- ls: Lista o conteúdo.\n- cd: Altera diretório.\n- mkdir: Cria uma pasta.\n- cat: Mostra conteúdo de arquivos.",
        "ce-docs-terminal-inspect-title": "Inspeção de Objetos",
        "ce-docs-terminal-inspect-list": "- find [nome]: Procura por nome e devolve ID.\n- inspect [id]: Mostra propriedades JSON.\n- log [msj]: Imprime na consola.",
        "ce-docs-terminal-control-title": "Controle de Jogo",
        "ce-docs-terminal-control-list": "- play/stop/pause: Controla a execução.\n- scene [caminho]: Carrega uma cena imediatamente."
    },
    ru: {
        "ce-docs-nav-cap0": "Гл 0: Первый скрипт",
        "ce-docs-nav-cap1": "Гл 1: Философия",
        "ce-docs-nav-cap2": "Гл 2: Анатомия",
        "ce-docs-nav-cap3": "Гл 3: Переменные",
        "ce-docs-nav-cap4": "Гл 4: Жизненный цикл",
        "ce-docs-nav-cap5": "Гл 5: Ввод и физика",
        "ce-docs-nav-cap6": "Гл 6: Словарь API",
        "ce-docs-nav-cap7": "Гл 7: Сообщения",
        "ce-docs-nav-cap8": "Гл 8: Корутины",
        "ce-docs-nav-cap9": "Гл 9: Рецепты",
        "ce-docs-nav-cap10": "Гл 10: Оптимизация",
        "ce-docs-nav-cap11": "Гл 11: FAQ",

        "ce-docs-scripting-cap0-title": "Глава 0: Твой первый скрипт за 60 секунд",
        "ce-docs-scripting-cap0-desc": "Хочешь результат? Следуй шагам:\n1. В Asset Browser: ПКМ > Новый > Скрипт (CES). Имя HelloWorld.ces.\n2. Вставь код ниже.\n3. Перетащи файл на любой объект.\n4. Нажми Play!",
        "ce-docs-scripting-cap0-code": "ve motor;\n\nalEmpezar() {\n    imprimir(\"Движок ожил!\");\n}\n\nalActualizar(delta) {\n    rotacion += 100 * delta; // Объект будет вращаться!\n}",

        "ce-docs-scripting-cap1-title": "Глава 1: Философия движка",
        "ce-docs-scripting-cap1-content": "Creative Engine: код должен быть читаемым для людей и мощным для машин. Мы убрали this., mtr. и префиксы. Хочешь двигать? Пиши 'posicion'. Цель: код как описание твоей идеи.",

        "ce-docs-scripting-cap2-title": "Глава 2: Анатомия скрипта",
        "ce-docs-scripting-cap2-content": "Каждый скрипт начинается с 've motor;'. Это мост к сердцу движка. Твой скрипт — это 'Закон' для 'Материи' (объекта).",

        "ce-docs-scripting-cap3-title": "Глава 3: Переменные и динамический инспектор",
        "ce-docs-scripting-cap3-content": "Сила в Инспекторе. Переменные 'publico' магически появляются в редакторе.",
        "ce-docs-scripting-cap3-types": "Типы:\n- number: Скорость, здоровье.\n- text: Имена, диалоги.\n- boolean: истина/ложь.\n- Materia: Ссылка на объекты.\n- Prefab: Создание новых объектов.\n- Audio/Sprite/Scene: Ресурсы.",
        "ce-docs-scripting-cap3-code": "publico число силаПрыжка = 12;\npublico булево можетЛетать = ложь;\npublico Материя целеваяКамера;",

        "ce-docs-scripting-cap4-title": "Глава 4: Ритм игры (Жизненный цикл)",
        "ce-docs-scripting-cap4-events": "1. alEmpezar(): Один раз при старте.\n2. alActualizar(delta): 60 раз в сек. Постоянная логика.\n3. actualizarFijo(delta): Физика.\n4. alHacerClick(): Клик игрока.",

        "ce-docs-scripting-cap5-title": "Глава 5: Полное взаимодействие (Ввод и физика)",
        "ce-docs-scripting-cap5-code": "обновить(delta) {\n    если (teclaPresionada(\"w\")) {\n        физика.applyForce(0, -100);\n    }\n    если (botonMouseRecienPresionado(0)) {\n        variable поз = obtenerPosicionMouse();\n        imprimir(\"Клик в: \" + поз.x + \",\" + поз.y);\n    }\n}",

        "ce-docs-scripting-cap6-title": "Глава 6: Словарь компонентов (Справочник API)",
        "ce-docs-scripting-cap6-content": "Ярлыки:\n- posicion (Transform): x, y, вращение.\n- физика (Rigidbody2D): Newton. applyImpulse и velocity.\n- zdorovye (Health): damage(10) или heal(5).\n- аниматор (Animator): play(\"Run\").\n- аудио (AudioSource): play() или stop().",

        "ce-docs-scripting-cap7-title": "Глава 7: Связь между объектами (Сообщения)",
        "ce-docs-scripting-cap7-emisor": "Отправитель:\nbroadcast(\"LevelCompleted\", { time: 45 });",
        "ce-docs-scripting-cap7-receptor": "Получатель:\nonReceive(\"LevelCompleted\", (данные) => {\n    imprimir(\"Пройдено за \" + данные.time + \" с!\");\n});",

        "ce-docs-scripting-cap8-title": "Глава 8: Магия времени (Корутины и циклы)",
        "ce-docs-scripting-cap8-code1": "async начать() {\n    imprimir(\"3...\");\n    ждать(1);\n    imprimir(\"ОГОНЬ!\");\n}",
        "ce-docs-scripting-cap8-code2": "начать() {\n    cada(5) {\n        create coinPrefab;\n    }\n}",

        "ce-docs-scripting-cap9-title": "Глава 9: Книга рецептов (Cookbook)",
        "ce-docs-scripting-cap9-mov": "Движение Про:\nve motor;\npublico число скорость = 300;\npublico число силаПрыжка = 15;\n\nобновить(delta) {\n    variable horizontal = 0;\n    если (teclaPresionada(\"d\")) horizontal = 1;\n    если (teclaPresionada(\"a\")) horizontal = -1;\n    физика.velocity.x = horizontal * (скорость * delta);\n    если (horizontal != 0) {\n        отразитьГ = (horizontal < 0);\n        воспроизвести.Walk();\n    } иначе { воспроизвести.Idle(); }\n    если (teclaRecienPresionada(\"Space\") и estaTocandoTag(\"Ground\")) {\n        физика.applyImpulse(новый Vector2(0, -силаПрыжка));\n    }\n}",

        "ce-docs-scripting-cap10-title": "Глава 10: Оптимизация и лучшие практики",
        "ce-docs-scripting-cap10-tips": "1. Используй delta: Одинаковая скорость на всех ПК.\n2. Избегай find() в обновить: Делай в начать.\n3. Пулинг: Используй повторно пули.\n4. Слои коллизий: Экономь ресурсы.",

        "ce-docs-scripting-cap11-title": "Глава 11: Решение проблем и FAQ",
        "ce-docs-scripting-cap11-content": "В: Можно JS?\nО: Да! CES — слой над JS.\nВ: Как удалить объект?\nО: destruir(mtr); или destruir(materia);",

        "ce-docs-nav-vehicles": "Транспорт",
        "ce-docs-vehicles-title": "Транспорт и контроллеры",
        "ce-docs-helicopter-name": "HelicopterController (Вертолет)",
        "ce-docs-helicopter-desc": "Полет вертолета (вид сбоку).",
        "ce-docs-helicopter-code": "controladorDeHelicoptero.potencia = 2500;\ncontroladorDeHelicoptero.vDespegue = 1200;",
        "ce-docs-plane-name": "PlaneController (Самолет)",
        "ce-docs-plane-desc": "Аэродинамика и полет самолета.",
        "ce-docs-topdown-name": "VehicleTopDown (Автомобиль)",
        "ce-docs-topdown-desc": "Аркадное управление авто (вид сверху, дрифт).",

        "ce-docs-nav-anim-adv": "Про-анимация",
        "ce-docs-anim-adv-title": "Анимация, Скелет и Свет",
        "ce-docs-skeleton-name": "SkeletonRenderer и IK",
        "ce-docs-skeleton-desc": "SkeletonRenderer: Деформация мешей костями. IKManager2D: Инверсная кинематика.",
        "ce-docs-light-name": "2D Освещение (Lights)",
        "ce-docs-light-desc": "PointLight2D, SpotLight2D и SpriteLight2D.",

        "ce-docs-carl-deep-title": "Глубокое планирование",
        "ce-docs-carl-deep-desc": "Карл анализирует задачи: задает вопросы, создает [ПЛАН] и показывает прогресс в 'Активности'.",
        "ce-docs-carl-autonomy-title": "Автономные команды",
        "ce-docs-carl-autonomy-list": "- create_materia: Создает объекты.\n- add_component: Добавляет Законы.\n- set_property: Меняет Инспектор.\n- download_file: Импорт из сети.",
        "ce-docs-carl-chc-title": "CHC (Code Helper)",
        "ce-docs-carl-chc-desc": "Пиши на человеческом языке — Карл переведет в .ces код.",

        "ce-docs-libs-cap1-title": "Глава 1: Сила расширяемости",
        "ce-docs-libs-cap1-content": "Зачем использовать библиотеки?\n- Автоматизация: Создавайте кнопки для генерации уровней.\n- Свои API: Добавляйте функции, которые ощущаются как родные в CES.\n- Кастомизация: Меняйте рабочий процесс редактора.",
        "ce-docs-libs-cap4-title": "Глава 4: Справочник API UI",
        "ce-docs-libs-cap4-content": "Элементы, которые можно создать в панелях:\n- texto(контент, опции)\n- boton(метка, callback)\n- input(метка, callback)\n- slider(метка, опции, callback)\n- fila/columna: Для организации интерфейса.",
        "ce-docs-libs-cap5-title": "Глава 5: Расширения Runtime",
        "ce-docs-libs-cap5-content": "Добавляйте функции для использования в .ces скриптах через CreativeEngine.API.registrarRuntimeAPI.",
        "ce-docs-libs-cap8-title": "Глава 8: Установка",
        "ce-docs-libs-cap8-content": "1. Перетащите .js или .celib файл в панель Assets.\n2. Движок переместит его в /lib.\n3. Активируйте в меню 'Библиотеки'.",

        "ce-docs-terminal-files-title": "Управление файлами",
        "ce-docs-terminal-files-list": "- ls: Список содержимого.\n- cd: Смена директории.\n- mkdir: Создать папку.\n- cat: Показать содержимое файла.",
        "ce-docs-terminal-inspect-title": "Инспекция объектов",
        "ce-docs-terminal-inspect-list": "- find [имя]: Поиск по имени, возвращает ID.\n- inspect [id]: Показать свойства JSON.\n- log [сообщение]: Печать в консоль.",
        "ce-docs-terminal-control-title": "Управление игрой",
        "ce-docs-terminal-control-list": "- play/stop/pause: Управление выполнением.\n- scene [путь]: Немедленная загрузка сцены."
    },
    zh: {
        "ce-docs-nav-cap0": "第 0 章：首个脚本",
        "ce-docs-nav-cap1": "第 1 章：引擎哲学",
        "ce-docs-nav-cap2": "第 2 章：脚本解剖",
        "ce-docs-nav-cap3": "第 3 章：变量",
        "ce-docs-nav-cap4": "第 4 章：生命周期",
        "ce-docs-nav-cap5": "第 5 章：输入与物理",
        "ce-docs-nav-cap6": "第 6 章：API 词典",
        "ce-docs-nav-cap7": "第 7 章：全局消息",
        "ce-docs-nav-cap8": "第 8 章：时间魔法",
        "ce-docs-nav-cap9": "第 9 章：解决方案食谱",
        "ce-docs-nav-cap10": "第 10 章：优化",
        "ce-docs-nav-cap11": "第 11 章：FAQ",

        "ce-docs-scripting-cap0-title": "第零章：60 秒完成你的第一个脚本",
        "ce-docs-scripting-cap0-desc": "想看效果？步骤如下：\n1. 资源浏览器：右键 > 新建 > 脚本 (CES)。命名 HelloWorld.ces。\n2. 粘贴下方代码。\n3. 拖到场景对象上。\n4. 点击播放！",
        "ce-docs-scripting-cap0-code": "ve motor;\n\nalEmpezar() {\n    imprimir(\"引擎已激活！\");\n}\n\nalActualizar(delta) {\n    旋转 += 100 * delta; // 对象将旋转！\n}",

        "ce-docs-scripting-cap1-title": "第一章：引擎哲学",
        "ce-docs-scripting-cap1-content": "Creative Engine：代码必须人类可读且机器强大。无需 this. 或前缀。想移动？写 'posicion'。目标：代码即描述。",

        "ce-docs-scripting-cap2-title": "第二章：脚本解剖",
        "ce-docs-scripting-cap2-content": "脚本以 've motor;' 开始。它是连接引擎核心的桥梁。脚本是对象的“法律”。",

        "ce-docs-scripting-cap3-title": "第三章：变量与动态检查器",
        "ce-docs-scripting-cap3-content": "检查器是核心。'publico' 变量会自动出现在编辑器界面。",
        "ce-docs-scripting-cap3-types": "支持类型：\n- number: 速度、生命值。\n- text: 名称、对话。\n- boolean: 真/假。\n- Materia: 引用对象。\n- Prefab: 创建新对象。\n- Audio/Sprite/Scene: 资源。",
        "ce-docs-scripting-cap3-code": "publico 数字 跳跃力 = 12;\npublico 布尔值 可以飞行 = 假;\npublico 物质 目标摄像机;",

        "ce-docs-scripting-cap4-title": "第四章：游戏节奏（生命周期）",
        "ce-docs-scripting-cap4-events": "1. 开始(): 运行一次。\n2. 更新(delta): 每秒 60 次。持续逻辑。\n3. actualizarFijo(delta): 物理计算。\n4. alHacerClick(): 玩家点击。",

        "ce-docs-scripting-cap5-title": "第五章：全方位交互（输入与物理）",
        "ce-docs-scripting-cap5-code": "更新(delta) {\n    如果 (teclaPresionada(\"w\")) {\n        物理.applyForce(0, -100);\n    }\n    如果 (botonMouseRecienPresionado(0)) {\n        变量 位置 = 获取鼠标位置();\n        打印(\"点击位置：\" + 位置.x + \",\" + 位置.y);\n    }\n}",

        "ce-docs-scripting-cap6-title": "第六章：组件词典 (API 参考)",
        "ce-docs-scripting-cap6-content": "常用捷径：\n- posicion (变换): x, y, 旋转, 缩放。\n- fisica (刚体): 跳跃 applyImpulse, 速度 velocity。\n- vida (生命值): damage(10) 或 heal(5)。\n- animacion (动画器): play(\"Run\")。\n- audio (音频源): play() 或 stop()。",

        "ce-docs-scripting-cap7-title": "第七章：对象通信（全局消息）",
        "ce-docs-scripting-cap7-emisor": "发送者：\nbroadcast(\"LevelCompleted\", { time: 45 });",
        "ce-docs-scripting-cap7-receptor": "接收者：\nonReceive(\"LevelCompleted\", (数据) => {\n    打印(\"完成耗时：\" + 数据.time + \" 秒！\");\n});",

        "ce-docs-scripting-cap8-title": "第八章：时间魔法（协程与循环）",
        "ce-docs-scripting-cap8-code1": "async 开始() {\n    打印(\"3...\");\n    等待(1);\n    打印(\"开火！\");\n}",
        "ce-docs-scripting-cap8-code2": "开始() {\n    cada(5) {\n        创建 金币预制件;\n    }\n}",

        "ce-docs-scripting-cap9-title": "第九章：解决方案食谱 (Cookbook)",
        "ce-docs-scripting-cap9-mov": "专业移动：\nve motor;\npublico 数字 速度 = 300;\npublico 数字 跳跃力 = 15;\n\n更新(delta) {\n    变量 水平 = 0;\n    如果 (teclaPresionada(\"d\")) 水平 = 1;\n    如果 (teclaPresionada(\"a\")) 水平 = -1;\n    物理.velocity.x = 水平 * (速度 * delta);\n    如果 (水平 != 0) {\n        水平翻转 = (水平 < 0);\n        播放.Walk();\n    } 否则 { 播放.Idle(); }\n    如果 (teclaRecienPresionada(\"Space\") && 正在触摸标签(\"Ground\")) {\n        物理.applyImpulse(新建 Vector2(0, -跳跃力));\n    }\n}",

        "ce-docs-scripting-cap10-title": "第十章：优化与最佳实践",
        "ce-docs-scripting-cap10-tips": "1. 使用 delta: 确保各 PC 速度一致。\n2. 避免在更新中使用搜索: 在开始中做。\n3. 对象池: 重用子弹。\n4. 碰撞层: 优化性能。",

        "ce-docs-scripting-cap11-title": "第十一章：故障排除与常见问题",
        "ce-docs-scripting-cap11-content": "问：可以用普通 JS 吗？\n答：可以！CES 是 JS 上的层。\n问：如何销毁对象？\n答：destruir(mtr); 或 destruir(materia);",

        "ce-docs-nav-vehicles": "载具",
        "ce-docs-vehicles-title": "载具与高级控制器",
        "ce-docs-helicopter-name": "HelicopterController (直升机)",
        "ce-docs-helicopter-desc": "横向飞行模拟。",
        "ce-docs-helicopter-code": "helicopterController.power = 2500;\nhelicopterController.vDespegue = 1200;",
        "ce-docs-plane-name": "PlaneController (飞机)",
        "ce-docs-plane-desc": "空气动力学升力物理。",
        "ce-docs-topdown-name": "VehicleTopDown (顶视载具)",
        "ce-docs-topdown-desc": "赛车控制 (漂移, 动力)。",

        "ce-docs-nav-anim-adv": "高级动画",
        "ce-docs-anim-adv-title": "动画、骨骼与光照",
        "ce-docs-skeleton-name": "SkeletonRenderer 与 IK",
        "ce-docs-skeleton-desc": "SkeletonRenderer: 骨骼变形。IKManager2D: 逆向动力学。",
        "ce-docs-light-name": "2D 光照 (Lights)",
        "ce-docs-light-desc": "点光源、聚光灯与自定义精灵光源。",

        "ce-docs-carl-deep-title": "深度规划模式",
        "ce-docs-carl-deep-desc": "Carl 分析复杂任务：提问、生成 [PLAN] 并在“活动”选项卡显示进度。",
        "ce-docs-carl-autonomy-title": "自主命令",
        "ce-docs-carl-autonomy-list": "- create_materia: 创建对象。\n- add_component: 添加法律。\n- set_property: 修改检查器。\n- download_file: 导入网络资产。",
        "ce-docs-carl-chc-title": "CHC (代码助手)",
        "ce-docs-carl-chc-desc": "输入人类语言，Carl 立即翻译为 .ces 代码。",

        "ce-docs-libs-cap1-title": "第一章：扩展的力量",
        "ce-docs-libs-cap1-content": "为什么要使用库？\n- 自动化：创建可生成整个关卡的按钮。\n- 自定义 API：添加在 CES 中感觉像原生一样的函数。\n- 个性化：更改编辑器工作流程。",
        "ce-docs-libs-cap4-title": "第四章：UI 生成器 API 参考",
        "ce-docs-libs-cap4-content": "您可以在面板中创建的元素：\n- texto(内容, 选项)\n- boton(标签, 回调)\n- input(标签, 回调)\n- slider(标签, 选项, 回调)\n- fila/columna：用于组织界面。",
        "ce-docs-libs-cap5-title": "第五章：运行时扩展",
        "ce-docs-libs-cap5-content": "通过 CreativeEngine.API.registrarRuntimeAPI 添加您的 .ces 脚本可以使用的函数。",
        "ce-docs-libs-cap8-title": "第八章：安装",
        "ce-docs-libs-cap8-content": "1. 将 .js 或 .celib 文件拖到资源 (Assets) 面板。\n2. 引擎会将其移动到 /lib。\n3. 从“库 (Libraries)”菜单激活它。",

        "ce-docs-terminal-files-title": "文件管理",
        "ce-docs-terminal-files-list": "- ls：列出内容。\n- cd：更改目录。\n- mkdir：创建文件夹。\n- cat：显示文件内容。",
        "ce-docs-terminal-inspect-title": "对象检查",
        "ce-docs-terminal-inspect-list": "- find [名称]：按名称搜索并返回 ID。\n- inspect [id]：显示 JSON 属性。\n- log [消息]：打印到控制台。",
        "ce-docs-terminal-control-title": "游戏控制",
        "ce-docs-terminal-control-list": "- play/stop/pause：控制执行。\n- scene [路径]：立即加载场景。"
    }
};
