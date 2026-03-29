const fs = require('fs');

const codes = {
    es: {
        "ce-docs-tech-title": "5. Sistemas Técnicos",
        "ce-docs-particles-title": "Partículas",
        "ce-docs-particles-desc": "Crea efectos visuales complejos como fuego o humo.",
        "ce-docs-particles-code": "particulas.emitir(10);\nparticulas.detener();",
        "ce-docs-post-title": "Post-procesamiento",
        "ce-docs-post-desc": "Filtros visuales globales como Bloom o Corrección de Color.",
        "ce-docs-post-code": "postProcesado.bloom = verdadero;\npostProcesado.vignette = 0.5;",
        "ce-docs-audio-title": "Audio",
        "ce-docs-audio-desc": "Gestión de música y efectos de sonido.",
        "ce-docs-audio-code": "sonido.reproducir(\"Explosion\");\nsonido.volumenPrincipal = 1.0;",
        "ce-docs-opt-title": "Optimización",
        "ce-docs-opt-desc": "Herramientas para mejorar el rendimiento del juego."
    },
    en: {
        "ce-docs-tech-title": "5. Technical Systems",
        "ce-docs-particles-title": "Particles",
        "ce-docs-particles-desc": "Create complex visual effects like fire or smoke.",
        "ce-docs-particles-code": "particles.emit(10);\nparticles.stop();",
        "ce-docs-post-title": "Post-Processing",
        "ce-docs-post-desc": "Global visual filters like Bloom or Color Correction.",
        "ce-docs-post-code": "postProcessing.bloom = true;\npostProcessing.vignette = 0.5;",
        "ce-docs-audio-title": "Audio",
        "ce-docs-audio-desc": "Management of music and sound effects.",
        "ce-docs-audio-code": "sound.play(\"Explosion\");\nsound.masterVolume = 1.0;",
        "ce-docs-opt-title": "Optimization",
        "ce-docs-opt-desc": "Tools to improve game performance."
    },
    pt: {
        "ce-docs-tech-title": "5. Sistemas Técnicos",
        "ce-docs-particles-title": "Partículas",
        "ce-docs-particles-desc": "Cria efeitos visuais complexos como fogo ou fumo.",
        "ce-docs-particles-code": "particulas.emitir(10);\nparticulas.detener();",
        "ce-docs-post-title": "Pós-processamento",
        "ce-docs-post-desc": "Filtros visuais globais como Bloom ou Correção de Cor.",
        "ce-docs-post-code": "posProcessamento.bloom = verdadero;\nposProcessamento.vignette = 0.5;",
        "ce-docs-audio-title": "Áudio",
        "ce-docs-audio-desc": "Gestão de música e efeitos sonoros.",
        "ce-docs-audio-code": "som.reproducir(\"Explosion\");\nsom.volumenPrincipal = 1.0;",
        "ce-docs-opt-title": "Otimização",
        "ce-docs-opt-desc": "Ferramentas para melhorar o desempenho do jogo."
    },
    ru: {
        "ce-docs-tech-title": "5. Технические системы",
        "ce-docs-particles-title": "Частицы",
        "ce-docs-particles-desc": "Создавайте сложные визуальные эффекты, такие как огонь или дым.",
        "ce-docs-particles-code": "chasticy.emit(10);\nchasticy.stop();",
        "ce-docs-post-title": "Пост-обработка",
        "ce-docs-post-desc": "Глобальные визуальные фильтры, такие как Bloom или коррекция цвета.",
        "ce-docs-post-code": "postProcesado.bloom = istina;\npostProcessing.vignette = 0.5;",
        "ce-docs-audio-title": "Аудио",
        "ce-docs-audio-desc": "Управление музыкой и звуковыми эффектами.",
        "ce-docs-audio-code": "zvuk.play(\"Explosion\");\nzvuk.masterVolume = 1.0;",
        "ce-docs-opt-title": "Оптимизация",
        "ce-docs-opt-desc": "Инструменты для повышения производительности игры."
    },
    zh: {
        "ce-docs-tech-title": "5. 技术系统",
        "ce-docs-particles-title": "粒子",
        "ce-docs-particles-desc": "创建复杂的视觉效果，如火或烟。",
        "ce-docs-particles-code": "lizi.fashe(10);\nlizi.tingzhi();",
        "ce-docs-post-title": "后处理",
        "ce-docs-post-desc": "全局视觉滤镜，如 Bloom 或色彩校正。",
        "ce-docs-post-code": "houchuli.bloom = zhen;\nhouchuli.vignette = 0.5;",
        "ce-docs-audio-title": "音频",
        "ce-docs-audio-desc": "音乐和音效管理。",
        "ce-docs-audio-code": "yinpin.bofang(\"Explosion\");\nyinpin.zhuyinliang = 1.0;",
        "ce-docs-opt-title": "优化",
        "ce-docs-opt-desc": "提高游戏性能的工具。"
    }
};

let content = fs.readFileSync('js/main.js', 'utf8');

for (const lang in codes) {
    const sectionPattern = new RegExp(`    ${lang}: \\{`, 'g');
    const match = sectionPattern.exec(content);
    if (!match) continue;

    const sectionStart = match.index;
    let sectionEnd = content.indexOf('        },', sectionStart);
    if (sectionEnd === -1) {
        sectionEnd = content.indexOf('    },', sectionStart);
    }
    if (sectionEnd === -1) {
        sectionEnd = content.indexOf('    }', sectionStart);
    }

    const langBlock = content.slice(sectionStart, sectionEnd);

    let insertion = '';
    for (const key in codes[lang]) {
        if (!langBlock.includes(`\"${key}\":`)) {
            const escapedValue = codes[lang][key].replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\"/g, '\\\"');
            insertion += `        \"${key}\": \"${escapedValue}\",\n`;
        }
    }

    if (insertion) {
        content = content.slice(0, sectionEnd) + insertion + content.slice(sectionEnd);
    }
}

fs.writeFileSync('js/main.js', content);
