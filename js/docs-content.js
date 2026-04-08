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
        "ce-docs-nav-cap11": "Cap 11: Bajo el Capó",

        "ce-nav-docs-masterbook": "Libro Maestro",
        "ce-docs-master-title": "Libro Maestro del Motor",
        "ce-docs-master-intro": "Bienvenido a la guía definitiva. Aquí aprenderás a dominar Creative Engine desde los cimientos hasta las técnicas más avanzadas. Estos 12 capítulos contienen todo el conocimiento necesario para crear mundos profesionales.",

        "ce-docs-master-cap1-title": "Capítulo 1: El Actor, el Guion y la Jerarquía",
        "ce-docs-master-cap1-content": "<b>¿Qué es una Materia?</b>\nUna Materia es el átomo de tu juego. Puede ser un jugador, una luz, o incluso un punto invisible en el espacio. Por sí sola, una Materia no hace nada; es simplemente un punto con posición (X, Y), rotación y escala.\n\n<b>El Sistema de Leyes (Componentes):</b>\nSi la Materia es el actor, la <b>Ley</b> es el guion. Las leyes son modulares y acumulables:\n• <b>SpriteRenderer:</b> Permite que la Materia sea visible.\n• <b>Rigidbody2D:</b> Le otorga masa y respuesta a la gravedad.\n• <b>Script:</b> Le da inteligencia personalizada.\n\n<b>Jerarquía (Padres e Hijos):</b>\nLas Materias pueden anidarse. Si mueves a un Padre, todos sus Hijos se mueven con él, manteniendo su posición relativa. Esto es vital para crear personajes con partes separadas (brazos, armas, mochilas).",

        "ce-docs-master-cap2-title": "Capítulo 2: El Catálogo Maestro de Materias",
        "ce-docs-master-cap2-content": "Creative Engine ofrece tipos predefinidos para acelerar tu flujo de trabajo:\n\n• <b>Materia Vacía:</b> Ideal como contenedores, puntos de spawn o cámaras.\n• <b>Materia Sprite:</b> Viene con un renderizador listo para recibir texturas.\n• <b>Materia Luz:</b> Emiten luz dinámica que genera sombras en tiempo real.\n• <b>Materia Audio:</b> Fuentes de sonido que pueden ser globales o espaciales (el volumen baja si te alejas).\n• <b>Materia UI:</b> Diseñadas para vivir en el Canva, perfectas para botones y barras de vida.\n• <b>Materia Tilemap:</b> Un lienzo optimizado para pintar niveles gigantes con miles de bloques sin que el rendimiento caiga.",

        "ce-docs-master-cap3-title": "Capítulo 3: El Universo de la Interfaz (UI)",
        "ce-docs-master-cap3-content": "La UI en Creative Engine es potente y flexible. Todo debe ser hijo de un <b>Canva</b>.\n\n<b>Modos de Visualización:</b>\n• <b>Screen Space:</b> La UI se pega al cristal de tu monitor (HUD, Inventario). No se mueve aunque la cámara sí.\n• <b>World Space:</b> La UI vive 'dentro' del mundo. Útil para diálogos que flotan sobre personajes o carteles indicadores.\n\n<b>Anclajes (Anchors):</b>\nSon el secreto de la UI responsiva. Definen cómo se estira un botón cuando cambias el tamaño de la ventana del navegador. Siempre ancla tu HUD a las esquinas y tu inventario al centro.",

        "ce-docs-master-cap4-title": "Capítulo 4: Físicas, Colisiones y Raycast",
        "ce-docs-master-cap4-content": "<b>Rigidbody 2D:</b>\n• <b>Dinámico:</b> Reacciona a todo (gravedad, golpes).\n• <b>Estático:</b> Inamovible (suelo, paredes).\n• <b>Cinemático:</b> Se mueve solo por código, ignorando la gravedad pero empujando a otros.\n\n<b>Triggers (Sensores):</b>\nSi activas 'Is Trigger' en un colisionador, este se vuelve 'fantasma'. No chocará físicamente, pero enviará una señal cuando algo lo atraviese. Perfecto para monedas, portales o áreas de veneno.\n\n<b>Raycasting:</b>\nEs lanzar un 'láser invisible' desde un punto. Si el láser toca algo, te devuelve qué tocó y a qué distancia. Útil para que los enemigos 'vean' al jugador o para detectar el suelo con precisión quirúrgica.",

        "ce-docs-master-cap5-title": "Capítulo 5: El Ritmo de la Vida (Ciclo de Vida)",
        "ce-docs-master-cap5-content": "Los scripts siguen un orden estricto de ejecución:\n\n1. <b>alEmpezar():</b> Se ejecuta una sola vez cuando la Materia nace. Aquí debes configurar variables e hijos.\n2. <b>alActualizar(delta):</b> Se ejecuta cada frame (60 veces por segundo). Aquí va el movimiento y la lógica del jugador.\n3. <b>actualizarFijo(delta):</b> Ideal para físicas. Se ejecuta a intervalos constantes, asegurando que tu personaje no atraviese paredes si los FPS bajan.\n4. <b>alHacerClick():</b> Evento directo cuando el usuario toca la Materia.",

        "ce-docs-master-cap6-title": "Capítulo 6: Animación y El Cerebro Visual",
        "ce-docs-master-cap6-content": "<b>AnimatorController:</b>\nEs una máquina de estados. Imagina un diagrama de flujo: Si el jugador corre, pasa del estado 'Quieto' a 'Correr'.\n\n<b>Smart Mode:</b>\nUna función exclusiva de Creative Engine. Si la activas, el motor detecta la velocidad de la Materia y cambia las animaciones automáticamente. ¡No tienes que escribir ni una línea de código para que tu personaje camine y salte!\n\n<b>Línea de Tiempo:</b>\nPuedes animar cualquier cosa: la opacidad de una imagen, el color de una luz o la escala de un objeto, creando efectos de respiración o parpadeo.",

        "ce-docs-master-cap7-title": "Capítulo 7: Organización y Arquitectura Maestra",
        "ce-docs-master-cap7-content": "Un juego desordenado es un juego que falla. Usa estas herramientas:\n\n• <b>Tags (Etiquetas):</b> Clasifica objetos. Las balas deben buscar el tag 'Enemigo'.\n• <b>Capas (Layers):</b> Controlan qué se ve y qué choca. Puedes hacer que el Agua no choque con la Decoración para ganar rendimiento.\n• <b>Sorting Layers:</b> Controlan el orden de dibujo. El Jugador siempre debe estar en una capa superior al Fondo.\n• <b>Estructura de Carpetas:</b> Mantén tus scripts en /Scripts y tus imágenes en /Sprites. Carl IA trabaja mejor si el proyecto está organizado.",

        "ce-docs-master-cap8-title": "Capítulo 8: Psicología del Diseño y Jugabilidad",
        "ce-docs-master-cap8-content": "<b>Feedback (Retroalimentación):</b>\nEl jugador debe SENTIR el juego. Si salta, añade un pequeño sonido. Si golpea una pared, añade un leve temblor de cámara (Screenshake).\n\n<b>Curva de Dificultad:</b>\nIntroduce mecánicas de forma segura. Primero enseña a saltar sin peligro, luego añade un pozo, y finalmente añade enemigos mientras salta.\n\n<b>Regla de los 3 Segundos:</b>\nEn los primeros 3 segundos, el jugador debe saber quién es y qué debe hacer. Usa la UI y el diseño de niveles para guiar el ojo del jugador hacia el objetivo.",

        "ce-docs-master-cap9-title": "Capítulo 9: Efectos Visuales y 'Juice'",
        "ce-docs-master-cap9-content": "El 'Juice' es lo que hace que un juego sea adictivo. En Creative Engine puedes usar:\n\n• <b>Sistemas de Partículas:</b> Explosiones, polvo al correr o chispas de metal. Usa prefabs para que cada impacto cree partículas dinámicas.\n• <b>Post-Procesado:</b> Aplica efectos globales. El <b>Bloom</b> hace que las luces brillen, la <b>Viñeta</b> oscurece los bordes para mayor inmersión, y la <b>Corrección de Color</b> da el tono cinematográfico final.\n• <b>Interpolación (Lerp):</b> No muevas las cosas bruscamente. Usa Lerp para que la cámara siga al jugador con suavidad.",

        "ce-docs-master-cap10-title": "Capítulo 10: Construcción de Mundos Dinámicos",
        "ce-docs-master-cap10-content": "<b>Parallax:</b>\nCrea capas de fondo que se muevan a distintas velocidades. El fondo lejano (montañas) se mueve lento, el cercano (árboles) se mueve rápido. Esto genera una ilusión de profundidad 3D impresionante.\n\n<b>Iluminación Ambiental:</b>\nPuedes cambiar el color global del mundo. Pasa de un mediodía brillante a una medianoche azulada con un solo comando. Usa <b>Point Lights</b> para iluminar solo el camino del jugador en niveles oscuros, creando tensión y atmósfera.",

        "ce-docs-master-cap11-title": "Capítulo 11: Prefabs y El Poder de los Moldes",
        "ce-docs-master-cap11-content": "Un <b>Prefab</b> es un 'molde' de una Materia. Imagina que diseñas un Enemigo perfecto con animaciones, sonidos y scripts.\n\n<b>Por qué usarlos:</b>\n1. <b>Edición Maestra:</b> Si cambias el color del Prefab del Enemigo, ¡TODOS los enemigos en TODOS los niveles cambiarán al instante!\n2. <b>Instanciación Dinámica:</b> Usa scripts para 'crear' enemigos o balas en tiempo real. El motor simplemente saca una copia del molde (Prefab) y la lanza al mundo.\n3. <b>Optimización:</b> El motor ahorra memoria al tratar a las copias como una sola referencia técnica.",

        "ce-docs-master-cap12-title": "Capítulo 12: Glosario Técnico y FAQ",
        "ce-docs-master-cap12-content": "• <b>DeltaTime:</b> Es el tiempo que pasó entre el frame anterior y el actual. Multiplica tu velocidad por delta para que el juego corra igual en una PC lenta y una PC gamer.\n• <b>Vector2:</b> Un par de coordenadas (X, Y).\n• <b>Draw Calls:</b> Cuántas veces el motor le pide a la tarjeta gráfica que dibuje algo. Manténlas bajas usando Tilemaps.\n\n<b>Preguntas Frecuentes:</b>\n- <i>¿Por qué atravieso el suelo?</i> Revisa que el suelo sea Estático y tenga un Collider.\n- <i>¿Por qué no se mueve mi script?</i> Asegúrate de que empiece con 've motor;'.\n- <i>¿Cómo optimizo?</i> No uses 'buscar()' dentro de alActualizar; hazlo una sola vez en alEmpezar().",

        "ce-docs-scripting-cap0-title": "Capítulo 0: Tu Primer Script (El Despertar)",
        "ce-docs-scripting-cap0-desc": "En Creative Engine, el código es el alma de la Materia. Sigue estos pasos:\n1. Crea un nuevo Script (.ces) en el navegador de activos.\n2. Ábrelo y escribe: <b>ve motor;</b> (esto conecta el script al corazón del sistema).\n3. Arrastra el script a una Materia y dale a Play.\n\n<b>Reto 0:</b> Haz que una Materia gire sin parar sumando 100 * delta a la rotación.",
        "ce-docs-scripting-cap0-code": "ve motor;\n\nalActualizar(delta) {\n    rotacion += 100 * delta;\n}",

        "ce-docs-scripting-cap1-title": "Capítulo 1: La Filosofía de CES",
        "ce-docs-scripting-cap1-content": "Creative Engine Script (CES) nació para ser humano. Hemos eliminado el exceso de sintaxis. \n• No uses <b>this.posicion</b>, solo escribe <b>posicion</b>.\n• No uses <b>motor.fisica</b>, solo escribe <b>fisica</b>.\nEl objetivo es que tu código parezca una oración: 'Si la tecla es Espacio, fisica aplica impulso'. CES es una capa sobre JavaScript, lo que significa que es increíblemente rápido pero fácil de leer.",

        "ce-docs-scripting-cap2-title": "Capítulo 2: Anatomía de un Archivo .ces",
        "ce-docs-scripting-cap2-content": "Un script profesional tiene 3 zonas:\n1. <b>Cabecera:</b> Siempre empieza con 've motor;'.\n2. <b>Variables:</b> Aquí defines la velocidad o la vida usando 'publico' o 'variable'.\n3. <b>Eventos:</b> Las funciones que el motor llama automáticamente.\n\n<b>Reto 2:</b> Declara una variable llamada 'nombreHeroe' y muéstrala en la consola usando imprimir() al empezar.",

        "ce-docs-scripting-cap3-title": "Capítulo 3: Variables y El Inspector Mágico",
        "ce-docs-scripting-cap3-content": "<b>Tipos de Datos:</b>\n• <b>numero:</b> 10, -5.2, 0.\n• <b>texto:</b> \"¡Hola!\"\n• <b>booleano:</b> verdadero, falso.\n• <b>Materia:</b> Referencia a otro objeto.\n• <b>Prefab:</b> Referencia a un molde.\n\n<b>Palabra clave 'publico':</b>\nSi escribes 'publico numero velocidad = 10;', esa variable aparecerá en el editor. Podrás cambiar la velocidad de tu jugador mientras el juego corre sin tocar el código.\n\n<b>Reto 3:</b> Crea una variable pública de tipo Materia llamada 'enemigo' y una pública de tipo numero llamada 'daño'.",

        "ce-docs-scripting-cap4-title": "Capítulo 4: Ciclo de Vida y Eventos Pro",
        "ce-docs-scripting-cap4-events": "Dominar los eventos es dominar el tiempo:\n• <b>alEmpezar():</b> Configuración. (Ej: obtener la vida inicial).\n• <b>alActualizar(delta):</b> Entrada del usuario y lógica de IA.\n• <b>actualizarFijo(delta):</b> Cálculos físicos constantes.\n• <b>alEntrarColision(otro):</b> Se llama cuando chocas. 'otro' te dice con qué chocaste.\n• <b>alHacerClick():</b> Detección de toque en móviles o clics en PC.\n\n<b>Reto 4:</b> Usa alEntrarColision para imprimir el nombre del objeto que acabas de tocar.",

        "ce-docs-scripting-cap5-title": "Capítulo 5: Entrada de Usuario y Control Total",
        "ce-docs-scripting-cap5-code": "alActualizar(delta) {\n    // Control con flechas o WASD\n    variable horizontal = 0;\n    si (teclaPresionada(\"d\")) horizontal = 1;\n    si (teclaPresionada(\"a\")) horizontal = -1;\n    \n    posicion.x += horizontal * (300 * delta);\n    \n    // Salto con detección de suelo\n    si (teclaRecienPresionada(\"Space\") y estaTocandoTag(\"Suelo\")) {\n        fisica.applyImpulse(nuevo Vector2(0, -15));\n    }\n}\n\n// Reto 5: Haz que el personaje se haga más grande (escala) mientras presionas la tecla 'e'.",

        "ce-docs-scripting-cap6-title": "Capítulo 6: El Diccionario API (Atajos Maestros)",
        "ce-docs-scripting-cap6-content": "Creative Engine traduce tus intenciones en acciones:\n• <b>posicion:</b> Controla x, y, rotacion, escala.\n• <b>fisica:</b> Acceso a velocidad, masa, fuerzas.\n• <b>animacion:</b> Controla el Animator (ej: animacion.play(\"Caminar\")).\n• <b>audio:</b> Reproduce sonidos (ej: audio.play()).\n• <b>reproducir:</b> Un atajo inteligente. Escribir 'reproducir.Explosion();' buscará automáticamente un sonido o animación con ese nombre.\n\n<b>Reto 6:</b> Cambia el color del renderizador de sprite a rojo cuando el jugador tenga poca vida.",

        "ce-docs-scripting-cap7-title": "Capítulo 7: Mensajería y Eventos Globales",
        "ce-docs-scripting-cap7-emisor": "Emisor:\ndifundir(\"GameOver\", { puntuacion: 100 });",
        "ce-docs-scripting-cap7-receptor": "Receptor:\nalRecibir(\"GameOver\", (datos) => {\n    imprimir(\"Juego terminado. Puntos: \" + datos.puntuacion);\n});\n\n<b>¿Para qué sirve?</b>\nPara que objetos que no se conocen hablen entre sí. Cuando el jugador muere, envía un mensaje global.",

        "ce-docs-scripting-cap8-title": "Capítulo 8: Corrutinas (El Poder de la Espera)",
        "ce-docs-scripting-cap8-code1": "async alEmpezar() {\n    imprimir(\"Cargando escudo...\");\n    esperar(3); // Pausa el script sin congelar el juego\n    imprimir(\"¡Escudo activado!\");\n}",
        "ce-docs-scripting-cap8-code2": "// Bucles infinitos seguros\nalEmpezar() {\n    cada(5) {\n        instanciar(enemigoPrefab, posicion);\n    }\n}\n\n<b>Reto 8:</b> Crea una corrutina que cambie el color del jugador cada 1 segundo entre 3 colores diferentes.",

        "ce-docs-scripting-cap9-title": "Capítulo 9: Cookbook (Recetas de Éxito)",
        "ce-docs-scripting-cap9-mov": "<b>Seguimiento de Cámara Suave:</b>\nve motor;\npublico Materia objetivo;\n\nalActualizar(delta) {\n    si (objetivo) {\n        posicion.x = interpolar(posicion.x, objetivo.posicion.x, 0.1);\n        posicion.y = interpolar(posicion.y, objetivo.posicion.y, 0.1);\n    }\n}\n\n<b>Reto 9:</b> Crea un script para una bala que se destruya automáticamente después de 2 segundos.",

        "ce-docs-scripting-cap10-title": "Capítulo 10: Optimización para Navegadores",
        "ce-docs-scripting-cap10-tips": "Los juegos web tienen límites. Sigue estas reglas:\n1. <b>No abuses de buscar():</b> Es lento. Hazlo en alEmpezar y guarda en variable.\n2. <b>Object Pooling:</b> Reutiliza balas en lugar de crear/destruir.\n3. <b>Física Simple:</b> Usa colisionadores de círculo siempre que puedas.",

        "ce-docs-scripting-cap11-title": "Capítulo 11: Bajo el Capó y JavaScript Puro",
        "ce-docs-scripting-cap11-content": "<b>Transpilación:</b>\nTu script .ces se convierte en JS altamente optimizado. \n\n<b>Acceso a JS:</b>\nPuedes usar funciones nativas de JS como <b>Math.random()</b> o <b>fetch()</b> para conectar tu juego con internet.\n\n<b>Reto 11:</b> Genera un número aleatorio entre 1 y 100 y muéstralo al empezar el juego.",

        "ce-docs-sceneloader-desc": "Permite viajar entre niveles (.ceScene). Actívalo al chocar o por código.",
        "ce-docs-sceneloader-name": "SceneLoader (Niveles)"
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
        "ce-docs-nav-cap11": "Cap 11: Under the Hood",

        "ce-nav-docs-masterbook": "Master Book",
        "ce-docs-master-title": "Engine Master Book",
        "ce-docs-master-intro": "Welcome to the ultimate guide. Master Creative Engine from foundations to advanced techniques in these 12 robust chapters.",

        "ce-docs-master-cap1-title": "Chapter 1: The Actor, Script, and Hierarchy",
        "ce-docs-master-cap1-content": "<b>What is a Matter?</b>\nA Matter is the atom of your game. It's a point with position (X, Y), rotation, and scale.\n\n<b>The Laws System:</b>\nIf Matter is the actor, <b>Law</b> is the script. Laws are modular: SpriteRenderer for vision, Rigidbody2D for gravity.\n\n<b>Hierarchy:</b>\nMatters can be nested. Moving a Parent moves all Children, vital for limbs or weapon attachments.",

        "ce-docs-master-cap2-title": "Chapter 2: Master Matter Catalog",
        "ce-docs-master-cap2-content": "• <b>Empty Matter:</b> Containers or spawn points.\n• <b>Sprite Matter:</b> 2D rendering.\n• <b>Light Matter:</b> Dynamic shadows.\n• <b>Audio Matter:</b> Spatial sound.\n• <b>Tilemap:</b> Optimized for massive level design.",

        "ce-docs-master-cap3-title": "Chapter 3: The UI Universe",
        "ce-docs-master-cap3-content": "Everything UI must be a child of <b>Canva</b>.\n• <b>Screen Space:</b> UI sticks to the monitor (HUD).\n• <b>World Space:</b> UI lives in the world (speech bubbles).\n<b>Anchors:</b> Ensure buttons scale correctly on different browser sizes.",

        "ce-docs-master-cap4-title": "Chapter 4: Physics, Collisions, and Raycast",
        "ce-docs-master-cap4-content": "<b>Rigidbody 2D:</b> Dynamic, Static, or Kinematic.\n<b>Triggers:</b> Non-physical detection areas (coins, portals).\n<b>Raycasting:</b> Invisible lasers for IA 'vision' or surgical ground detection.",

        "ce-docs-master-cap5-title": "Chapter 5: The Rhythm of Life (Lifecycle)",
        "ce-docs-master-cap5-content": "1. <b>onStart():</b> Initial setup.\n2. <b>onUpdate(delta):</b> Logic every frame.\n3. <b>fixedUpdate(delta):</b> Deterministic physics.\n4. <b>onClick():</b> User interaction event.",

        "ce-docs-master-cap6-title": "Chapter 6: Animation and Visual Brain",
        "ce-docs-master-cap6-content": "<b>AnimatorController:</b> State machine. <b>Smart Mode</b> automatically swaps animations based on velocity. <b>Timeline</b> animates properties like opacity or scale.",

        "ce-docs-master-cap7-title": "Chapter 7: Master Organization",
        "ce-docs-master-cap7-content": "Use <b>Tags</b> to identify objects, <b>Layers</b> for collision control, and <b>Sorting Layers</b> for visual depth (Player above Background).",

        "ce-docs-master-cap8-title": "Chapter 8: Design Psychology",
        "ce-docs-master-cap8-content": "<b>Feedback:</b> Add sounds and screenshakes. <b>Difficulty Curve:</b> Introduce mechanics safely. <b>3-Second Rule:</b> Player must understand goals immediately.",

        "ce-docs-master-cap9-title": "Chapter 9: Effects and 'Juice'",
        "ce-docs-master-cap9-content": "<b>Particles:</b> Explosions and dust. <b>Post-Processing:</b> Bloom and color grading. <b>Lerp:</b> Smooth transitions for camera or UI.",

        "ce-docs-master-cap10-title": "Chapter 10: Dynamic World Building",
        "ce-docs-master-cap10-content": "<b>Parallax:</b> Layers moving at different speeds for 3D illusion. <b>Ambient Light:</b> Global color changes (day/night).",

        "ce-docs-master-cap11-title": "Chapter 11: Prefabs and Master Templates",
        "ce-docs-master-cap11-content": "<b>Prefabs</b> are master molds. Edit the mold, and every instance in every level updates. Vital for bullets and repetitive enemies.",

        "ce-docs-master-cap12-title": "Chapter 12: Technical FAQ",
        "ce-docs-master-cap12-content": "Use <b>DeltaTime</b> for frame-independence. Keep <b>Draw Calls</b> low via Tilemaps.",

        "ce-docs-scripting-cap0-title": "Chapter 0: Your First Script (The Awakening)",
        "ce-docs-scripting-cap0-desc": "Code is the soul. Use <b>engine motor;</b>. \n\n<b>Challenge 0:</b> Spin a Matter using 100 * delta.",
        "ce-docs-scripting-cap0-code": "engine motor;\n\nonUpdate(delta) {\n    rotation += 100 * delta;\n}",

        "ce-docs-scripting-cap1-title": "Chapter 1: CES Philosophy",
        "ce-docs-scripting-cap1-content": "Human-readable syntax. Use <b>position</b> instead of <b>this.position</b>. CES is a fast JS layer.",

        "ce-docs-scripting-cap2-title": "Chapter 2: Anatomy of a .ces File",
        "ce-docs-scripting-cap2-content": "3 main zones: Header (engine motor;), Variables, and Events.",

        "ce-docs-scripting-cap3-title": "Chapter 3: Variables and Magic Inspector",
        "ce-docs-scripting-cap3-content": "Use <b>public</b> keyword to show variables in the editor for real-time tweaking.\n\n<b>Challenge 3:</b> Create a public speed variable.",

        "ce-docs-scripting-cap4-title": "Chapter 4: Lifecycle Pro",
        "ce-docs-scripting-cap4-events": "onStart for setup, onUpdate for frame logic, fixedUpdate for physics.",

        "ce-docs-scripting-cap5-title": "Chapter 5: User Input and Control",
        "ce-docs-scripting-cap5-code": "onUpdate(delta) {\n    variable horizontal = 0;\n    if (isKeyPressed(\"d\")) horizontal = 1;\n    position.x += horizontal * (300 * delta);\n    \n    if (isKeyJustPressed(\"Space\") && isTouchingTag(\"Floor\")) {\n        physics.applyImpulse(new Vector2(0, -15));\n    }\n}",

        "ce-docs-scripting-cap6-title": "Chapter 6: API Dictionary",
        "ce-docs-scripting-cap6-content": "Direct access: position, physics, animation, audio, play.Explosion().",

        "ce-docs-scripting-cap7-title": "Chapter 7: Global Messaging",
        "ce-docs-scripting-cap7-emisor": "broadcast(\"GameOver\", { score: 100 });",
        "ce-docs-scripting-cap7-receptor": "onReceive(\"GameOver\", (data) => { ... });",

        "ce-docs-scripting-cap8-title": "Chapter 8: Coroutines",
        "ce-docs-scripting-cap8-code1": "async onStart() {\n    wait(3);\n    print(\"Activated!\");\n}",

        "ce-docs-scripting-cap9-title": "Chapter 9: Cookbook",
        "ce-docs-scripting-cap9-mov": "Smooth camera follow using lerp().",

        "ce-docs-scripting-cap10-title": "Chapter 10: Optimization",
        "ce-docs-scripting-cap10-tips": "Don't abuse find(). Use pooling for bullets.",

        "ce-docs-scripting-cap11-title": "Chapter 11: Under the Hood",
        "ce-docs-scripting-cap11-content": "CES transpiles to optimized JS. Access native JS via Math.random() or fetch()."
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
        "ce-docs-nav-cap11": "Cap 11: Sob o Capô",

        "ce-nav-docs-masterbook": "Livro Mestre",
        "ce-docs-master-title": "Livro Mestre do Motor",
        "ce-docs-master-intro": "Bem-vindo ao guia definitivo. Domine o Creative Engine nestes 12 capítulos detalhados, cobrindo desde a lógica básica até a arquitetura de sistemas profissionais.",

        "ce-docs-master-cap1-title": "Capítulo 1: O Ator, o Roteiro e a Hierarquia",
        "ce-docs-master-cap1-content": "<b>O que é uma Matéria?</b>\nUma Matéria é o átomo do seu jogo. Pode ser um jogador, uma luz, ou mesmo um ponto invisível no espaço. Por si só, uma Matéria não faz nada; é simplesmente um ponto com posição (X, Y), rotação e escala.\n\n<b>O Sistema de Leis (Componentes):</b>\nSe a Matéria é o ator, a <b>Lei</b> é o roteiro. As leis são modulares e acumuláveis:\n• <b>SpriteRenderer:</b> Permite que a Matéria seja visível.\n• <b>Rigidbody2D:</b> Dá massa e resposta à gravidade.\n• <b>Script:</b> Dá inteligência personalizada.\n\n<b>Hierarquia (Pais e Filhos):</b>\nAs Matérias podem ser aninhadas. Se mover um Pai, todos os seus Filhos movem-se com ele, mantendo a sua posição relativa. Isto é vital para criar personagens com partes separadas (braços, armas, mochilas).",

        "ce-docs-master-cap2-title": "Capítulo 2: Catálogo Mestre de Matérias",
        "ce-docs-master-cap2-content": "O Creative Engine oferece tipos predefinidos para acelerar o seu fluxo de trabalho:\n\n• <b>Matéria Vazia:</b> Ideal como contentores, pontos de spawn ou câmaras.\n• <b>Matéria Sprite:</b> Vem com um renderizador pronto para receber texturas.\n• <b>Matéria Luz:</b> Emitem luz dinâmica que gera sombras em tempo real.\n• <b>Matéria Áudio:</b> Fontes de som que podem ser globais ou espaciais (o volume baixa se se afastar).\n• <b>Matéria UI:</b> Desenhadas para viver no Canva, perfeitas para botões e barras de vida.\n• <b>Matéria Tilemap:</b> Uma tela otimizada para pintar níveis gigantes com milhares de blocos sem que o rendimento caia.",

        "ce-docs-master-cap3-title": "Capítulo 3: O Universo da Interface (UI)",
        "ce-docs-master-cap3-content": "A UI no Creative Engine é potente e flexível. Tudo deve ser filho de um <b>Canva</b>.\n\n<b>Modos de Visualização:</b>\n• <b>Screen Space:</b> A UI cola-se ao vidro do seu monitor (HUD, Inventário). Não se move mesmo que a câmara sim.\n• <b>World Space:</b> A UI vive 'dentro' do mundo. Útil para diálogos que flutuam sobre personagens ou cartazes indicadores.\n\n<b>Âncoras (Anchors):</b>\nSão o segredo da UI responsiva. Definem como se estica um botão quando muda o tamanho da janela do navegador. Sempre ancore o seu HUD aos cantos e o seu inventário ao centro.",

        "ce-docs-master-cap4-title": "Capítulo 4: Físicas, Colisões e Raycast",
        "ce-docs-master-cap4-content": "<b>Rigidbody 2D:</b>\n• <b>Dinâmico:</b> Reage a tudo (gravidade, golpes).\n• <b>Estático:</b> Inamovível (chão, paredes).\n• <b>Cinemático:</b> Move-se apenas por código, ignorando a gravidade mas empurrando outros.\n\n<b>Triggers (Sensores):</b>\nSe ativar 'Is Trigger' num colisor, este torna-se 'fantasma'. Não chocará fisicamente, mas enviará um sinal quando algo o atravessar. Perfeito para moedas, portais ou áreas de veneno.\n\n<b>Raycasting:</b>\nÉ lançar um 'laser invisível' de um ponto. Se o laser tocar em algo, devolve o que tocou e a que distância. Útil para que os inimigos 'vejam' o jogador ou para detetar o solo com precisão cirúrgica.",

        "ce-docs-master-cap5-title": "Capítulo 5: O Ritmo da Vida (Ciclo de Vida)",
        "ce-docs-master-cap5-content": "Os scripts seguem uma ordem estrita de execução:\n\n1. <b>aoComecar():</b> Executa-se uma única vez quando a Matéria nasce. Aqui deve configurar variáveis e filhos.\n2. <b>aoAtualizar(delta):</b> Executa-se a cada frame (60 vezes por segundo). Aqui vai o movimento e a lógica do jogador.\n3. <b>atualizarFixo(delta):</b> Ideal para físicas. Executa-se a intervalos constantes, assegurando que o seu personagem não atravesse paredes se os FPS baixarem.\n4. <b>aoClicar():</b> Evento direto quando o utilizador toca na Matéria.",

        "ce-docs-master-cap6-title": "Capítulo 6: Animação e O Cérebro Visual",
        "ce-docs-master-cap6-content": "<b>AnimatorController:</b>\nÉ uma máquina de estados. Imagine um fluxograma: Se o jogador corre, passa do estado 'Parado' para 'Correr'.\n\n<b>Smart Mode:</b>\nUma função exclusiva do Creative Engine. Se a ativar, o motor deteta a velocidade da Matéria e muda as animações automaticamente. Não tem de escrever nem uma linha de código para que o seu personagem caminhe e salte!\n\n<b>Linha de Tempo:</b>\nPode animar qualquer coisa: a opacidade de uma imagem, a cor de uma luz ou a escala de um objeto, criando efeitos de respiração ou piscar.",

        "ce-docs-master-cap7-title": "Capítulo 7: Organização e Arquitetura Maestra",
        "ce-docs-master-cap7-content": "Um jogo desordenado é um jogo que falha. Use estas ferramentas:\n\n• <b>Tags (Etiquetas):</b> Classifica objetos. As balas devem procurar a tag 'Inimigo'.\n• <b>Capas (Layers):</b> Controlam o que se vê e o que choca. Pode fazer com que a Água não choque com a Decoração para ganhar rendimento.\n• <b>Sorting Layers:</b> Controlam a ordem de desenho. O Jogador deve estar sempre numa camada superior ao Fundo.\n• <b>Estrutura de Pastas:</b> Mantenha os seus scripts em /Scripts e as suas imagens em /Sprites. Carl IA trabalha melhor se o projeto estiver organizado.",

        "ce-docs-master-cap8-title": "Capítulo 8: Psicologia do Design e Jogabilidade",
        "ce-docs-master-cap8-content": "<b>Feedback (Retroalimentação):</b>\nO jogador deve SENTIR o jogo. Se salta, adicione um pequeno som. Se atinge uma parede, adicione um leve tremor de câmara (Screenshake).\n\n<b>Curva de Dificuldade:</b>\nIntroduza mecânicas de forma segura. Primeiro ensine a saltar sem perigo, depois adicione um poço, e finalmente adicione inimigos enquanto salta.\n\n<b>Regra dos 3 Segundos:</b>\nNos primeiros 3 segundos, o jogador deve saber quem é e o que deve fazer. Use a UI e o design de níveis para guiar o olho do jogador para o objetivo.",

        "ce-docs-master-cap9-title": "Capítulo 9: Efeitos Visuais e 'Juice'",
        "ce-docs-master-cap9-content": "O 'Juice' é o que faz com que um jogo seja viciante. No Creative Engine pode usar:\n\n• <b>Sistemas de Partículas:</b> Explosões, pó ao correr ou faíscas de metal. Use prefabs para que cada impacto crie partículas dinâmicas.\n• <b>Pós-Processamento:</b> Aplica efeitos globais. O <b>Bloom</b> faz com que as luzes brilhem, a <b>Vinheta</b> escurece os bordos para maior imersão, e a <b>Correção de Cor</b> dá o tom cinematográfico final.\n• <b>Interpolação (Lerp):</b> Não mova as coisas bruscamente. Use Lerp para que a câmara siga o jogador com suavidade.",

        "ce-docs-master-cap10-title": "Capítulo 10: Construção de Mundos Dinâmicos",
        "ce-docs-master-cap10-content": "<b>Parallax:</b>\nCrie camadas de fundo que se movam a diferentes velocidades. O fundo distante (montanhas) move-se lento, o próximo (árvores) move-se rápido. Isto gera uma ilusão de profundidade 3D impressionante.\n\n<b>Iluminação Ambiental:</b>\nPode mudar a cor global do mundo. Passe de um meio-dia brilhante para uma meia-noite azulada com um único comando. Use <b>Point Lights</b> para iluminar apenas o caminho do jogador em níveis escuros, criando tensão e atmosfera.",

        "ce-docs-master-cap11-title": "Capítulo 11: Prefabs e O Poder dos Moldes",
        "ce-docs-master-cap11-content": "Um <b>Prefab</b> é um 'molde' de uma Matéria. Imagine que desenha um Inimigo perfeito com animações, sons e scripts.\n\n<b>Por que usá-los:</b>\n1. <b>Edição Maestra:</b> Se mudar a cor do Prefab do Inimigo, TODOS os inimigos em TODOS os níveis mudarão instantaneamente!\n2. <b>Instanciação Dinâmica:</b> Use scripts para 'criar' inimigos ou balas em tempo real. O motor simplesmente tira uma cópia do molde (Prefab) e lança-a ao mundo.\n3. <b>Otimização:</b> O motor poupa memória ao tratar as cópias como uma única referência técnica.",

        "ce-docs-master-cap12-title": "Capítulo 12: Glossário Técnico e FAQ",
        "ce-docs-master-cap12-content": "• <b>DeltaTime:</b> É o tempo que passou entre o frame anterior e o atual. Multiplique a sua velocidade por delta para que o jogo corra igual num PC lento e num PC gamer.\n• <b>Vector2:</b> Um par de coordenadas (X, Y).\n• <b>Draw Calls:</b> Quantas vezes o motor pede à placa gráfica para desenhar algo. Mantenha-as baixas usando Tilemaps.\n\n<b>Perguntas Frequentes:</b>\n- <i>Por que atravesso o chão?</i> Verifique se o chão é Estático e tem um Collider.\n- <i>Por que não se move o meu script?</i> Certifique-se de que começa com 've motor;'.\n- <i>Como otimizo?</i> Não use 'buscar()' dentro de aoAtualizar; faça-o uma única vez em aoComecar().",

        "ce-docs-scripting-cap0-title": "Capítulo 0: Seu Primeiro Script (O Despertar)",
        "ce-docs-scripting-cap0-desc": "No Creative Engine, o código é a alma. Comece com <b>ve motor;</b>.\n\n<b>Desafio 0:</b> Faça uma Matéria girar somando 100 * delta à rotação.",
        "ce-docs-scripting-cap0-code": "ve motor;\n\naoAtualizar(delta) {\n    rotacao += 100 * delta;\n}",

        "ce-docs-scripting-cap1-title": "Capítulo 1: Filosofia CES",
        "ce-docs-scripting-cap1-content": "Eliminamos o excesso. Use <b>posicao</b> em vez de <b>this.posicao</b>. O CES é uma camada sobre JS, rápido e legível.",

        "ce-docs-scripting-cap2-title": "Capítulo 2: Anatomia de um Script",
        "ce-docs-scripting-cap2-content": "Um script profissional tem 3 zonas: Cabeçalho (ve motor;), Variáveis e Eventos.",

        "ce-docs-scripting-cap3-title": "Capítulo 3: Variáveis e Inspetor",
        "ce-docs-scripting-cap3-content": "Use <b>publico</b> para ver variáveis no editor e ajustá-las em tempo real enquanto o jogo corre.\n\n<b>Desafio 3:</b> Crie uma variável pública para a velocidade.",

        "ce-docs-scripting-cap4-title": "Capítulo 4: Ciclo de Vida Pro",
        "ce-docs-scripting-cap4-events": "aoEmpezar para configuração, aoAtualizar para lógica constante.",

        "ce-docs-scripting-cap5-title": "Capítulo 5: Entrada e Controlo",
        "ce-docs-scripting-cap5-code": "aoAtualizar(delta) {\n    variavel horizontal = 0;\n    se (teclaPressionada(\"d\")) horizontal = 1;\n    posicion.x += horizontal * (300 * delta);\n    \n    se (teclaRecienPresionada(\"Space\") e estaTocandoTag(\"Chao\")) {\n        fisica.applyImpulse(novo Vector2(0, -15));\n    }\n}",

        "ce-docs-scripting-cap6-title": "Capítulo 6: Dicionário API",
        "ce-docs-scripting-cap6-content": "Aceda a componentes diretamente: posicao, fisica, animacao, audio.",

        "ce-docs-scripting-cap7-title": "Capítulo 7: Mensagens Globais",
        "ce-docs-scripting-cap7-emisor": "difundir(\"GameOver\", { pontos: 100 });",
        "ce-docs-scripting-cap7-receptor": "alRecibir(\"GameOver\", (dados) => { ... });",

        "ce-docs-scripting-cap8-title": "Capítulo 8: Corrotinas",
        "ce-docs-scripting-cap8-code1": "async aoComecar() {\n    esperar(3);\n    imprimir(\"Ativado!\");\n}",

        "ce-docs-scripting-cap9-title": "Capítulo 9: Cookbook",
        "ce-docs-scripting-cap9-mov": "Seguimento de câmara suave usando interpolar().",

        "ce-docs-scripting-cap10-title": "Capítulo 10: Otimização Pro",
        "ce-docs-scripting-cap10-tips": "Não abuse de buscar(). Use Object Pooling para balas.",

        "ce-docs-scripting-cap11-title": "Capítulo 11: Sob o Capô",
        "ce-docs-scripting-cap11-content": "O CES é transpilado para JS otimizado. Suporta Math.random() e fetch()."
    },
    fr: {
        "ce-docs-nav-cap0": "Cap 0: Premier Script",
        "ce-docs-nav-cap1": "Cap 1: Philosophie",
        "ce-docs-nav-cap2": "Cap 2: Anatomie",
        "ce-docs-nav-cap3": "Cap 3: Variables",
        "ce-docs-nav-cap4": "Cap 4: Cycle de Vie",
        "ce-docs-nav-cap5": "Cap 5: Input & Physique",
        "ce-docs-nav-cap6": "Cap 6: Dictionnaire API",
        "ce-docs-nav-cap7": "Cap 7: Messagerie",
        "ce-docs-nav-cap8": "Cap 8: Coroutines",
        "ce-docs-nav-cap9": "Cap 9: Cookbook",
        "ce-docs-nav-cap10": "Cap 10: Optimisation",
        "ce-docs-nav-cap11": "Cap 11: Sous le Capot",

        "ce-nav-docs-masterbook": "Livre Maître",
        "ce-docs-master-title": "Livre Maître du Moteur",
        "ce-docs-master-intro": "Bienvenue dans le guide ultime. Maîtrisez le moteur à travers ces 12 chapitres détaillés, couvrant tout, des bases à l'architecture de systèmes professionnels.",

        "ce-docs-master-cap1-title": "Chapitre 1 : L'Acteur, le Script et la Hiérarchie",
        "ce-docs-master-cap1-content": "Une <b>Matière</b> est l'atome de votre jeu. Les <b>Lois</b> sont des composants. La hiérarchie (Parent/Enfant) permet de créer des objets complexes comme des bras articulés ou des systèmes d'armes.",

        "ce-docs-master-cap2-title": "Chapitre 2 : Catalogue des Matières",
        "ce-docs-master-cap2-content": "• <b>Matière Vide :</b> Conteneurs ou points de spawn.\n• <b>Matière Sprite :</b> Rendu 2D prêt à l'emploi.\n• <b>Matière Lumière :</b> Ombres dynamiques en temps réel.\n• <b>Matière Audio :</b> Sons spatiaux (le volume baisse avec la distance).\n• <b>Matière Tilemap :</b> Pour dessiner des niveaux massifs sans perte de performance.",

        "ce-docs-master-cap3-title": "Chapitre 3 : L'Univers de l'Interface (UI)",
        "ce-docs-master-cap3-content": "L'UI doit être enfant d'un <b>Canva</b>.\n• <b>Screen Space :</b> L'UI est fixée sur l'écran (HUD).\n• <b>World Space :</b> L'UI vit dans le monde (bulles de dialogue).\n<b>Ancres :</b> Assurez-vous que les boutons s'adaptent à toutes les tailles de fenêtre.",

        "ce-docs-master-cap4-title": "Chapitre 4 : Physique, Collisions et Raycast",
        "ce-docs-master-cap4-content": "<b>Rigidbody 2D :</b> Dynamique (réagit), Statique (sol), Cinématique (par code).\n<b>Triggers :</b> Détection sans collision physique.\n<b>Raycasting :</b> Lasers invisibles pour donner une 'vue' à l'IA ou détecter le sol avec précision.",

        "ce-docs-master-cap5-title": "Chapitre 5 : Le Rythme de la Vie (Cycle de Vie)",
        "ce-docs-master-cap5-content": "1. <b>auDemarrage() :</b> Une fois à la naissance.\n2. <b>auMiseAJour(delta) :</b> 60 fois par seconde.\n3. <b>miseAJourFixe(delta) :</b> Physique stable.\n4. <b>auClic() :</b> Événement d'interaction utilisateur.",

        "ce-docs-master-cap6-title": "Chapitre 6 : Animation et Cerveau Visuel",
        "ce-docs-master-cap6-content": "L'<b>AnimatorController</b> est une machine à états. Le <b>Smart Mode</b> détecte la vitesse et change les animations automatiquement.",

        "ce-docs-master-cap7-title": "Chapitre 7 : Organisation et Tags",
        "ce-docs-master-cap7-content": "Utilisez des <b>Tags</b> pour identifier les objets et des <b>Layers</b> pour contrôler les collisions.",

        "ce-docs-master-cap8-title": "Chapitre 8 : Psychologie et Gameplay",
        "ce-docs-master-cap8-content": "Le <b>Feedback</b> est crucial : sons, screenshakes et effets visuels pour chaque action.",

        "ce-docs-master-cap9-title": "Chapitre 9 : Juice et Effets",
        "ce-docs-master-cap9-content": "Ajoutez du 'Juice' avec des systèmes de particules et du post-traitement (Bloom, Vignette).",

        "ce-docs-master-cap10-title": "Chapitre 10 : Mondes Dynamiques et Parallax",
        "ce-docs-master-cap10-content": "Utilisez le Parallax pour créer une illusion de profondeur 3D en 2D. La lumière ambiante change l'atmosphère globale du jour à la nuit en une commande.",

        "ce-docs-master-cap11-title": "Chapitre 11 : Prefabs et Modèles",
        "ce-docs-master-cap11-content": "Les <b>Prefabs</b> sont des modèles maîtres. Modifiez-en un, et toutes les instances du jeu sont mises à jour.",

        "ce-docs-master-cap12-title": "Chapitre 12 : FAQ Technique",
        "ce-docs-master-cap12-content": "Utilisez <b>DeltaTime</b> pour la fluidité sur tous les PC. Optimisez avec les Tilemaps.",

        "ce-docs-scripting-cap0-title": "Chapitre 0 : Votre Premier Script (L'Éveil)",
        "ce-docs-scripting-cap0-desc": "Le code est l'âme de la Matière. Commencez par <b>ve motor;</b>.\n\n<b>Défi 0 :</b> Faites tourner un objet en ajoutant 100 * delta à la rotation.",
        "ce-docs-scripting-cap0-code": "ve motor;\n\nauMiseAJour(delta) {\n    rotation += 100 * delta;\n}",

        "ce-docs-scripting-cap1-title": "Chapitre 1 : Philosophie CES",
        "ce-docs-scripting-cap1-content": "Syntaxe lisible par l'homme. Utilisez <b>posicion</b> au lieu de <b>this.posicion</b>. CES est une couche rapide sur JS.",

        "ce-docs-scripting-cap2-title": "Chapitre 2 : Anatomie d'un Script",
        "ce-docs-scripting-cap2-content": "3 zones : En-tête (ve motor;), Variables (publico) et Événements.",

        "ce-docs-scripting-cap3-title": "Chapitre 3 : Variables et Inspecteur",
        "ce-docs-scripting-cap3-content": "Utilisez <b>publico</b> pour voir les variables dans l'éditeur et les ajuster en temps réel pendant que le jeu tourne.\n\n<b>Défi 3 :</b> Créez une variable publique pour la vitesse.",

        "ce-docs-scripting-cap4-title": "Chapitre 4 : Cycle de Vie Pro",
        "ce-docs-scripting-cap4-events": "auDemarrage pour l'initialisation, auMiseAJour pour la logique frame par frame.",

        "ce-docs-scripting-cap5-title": "Chapitre 5 : Entrée et Contrôle",
        "ce-docs-scripting-cap5-code": "auMiseAJour(delta) {\n    variable horizontal = 0;\n    si (teclaPressionada(\"d\")) horizontal = 1;\n    posicion.x += horizontal * (300 * delta);\n    \n    si (teclaRecienPresionada(\"Space\") && estaTocandoTag(\"Sol\")) {\n        fisica.applyImpulse(nuevo Vector2(0, -15));\n    }\n}",

        "ce-docs-scripting-cap6-title": "Chapitre 6 : Dictionnaire API",
        "ce-docs-scripting-cap6-content": "Accès direct : posicion, fisica, animacion, audio, reproducir.",

        "ce-docs-scripting-cap7-title": "Chapitre 7 : Messagerie Globale",
        "ce-docs-scripting-cap7-emisor": "difundir(\"GameOver\", { score: 100 });",
        "ce-docs-scripting-cap7-receptor": "alRecibir(\"GameOver\", (data) => { ... });",

        "ce-docs-scripting-cap8-title": "Chapitre 8 : Coroutines",
        "ce-docs-scripting-cap8-code1": "async auDemarrage() {\n    attendre(3);\n    imprimer(\"Activé !\");\n}",

        "ce-docs-scripting-cap9-title": "Chapitre 9 : Cookbook",
        "ce-docs-scripting-cap9-mov": "Suivi de caméra fluide avec lerp().",

        "ce-docs-scripting-cap10-title": "Chapitre 10 : Optimisation Pro",
        "ce-docs-scripting-cap10-tips": "Évitez buscar() dans Update. Utilisez le Pooling.",

        "ce-docs-scripting-cap11-title": "Chapitre 11 : Sous le Capot",
        "ce-docs-scripting-cap11-content": "CES est transpilé en JS optimisé. Accédez aux fonctions JS natives."
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
        "ce-docs-nav-cap11": "Гл 11: Под капотом",

        "ce-nav-docs-masterbook": "Мастер-книга",
        "ce-docs-master-title": "Мастер-книга Движка",
        "ce-docs-master-intro": "Добро пожаловать в полное руководство. Станьте профессионалом Creative Engine за 12 глав.",

        "ce-docs-master-cap1-title": "Глава 1: Актер, Скрипт и Иерархия",
        "ce-docs-master-cap1-content": "<b>Материя</b> — это атом вашей игры. <b>Закон (Закон)</b> — это скрипт. Иерархия позволяет связывать объекты: Родитель и Ребенок. Если вы двигаете Родителя, Ребенок следует за ним.",

        "ce-docs-master-cap2-title": "Глава 2: Каталог Материй",
        "ce-docs-master-cap2-content": "• <b>Пустая Материя:</b> Точки спавна.\n• <b>Спрайт:</b> 2D рендеринг.\n• <b>Свет:</b> Динамические тени.\n• <b>Звук:</b> Пространственное аудио.\n• <b>Тайлсет:</b> Огромные уровни.",

        "ce-docs-master-cap3-title": "Глава 3: Интерфейс (UI)",
        "ce-docs-master-cap3-content": "Все элементы UI должны быть детьми <b>Canva</b>. Используйте <b>Anchors</b> для адаптивности под разные размеры экрана.",

        "ce-docs-master-cap4-title": "Глава 4: Физика и Raycast",
        "ce-docs-master-cap4-content": "Rigidbody 2D для массы. <b>Triggers</b> для детекции без столкновения. <b>Raycasting</b> — невидимые лучи для 'зрения' ИИ.",

        "ce-docs-master-cap5-title": "Глава 5: Жизненный цикл",
        "ce-docs-master-cap5-content": "1. <b>alEmpezar():</b> На старте.\n2. <b>alActualizar(delta):</b> Каждый кадр.\n3. <b>actualizarFijo(delta):</b> Для физики.\n4. <b>alHacerClick():</b> При нажатии.",

        "ce-docs-master-cap6-title": "Глава 6: Анимация",
        "ce-docs-master-cap6-content": "<b>AnimatorController</b> управляет состояниями. <b>Smart Mode</b> автоматически меняет анимации в зависимости от скорости.",

        "ce-docs-master-cap7-title": "Глава 7: Организация",
        "ce-docs-master-cap7-content": "Используйте <b>Tags</b> для идентификации и <b>Layers</b> для контроля столкновений.",

        "ce-docs-master-cap8-title": "Глава 8: Психология дизайна",
        "ce-docs-master-cap8-content": "Обратная связь (Feedback): звуки и тряска камеры (screenshake) делают игру 'живой'.",

        "ce-docs-master-cap9-title": "Глава 9: Эффекты и Сок",
        "ce-docs-master-cap9-content": "Частицы (Particles) и Пост-обработка (Post-Processing) добавляют финальный лоск вашей игре.",

        "ce-docs-master-cap10-title": "Глава 10: Миры и Параллакс",
        "ce-docs-master-cap10-content": "Параллакс создает иллюзию 3D глубины в 2D. Окружающее освещение меняет время суток.",

        "ce-docs-master-cap11-title": "Глава 11: Префабы",
        "ce-docs-master-cap11-content": "<b>Prefabs</b> — это шаблоны. Измените один, и все копии в игре обновятся автоматически.",

        "ce-docs-master-cap12-title": "Глава 12: Технический FAQ",
        "ce-docs-master-cap12-content": "Используйте <b>DeltaTime</b> для стабильной скорости на любых ПК. Оптимизируйте отрисовку через тайлсеты.",

        "ce-docs-scripting-cap0-title": "Глава 0: Ваш первый скрипт (Пробуждение)",
        "ce-docs-scripting-cap0-desc": "Код — это душа Материи. Начните с <b>ve motor;</b>.\n\n<b>Задание 0:</b> Заставьте объект вращаться, прибавляя 100 * delta к ротации.",
        "ce-docs-scripting-cap0-code": "ve motor;\n\nalActualizar(delta) {\n    rotacion += 100 * delta;\n}",

        "ce-docs-scripting-cap1-title": "Глава 1: Философия CES",
        "ce-docs-scripting-cap1-content": "Понятный синтаксис. Пишите <b>posicion</b> вместо <b>this.posicion</b>. CES — это быстрый слой над JavaScript.",

        "ce-docs-scripting-cap2-title": "Глава 2: Анатомия файла .ces",
        "ce-docs-scripting-cap2-content": "3 зоны: Заголовок (ve motor;), Переменные и События.",

        "ce-docs-scripting-cap3-title": "Глава 3: Переменные и Инспектор",
        "ce-docs-scripting-cap3-content": "Используйте <b>publico</b>, чтобы менять значения прямо в редакторе в реальном времени.\n\n<b>Задание 3:</b> Создайте публичную переменную скорости.",

        "ce-docs-scripting-cap4-title": "Глава 4: Профессиональный цикл",
        "ce-docs-scripting-cap4-events": "alEmpezar для настройки, alActualizar для логики кадров.",

        "ce-docs-scripting-cap5-title": "Глава 5: Ввод и управление",
        "ce-docs-scripting-cap5-code": "alActualizar(delta) {\n    variable horizontal = 0;\n    si (teclaPressionada(\"d\")) horizontal = 1;\n    posicion.x += horizontal * (300 * delta);\n    \n    si (teclaRecienPresionada(\"Space\") && estaTocandoTag(\"Suelo\")) {\n        fisica.applyImpulse(nuevo Vector2(0, -15));\n    }\n}",

        "ce-docs-scripting-cap6-title": "Глава 6: Словарь API",
        "ce-docs-scripting-cap6-content": "Прямой доступ: posicion, fisica, animacion, audio, reproducir.",

        "ce-docs-scripting-cap7-title": "Глава 7: Глобальные сообщения",
        "ce-docs-scripting-cap7-emisor": "difundir(\"GameOver\", { score: 100 });",
        "ce-docs-scripting-cap7-receptor": "alRecibir(\"GameOver\", (data) => { ... });",

        "ce-docs-scripting-cap8-title": "Глава 8: Корутины",
        "ce-docs-scripting-cap8-code1": "async alEmpezar() {\n    esperar(3);\n    imprimir(\"Активировано!\");\n}",

        "ce-docs-scripting-cap9-title": "Глава 9: Рецепты",
        "ce-docs-scripting-cap9-mov": "Плавное следование камеры через lerp().",

        "ce-docs-scripting-cap10-title": "Глава 10: Оптимизация",
        "ce-docs-scripting-cap10-tips": "Не используйте buscar() в Update. Применяйте Pooling для пуль.",

        "ce-docs-scripting-cap11-title": "Глава 11: Под капотом",
        "ce-docs-scripting-cap11-content": "CES транслируется в оптимизированный JS. Доступны Math.random() и fetch()."
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
        "ce-docs-nav-cap8": "第 8 章：协程",
        "ce-docs-nav-cap9": "第 9 章：解决方案食谱",
        "ce-docs-nav-cap10": "第 10 章：优化",
        "ce-docs-nav-cap11": "第 11 章：深入底层",

        "ce-nav-docs-masterbook": "大师之书",
        "ce-docs-master-title": "引擎大师之书",
        "ce-docs-master-intro": "欢迎阅读终极指南。通过这 12 章深度技术指南，从零基础成长为 Creative Engine 专家。",

        "ce-docs-master-cap1-title": "第 1 章：物质、法律与层级结构",
        "ce-docs-master-cap1-content": "<b>什么是物质 (Matter)？</b>\n物质是游戏的原子。它只是一个具有位置 (X, Y)、旋转和缩放的点。\n\n<b>层级 (Hierarchy)：</b>\n父子关系是核心。移动父物体，子物体会随之移动。对于角色肢体或武器挂载至关重要。",

        "ce-docs-master-cap2-title": "第 2 章：物质目录",
        "ce-docs-master-cap2-content": "• <b>空物质：</b> 生成点。\n• <b>精灵：</b> 2D 渲染。\n• <b>光照：</b> 实时阴影。\n• <b>音频：</b> 空间音效。\n• <b>瓦片地图：</b> 超大规模关卡优化。",

        "ce-docs-master-cap3-title": "第 3 章：UI 宇宙",
        "ce-docs-master-cap3-content": "所有 UI 必须是 <b>Canva</b> 的子物体。使用 <b>Anchors</b> (锚点) 确保界面在不同分辨率下都能正确缩放。",

        "ce-docs-master-cap4-title": "第 4 章：物理、碰撞与射线检测",
        "ce-docs-master-cap4-content": "Rigidbody 2D 处理质量。使用<b>触发器 (Triggers)</b> 进行区域检测。使用<b>射线检测 (Raycast)</b> 为 AI 提供“视力”。",

        "ce-docs-master-cap5-title": "第 5 章：生命周期",
        "ce-docs-master-cap5-content": "1. <b>alEmpezar():</b> 初始化。\n2. <b>alActualizar(delta):</b> 逻辑循环。\n3. <b>actualizarFijo(delta):</b> 物理步长。\n4. <b>alHacerClick():</b> 交互事件。",

        "ce-docs-master-cap6-title": "第 6 章：动画系统",
        "ce-docs-master-cap6-content": "<b>AnimatorController</b> 是状态机。<b>Smart Mode</b> 可根据速度自动切换动画。",

        "ce-docs-master-cap7-title": "第 7 章：项目组织",
        "ce-docs-master-cap7-content": "使用 <b>Tags</b> 识别物体，使用 <b>Layers</b> 控制碰撞层级，以及 <b>Sorting Layers</b> 控制渲染深度。",

        "ce-docs-master-cap8-title": "第 8 章：游戏设计心理学",
        "ce-docs-master-cap8-content": "反馈 (Feedback) 是关键。通过音效和屏幕抖动 (screenshake) 让玩家感受到每一次交互。",

        "ce-docs-master-cap9-title": "第 9 章：特效与细节磨砺",
        "ce-docs-master-cap9-content": "使用粒子系统 (Particles) 和后期处理 (Post-Processing) 如 Bloom 效果来提升游戏画质。",

        "ce-docs-master-cap10-title": "第 10 章：动态世界与视差滚动",
        "ce-docs-master-cap10-content": "使用 <b>Parallax</b> 创建 3D 深度感。动态环境光照可以改变世界氛围。",

        "ce-docs-master-cap11-title": "第 11 章：预制体 (Prefabs)",
        "ce-docs-master-cap11-content": "预制体是主模板。修改预制体，场景中所有的实例都会同步更新。非常适合子弹和敌人。",

        "ce-docs-master-cap12-title": "第 12 章：技术问答",
        "ce-docs-master-cap12-content": "使用 <b>DeltaTime</b> 确保帧率无关性。通过瓦片地图减少渲染批次 (Draw Calls)。",

        "ce-docs-scripting-cap0-title": "第 0 章：您的第一个脚本 (觉醒)",
        "ce-docs-scripting-cap0-desc": "代码是灵魂。从 <b>ve motor;</b> 开始。\n\n<b>挑战 0：</b> 让物体持续旋转。",
        "ce-docs-scripting-cap0-code": "ve motor;\n\nalActualizar(delta) {\n    rotacion += 100 * delta;\n}",

        "ce-docs-scripting-cap1-title": "第 1 章：CES 哲学",
        "ce-docs-scripting-cap1-content": "极简语法。直接使用 <b>posicion</b> 而不需要 this。CES 是 JavaScript 的高性能抽象。",

        "ce-docs-scripting-cap2-title": "第 2 章：脚本结构",
        "ce-docs-scripting-cap2-content": "分为：头文件、变量定义区 (publico) 和事件区。",

        "ce-docs-scripting-cap3-title": "第 3 章：变量与编辑器交互",
        "ce-docs-scripting-cap3-content": "使用 <b>publico</b> 关键字将变量暴露给编辑器，实现零代码调优。\n\n<b>挑战 3：</b> 创建一个公共速度变量并在编辑器中修改它。",

        "ce-docs-scripting-cap4-title": "第 4 章：专业生命周期",
        "ce-docs-scripting-cap4-events": "alEmpezar 用于获取组件，alActualizar 用于实时控制。",

        "ce-docs-scripting-cap5-title": "第 5 章：输入控制",
        "ce-docs-scripting-cap5-code": "alActualizar(delta) {\n    bianliang horizontal = 0;\n    ruguo (teclaPressionada(\"d\")) horizontal = 1;\n    posicion.x += horizontal * (300 * delta);\n    \n    ruguo (teclaRecienPresionada(\"Space\") && 正在触摸标签(\"地面\")) {\n        wuli.applyImpulse(xin Vector2(0, -15));\n    }\n}",

        "ce-docs-scripting-cap6-title": "第 6 章：API 词典",
        "ce-docs-scripting-cap6-content": "快速访问：posicion, fisica, animacion, audio, reproducir。",

        "ce-docs-scripting-cap7-title": "第 7 章：全局消息通信",
        "ce-docs-scripting-cap7-emisor": "difundir(\"GameOver\", { score: 100 });",
        "ce-docs-scripting-cap7-receptor": "alRecibir(\"GameOver\", (data) => { ... });",

        "ce-docs-scripting-cap8-title": "第 8 章：协程与异步",
        "ce-docs-scripting-cap8-code1": "async alEmpezar() {\n    esperar(3);\n    imprimir(\"已激活！\");\n}",

        "ce-docs-scripting-cap9-title": "第 9 章：实用方案集",
        "ce-docs-scripting-cap9-mov": "使用 lerp() 实现平滑的摄像机跟随。",

        "ce-docs-scripting-cap10-title": "第 10 章：Web 端优化",
        "ce-docs-scripting-cap10-tips": "避免在 Update 中频繁调用 buscar()。使用对象池技术。",

        "ce-docs-scripting-cap11-title": "第 11 章：深入底层",
        "ce-docs-scripting-cap11-content": "CES 会转译为高度优化的 JavaScript。支持所有原生 JS 函数。"
    },
    it: {
        "ce-docs-nav-cap0": "Cap 0: Primo Script",
        "ce-docs-nav-cap1": "Cap 1: Filosofia",
        "ce-docs-nav-cap2": "Cap 2: Anatomia",
        "ce-docs-nav-cap3": "Cap 3: Variabili",
        "ce-docs-nav-cap4": "Cap 4: Ciclo di Vita",
        "ce-docs-nav-cap5": "Cap 5: Input & Fisica",
        "ce-docs-nav-cap6": "Cap 6: Dizionario API",
        "ce-docs-nav-cap7": "Cap 7: Messaggistica",
        "ce-docs-nav-cap8": "Cap 8: Coroutine",
        "ce-docs-nav-cap9": "Cap 9: Cookbook",
        "ce-docs-nav-cap10": "Cap 10: Ottimizzazione",
        "ce-docs-nav-cap11": "Cap 11: Sotto il Cofano",

        "ce-nav-docs-masterbook": "Libro Mastro",
        "ce-docs-master-title": "Libro Mastro del Motore",
        "ce-docs-master-intro": "Benvenuto nella guida definitiva. Domina Creative Engine dalle fondamenta alle tecniche più avanzate in questi 12 capitoli tecnici.",

        "ce-docs-master-cap1-title": "Capitolo 1: L'Attore, lo Script e la Gerarchia",
        "ce-docs-master-cap1-content": "<b>Cos'è una Materia?</b>\nUna Materia è l'atomo del tuo gioco. È semplicemente un punto con posizione (X, Y), rotazione e scala.\n\n<b>Gerarchia (Padre e Figlio):</b>\nLe Materie possono essere annidate. Se muovi un Padre, tutti i suoi Figli si muovono con lui. Essenziale per braccia di personaggi o armi.",

        "ce-docs-master-cap2-title": "Capitolo 2: Catalogo Materie",
        "ce-docs-master-cap2-content": "• <b>Materia Vuota:</b> Spawn point.\n• <b>Materia Sprite:</b> Rendering 2D.\n• <b>Materia Luce:</b> Ombre dinamiche.\n• <b>Materia Audio:</b> Suoni spaziali.\n• <b>Materia Tilemap:</b> Ottimizzata per livelli giganti.",

        "ce-docs-master-cap3-title": "Capitolo 3: L'Universo dell'Interface (UI)",
        "ce-docs-master-cap3-content": "Tutta la UI deve essere figlia di un <b>Canva</b>. Usa gli <b>Anchor</b> per assicurare che i pulsanti si adattino a ogni schermo.",

        "ce-docs-master-cap4-title": "Capitolo 4: Fisica, Collisioni e Raycast",
        "ce-docs-master-cap4-content": "Rigidbody 2D per la fisica. <b>Trigger</b> per zone di rilevamento. <b>Raycasting</b> per dare 'vista' all'IA o rilevamento preciso del terreno.",

        "ce-docs-master-cap5-title": "Capitolo 5: Il Ritmo della Vita (Ciclo di Vita)",
        "ce-docs-master-cap5-content": "1. <b>alEmpezar():</b> Alla creazione.\n2. <b>alActualizar(delta):</b> Logica ogni frame.\n3. <b>actualizarFijo(delta):</b> Fisica stabile.\n4. <b>alHacerClick():</b> Interazione utente.",

        "ce-docs-master-cap6-title": "Capitolo 6: Animazione",
        "ce-docs-master-cap6-content": "L'<b>AnimatorController</b> gestisce gli stati. Il <b>Smart Mode</b> cambia animazione in base alla velocità senza codice.",

        "ce-docs-master-cap7-title": "Capitolo 7: Organizzazione Maestra",
        "ce-docs-master-cap7-content": "Usa i <b>Tag</b> per identificare oggetti e i <b>Layer</b> per il controllo delle collisioni.",

        "ce-docs-master-cap8-title": "Capitolo 8: Psicologia del Design",
        "ce-docs-master-cap8-content": "Il <b>Feedback</b> è vitale. Usa suoni e vibrazioni della camera (screenshake) per rendere l'azione soddisfacente.",

        "ce-docs-master-cap9-title": "Capitolo 9: Effetti e 'Juice'",
        "ce-docs-master-cap9-content": "Aggiungi stile con sistemi di particelle e post-processing come il Bloom per luci brillanti.",

        "ce-docs-master-cap10-title": "Capitolo 10: Mondi Dinamici e Parallax",
        "ce-docs-master-cap10-content": "Usa il Parallax per la profondità 3D in 2D. L'illuminazione ambientale cambia l'atmosfera globale.",

        "ce-docs-master-cap11-title": "Capitolo 11: Prefab",
        "ce-docs-master-cap11-content": "I <b>Prefab</b> sono modelli. Modifica il Prefab e ogni istanza nel gioco si aggiornerà all'istante.",

        "ce-docs-master-cap12-title": "Capitolo 12: FAQ Tecnica",
        "ce-docs-master-cap12-content": "Usa <b>DeltaTime</b> per la velocità costante. Ottimizza con le Tilemap per ridurre le Draw Call.",

        "ce-docs-scripting-cap0-title": "Capitolo 0: Il Tuo Primo Script (Il Risveglio)",
        "ce-docs-scripting-cap0-desc": "Il codice è l'anima. Inizia con <b>ve motor;</b>.\n\n<b>Sfida 0:</b> Fai ruotare un oggetto.",
        "ce-docs-scripting-cap0-code": "ve motor;\n\nalActualizar(delta) {\n    rotazione += 100 * delta;\n}",

        "ce-docs-scripting-cap1-title": "Capitolo 1: Filosofia CES",
        "ce-docs-scripting-cap1-content": "Sintassi umana. Usa <b>posicion</b> invece di this. CES è uno strato veloce costruito su JavaScript.",

        "ce-docs-scripting-cap2-title": "Capitolo 2: Anatomia di un .ces",
        "ce-docs-scripting-cap2-content": "Diviso in: Intestazione, Variabili (publico) ed Eventi.",

        "ce-docs-scripting-cap3-title": "Capitolo 3: Variabili e Ispettore",
        "ce-docs-scripting-cap3-content": "Usa <b>publico</b> per mostrare le variabili nell'editor e regolarle in tempo reale.\n\n<b>Sfida 3:</b> Crea una variabile di velocità pubblica.",

        "ce-docs-scripting-cap4-title": "Capitolo 4: Ciclo di Vita Pro",
        "ce-docs-scripting-cap4-events": "alEmpezar per il setup, alActualizar per la logica di gioco.",

        "ce-docs-scripting-cap5-title": "Capitolo 5: Input e Controllo",
        "ce-docs-scripting-cap5-code": "alActualizar(delta) {\n    variable horizontal = 0;\n    si (teclaPressionada(\"d\")) horizontal = 1;\n    posicion.x += horizontal * (300 * delta);\n    \n    si (teclaRecienPresionada(\"Space\") && estaTocandoTag(\"Suolo\")) {\n        fisica.applyImpulse(nuevo Vector2(0, -15));\n    }\n}",

        "ce-docs-scripting-cap6-title": "Capitolo 6: Dizionario API",
        "ce-docs-scripting-cap6-content": "Accesso rapido: posicion, fisica, animacion, audio, reproducir.",

        "ce-docs-scripting-cap7-title": "Capitolo 7: Messaggistica Globale",
        "ce-docs-scripting-cap7-emisor": "difundir(\"GameOver\", { score: 100 });",
        "ce-docs-scripting-cap7-receptor": "alRecibir(\"GameOver\", (data) => { ... });",

        "ce-docs-scripting-cap8-title": "Capitolo 8: Coroutine",
        "ce-docs-scripting-cap8-code1": "async alEmpezar() {\n    esperar(3);\n    imprimir(\"Attivato!\");\n}",

        "ce-docs-scripting-cap9-title": "Capitolo 9: Cookbook",
        "ce-docs-scripting-cap9-mov": "Camera follow fluida usando lerp().",

        "ce-docs-scripting-cap10-title": "Capitolo 10: Ottimizzazione Web",
        "ce-docs-scripting-cap10-tips": "Evita buscar() in Update. Usa l'Object Pooling per i proiettili.",

        "ce-docs-scripting-cap11-title": "Capitolo 11: Sotto il Cofano",
        "ce-docs-scripting-cap11-content": "CES viene transpilato in JS ottimizzato. Supporta le funzioni native di JS."
    },
    ja: {
        "ce-docs-nav-cap0": "第 0 章: 初めてのスクリプト",
        "ce-docs-nav-cap1": "第 1 章: 哲学",
        "ce-docs-nav-cap2": "第 2 章: 解剖学",
        "ce-docs-nav-cap3": "第 3 章: 変数",
        "ce-docs-nav-cap4": "第 4 章: ライフサイクル",
        "ce-docs-nav-cap5": "第 5 章: 入力と物理",
        "ce-docs-nav-cap6": "第 6 章: API 辞書",
        "ce-docs-nav-cap7": "第 7 章: メッセージング",
        "ce-docs-nav-cap8": "第 8 章: コルーチン",
        "ce-docs-nav-cap9": "第 9 章: クックブック",
        "ce-docs-nav-cap10": "第 10 章: 最適化",
        "ce-docs-nav-cap11": "第 11 章: 内部構造",

        "ce-nav-docs-masterbook": "マスターブック",
        "ce-docs-master-title": "エンジン・マスターブック",
        "ce-docs-master-intro": "究極のガイドへようこそ。この12章でCreative Engineのプロフェッショナルになりましょう。",

        "ce-docs-master-cap1-title": "第 1 章: アクター、スクリプト、階層",
        "ce-docs-master-cap1-content": "<b>マテリア</b>はゲームの原子です。階層構造により、腕や武器などの親子関係を構築できます。親を動かすと子が追従します。",

        "ce-docs-master-cap2-title": "第 2 章: マテリア・カタログ",
        "ce-docs-master-cap2-content": "• <b>空のマテリア:</b> 生成点。\n• <b>スプライト:</b> 2D描画。\n• <b>ライト:</b> 動的な影。\n• <b>オーディオ:</b> 立体音響。\n• <b>タイルマップ:</b> 巨大ステージの最適化。",

        "ce-docs-master-cap3-title": "第 3 章: UI 宇宙",
        "ce-docs-master-cap3-content": "UIは<b>Canva</b>の子要素である必要があります。<b>Anchors</b>を使用して、あらゆる画面サイズに対応させます。",

        "ce-docs-master-cap4-title": "第 4 章: 物理、衝突、レイキャスト",
        "ce-docs-master-cap4-content": "Rigidbody 2Dで物理を適用します。<b>Triggers</b>で接触検知、<b>Raycasting</b>でAIの視覚を実装します。",

        "ce-docs-master-cap5-title": "第 5 章: ライフサイクル",
        "ce-docs-master-cap5-content": "1. <b>alEmpezar():</b> 開始時。\n2. <b>alActualizar(delta):</b> 毎フレーム。\n3. <b>actualizarFijo(delta):</b> 物理演算用。\n4. <b>alHacerClick():</b> クリック時。",

        "ce-docs-master-cap6-title": "第 6 章: アニメーション",
        "ce-docs-master-cap6-content": "<b>AnimatorController</b>で状態を管理。<b>Smart Mode</b>は速度に応じて自動でアニメーションを切り替えます。",

        "ce-docs-master-cap7-title": "第 7 章: プロジェクト構成",
        "ce-docs-master-cap7-content": "<b>Tags</b>でオブジェクトを識別し、<b>Layers</b>で衝突を制御します。",

        "ce-docs-master-cap8-title": "第 8 章: デザイン心理学",
        "ce-docs-master-cap8-content": "<b>フィードバック</b>が重要です。効果音や画面の揺れ（screenshake）で、操作に心地よさを与えます。",

        "ce-docs-master-cap9-title": "第 9 章: エフェクトと仕上げ",
        "ce-docs-master-cap9-content": "パーティクルシステムとポストプロセッシング（Bloomなど）で、ゲームの質を向上させます。",

        "ce-docs-master-cap10-title": "第 10 章: 動的な世界とパララックス",
        "ce-docs-master-cap10-content": "パララックスで奥行きを演出します。環境光で昼夜の雰囲気を一瞬で切り替えられます。",

        "ce-docs-master-cap11-title": "第 11 章: プレハブ (Prefabs)",
        "ce-docs-master-cap11-content": "プレハブは金型です。一つ変更すれば、ゲーム内の全コピーが更新されます。弾丸や敵に最適です。",

        "ce-docs-master-cap12-title": "第 12 章: 技術FAQ",
        "ce-docs-master-cap12-content": "<b>DeltaTime</b>でPC間の速度を同期。タイルマップで描画負荷（Draw Calls）を軽減します。",

        "ce-docs-scripting-cap0-title": "第 0 章: 初めてのスクリプト (目覚め)",
        "ce-docs-scripting-cap0-desc": "コードは魂です。<b>ve motor;</b>から始めましょう。\n\n<b>チャレンジ 0:</b> オブジェクトを回転させます。",
        "ce-docs-scripting-cap0-code": "ve motor;\n\nalActualizar(delta) {\n    rotacion += 100 * delta;\n}",

        "ce-docs-scripting-cap1-title": "第 1 章: CES 哲学",
        "ce-docs-scripting-cap1-content": "人間が読みやすい構文。thisは不要です。CESはJavaScript上の高速なレイヤーです。",

        "ce-docs-scripting-cap2-title": "第 2 章: スクリプトの構造",
        "ce-docs-scripting-cap2-content": "ヘッダー、変数定義（publico）、イベントの3つのエリアに分かれます。",

        "ce-docs-scripting-cap3-title": "第 3 章: 変数とエディター",
        "ce-docs-scripting-cap3-content": "<b>publico</b> を使ってエディターから値を直接調整できるようにします。\n\n<b>チャレンジ 3:</b> 公開速度変数を作成してください。",

        "ce-docs-scripting-cap4-title": "第 4 章: プロのライフサイクル",
        "ce-docs-scripting-cap4-events": "alEmpezarで初期設定、alActualizarでフレーム毎の処理を行います。",

        "ce-docs-scripting-cap5-title": "第 5 章: 入力制御",
        "ce-docs-scripting-cap5-code": "alActualizar(delta) {\n    variable horizontal = 0;\n    if (teclaPressionada(\"d\")) horizontal = 1;\n    posicion.x += horizontal * (300 * delta);\n    \n    if (teclaRecienPresionada(\"Space\") && estaTocandoTag(\"Floor\")) {\n        fisica.applyImpulse(new Vector2(0, -15));\n    }\n}",

        "ce-docs-scripting-cap6-title": "第 6 章: API 辞書",
        "ce-docs-scripting-cap6-content": "直接アクセス：posicion, fisica, animacion, audio, reproducir。",

        "ce-docs-scripting-cap7-title": "第 7 章: グローバルメッセージ",
        "ce-docs-scripting-cap7-emisor": "difundir(\"GameOver\", { score: 100 });",
        "ce-docs-scripting-cap7-receptor": "alRecibir(\"GameOver\", (data) => { ... });",

        "ce-docs-scripting-cap8-title": "第 8 章: コルーチン",
        "ce-docs-scripting-cap8-code1": "async alEmpezar() {\n    esperar(3);\n    imprimir(\"起動！\");\n}",

        "ce-docs-scripting-cap9-title": "第 9 章: クックブック",
        "ce-docs-scripting-cap9-mov": "lerp()を使用した滑らかなカメラ追従。",

        "ce-docs-scripting-cap10-title": "第 10 章: 最適化",
        "ce-docs-scripting-cap10-tips": "Update内でbuscar()を多用しないでください。オブジェクトプールを使用しましょう。",

        "ce-docs-scripting-cap11-title": "第 11 章: 内部構造",
        "ce-docs-scripting-cap11-content": "CESは最適化されたJSに変換されます。ネイティブJS関数を使用可能です。"
    },
    sw: {
        "ce-docs-nav-cap0": "Sura ya 0: Script ya Kwanza",
        "ce-docs-nav-cap1": "Sura ya 1: Falsafa",
        "ce-docs-nav-cap2": "Sura ya 2: Anatomia",
        "ce-docs-nav-cap3": "Sura ya 3: Vigezo",
        "ce-docs-nav-cap4": "Sura ya 4: Mzunguko wa Maisha",
        "ce-docs-nav-cap5": "Sura ya 5: Ingizo na Fizikia",
        "ce-docs-nav-cap6": "Sura ya 6: Kamusi ya API",
        "ce-docs-nav-cap7": "Sura ya 7: Ujumbe",
        "ce-docs-nav-cap8": "Sura ya 8: Coroutines",
        "ce-docs-nav-cap9": "Sura ya 9: Cookbook",
        "ce-docs-nav-cap10": "Sura ya 10: Uboreshaji",
        "ce-docs-nav-cap11": "Sura ya 11: Ndani ya Mitambo",

        "ce-nav-docs-masterbook": "Kitabu Mkuu",
        "ce-docs-master-title": "Kitabu Mkuu cha Injini",
        "ce-docs-master-intro": "Karibu kwenye mwongozo kamili. Jifunze kutumia Creative Engine kupitia sura hizi 12 za kiufundi, kutoka misingi hadi mifumo ya kitaalamu.",

        "ce-docs-master-cap1-title": "Sura ya 1: Muigizaji, Script, na Uongozi",
        "ce-docs-master-cap1-content": "<b>Materia ni nini?</b>\nMateria ni atomi ya mchezo wako. Ni nukta yenye nafasi (X, Y), mzunguko, na ukubwa. Uongozi (Hierarchy) unaruhusu Mzazi na Mtoto; Mzazi akisogea, Mtoto anamfuata.",

        "ce-docs-master-cap2-title": "Sura ya 2: Orodha ya Materia",
        "ce-docs-master-cap2-content": "• <b>Empty Matter:</b> Pointi za spawn.\n• <b>Sprite:</b> Picha za 2D.\n• <b>Mwanga:</b> Vivuli.\n• <b>Sauti:</b> Sauti za anga.\n• <b>Tilemap:</b> Ramani kubwa zilizoboreshwa.",

        "ce-docs-master-cap3-title": "Sura ya 3: Ulimwengu wa UI",
        "ce-docs-master-cap3-content": "UI lazima iwe mtoto wa <b>Canva</b>. <b>Anchors</b> zinahakikisha UI inakaa sawa kwenye skrini tofauti.",

        "ce-docs-master-cap4-title": "Sura ya 4: Fizikia na Raycast",
        "ce-docs-master-cap4-content": "Rigidbody 2D kwa uzito. <b>Triggers</b> kwa maeneo ya kugundua. <b>Raycasting</b> kwa 'maono' ya AI au kugundua ardhi kwa usahihi.",

        "ce-docs-master-cap5-title": "Sura ya 5: Mzunguko wa Maisha",
        "ce-docs-master-cap5-content": "1. <b>alEmpezar():</b> Wakati wa kuanza.\n2. <b>alActualizar(delta):</b> Kila fremu.\n3. <b>actualizarFijo(delta):</b> Kwa fizikia.\n4. <b>alHacerClick():</b> Tukio la kugusa.",

        "ce-docs-master-cap6-title": "Sura ya 6: Uhuishaji",
        "ce-docs-master-cap6-content": "<b>AnimatorController</b> ni mashine ya hali. <b>Smart Mode</b> inabadilisha uhuishaji kulingana na kasi bila code.",

        "ce-docs-master-cap7-title": "Sura ya 7: Mpangilio wa Miradi",
        "ce-docs-master-cap7-content": "Tumia <b>Tags</b> kutambua vitu na <b>Layers</b> kudhibiti migongano.",

        "ce-docs-master-cap8-title": "Sura ya 8: Saikolojia ya Ubunifu",
        "ce-docs-master-cap8-content": "<b>Feedback</b> ni muhimu sana. Sauti na mtikisiko wa kamera (screenshake) hufanya mchezo 'uhisiwe'.",

        "ce-docs-master-cap9-title": "Sura ya 9: Madoido na 'Juice'",
        "ce-docs-master-cap9-content": "Ongeza madoido kwa kutumia mifumo ya chembe (Particles) na post-processing kama Bloom kwa mwangaza.",

        "ce-docs-master-cap10-title": "Sura ya 10: Ulimwengu na Parallax",
        "ce-docs-master-cap10-content": "Tumia Parallax kwa muonekano wa 3D. Mwanga wa mazingira unabadilisha anga kwa amri moja.",

        "ce-docs-master-cap11-title": "Sura ya 11: Prefabs",
        "ce-docs-master-cap11-content": "<b>Prefabs</b> ni kielelezo kikuu. Badilisha kielelezo kimoja, na nakala zote kwenye mchezo zitasasishwa.",

        "ce-docs-master-cap12-title": "Sura ya 12: Maswali ya Kiufundi",
        "ce-docs-master-cap12-content": "Tumia <b>DeltaTime</b> kwa kasi thabiti. Boresha utendaji kwa kutumia Tilemaps.",

        "ce-docs-scripting-cap0-title": "Sura ya 0: Script Yako ya Kwanza (Uamsho)",
        "ce-docs-scripting-cap0-desc": "Code ni roho ya Materia. Anza na <b>ve motor;</b>.\n\n<b>Changamoto 0:</b> Fanya kitu kizunguke.",
        "ce-docs-scripting-cap0-code": "ve motor;\n\nalActualizar(delta) {\n    rotacion += 100 * delta;\n}",

        "ce-docs-scripting-cap1-title": "Sura ya 1: Falsafa ya CES",
        "ce-docs-scripting-cap1-content": "Syntax rahisi kusoma. Tumia <b>posicion</b> badala ya this. CES ni safu ya haraka juu ya JavaScript.",

        "ce-docs-scripting-cap2-title": "Sura ya 2: Anatomia ya Script",
        "ce-docs-scripting-cap2-content": "Imegawanywa katika: Kichwa, Vigezo (publico), na Matukio.",

        "ce-docs-scripting-cap3-title": "Sura ya 3: Vigezo na Mkaguzi",
        "ce-docs-scripting-cap3-content": "Tumia <b>publico</b> ili kuona vigezo kwenye kihariri na kuvibadilisha wakati mchezo unaendelea.\n\n<b>Changamoto 3:</b> Tengeneza kigezo cha kasi cha public.",

        "ce-docs-scripting-cap4-title": "Sura ya 4: Mzunguko wa Pro",
        "ce-docs-scripting-cap4-events": "alEmpezar kwa mipangilio, alActualizar kwa logiki ya kila fremu.",

        "ce-docs-scripting-cap5-title": "Sura ya 5: Udhibiti wa Ingizo",
        "ce-docs-scripting-cap5-code": "alActualizar(delta) {\n    variable horizontal = 0;\n    kama (teclaPressionada(\"d\")) horizontal = 1;\n    posicion.x += horizontal * (300 * delta);\n    \n    kama (teclaRecienPresionada(\"Space\") && estaTocandoTag(\"Ardhi\")) {\n        fisica.applyImpulse(nuevo Vector2(0, -15));\n    }\n}",

        "ce-docs-scripting-cap6-title": "Sura ya 6: Kamusi ya API",
        "ce-docs-scripting-cap6-content": "Ufikiaji wa moja kwa moja: posicion, fisica, animacion, audio, reproducir.",

        "ce-docs-scripting-cap7-title": "Sura ya 7: Ujumbe wa Ulimwengu",
        "ce-docs-scripting-cap7-emisor": "difundir(\"GameOver\", { score: 100 });",
        "ce-docs-scripting-cap7-receptor": "alRecibir(\"GameOver\", (data) => { ... });",

        "ce-docs-scripting-cap8-title": "Sura ya 8: Coroutines",
        "ce-docs-scripting-cap8-code1": "async alEmpezar() {\n    esperar(3);\n    imprimir(\"Imewashwa!\");\n}",

        "ce-docs-scripting-cap9-title": "Sura ya 9: Cookbook",
        "ce-docs-scripting-cap9-mov": "Kufuata kwa kamera laini kwa kutumia lerp().",

        "ce-docs-scripting-cap10-title": "Sura ya 10: Uboreshaji wa Web",
        "ce-docs-scripting-cap10-tips": "Epuka kutumia buscar() kwenye Update. Tumia Object Pooling kwa risasi.",

        "ce-docs-scripting-cap11-title": "Sura ya 11: Ndani ya Mitambo",
        "ce-docs-scripting-cap11-content": "CES inabadilishwa kuwa JS iliyoboreshwa. Inasaidia kazi asilia za JS."
    }
};
