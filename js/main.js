const translations = {
    'es': {
        'hero-title': 'Carley Interactive Studio',
        'hero-tagline': 'Convertiendo ideas en realidad',
        'engine-heading': 'Conoce a nuestro motor de video juego',
        'engine-desc': 'Creative Engine diseñado para que todos puedan crear video juegos fácil y rápida.',
        'social': 'Redes sociales',
        'help': 'Ayuda',
        'support': 'Soporte',
        'feedback': 'Opinar',
        'donations': 'Donaciones',
        'policies': 'Políticas',
        'licenses': 'Licencias',
        'docs': 'Documentación',
        'apps': 'Apps',
        'collaborators': 'Colaboradores'
    },
    'en': {
        'hero-title': 'Carley Interactive Studio',
        'hero-tagline': 'Turning ideas into reality',
        'engine-heading': 'Meet our game engine',
        'engine-desc': 'Creative Engine designed for everyone to create video games easily and quickly.',
        'social': 'Social Media',
        'help': 'Help',
        'support': 'Support',
        'feedback': 'Feedback',
        'donations': 'Donations',
        'policies': 'Policies',
        'licenses': 'Licenses',
        'docs': 'Documentation',
        'apps': 'Apps',
        'collaborators': 'Collaborators'
    },
    'fr': {
        'hero-title': 'Carley Interactive Studio',
        'hero-tagline': 'Transformer les idées en réalité',
        'engine-heading': 'Découvrez notre moteur de jeu',
        'engine-desc': 'Creative Engine conçu pour que tout le monde puisse créer des jeux vidéo facilement et rapidement.',
        'social': 'Réseaux sociaux',
        'help': 'Aide',
        'support': 'Support',
        'feedback': 'Avis',
        'donations': 'Dons',
        'policies': 'Politiques',
        'licenses': 'Licences',
        'docs': 'Documentation',
        'apps': 'Apps',
        'collaborators': 'Collaborateurs'
    },
    'pt': {
        'hero-title': 'Carley Interactive Studio',
        'hero-tagline': 'Transformando ideias em realidade',
        'engine-heading': 'Conheça o nosso motor de jogo',
        'engine-desc': 'Creative Engine projetado para que todos possam criar jogos de vídeo de forma fácil e rápida.',
        'social': 'Redes sociais',
        'help': 'Ajuda',
        'support': 'Suporte',
        'feedback': 'Opinar',
        'donations': 'Doações',
        'policies': 'Políticas',
        'licenses': 'Licenças',
        'docs': 'Documentação',
        'apps': 'Apps',
        'collaborators': 'Colaboradores'
    },
    'ru': {
        'hero-title': 'Carley Interactive Studio',
        'hero-tagline': 'Превращаем идеи в реальность',
        'engine-heading': 'Познакомьтесь с нашим игровым движком',
        'engine-desc': 'Creative Engine разработан для того, чтобы каждый мог создавать видеоигры легко и быстро.',
        'social': 'Соцсети',
        'help': 'Помощь',
        'support': 'Поддержка',
        'feedback': 'Отзывы',
        'donations': 'Пожертвования',
        'policies': 'Политика',
        'licenses': 'Лицензии',
        'docs': 'Документация',
        'apps': 'Приложения',
        'collaborators': 'Партнеры'
    },
    'it': {
        'hero-title': 'Carley Interactive Studio',
        'hero-tagline': 'Trasformare le idee in realtà',
        'engine-heading': 'Scopri il nostro motore di gioco',
        'engine-desc': 'Creative Engine progettato perché tutti possano creare videogiochi in modo facile e veloce.',
        'social': 'Social',
        'help': 'Aiuto',
        'support': 'Supporto',
        'feedback': 'Opinioni',
        'donations': 'Donazioni',
        'policies': 'Policy',
        'licenses': 'Licenze',
        'docs': 'Documentazione',
        'apps': 'App',
        'collaborators': 'Collaboratori'
    },
    'zh': {
        'hero-title': 'Carley Interactive Studio',
        'hero-tagline': '将创意变为现实',
        'engine-heading': '了解我们的游戏引擎',
        'engine-desc': 'Creative Engine 旨在让每个人都能轻松快速地开发视频游戏。',
        'social': '社交媒体',
        'help': '帮助',
        'support': '支持',
        'feedback': '反馈',
        'donations': '捐赠',
        'policies': '政策',
        'licenses': '许可',
        'docs': '文档',
        'apps': '应用',
        'collaborators': '合作伙伴'
    },
    'ja': {
        'hero-title': 'Carley Interactive Studio',
        'hero-tagline': 'アイデアを現実に',
        'engine-heading': '私たちのゲームエンジンをご紹介',
        'engine-desc': 'Creative Engineは、誰でも簡単に素早くビデオゲームを作成できるように設計されています。',
        'social': 'ソーシャル',
        'help': 'ヘルプ',
        'support': 'サポート',
        'feedback': 'フィードバック',
        'donations': '寄付',
        'policies': 'ポリシー',
        'licenses': 'ライセンス',
        'docs': 'ドキュメント',
        'apps': 'アプリ',
        'collaborators': '協力者'
    },
    'sw': {
        'hero-title': 'Carley Interactive Studio',
        'hero-tagline': 'Kugeuza mawazo kuwa ukweli',
        'engine-heading': 'Kutana na injini yetu ya mchezo',
        'engine-desc': 'Creative Engine iliyoundwa kwa ajili ya kila mtu kuunda michezo ya video kwa urahisi na haraka.',
        'social': 'Mitandao ya Kijamii',
        'help': 'Msaada',
        'support': 'Usaidizi',
        'feedback': 'Maoni',
        'donations': 'Michango',
        'policies': 'Sera',
        'licenses': 'Leseni',
        'docs': 'Nyaraka',
        'apps': 'Programu',
        'collaborators': 'Washiriki'
    }
};

function changeLanguage(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('preferredLang', lang);

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'es';
    changeLanguage(savedLang);
});
