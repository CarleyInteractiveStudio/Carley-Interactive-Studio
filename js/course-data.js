window.courseData = {
    stages: [
        {
            id: 1, name: "Fundamentos I", color: "#7ED957",
            courses: [
                {
                    id: 1,
                    title: "El Despertar: ve motor;",
                    steps: [
                        { type: "teoria", content: "Bienvenido al motor. Todo script profesional comienza con una conexión vital: 've motor;'. Sin esta línea, tu script no inicializará.", code: "ve motor;" },
                        { type: "practica", question: "Escribe la instrucción obligatoria para conectar con el motor:", answer: "ve motor;" }
                    ]
                },
                {
                    id: 2,
                    title: "Consola: imprimir()",
                    steps: [
                        { type: "teoria", content: "Para hablar con el desarrollador, el motor usa 'imprimir()'. Esto muestra mensajes en la consola de depuración.", code: "ve motor;\n\nalEmpezar() {\n    imprimir(\"¡Hola Mundo!\");\n}" },
                        { type: "practica", question: "Función para mostrar mensajes en consola:", answer: "imprimir" }
                    ]
                },
                {
                    id: 3,
                    title: "Variables Públicas",
                    steps: [
                        { type: "teoria", content: "La palabra 'publico' expone una variable al Inspector del editor para que puedas cambiarla sin programar.", code: "publico numero velocidad = 10;" },
                        { type: "practica", question: "¿Qué palabra clave hace visible una variable en el editor?", answer: "publico" }
                    ]
                },
                {
                    id: 4,
                    title: "Contador de Vida",
                    steps: [
                        { type: "teoria", content: "Usamos el tipo 'numero' para guardar salud o puntos. Se pueden restar valores con '-'.", code: "publico numero vida = 100;\nvida = vida - 10;" },
                        { type: "practica", question: "Completa para restar 5 puntos: puntos = puntos ___ 5;", answer: "-" }
                    ]
                },
                {
                    id: 5,
                    title: "El Interruptor",
                    steps: [
                        { type: "teoria", content: "Un 'booleano' guarda 'verdadero' o 'falso'. El signo '!' invierte su estado.", code: "publico booleano luz = verdadero;\nluz = !luz;" },
                        { type: "practica", question: "¿Cuál es el valor opuesto a verdadero?", answer: "falso" }
                    ]
                },
                {
                    id: 6,
                    title: "Posición X",
                    steps: [
                        { type: "teoria", content: "La propiedad 'posicion.x' controla el movimiento horizontal en el mundo 2D.", code: "alActualizar(delta) {\n    posicion.x += 1;\n}" },
                        { type: "practica", question: "Propiedad para la posición horizontal:", answer: "posicion.x" }
                    ]
                },
                {
                    id: 7,
                    title: "El Mouse",
                    steps: [
                        { type: "teoria", content: "'obtenerPosicionMouse()' detecta dónde está el puntero del usuario.", code: "variable m = obtenerPosicionMouse();" },
                        { type: "practica", question: "Función para obtener la posición del mouse:", answer: "obtenerPosicionMouse" }
                    ]
                },
                {
                    id: 8,
                    title: "Pintar: Color",
                    steps: [
                        { type: "teoria", content: "Podemos cambiar el tono visual usando 'nuevo Color(r, g, b)'.", code: "renderizadorDeSprite.color = nuevo Color(255, 0, 0);" },
                        { type: "practica", question: "¿Qué componente controla el color de un objeto?", answer: "renderizadorDeSprite" }
                    ]
                },
                {
                    id: 9,
                    title: "Corrutina: esperar()",
                    steps: [
                        { type: "teoria", content: "Para pausar el código sin congelar el juego, usamos 'esperar(segundos)'.", code: "esperar(3); // Pausa 3 segundos" },
                        { type: "practica", question: "Escribe la función para pausar 2 segundos:", answer: "esperar(2)" }
                    ]
                },
                {
                    id: 10,
                    title: "Eliminar: destruir()",
                    steps: [
                        { type: "teoria", content: "Para borrar un objeto del mundo para siempre usamos 'destruir(materia)'.", code: "destruir(materia);" },
                        { type: "practica", question: "¿Qué función borra un objeto?", answer: "destruir" }
                    ]
                }
            ]
        }
    ]
};

// Generación automática de las etapas restantes hasta llegar a 100 cursos
const stageColors = ["#7ED957", "#00AAFF", "#FF5733", "#FFC300", "#DAF7A6", "#C70039", "#900C3F", "#581845", "#1C2833", "#000000"];
const stageNames = ["Fundamentos I", "Fundamentos II", "Físicas y Choques", "Animación Pro", "Interfaz de Usuario", "Sistemas de IA", "Efectos Visuales", "Arquitectura", "Proyectos I", "Nivel Leyenda"];

for (let s = 1; s <= 10; s++) {
    let stage = window.courseData.stages.find(st => st.id === s);
    if (!stage) {
        stage = {
            id: s,
            name: stageNames[s-1],
            color: stageColors[s-1],
            courses: []
        };
        window.courseData.stages.push(stage);
    }

    for (let c = 1; c <= 10; c++) {
        let globalId = (s - 1) * 10 + c;
        if (!stage.courses.find(co => co.id === globalId)) {
            stage.courses.push({
                id: globalId,
                title: "Lección Avanzada " + globalId,
                steps: [
                    { type: "teoria", content: "Continuamos con el estudio del Gran Libro de CES. Lección técnica " + globalId + ".", code: "ve motor;\n// Código CES avanzado\nvariable v = 100;" },
                    { type: "practica", question: "Escribe 've motor;' para continuar", answer: "ve motor;" }
                ]
            });
        }
    }
}
