/* ==============================
   Course Logic System - Professional & Fun
   Updated with Combat, Multi-Mechanics, Shop & Sync
============================== */

// Global State Object for external access and persistence
window.currentProgress = {
    stage: 1,
    course: 1,
    completed: [],
    credits: 0,
    ownedSkins: ['default'],
    activeSkin: 'default',
    ownedAccessories: [],
    activeAccessory: null,
    achievements: []
};

window.activeStage = null;
window.activeCourse = null;
window.currentStepIndex = 0;
window.userHealth = 3;
window.selectedBlocks = [];
window.bgmSource = null;
window.isMusicOn = false;

// Certification Metrics
window.examStartTime = 0;
window.examMistakes = 0;

// Internal aliases for existing code compatibility
let currentProgress = window.currentProgress; // Object reference is shared

const skins = {
    'default': { name: 'Carl Original', color: '#7ED957', price: 0 },
    'ocean': { name: 'Carl Oceánico', color: '#00AAFF', price: 50 },
    'lava': { name: 'Carl Volcánico', color: '#FF5733', price: 50 },
    'gold': { name: 'Carl Dorado', color: '#FFD700', price: 150 },
    'void': { name: 'Carl del Vacío', color: '#8A2BE2', price: 200 }
};

const accessories = {
    'glasses': { name: 'Gafas de Genio', price: 75, class: 'acc-glasses' },
    'pirate': { name: 'Sombrero Pirata', price: 100, class: 'acc-pirate' },
    'fire': { name: 'Aura Ígnea', price: 150, class: 'acc-fire' },
    'cape': { name: 'Capa de Héroe', price: 200, class: 'acc-cape' }
};

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
    },
    achievement() {
        [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'sine', 0.4, 0.1), i * 150);
        });
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
            updateCreditsUI();
        }
    }, 100);

    window.addEventListener('resize', renderMap);
});

async function initAuthCheck() {
    const { data: { session: currentSession } } = await window.supabaseClient.auth.getSession();
    const lang = localStorage.getItem('carley-lang') || 'es';

    // Update Course UI Auth
    const guestUI = document.getElementById('course-auth-guest');
    const userUI = document.getElementById('course-auth-user');
    if (currentSession) {
        if (guestUI) guestUI.classList.add('hidden');
        if (userUI) {
            userUI.classList.remove('hidden');
            document.getElementById('course-user-name').textContent = currentSession.user.user_metadata.username || currentSession.user.email.split('@')[0];
            document.getElementById('course-user-avatar').src = currentSession.user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${currentSession.user.email}`;
        }
    } else {
        if (guestUI) guestUI.classList.remove('hidden');
        if (userUI) userUI.classList.add('hidden');
    }

    if (currentSession) {
        const { data: profile } = await window.supabaseClient
            .from('profiles')
            .select('language')
            .eq('id', currentSession.user.id)
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
    const { data: { session: loadSession } } = await window.supabaseClient.auth.getSession();
    if (loadSession) {
        const { data, error } = await window.supabaseClient
            .from('course_progress')
            .select('*')
            .eq('user_id', loadSession.user.id)
            .single();

        if (data && !error) {
            currentProgress.stage = data.stage;
            currentProgress.completed = data.completed_courses || [];
            currentProgress.credits = data.credits || 0;
            currentProgress.ownedSkins = data.owned_skins || ['default'];
            currentProgress.activeSkin = data.active_skin || 'default';
            currentProgress.ownedAccessories = data.owned_accessories || [];
            currentProgress.activeAccessory = data.active_accessory || null;
            currentProgress.achievements = data.achievements || [];
            return;
        }
    }

    const saved = localStorage.getItem('ces-course-progress');
    if (saved) {
        const parsed = JSON.parse(saved);
        // Deep copy to window object
        Object.assign(window.currentProgress, parsed);
        currentProgress = window.currentProgress;
    }
}

async function saveProgress() {
    localStorage.setItem('ces-course-progress', JSON.stringify(currentProgress));

    if (!window.supabaseClient) return;
    const { data: { session: saveSession } } = await window.supabaseClient.auth.getSession();
    if (saveSession) {
        await window.supabaseClient
            .from('course_progress')
            .upsert({
                user_id: saveSession.user.id,
                stage: currentProgress.stage,
                completed_courses: currentProgress.completed,
                credits: currentProgress.credits,
                owned_skins: currentProgress.ownedSkins,
                active_skin: currentProgress.activeSkin,
                owned_accessories: currentProgress.ownedAccessories,
                active_accessory: currentProgress.activeAccessory,
                achievements: currentProgress.achievements,
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

function updateCreditsUI() {
    const el = document.getElementById('user-credits');
    if (el) el.textContent = currentProgress.credits;
}

/* ==============================
   Rendering & Map
============================== */
window.renderMap = async function() {
    const map = document.getElementById('map-view');
    if (!map || map.classList.contains('hidden')) return;

    // Guest Banner Logic
    const sessionResForBanner = await window.supabaseClient?.auth.getSession();
    const sessionForBanner = sessionResForBanner?.data?.session;
    const existingBanner = document.getElementById('guest-login-banner');
    if (!sessionForBanner) {
        if (!existingBanner) {
            const banner = document.createElement('div');
            banner.id = 'guest-login-banner';
            banner.style = "background: rgba(255,195,0,0.1); border: 1px solid #FFC300; padding: 15px; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 15px;";
            banner.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <i data-lucide="alert-circle" style="color:#FFC300"></i>
                    <span style="font-size:0.9rem; color:#fff;">Estás en modo invitado. <b>Inicia sesión</b> para guardar tu progreso en la nube y obtener certificados.</span>
                </div>
                <button class="btn-main" style="padding: 8px 15px; font-size: 0.8rem;" onclick="window.location.href='sso.html'">Iniciar Sesión</button>
            `;
            map.prepend(banner);
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    } else if (existingBanner) {
        existingBanner.remove();
    }

    let mapWidth = map.offsetWidth;
    if (mapWidth === 0) mapWidth = Math.min(window.innerWidth, 1000) - 40;

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
        const y = 80 + (index * 180);

        node.style.left = `${x - 60}px`;
        node.style.top = `${y - 60}px`;
        node.style.borderColor = stage.color;
        node.style.boxShadow = `0 0 30px ${stage.color}44`;
        node.style.position = 'absolute';

        const isStageDone = stage.courses.length > 0 && stage.courses.every(c => currentProgress.completed.includes(c.id));

        node.innerHTML = `
            <i data-lucide="${isStageDone ? 'check-circle' : getStageIcon(index)}" style="color:${isStageDone ? '#7ED957' : stage.color}; width:45px; height:45px;"></i>
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
        updateCharacterVisuals(char);
        char.classList.add('char-walking');
        char.style.left = `${currentPos.x - 30}px`;
        char.style.top = `${currentPos.y - 60}px`;
        setTimeout(() => char.classList.remove('char-walking'), 1000);
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
    map.style.height = (stages.length * 180 + 150) + 'px';
    setTimeout(() => window.scrollTo(0, 0), 100);
}

function getStageIcon(i) {
    const icons = ['code', 'box', 'zap', 'volume-2', 'cpu', 'shield', 'layers', 'gem', 'star', 'trophy'];
    return icons[i] || 'book';
}

async function selectStage(stage) {
    if (stage.id > currentProgress.stage) return;

    if (stage.id === 11) {
        const { data: { session: examSession } } = await window.supabaseClient.auth.getSession();
        if (!examSession) {
            showLoginRequiredModal("Para realizar el Examen Final y obtener tu Certificado Profesional, es obligatorio tener una cuenta.");
            return;
        }
    }

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
    updateCharacterVisuals(subChar);

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

/* ==============================
   Lesson & Mechanics
============================== */
function startCourse(course) {
    window.activeCourse = course;
    const lessonChar = document.getElementById('lesson-character');
    if (lessonChar) {
        lessonChar.style.transform = 'translateX(-100px)';
        lessonChar.style.opacity = '0';
        setTimeout(() => {
            lessonChar.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            lessonChar.style.transform = 'translateX(0)';
            lessonChar.style.opacity = '1';
        }, 10);
    }
    window.currentStepIndex = 0;
    window.userHealth = 3;
    updateHealthUI();
    document.getElementById('stage-detail-view').classList.add('hidden');
    document.getElementById('lesson-view').classList.remove('hidden');
    renderStep();

    if (window.activeStage && window.activeStage.id === 11) {
        window.examStartTime = Date.now();
        window.examMistakes = 0;
    }
}

function updateHealthUI() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((h, i) => {
        if (i < window.userHealth) h.classList.remove('lost');
        else h.classList.add('lost');
    });
}

function renderStep() {
    const step = window.activeCourse.steps[window.currentStepIndex];
    const lessonChar = document.getElementById('lesson-character');
    if (lessonChar) {
        lessonChar.classList.add('char-walking');
        setTimeout(() => lessonChar.classList.remove('char-walking'), 800);
    }
    const isBoss = window.activeCourse.isBoss;
    document.getElementById('lesson-title').textContent = window.activeCourse.title;

    const lessonView = document.getElementById('lesson-view');
    lessonView.style.background = isBoss ? 'radial-gradient(circle at center, #200, #000)' : '';

    const status = document.getElementById('practice-status');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    const feedback = document.getElementById('feedback-msg');
    feedback.classList.add('hidden');
    window.selectedBlocks = [];

    const bossCont = document.getElementById('boss-container');
    if (step.type !== 'teoria') {
        bossCont.classList.remove('hidden');
        bossCont.style.transform = isBoss ? 'scale(1.2)' : 'scale(0.8)';
    } else {
        bossCont.classList.add('hidden');
    }

    updateCharacterVisuals(document.getElementById('lesson-character'));

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
            const isLong = step.answer.length > 20 || step.answer.includes('{') || step.answer.includes(';');
            if (isLong) {
                area.innerHTML = `
                    <div class="mini-editor-container">
                        <div class="editor-line-numbers" id="line-numbers">1</div>
                        <textarea class="editor-textarea" id="answer-input" placeholder="Escribe tu código aquí..." spellcheck="false"></textarea>
                    </div>
                `;
                const editor = document.getElementById('answer-input');
                const lineNumbers = document.getElementById('line-numbers');

                editor.oninput = () => {
                    const lines = editor.value.split('\n').length;
                    lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
                    lineNumbers.scrollTop = editor.scrollTop;
                };

                editor.onscroll = () => {
                    lineNumbers.scrollTop = editor.scrollTop;
                };

                editor.onkeydown = (e) => {
                    if (e.key === 'Tab') {
                        e.preventDefault();
                        const start = editor.selectionStart;
                        const end = editor.selectionEnd;
                        editor.value = editor.value.substring(0, start) + "    " + editor.value.substring(end);
                        editor.selectionStart = editor.selectionEnd = start + 4;
                    }
                };
            } else {
                area.innerHTML = '<input type="text" class="code-input" id="answer-input" placeholder="Tu respuesta...">';
            }

            const inputEl = document.getElementById('answer-input');
            inputEl.focus();
            inputEl.onkeypress = (e) => {
                if(e.key === 'Enter' && (!isLong || e.ctrlKey)) {
                    checkAnswer();
                }
            };
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
        } else if (step.type === 'ordenar-bloques') {
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
        } else if (step.type === 'modo-debug') {
            const container = document.createElement('div');
            container.style.background = '#000';
            container.style.padding = '20px';
            container.style.borderRadius = '15px';
            container.style.border = '1px solid #333';

            step.codeLines.forEach((line, i) => {
                const lineEl = document.createElement('div');
                lineEl.className = 'debug-line buggy-hover';
                lineEl.textContent = line;
                lineEl.onclick = () => checkDebug(i);
                container.appendChild(lineEl);
            });
            area.appendChild(container);
            checkBtn.classList.add('hidden');
        }
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
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

function checkDebug(index) {
    const step = activeCourse.steps[currentStepIndex];
    if (index === step.errorLine) {
        checkAnswer(true);
    } else {
        checkAnswer(false);
    }
}

function normalizeCode(code, ignoreImprimirContent = false) {
    if (!code) return "";
    let normalized = code.toLowerCase()
        .replace(/\/\/.*/g, '') // Remove single line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/\s+/g, '') // Remove all whitespace
        .replace(/;/g, '')   // Remove semicolons
        .replace(/["']/g, "'"); // Standardize quotes

    // Handle optional empty parentheses for function definitions/calls
    // This helps with alEmpezar vs alEmpezar()
    normalized = normalized.replace(/\(\)/g, '');

    // Intent detection: Normalize assignment patterns
    normalized = normalized.replace(/([a-z0-9.]+)=([a-z0-9.]+)\+([0-9.]+)/g, "$1+=$3");
    normalized = normalized.replace(/([a-z0-9.]+)=([0-9.]+)\+([a-z0-9.]+)/g, "$1+=$2");

    if (ignoreImprimirContent) {
        // Replace content inside imprimir('...') with a placeholder for comparison
        normalized = normalized.replace(/imprimir\('.*?'\)/g, "imprimir('placeholder')");
    }
    return normalized;
}

function checkAnswer(isCorrectOverride = null) {
    const step = activeCourse.steps[currentStepIndex];
    let isCorrect = false;

    if (isCorrectOverride !== null) {
        isCorrect = isCorrectOverride;
    } else if (step.type === 'practica') {
        const val = document.getElementById('answer-input').value.trim();
        const hasImprimir = step.answer.includes('imprimir(');
        isCorrect = normalizeCode(val, hasImprimir) === normalizeCode(step.answer, hasImprimir);
    } else if (step.type === 'completar-codigo') {
        isCorrect = selectedBlocks[0] === step.answer;
    } else if (step.type === 'ordenar-bloques') {
        isCorrect = JSON.stringify(selectedBlocks) === JSON.stringify(step.answer);
    }

    if (isCorrect) handleSuccess();
    else handleFailure();
}

function handleSuccess() {
    SoundManager.ding();
    const char = document.getElementById('lesson-character');
    const boss = document.querySelector('.boss-bug');

    char.classList.add('char-attack');
    setTimeout(() => {
        char.classList.remove('char-attack');
        if (boss) {
            boss.classList.add('boss-hit');
            SoundManager.bossHit();
            setTimeout(() => boss.classList.remove('boss-hit'), 500);
        }
    }, 300);

    if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: [skins[currentProgress.activeSkin].color, '#fff'] });
    }
    showFeedback(true);
}

function handleFailure() {
    userHealth--;

    // Intervention logic: if health is 1, Carl intervenes automatically
    if (userHealth === 1) {
        setTimeout(() => {
            CustomModal.show("APOYO DE CARL IA", "Veo que tienes dificultades. ¡No te rindas! Revisa las mayúsculas y asegúrate de que no falte 've motor;' si es necesario.", "🤖");
        }, 800);
    }

    if (activeStage && activeStage.id === 11) {
        examMistakes++;
    }
    updateHealthUI();
    SoundManager.uhoh();

    const char = document.getElementById('lesson-character');
    const boss = document.querySelector('.boss-bug');

    if (boss) {
        const originalTransform = boss.style.transform;
        boss.style.transform = 'translateX(-50px) scale(1.1)';
        setTimeout(() => {
            boss.style.transform = originalTransform;
            char.classList.add('char-hit');
            setTimeout(() => char.classList.remove('char-hit'), 500);
        }, 200);
    } else {
        char.classList.add('char-hit');
        setTimeout(() => char.classList.remove('char-hit'), 500);
    }

    if (userHealth <= 0) {
        SoundManager.gameOver();
        CustomModal.show("BATALLA PERDIDA", "¡Has caído en batalla! Recupérate y vuelve a intentarlo.", "💀");
        startCourse(activeCourse);
        return;
    }

    const hint = analyzeError(activeCourse.steps[currentStepIndex]);
    showFeedback(false, hint);
}

function analyzeError(step) {
    const val = document.getElementById('answer-input')?.value || "";
    if (!val) return "Escribe algo para poder ayudarte.";

    // Basic structure check
    const openBraces = (val.match(/{/g) || []).length;
    const closeBraces = (val.match(/}/g) || []).length;
    if (openBraces > closeBraces) return "Te falta cerrar una llave <code>}</code>.";
    if (closeBraces > openBraces) return "Tienes una llave <code>}</code> de más.";

    const openParens = (val.match(/\(/g) || []).length;
    const closeParens = (val.match(/\)/g) || []).length;
    if (openParens > closeParens) return "Te falta cerrar un paréntesis <code>)</code>.";
    if (closeParens > openParens) return "Tienes un paréntesis <code>)</code> de más.";

    // Logic/Keyword check
    const keywords = ['alEmpezar', 'alActualizar', 'publico', 'variable', 'si', 'imprimir', 've motor', 'fisica', 'posicion'];
    for (let kw of keywords) {
        if (step.answer.includes(kw) && val.toLowerCase().includes(kw.toLowerCase()) && !val.includes(kw)) {
            return `Recuerda que <b>${kw}</b> debe escribirse exactamente así (ojo con las mayúsculas).`;
        }
    }

    if (step.answer.includes('"') && !val.includes('"') && !val.includes("'")) {
        return "Parece que te faltan las comillas para el texto.";
    }

    return "Casi lo tienes. Revisa bien el orden y las palabras clave.";
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
        nextBtn.style.display = "inline-flex"; // Force display
        feedback.classList.add('hidden');
    } else {
        card.classList.remove('bounce');
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 600);
        status.textContent = '¡GOLPE RECIBIDO!';
        status.style.background = '#ff4d4d';
        feedback.innerHTML = hint;
        feedback.classList.remove('hidden');
        if (activeCourse.steps[currentStepIndex].type.includes('ordenar')) setTimeout(() => renderStep(), 1000);
    }
}

async function nextStep() {
    if (currentStepIndex < activeCourse.steps.length - 1) {
        currentStepIndex++;
        renderStep();
    } else {
        const isFirstTime = !currentProgress.completed.includes(activeCourse.id);
        if (isFirstTime) {
            currentProgress.completed.push(activeCourse.id);
            currentProgress.credits += activeCourse.isBoss ? 25 : 10;
            updateCreditsUI();

            const ids = activeStage.stages ? [] : activeStage.courses.map(c => c.id);
            if (!activeStage.stages && ids.every(id => currentProgress.completed.includes(id)) && currentProgress.stage === activeStage.id) {
                currentProgress.stage++;
                unlockAchievement(activeStage.name);
            }
        }

        // Final Exam Check
        if (activeStage.id === 11) {
            const allExamCourses = activeStage.courses;
            const lastExamCourse = allExamCourses[allExamCourses.length - 1];
            if (activeCourse.id === lastExamCourse.id) {
                finishExam();
                return;
            }
        }

        await saveProgress();
        updateUIProgress();

        const all = window.courseData.stages.flatMap(s => s.courses);
        const idx = all.findIndex(c => c.id === activeCourse.id);
        if (idx < all.length - 1) startCourse(all[idx + 1]);
        else {
            CustomModal.show("¡MAESTRÍA ALCANZADA!", "Has completado todos los niveles disponibles por ahora. ¡Vuelve pronto!", "🌟");
            backToMap();
        }
    }
}

window.finishExam = function() {
    const endTime = Date.now();
    const totalTimeSeconds = Math.floor((endTime - examStartTime) / 1000);

    // Grading Logic:
    // Base 100. -4 per mistake. -1 every 15s after 3 minutes.
    let score = 100;
    score -= (examMistakes * 4);
    if (totalTimeSeconds > 180) {
        score -= Math.floor((totalTimeSeconds - 180) / 15);
    }
    score = Math.max(0, score);

    let rank = "S";
    if (score < 95) rank = "A";
    if (score < 85) rank = "B";
    if (score < 70) rank = "C";
    if (score < 60) rank = "D";

    if (score >= 55) {
        window.showCertificatePrompt(score, rank, totalTimeSeconds);
    } else {
        CustomModal.show("RESULTADO EXAMEN", `Has completado el examen con un ${score}%. Necesitas al menos un 55% para certificar.\n¡Sigue practicando y vuelve a intentarlo!`, "📝");
        backToMap();
    }
}

window.generateCertificate = async (score, rank, time) => {
    if (!window.supabaseClient) return;

    // Protection Check: Verify they actually finished Stage 11 courses
    const examStage = window.courseData.stages.find(s => s.id === 11);
    const examCourseIds = examStage.courses.map(c => c.id);
    const hasFinishedExam = examCourseIds.every(id => currentProgress.completed.includes(id));

    if (currentProgress.stage < 11 || !hasFinishedExam) {
        CustomModal.show("ACCESO DENEGADO", "No puedes generar un certificado sin haber completado el examen final satisfactoriamente.", "🛡️");
        backToMap();
        return;
    }

    const { data: { session: certSession } } = await window.supabaseClient.auth.getSession();

    if (!certSession) {
        CustomModal.show("SESIÓN EXPIRADA", "Por favor, inicia sesión de nuevo para obtener tu certificado.", "🔑");
        setTimeout(() => window.location.href = 'sso.html', 2000);
        return;
    }

    const signatureData = sigCanvas.toDataURL();
    const nameInput = document.getElementById('cert-name-input');
    const name = nameInput.value.trim() || "Desarrollador Creative Engine";

    const serial = `CE-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Update Certificate Template
    document.getElementById('cert-display-name').textContent = name;
    document.getElementById('cert-display-score').textContent = score + "%";
    document.getElementById('cert-display-rank').textContent = rank;
    document.getElementById('cert-display-date').textContent = new Date().toLocaleDateString();
    document.getElementById('cert-seal-id-display').textContent = serial;

    const certSigImg = document.getElementById('cert-user-sig-img');
    if(certSigImg) {
        certSigImg.src = signatureData;
        certSigImg.classList.remove('hidden');
    }

    // Inject Achievements
    const achList = document.getElementById('cert-achievements-list');
    achList.innerHTML = currentProgress.achievements.map(a => `<span>◈ ${a}</span>`).join(' ');

    // Persistence to Supabase
    const privacy = {
        show_score: document.getElementById('privacy-score').checked,
        show_rank: document.getElementById('privacy-rank').checked,
        show_achievements: document.getElementById('privacy-achievements').checked
    };

    const { error } = await window.supabaseClient.from('certificates').insert({
        id: serial,
        user_id: certSession.user.id,
        full_name: name,
        score: parseInt(score),
        rank: rank,
        achievements: currentProgress.achievements,
        privacy_settings: privacy,
        user_signature: signatureData
    });

    if (error) {
        console.error("Error saving certificate:", error);
        CustomModal.show("ERROR DE GUARDADO", "Hubo un error guardando tu certificado en la nube, pero aún puedes descargarlo localmente.", "⚠️");
    }

    window.generatedSerial = serial; // Store for verification link

    // Show Download Modal
    const promptModal = document.getElementById('cert-prompt-modal');
    if (promptModal) promptModal.remove();

    document.getElementById('final-success-modal').classList.add('hidden');
    document.getElementById('cert-ready-modal').classList.remove('hidden');

    // Configure Sharing Links
    const text = `¡Soy oficialmente Desarrollador en Creative Engine! Mi rango: ${rank} (${score}%). Mira mi certificado:`;
    const url = window.location.href;
    document.getElementById('share-linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (typeof confetti !== 'undefined') confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
};

window.downloadPDF = () => {
    const element = document.getElementById('certificate-container');
    const opt = {
        margin: 0,
        filename: 'Certificado_Creative_Engine.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'px', format: [800, 600], orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save();
};

window.showCertificatePrompt = async function(score, rank, time) {
    const examStage = window.courseData.stages.find(s => s.id === 11);
    const examCourseIds = examStage.courses.map(c => c.id);
    const hasFinishedExam = examCourseIds.every(id => currentProgress.completed.includes(id));

    if (currentProgress.stage < 11 || !hasFinishedExam) {
        CustomModal.show("CERTIFICADO BLOQUEADO", "Primero debes completar todas las etapas del curso y aprobar el examen final.", "🛡️");
        backToMap();
        return;
    }

    const { data: { session: promptSession } } = await window.supabaseClient.auth.getSession();
    if (!promptSession) {
        CustomModal.show("¡EXAMEN COMPLETADO!", `Has aprobado con un ${score}% (Rango ${rank}). Inicia sesión para reclamar tu certificado.`, "🏆");
        setTimeout(() => window.location.href = 'sso.html', 3000);
        return;
    }

    // Use the Success Modal in HTML
    window.currentExamStats = { score, rank, time };
    document.getElementById('final-success-modal').classList.remove('hidden');
    initSignature();
};

window.finalizeCertificate = async () => {
    const nameInput = document.getElementById('cert-name-input');
    if (!nameInput.value.trim()) {
        CustomModal.show("DATO REQUERIDO", "Por favor ingresa tu nombre para el certificado.", "✍️");
        return;
    }

    const { score, rank, time } = window.currentExamStats;
    generateCertificate(score, rank, time);
};

/* ==============================
   Gamification: Shop & Achievements
============================== */
function openShop() {
    const container = document.getElementById('shop-items-container');
    container.innerHTML = '';

    // Tabs / Section Headers
    const skinTitle = document.createElement('h3');
    skinTitle.textContent = "SKINS (COLORES)";
    skinTitle.style.gridColumn = "1 / -1";
    skinTitle.style.margin = "20px 0 10px";
    skinTitle.style.fontSize = "0.9rem";
    skinTitle.style.opacity = "0.5";
    container.appendChild(skinTitle);

    Object.entries(skins).forEach(([id, skin]) => {
        const isOwned = currentProgress.ownedSkins.includes(id);
        const isActive = currentProgress.activeSkin === id;

        const card = document.createElement('div');
        card.className = `shop-item ${isOwned ? 'owned' : ''} ${isActive ? 'active' : ''}`;
        card.innerHTML = `
            <div class="skin-preview" style="background:${skin.color}; box-shadow: 0 0 15px ${skin.color}66;"></div>
            <div style="font-weight:bold; font-size:0.9rem; margin-bottom:5px;">${skin.name}</div>
            <div style="font-size:0.8rem; opacity:0.7;">${isOwned ? (isActive ? 'EQUIPADO' : 'OBTENIDO') : skin.price + ' Créditos'}</div>
        `;
        card.onclick = () => handleShopAction(id, 'skin');
        container.appendChild(card);
    });

    const accTitle = document.createElement('h3');
    accTitle.textContent = "ACCESORIOS PREMIUM";
    accTitle.style.gridColumn = "1 / -1";
    accTitle.style.margin = "30px 0 10px";
    accTitle.style.fontSize = "0.9rem";
    accTitle.style.opacity = "0.5";
    container.appendChild(accTitle);

    Object.entries(accessories).forEach(([id, acc]) => {
        const isOwned = (currentProgress.ownedAccessories || []).includes(id);
        const isActive = currentProgress.activeAccessory === id;

        const card = document.createElement('div');
        card.className = `shop-item ${isOwned ? 'owned' : ''} ${isActive ? 'active' : ''}`;
        card.innerHTML = `
            <div class="skin-preview" style="background:#333; display:flex; align-items:center; justify-content:center;">
                <div class="char-accessory ${acc.class}" style="position:relative; top:0; left:0; transform:none;"></div>
            </div>
            <div style="font-weight:bold; font-size:0.9rem; margin-bottom:5px;">${acc.name}</div>
            <div style="font-size:0.8rem; opacity:0.7;">${isOwned ? (isActive ? 'EQUIPADO' : 'OBTENIDO') : acc.price + ' Créditos'}</div>
        `;
        card.onclick = () => handleShopAction(id, 'accessory');
        container.appendChild(card);
    });

    document.getElementById('shop-modal').classList.remove('hidden');
}

function closeShop() {
    document.getElementById('shop-modal').classList.add('hidden');
    renderMap();
}

async function handleShopAction(id, type) {
    if (type === 'skin') {
        if (currentProgress.ownedSkins.includes(id)) {
            currentProgress.activeSkin = id;
        } else {
            const skin = skins[id];
            if (currentProgress.credits >= skin.price) {
                currentProgress.credits -= skin.price;
                currentProgress.ownedSkins.push(id);
                currentProgress.activeSkin = id;
                SoundManager.ding();
                updateCreditsUI();
            } else {
                CustomModal.show("FONDOS INSUFICIENTES", "No tienes suficientes créditos para esta skin.", "💰");
                return;
            }
        }
    } else {
        if (!currentProgress.ownedAccessories) currentProgress.ownedAccessories = [];
        if (currentProgress.ownedAccessories.includes(id)) {
            currentProgress.activeAccessory = (currentProgress.activeAccessory === id) ? null : id;
        } else {
            const acc = accessories[id];
            if (currentProgress.credits >= acc.price) {
                currentProgress.credits -= acc.price;
                currentProgress.ownedAccessories.push(id);
                currentProgress.activeAccessory = id;
                SoundManager.ding();
                updateCreditsUI();
            } else {
                CustomModal.show("FONDOS INSUFICIENTES", "No tienes suficientes créditos para este accesorio.", "💰");
                return;
            }
        }
    }
    await saveProgress();
    openShop();
}

function unlockAchievement(stageName) {
    const name = `Maestro de ${stageName}`;
    if (currentProgress.achievements.includes(name)) return;

    currentProgress.achievements.push(name);
    const popup = document.getElementById('achievement-popup');
    document.getElementById('achievement-name').textContent = name;
    popup.classList.remove('hidden');
    SoundManager.achievement();

    setTimeout(() => popup.classList.add('hidden'), 5000);
}

function updateCharacterVisuals(char) {
    if (!char) return;
    const body = char.classList.contains('char-body') ? char : char.querySelector('.char-body');
    if (!body) return;

    const skin = skins[currentProgress.activeSkin] || skins.default;
    body.style.background = skin.color;
    body.style.boxShadow = `0 0 25px ${skin.color}`;

    const existing = char.querySelectorAll('.char-accessory');
    existing.forEach(e => e.remove());
    if (currentProgress.stage > 1) {
        const hat = document.createElement('div');
        hat.className = 'char-accessory hat-expert';
        char.appendChild(hat);
    }
}

/* ==============================
   Audio & Utilities
============================== */
function toggleMusic() {
    isMusicOn = !isMusicOn;
    const btn = document.getElementById('bgm-toggle');
    btn.style.color = isMusicOn ? 'var(--primary)' : '#fff';

    if (isMusicOn) {
        // In a real browser we need a user gesture, which this click is.
        // For static hosting, we use procedural tones to simulate BGM loops
        startAmbientBGM();
    } else {
        stopAmbientBGM();
    }
}

function startAmbientBGM() {
    SoundManager.init();
    if (window.bgmSource) return;
    // Real loops would use Audio files, but let's use some cool oscillator patterns
    bgmLoop();
}

function stopAmbientBGM() {
    window.bgmSource = false;
}

function bgmLoop() {
    if (!window.isMusicOn) return;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C Major
    const note = notes[Math.floor(Math.random() * notes.length)];
    SoundManager.playTone(note, 'sine', 1.5, 0.02);
    setTimeout(bgmLoop, 1000);
}

window.backToMap = function() {
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

function showLoginRequiredModal(msg) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="course-modal">
            <i data-lucide="lock" style="width:50px; height:50px; color:var(--primary); margin-bottom:20px;"></i>
            <h2 style="font-weight:900; margin-bottom:15px;">ACCESO RESTRINGIDO</h2>
            <p style="opacity:0.8; line-height:1.6; margin-bottom:25px;">${msg}</p>
            <div style="display:flex; flex-direction:column; gap:12px;">
                <button class="btn-main" onclick="window.location.href='sso.html'">Iniciar Sesión / Registrarse</button>
                <button class="btn-main" style="background:transparent; border:1px solid #444;" onclick="this.closest('.modal-overlay').remove()">Volver</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    if (typeof lucide !== 'undefined') lucide.createIcons();
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

window.speakContent = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const step = activeCourse.steps[currentStepIndex];
    const text = step.type === 'teoria' ? step.content : (step.question || "");
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = 'es-ES';
    const lessonChar = document.getElementById('lesson-character');
    ut.onstart = () => { if (lessonChar) lessonChar.classList.add('char-talking'); };
    ut.onend = () => { if (lessonChar) lessonChar.classList.remove('char-talking'); };
    window.speechSynthesis.speak(ut);
};

/* ==============================
   Premium Modal System Implementation
============================== */
window.CustomModal = {
    show(title, text, icon = '✨') {
        const overlay = document.createElement('div');
        overlay.className = 'custom-modal-overlay';
        overlay.innerHTML = `
            <div class="custom-modal">
                <span class="modal-icon-header">${icon}</span>
                <h2 class="modal-title-premium">${title}</h2>
                <p class="modal-text-premium">${text}</p>
                <button class="btn-main" onclick="this.closest('.custom-modal-overlay').remove()">Entendido</button>
            </div>
        `;
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('active'), 10);
    },
    confirm(title, text, confirmLabel, icon = '❓') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'custom-modal-overlay';
            overlay.innerHTML = `
                <div class="custom-modal">
                    <span class="modal-icon-header">${icon}</span>
                    <h2 class="modal-title-premium">${title}</h2>
                    <p class="modal-text-premium">${text}</p>
                    <div style="display:flex; gap:15px;">
                        <button class="btn-main outline" style="flex:1" id="modal-cancel">Cancelar</button>
                        <button class="btn-main" style="flex:1" id="modal-confirm">${confirmLabel}</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
            setTimeout(() => overlay.classList.add('active'), 10);

            overlay.querySelector('#modal-confirm').onclick = () => {
                overlay.remove();
                resolve(true);
            };
            overlay.querySelector('#modal-cancel').onclick = () => {
                overlay.remove();
                resolve(false);
            };
        });
    }
};

/* ==============================
   Signature Logic
============================== */
let sigCanvas, sigCtx, isDrawing = false;

window.initSignature = () => {
    sigCanvas = document.getElementById('sig-canvas');
    if (!sigCanvas) return;
    sigCtx = sigCanvas.getContext('2d');

    // Set internal resolution
    sigCanvas.width = sigCanvas.offsetWidth;
    sigCanvas.height = sigCanvas.offsetHeight;

    sigCtx.strokeStyle = "#111";
    sigCtx.lineWidth = 2;
    sigCtx.lineCap = "round";

    sigCanvas.onmousedown = (e) => { isDrawing = true; sigCtx.beginPath(); sigCtx.moveTo(e.offsetX, e.offsetY); };
    sigCanvas.onmousemove = (e) => { if (isDrawing) { sigCtx.lineTo(e.offsetX, e.offsetY); sigCtx.stroke(); } };
    sigCanvas.onmouseup = () => { isDrawing = false; };

    // Touch support
    sigCanvas.ontouchstart = (e) => {
        const t = e.touches[0];
        const rect = sigCanvas.getBoundingClientRect();
        isDrawing = true;
        sigCtx.beginPath();
        sigCtx.moveTo(t.clientX - rect.left, t.clientY - rect.top);
        e.preventDefault();
    };
    sigCanvas.ontouchmove = (e) => {
        if (isDrawing) {
            const t = e.touches[0];
            const rect = sigCanvas.getBoundingClientRect();
            sigCtx.lineTo(t.clientX - rect.left, t.clientY - rect.top);
            sigCtx.stroke();
        }
        e.preventDefault();
    };
    sigCanvas.ontouchend = () => { isDrawing = false; };
};

window.clearSignature = () => {
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
};

/* ==============================
   Carl IA - Smart Assistant
============================== */
window.askCarlHelp = () => {
    const step = activeCourse.steps[currentStepIndex];
    let title = "CONSEJO DE CARL IA";
    let explanation = "";

    if (step.type === 'teoria') {
        explanation = "Este concepto es fundamental. Fíjate bien en cómo se estructuran las llaves y el orden de los comandos. ¡Tú puedes!";
    } else if (step.type === 'practica') {
        explanation = `Para resolver esto, recuerda que usamos <code>${step.answer.split('(')[0]}</code>. Revisa que no te falten puntos ni comas.`;
    } else {
        explanation = "Analiza bien las opciones. A veces la respuesta más sencilla es la correcta.";
    }

    CustomModal.show(title, explanation, "🤖");
};

/* ==============================
   Enhanced Character Logic
============================== */
window.updateCharacterVisuals = function(char) {
    if (!char) return;
    const body = char.classList.contains('char-body') ? char : char.querySelector('.char-body');
    if (!body) return;

    const skin = skins[currentProgress.activeSkin] || skins.default;
    body.style.background = skin.color;
    body.style.boxShadow = `0 0 25px ${skin.color}`;

    // Clean up
    const existing = char.querySelectorAll('.char-accessory, .char-hand, .char-shoe');
    existing.forEach(e => e.remove());

    // Add Hands
    const lHand = document.createElement('div'); lHand.className = 'char-hand left';
    const rHand = document.createElement('div'); rHand.className = 'char-hand right';
    char.appendChild(lHand);
    char.appendChild(rHand);

    // Add Shoes
    const lShoe = document.createElement('div'); lShoe.className = 'char-shoe left';
    const rShoe = document.createElement('div'); rShoe.className = 'char-shoe right';
    char.appendChild(lShoe);
    char.appendChild(rShoe);

    // Evolution Accessories
    if (currentProgress.stage > 1 && !currentProgress.activeAccessory) {
        const hat = document.createElement('div');
        hat.className = 'char-accessory hat-expert';
        char.appendChild(hat);
    }

    // Purchased Accessories
    if (currentProgress.activeAccessory) {
        const acc = accessories[currentProgress.activeAccessory];
        if (acc) {
            const accEl = document.createElement('div');
            accEl.className = `char-accessory ${acc.class}`;
            char.appendChild(accEl);
        }
    }

    if (currentProgress.stage > 5) {
        const lGlove = lHand.cloneNode(); lGlove.classList.add('acc-gloves-white');
        const rGlove = rHand.cloneNode(); rGlove.classList.add('acc-gloves-white');
        char.appendChild(lGlove); char.appendChild(rGlove);
    }
}
