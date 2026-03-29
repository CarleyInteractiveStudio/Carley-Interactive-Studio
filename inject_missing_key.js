const fs = require('fs');

const key = "ce-docs-not-available";
const values = {
    es: "La documentación no está disponible actualmente en este idioma.",
    en: "Documentation is currently not available in this language.",
    pt: "A documentação não está disponível no momento neste idioma.",
    ru: "Документация на этом языке в данный момент недоступна.",
    zh: "该语言目前的文档尚未提供。",
    fr: "La documentation n'est pas disponible actuellement dans cette langue.",
    it: "La documentazione non è attualmente disponibile in questa lingua.",
    ja: "現在、この言語のドキュメントは利用できません。",
    sw: "Nyaraka hazipatikani kwa sasa katika lugha hii."
};

let content = fs.readFileSync('js/main.js', 'utf8');

for (const lang in values) {
    const sectionPattern = new RegExp(`    ${lang}: \\{`, 'g');
    const match = sectionPattern.exec(content);
    if (!match) continue;

    const sectionStart = match.index;
    let sectionEnd = content.indexOf('    },', sectionStart);
    if (sectionEnd === -1) {
        sectionEnd = content.indexOf('    }', sectionStart);
    }

    const langBlock = content.slice(sectionStart, sectionEnd);
    if (!langBlock.includes(`\"${key}\":`)) {
        const insertion = `        \"${key}\": \"${values[lang]}\",\n`;
        content = content.slice(0, sectionEnd) + insertion + content.slice(sectionEnd);
    }
}

fs.writeFileSync('js/main.js', content);
