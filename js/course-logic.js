/* ==============================
   Course Logic System - Professional & Fun
   Updated with Combat, Multi-Mechanics & Sync
============================== */

let currentProgress = {
    stage: 1,
    course: 1,
    completed: []
};

let activeStage = null;
let activeCourse = null;
let currentStepIndex = 0;
let userHealth = 3;
let selectedBlocks = []; // For sorting/completing mechanics

/* ==============================
   Sound Manager (Web Audio API)
============================== */
const SoundManager = {
    ctx: null,
    init() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    playTone(freq, type, duration, volume = 0.1) {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },
    pop() { this.playTone(600, 'sine', 0.1); },
    ding() {
        this.playTone(880, 'sine', 0.1, 0.15);
        setTimeout(() => this.playTone(1108, 'sine', 0.2, 0.1), 50);
    },
    uhoh() {
        this.playTone(300, 'triangle', 0.2);
        setTimeout(() => this.playTone(200, 'triangle', 0.3), 150);
    },
    bossHit() { this.playTone(150, 'square', 0.1, 0.2); },
    gameOver() {
        this.playTone(200, 'sawtooth', 0.5, 0.2);
        setTimeout(() => this.playTone(100, 'sawtooth', 0.8, 0.1), 300);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const checkSupabase = setInterval(async () => {
        if (window.supabaseClient) {
            clearInterval(checkSupabase);
            await initAuthCheck();
            await loadProgress();
            renderMap();
            updateUIProgress();
        }
    }, 100);

    window.addEventListener('resize', renderMap);
});

async function initAuthCheck() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    const lang = localStorage.getItem('carley-lang') || 'es';

    if (session) {
        const { data: profile } = await window.supabaseClient
            .from('profiles')
            .select('language')
            .eq('id', session.user.id)
            .single();

        const userLang = profile?.language || lang;
        if (userLang !== 'es') {
            showSorryMessage();
        }
    } else {
        if (!localStorage.getItem('course-lang-picked')) {
            showLanguageSelection();
        }
    }
}

async function loadProgress() {
    // Try Supabase first
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session) {
        const { data, error } = await window.supabaseClient
            .from('course_progress')
            .select('stage, completed_courses')
            .eq('user_id', session.user.id)
            .single();

        if (data && !error) {
            currentProgress.stage = data.stage;
            currentProgress.completed = data.completed_courses;
            return;
        }
    }

    // Fallback to local
    const saved = localStorage.getItem('ces-course-progress');
    if (saved) currentProgress = JSON.parse(saved);
}

async function saveProgress() {
    localStorage.setItem('ces-course-progress', JSON.stringify(currentProgress));

    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session) {
        await window.supabaseClient
            .from('course_progress')
            .upsert({
                user_id: session.user.id,
                stage: currentProgress.stage,
                completed_courses: currentProgress.completed,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
    }
}

function updateUIProgress() {
    const total = 100;
    const completedCount = currentProgress.completed.length;
    const percent = Math.floor((completedCount / total) * 100);
    const bar = document.getElementById('main-progress-bar');
    if (bar) bar.style.width = percent + '%';
    const stats = document.getElementById('user-stats');
    if (stats) stats.textContent = percent + '%';
}

function renderMap() {
    const map = document.getElementById('map-view');
    if (!map || map.classList.contains('hidden')) return;

    let mapWidth = map.offsetWidth;
    if (mapWidth === 0) {
        // Fallback for initial render or headless
        mapWidth = Math.min(window.innerWidth, 1000) - 40;
    }

    const stages = window.courseData.stages;
    const nodes = map.querySelectorAll('.stage-node, .map-svg');
    nodes.forEach(n => n.remove());

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "map-svg");
    svg.style.position = "absolute";
    svg.style.top = "0"; svg.style.left = "0";
    svg.style.width = "100%"; svg.style.height = "100%";
    svg.style.zIndex = "1";
    map.appendChild(svg);

    const positions = [];

    stages.forEach((stage, index) => {
        const node = document.createElement('div');
        node.className = 'stage-node';
        if (stage.id > currentProgress.stage) node.classList.add('locked');

        const offset = Math.sin(index * 1.5) * (mapWidth / 4);
        const x = (mapWidth / 2) + offset;
        const y = 150 + (index * 220);

        node.style.left = `${x - 60}px`;
        node.style.top = `${y - 60}px`;
        node.style.borderColor = stage.color;
        node.style.boxShadow = `0 0 30px ${stage.color}44`;
        node.style.position = 'absolute';

        node.innerHTML = `
            <i data-lucide="${getStageIcon(index)}" style="color:${stage.color}; width:45px; height:45px;"></i>
            <span class="stage-label">${stage.name}</span>
        `;

        node.onclick = () => {
            SoundManager.pop();
            selectStage(stage);
        };
        map.appendChild(node);
        positions.push({x, y});
    });

    let pathD = "";
    positions.forEach((p, i) => {
        if (i === 0) pathD += `M ${p.x} ${p.y}`;
        else {
            const prev = positions[i-1];
            const cp1y = prev.y + (p.y - prev.y) / 2;
            pathD += ` C ${prev.x} ${cp1y}, ${p.x} ${cp1y}, ${p.x} ${p.y}`;
        }
    });

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathD);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "rgba(255,255,255,0.08)");
    path.setAttribute("stroke-width", "10");
    path.setAttribute("stroke-dasharray", "20, 15");
    svg.appendChild(path);

    const char = document.getElementById('character');
    const currentPos = positions[currentProgress.stage - 1];
    if (currentPos && char) {
        updateCharacterAccessories(char);
        char.classList.add('char-walking');
        char.style.left = `${currentPos.x - 30}px`;
        char.style.top = `${currentPos.y - 60}px`;
        setTimeout(() => char.classList.remove('char-walking'), 1000);
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
    map.style.height = (stages.length * 220 + 300) + 'px';
}

function getStageIcon(i) {
    const icons = ['code', 'box', 'zap', 'volume-2', 'cpu', 'shield', 'layers', 'gem', 'star', 'trophy'];
    return icons[i] || 'book';
}

function selectStage(stage) {
    if (stage.id > currentProgress.stage) return;
    activeStage = stage;
    document.getElementById('map-view').classList.add('hidden');
    document.getElementById('stage-detail-view').classList.remove('hidden');
    document.getElementById('current-stage-name').textContent = stage.name;
    document.getElementById('current-stage-name').style.color = stage.color;
    renderSubMap();
}

function renderSubMap() {
    const container = document.getElementById('sub-map-container');
    if (!container) return;
    container.innerHTML = '';

    const courses = activeStage.courses;
    const mapWidth = container.offsetWidth;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "map-svg");
    svg.style.position = "absolute";
    svg.style.top = "0"; svg.style.left = "0";
    svg.style.width = "100%"; svg.style.height = "100%";
    svg.style.zIndex = "1";
    container.appendChild(svg);

    const positions = [];
    courses.forEach((course, index) => {
        const node = document.createElement('div');
        node.className = 'stage-node';

        const isDone = currentProgress.completed.includes(course.id);
        const isNext = !isDone && (index === 0 || currentProgress.completed.includes(courses[index-1].id));
        const isLocked = !isDone && !isNext;

        if (isLocked) node.classList.add('locked');

        const offset = Math.sin(index * 2) * (mapWidth / 5);
        const x = (mapWidth / 2) + offset;
        const y = 50 + (index * 180);

        node.style.left = `${x - 50}px`;
        node.style.top = `${y - 50}px`;
        node.style.width = '100px';
        node.style.height = '100px';
        node.style.borderColor = isDone ? '#7ED957' : (isNext ? activeStage.color : 'rgba(255,255,255,0.1)');
        node.style.position = 'absolute';

        node.innerHTML = `
            <span style="font-weight:900; font-size:2rem; color:${isDone ? '#7ED957' : '#fff'}">${index + 1}</span>
        `;

        if (!isLocked) node.onclick = () => {
            SoundManager.pop();
            startCourse(course);
        };
        container.appendChild(node);
        positions.push({x, y, isDone, isNext});
    });

    let pathD = "";
    positions.forEach((p, i) => {
        if (i === 0) pathD += `M ${p.x} ${p.y}`;
        else {
            const prev = positions[i-1];
            pathD += ` L ${p.x} ${p.y}`;
        }
    });

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathD);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "rgba(255,255,255,0.05)");
    path.setAttribute("stroke-width", "6");
    svg.appendChild(path);

    const subChar = document.createElement('div');
    subChar.id = 'sub-character';
    subChar.className = 'char-body';
    subChar.style.width = '40px'; subChar.style.height = '40px';
    subChar.style.position = 'absolute';
    subChar.style.zIndex = '10';
    subChar.innerHTML = '<div class="char-eye" style="width:5px; height:5px;"></div><div class="char-eye" style="width:5px; height:5px;"></div>';
    updateCharacterAccessories(subChar);

    let charPos = positions[0];
    for(let i=0; i<positions.length; i++) {
        if(positions[i].isNext) {
            charPos = positions[i];
            break;
        }
        if(positions[i].isDone) charPos = positions[i];
    }

    subChar.classList.add('char-walking');
    subChar.style.left = `${charPos.x - 20}px`;
    subChar.style.top = `${charPos.y - 60}px`;
    container.appendChild(subChar);
    setTimeout(() => subChar.classList.remove('char-walking'), 1000);

    container.style.height = (courses.length * 180 + 200) + 'px';
}

function startCourse(course) {
    activeCourse = course;
    currentStepIndex = 0;
    userHealth = 3;
    updateHealthUI();
    document.getElementById('stage-detail-view').classList.add('hidden');
    document.getElementById('lesson-view').classList.remove('hidden');
    renderStep();
}

function updateHealthUI() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((h, i) => {
        if (i < userHealth) h.classList.remove('lost');
        else h.classList.add('lost');
    });
}

function renderStep() {
    const step = activeCourse.steps[currentStepIndex];
    const isBoss = activeCourse.isBoss;
    document.getElementById('lesson-title').textContent = activeCourse.title;

    const lessonView = document.getElementById('lesson-view');
    lessonView.style.background = isBoss ? 'radial-gradient(circle at center, #200, #000)' : '';

    const status = document.getElementById('practice-status');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    const feedback = document.getElementById('feedback-msg');
    feedback.classList.add('hidden');
    selectedBlocks = [];

    const bossCont = document.getElementById('boss-container');
    bossCont.className = isBoss ? '' : 'hidden';

    const area = document.getElementById('practice-area');
    area.innerHTML = '';

    if (step.type === 'teoria') {
        document.getElementById('lesson-text').textContent = step.content;
        document.getElementById('lesson-code-wrapper').classList.remove('hidden');
        document.getElementById('lesson-code').textContent = step.code;
        status.textContent = 'APRENDIENDO';
        status.style.background = '#00AAFF';
        document.getElementById('practice-question').textContent = 'Estudia este concepto y continúa.';
        checkBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');
    } else {
        document.getElementById('lesson-text').textContent = '';
        document.getElementById('lesson-code-wrapper').classList.add('hidden');
        status.textContent = 'PRÁCTICA';
        status.style.background = '#FFC300';
        document.getElementById('practice-question').textContent = step.question;
        checkBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');

        if (step.type === 'practica') {
            area.innerHTML = '<input type="text" class="code-input" id="answer-input" placeholder="Tu respuesta...">';
            document.getElementById('answer-input').focus();
        } else if (step.type === 'opcion-multiple') {
            const grid = document.createElement('div');
            grid.className = 'options-grid';
            step.options.forEach((opt, i) => {
                const card = document.createElement('div');
                card.className = 'option-card';
                card.textContent = opt.text;
                card.onclick = () => selectOption(card, opt);
                grid.appendChild(card);
            });
            area.appendChild(grid);
            checkBtn.classList.add('hidden');
        } else if (step.type === 'completar-codigo') {
            const template = document.createElement('div');
            template.className = 'code-template-view';
            template.innerHTML = step.codeTemplate.replace('[BLOQUE]', '<span class="template-slot" id="target-slot">?</span>');
            area.appendChild(template);

            const blocks = document.createElement('div');
            blocks.className = 'block-zone';
            step.blocks.forEach(b => {
                const item = document.createElement('div');
                item.className = 'code-block-item';
                item.textContent = b;
                item.onclick = () => {
                    document.querySelectorAll('.code-block-item').forEach(x => x.classList.remove('selected'));
                    item.classList.add('selected');
                    const slot = document.getElementById('target-slot');
                    slot.textContent = b;
                    slot.classList.add('filled');
                    selectedBlocks = [b];
                };
                blocks.appendChild(item);
            });
            area.appendChild(blocks);
        } else if (step.type === 'ordenar-blocks' || step.type === 'ordenar-bloques') {
            const template = document.createElement('div');
            template.className = 'code-template-view';
            template.id = 'sequence-template';
            template.innerHTML = '<span style="opacity:0.5; font-size:0.9rem;">Toca los bloques en orden:</span>';
            area.appendChild(template);

            const blocks = document.createElement('div');
            blocks.className = 'block-zone';
            step.blocks.forEach(b => {
                const item = document.createElement('div');
                item.className = 'code-block-item';
                item.textContent = b;
                item.onclick = () => {
                    if (item.classList.contains('selected')) return;
                    item.classList.add('selected');
                    selectedBlocks.push(b);
                    const slot = document.createElement('span');
                    slot.className = 'template-slot filled';
                    slot.textContent = b;
                    slot.style.margin = '5px';
                    document.getElementById('sequence-template').appendChild(slot);
                };
                blocks.appendChild(item);
            });
            area.appendChild(blocks);
        }
    }
}

function selectOption(card, opt) {
    if (opt.correct) {
        card.classList.add('correct');
        checkAnswer(true);
    } else {
        card.classList.add('wrong');
        checkAnswer(false);
    }
}

function checkAnswer(isCorrectOverride = null) {
    const step = activeCourse.steps[currentStepIndex];
    let isCorrect = false;

    if (isCorrectOverride !== null) {
        isCorrect = isCorrectOverride;
    } else if (step.type === 'practica') {
        const val = document.getElementById('answer-input').value.trim();
        isCorrect = val.toLowerCase() === step.answer.toLowerCase();
    } else if (step.type === 'completar-codigo') {
        isCorrect = selectedBlocks[0] === step.answer;
    } else if (step.type === 'ordenar-blocks' || step.type === 'ordenar-bloques') {
        isCorrect = JSON.stringify(selectedBlocks) === JSON.stringify(step.answer);
    }

    if (isCorrect) {
        handleSuccess();
    } else {
        handleFailure();
    }
}

function handleSuccess() {
    SoundManager.ding();
    const char = document.getElementById('lesson-character');
    const boss = document.querySelector('.boss-bug');

    char.classList.add('char-attack');
    setTimeout(() => {
        char.classList.remove('char-attack');
        if (activeCourse.isBoss) {
            boss.classList.add('boss-hit');
            SoundManager.bossHit();
            setTimeout(() => boss.classList.remove('boss-hit'), 500);
        }
    }, 300);

    if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#7ED957', '#00AAFF'] });
    }
    showFeedback(true);
}

function handleFailure() {
    userHealth--;
    updateHealthUI();
    SoundManager.uhoh();

    const char = document.getElementById('lesson-character');
    const boss = document.querySelector('.boss-bug');

    if (activeCourse.isBoss) {
        boss.style.transform = 'translateX(-50px) scale(1.2)';
        setTimeout(() => {
            boss.style.transform = '';
            char.classList.add('char-hit');
            setTimeout(() => char.classList.remove('char-hit'), 500);
        }, 200);
    } else {
        char.classList.add('char-hit');
        setTimeout(() => char.classList.remove('char-hit'), 500);
    }

    if (userHealth <= 0) {
        SoundManager.gameOver();
        alert("¡Oh no! Te has quedado sin corazones. Inténtalo de nuevo.");
        startCourse(activeCourse);
        return;
    }

    let hint = "Algo no está bien. ¡Inténtalo de nuevo!";
    const step = activeCourse.steps[currentStepIndex];
    if (step.type === 'practica') {
        const val = document.getElementById('answer-input').value;
        if (val === "") hint = "No dejes el campo vacío.";
        else if (step.answer.toLowerCase().includes(val.toLowerCase()) && val.length > 2) hint = "¡Casi! Revisa bien la sintaxis.";
    }
    showFeedback(false, hint);
}

function showFeedback(correct, hint = "") {
    const card = document.querySelector('.practice-card');
    const status = document.getElementById('practice-status');
    const nextBtn = document.getElementById('next-btn');
    const checkBtn = document.getElementById('check-btn');
    const feedback = document.getElementById('feedback-msg');

    if (correct) {
        card.classList.remove('shake');
        card.classList.add('bounce');
        setTimeout(() => card.classList.remove('bounce'), 600);
        status.textContent = '¡EXCELENTE!';
        status.style.background = '#7ED957';
        checkBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');
        feedback.classList.add('hidden');
    } else {
        card.classList.remove('bounce');
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 600);
        status.textContent = '¡CUIDADO! TE GOLPEARON';
        status.style.background = '#ff4d4d';
        feedback.innerHTML = hint;
        feedback.classList.remove('hidden');

        // Reset blocks for sequence mechanics on fail
        const step = activeCourse.steps[currentStepIndex];
        if (step.type.includes('ordenar')) {
            setTimeout(() => renderStep(), 1000);
        }
    }
}

async function nextStep() {
    if (currentStepIndex < activeCourse.steps.length - 1) {
        currentStepIndex++;
        renderStep();
    } else {
        if (!currentProgress.completed.includes(activeCourse.id)) {
            currentProgress.completed.push(activeCourse.id);
            const ids = activeStage.courses.map(c => c.id);
            if (ids.every(id => currentProgress.completed.includes(id)) && currentProgress.stage === activeStage.id) {
                currentProgress.stage++;
            }
        }
        await saveProgress();
        updateUIProgress();

        const all = window.courseData.stages.flatMap(s => s.courses);
        const idx = all.findIndex(c => c.id === activeCourse.id);
        if (idx < all.length - 1) {
            startCourse(all[idx + 1]);
        } else {
            alert("¡INCREÍBLE! HAS COMPLETADO EL CAMINO DISPONIBLE.");
            backToMap();
        }
    }
}

window.speakContent = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const step = activeCourse.steps[currentStepIndex];
    const text = step.type === 'teoria' ? step.content : step.question;
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = 'es-ES';

    const lessonChar = document.getElementById('lesson-character');
    ut.onstart = () => { if (lessonChar) lessonChar.classList.add('char-talking'); };
    ut.onend = () => { if (lessonChar) lessonChar.classList.remove('char-talking'); };
    window.speechSynthesis.speak(ut);
};

function backToMap() {
    document.getElementById('map-view').classList.remove('hidden');
    document.getElementById('stage-detail-view').classList.add('hidden');
    document.getElementById('lesson-view').classList.add('hidden');
    renderMap();
}

function showLanguageSelection() {
    const modal = document.createElement('div');
    modal.id = 'lang-selection-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="course-modal">
            <h2 style="margin-bottom:20px; font-weight:900;">¡Hola! 👋</h2>
            <p style="opacity:0.7; margin-bottom:25px; line-height:1.6;">El curso técnico de Creative Engine Scripting actualmente solo está disponible en <b>Español</b>.</p>
            <div style="display:flex; flex-direction:column; gap:12px;">
                <button class="btn-main" onclick="pickLang('es')">Español (Empezar ahora)</button>
                <button class="btn-main" style="background:#222; color:#555; cursor:not-allowed;" disabled>English (Próximamente)</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

window.pickLang = (lang) => {
    localStorage.setItem('carley-lang', lang);
    localStorage.setItem('course-lang-picked', 'true');
    window.location.reload();
};

function showSorryMessage() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="course-modal" style="border-top: 5px solid #ff4d4d;">
            <div class="char-body" style="width:70px; height:70px; margin: 0 auto 20px; background:#ff4d4d; box-shadow: 0 0 30px rgba(255,77,77,0.4);">
                <div class="char-eye" style="height:4px; width:15px; border-radius:2px; transform: rotate(15deg); background:#000;"></div>
                <div class="char-eye" style="height:4px; width:15px; border-radius:2px; transform: rotate(-15deg); background:#000;"></div>
            </div>
            <h2 style="color:#ff4d4d; font-weight:900;">Lo sentimos mucho</h2>
            <p style="opacity:0.9; margin-top:20px; line-height:1.7; font-size: 1.1rem;">
                Hola. Lamentamos informarte que no tenemos cursos disponibles en tu idioma seleccionado actualmente.
                <br><br>
                Estamos trabajando duro para traducir todo el Gran Libro de CES. ¿Podrías volver luego por favor?
            </p>
            <button class="btn-main" style="margin-top:30px; background:#fff; color:#000;" onclick="window.location.href='index.html'">Volver al Inicio</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function updateCharacterAccessories(char) {
    const existing = char.querySelectorAll('.char-accessory');
    existing.forEach(e => e.remove());
    if (currentProgress.stage > 1) {
        const hat = document.createElement('div');
        hat.className = 'char-accessory hat-expert';
        char.appendChild(hat);
    }
}
