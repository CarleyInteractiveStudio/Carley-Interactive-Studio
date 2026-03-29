const fs = require('fs');

const codes = {
    es: {
        "btn-see-support": "Ver Colaboradores",
        "ce-docs-advanced-build-title": "3. El Sistema de Build",
        "ce-docs-advanced-intro": "Gestión de activos, diseño de niveles y publicación.",
        "ce-docs-advanced-scenes-title": "2. Gestión de Escenas",
        "ce-docs-advanced-struct-title": "1. Estructura de Proyectos",
        "ce-docs-advanced-title": "Guía Avanzada",
        "ce-docs-audiosource-desc": "Reproduce efectos de sonido o música.",
        "ce-docs-audiosource-inspector": "Uso en Inspector: Soporta Audio Espacial (el volumen baja si el objeto se aleja).",
        "ce-docs-audiosource-name": "AudioSource (Fuente de Audio)",
        "ce-docs-carl-act-1": "Botón Superior: Icono del robot 🤖 (Carl)",
        "ce-docs-carl-act-2": "Atajo: Shift + Ctrl + L",
        "ce-docs-config-ambient-title": "2. Control de Ambiente",
        "ce-docs-config-intro": "Personaliza tu flujo de trabajo y atmósfera.",
        "ce-docs-config-project-title": "1. Configuración del Proyecto",
        "ce-docs-config-title": "Configuración y Ambiente",
        "ce-docs-editors-anim-title": "2. Editor de Animaciones",
        "ce-docs-editors-intro": "Suite de herramientas para animaciones y niveles.",
        "ce-docs-editors-sprite-title": "1. Editor de Sprites",
        "ce-docs-editors-tilemap-title": "3. Editor de Tilemaps",
        "ce-docs-editors-title": "Guía de Editores Visuales",
        "ce-docs-terminal-activate": "Cómo Activar la Terminal",
        "ce-docs-terminal-fs-title": "1. Comandos de Sistema",
        "ce-docs-terminal-intro": "La Terminal es una herramienta avanzada para interactuar con el motor mediante comandos de texto.",
        "ce-docs-terminal-scene-title": "2. Comandos de Escena",
        "ce-docs-terminal-title": "Guía de la Terminal",
        "ce-donate-intro": "Tu apoyo es lo que mantiene este proyecto vivo y gratuito para todos. Con total transparencia, te compartimos que mantener Creative Engine requiere cubrir costos de servidores y desarrollo para que siga siendo una herramienta accesible para todos sin barreras económicas. Sus donaciones ayudarán a que otros usen nuestras herramientas gratuitamente.",
        "ce-info-1": "Creative Engine fue diseñado para todo público. No importa que seas experto, novato o no tengas experiencia alguna, Creative Engine te ayuda y te enseña.",
        "ce-info-2": "Nuestro motor fue inspirado de Unity pero se basa en materias y leyes. Las materias pueden ser cualquier cosa de tu juego y las leyes todo lo que define el comportamiento de cada cosa de tu juego; son un conjunto de reglas que hacen tu juego único y hacerlo lo que quieras que sea.",
        "ce-nav-claims": "Reclamos",
        "ce-nav-donations": "Donaciones",
        "ce-nav-join": "Únete y Seguirnos",
        "ce-nav-license": "Licencia",
        "ce-nav-opinions": "Opiniones",
        "ce-nav-privacy": "Privacidad",
        "ce-nav-report": "Reportar Bug",
        "ce-tutorial-carl-desc": "Aprende a activar a Carl, tu compañero de desarrollo que te acompañará en el desarrollo de tus videojuegos.",
        "ce-tutorial-carl-title": "Cómo activar a Carl",
        "ce-tutorial-desc": "Aprende los fundamentos de Creative Engine y empieza tu aventura como desarrollador.",
        "ce-tutorial-prog-desc": "Aprende a programar tus propios videojuegos usando CES (Creative Engine Scripting) and other coding tools.",
        "ce-tutorial-prog-title": "Cómo programar en Creative Engine",
        "ce-tutorial-title": "Cómo crear tu primer juego",
        "ce-tutorial-ui-desc": "Aprende la interfaz de Creative Engine para crear con facilidad. Descubrirás todo lo que tiene el motor en su lanzamiento y para qué sirve cada herramienta; así sabrás mejor cómo crear tu videojuego.",
        "ce-tutorial-ui-title": "Aprende la interfaz de Creative Engine"
    }
};

let content = fs.readFileSync('js/main.js', 'utf8');

const lang = 'es';
const sectionPattern = new RegExp(`    ${lang}: \\{`, 'g');
const match = sectionPattern.exec(content);
if (match) {
    const sectionStart = match.index;
    let sectionEnd = content.indexOf('        },', sectionStart);
    if (sectionEnd === -1) sectionEnd = content.indexOf('    },', sectionStart);
    if (sectionEnd === -1) sectionEnd = content.indexOf('    }', sectionStart);

    let insertion = '';
    for (const key in codes[lang]) {
        if (!content.includes(`\"${key}\":`)) {
            const escapedValue = codes[lang][key].replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\"/g, '\\\"');
            insertion += `        \"${key}\": \"${escapedValue}\",\n`;
        }
    }

    if (insertion) {
        content = content.slice(0, sectionEnd) + insertion + content.slice(sectionEnd);
    }
}

fs.writeFileSync('js/main.js', content);
