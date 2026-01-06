// 多語言翻譯模組
// 支援：繁體中文、簡體中文、英文、日文、韓文

const SUPPORTED_LANGUAGES = {
    'zh-TW': '繁體中文',
    'zh-CN': '简体中文',
    'en': 'English',
    'ja': '日本語',
    'ko': '한국어'
};

const TRANSLATIONS = {
    'zh-TW': {
        title: '🌊 擺渡蘭陽英雄之旅',
        subtitle: '蘭陽海岸・內在成長型三關英雄旅程',
        heroTitle: '內在成長型三關英雄旅程（宜蘭海岸）',
        heroDescription: '沿著蜜月灣到情人灣的海線，讓心跳與海風同步，一關一關長出新的自己。',
        mission1Title: '第一關｜啟程：蜜月灣海灘',
        mission1Desc: '找到你的「出航理由」，寫下此刻的勇氣宣言。',
        mission2Title: '第二關｜跨越：蘭陽細雨與海風',
        mission2Desc: '直面內心的疑慮，在風雨中練習穩住呼吸與腳步。',
        mission3Title: '第三關｜回歸：情人灣日出港',
        mission3Desc: '把旅程的洞見收束，為自己頒發一枚勇氣章，並分享給同伴。',
        chooseMission: '選擇今天的英雄任務',
        chooseMissionSub: '依照當下的狀態，挑一個任務，開始你的內在成長旅程。',
        missionWave: '🌊 海風中的呢喃任務',
        missionWaveLoc: '📍 蜜月灣',
        missionRain: '🌧 蘭陽細雨陪伴任務',
        missionRainLoc: '📍 壯圍沙丘生態園區',
        missionDawn: '🌅 情人灣日出勇氣任務',
        missionDawnLoc: '📍 情人灣',
        btnStartMission1: '🚢 開始第一關',
        btnViewRoute: '🗺️ 查看路線',
        btnHeroMusic: '🎵 英雄音樂',
        btnMindNotes: '📖 心靈筆記',
        btnTravelInfo: '📋 旅行資訊',
        btnPointsRedeem: '💚 點數兌換',
        btnScanQR: '📷 掃描 QR 碼進入任務',
        dashboardTitle: '旅人儀表板（測試版）',
        dashboardDesc: '這是為了設計與展示而準備的統計區塊，會根據你在三關中的行為，慢慢長出屬於你的海岸旅程數據。',
        statMissionCount: '任務完成次數',
        statMissionCountNote: '你已完成的所有關卡總數',
        statNotesCount: '心靈筆記數',
        statNotesCountNote: '寫下的所有內在感受與洞見',
        statDistance: '累積步行里程',
        statDistanceNote: '實地走過的海岸路程（估算）',
        statPoints: '環保點數',
        statPointsNote: '未來可兌換或折抵的潛在積分',
        feature1Title: '啟程・蜜月灣',
        feature1Desc: '在金色沙丘與海面交界，寫下啟航宣言，預備好第一步。',
        feature2Title: '跨越・蘭陽風雨',
        feature2Desc: '感受東北季風與細雨，練習面對不確定，找到自己的步調。',
        feature3Title: '回歸・情人灣日出港',
        feature3Desc: '迎接晨曦，整理旅程洞見，為自己頒發勇氣徽章並分享故事。',
        featureLink: '進入任務 →',
        progress: '進度',
        statusCompleted: '✅ 已完成',
        statusUnlocked: '🔓 可進行',
        statusLocked: '🔒 尚未解鎖'
    },
    'zh-CN': {
        title: '🌊 摆渡兰阳英雄之旅',
        subtitle: '兰阳海岸・内在成长型三关英雄旅程',
        heroTitle: '内在成长型三关英雄旅程（宜兰海岸）',
        heroDescription: '沿着蜜月湾到情人湾的海线，让心跳与海风同步，一关一关长出新的自己。',
        mission1Title: '第一关｜启程：蜜月湾海滩',
        mission1Desc: '找到你的「出航理由」，写下此刻的勇气宣言。',
        mission2Title: '第二关｜跨越：兰阳细雨与海风',
        mission2Desc: '直面内心的疑虑，在风雨中练习稳住呼吸与脚步。',
        mission3Title: '第三关｜回归：情人湾日出港',
        mission3Desc: '把旅程的洞见收束，为自己颁发一枚勇气章，并分享给同伴。',
        chooseMission: '选择今天的英雄任务',
        chooseMissionSub: '依照当下的状态，挑一个任务，开始你的内在成长旅程。',
        missionWave: '🌊 海风中的呢喃任务',
        missionWaveLoc: '📍 蜜月湾',
        missionRain: '🌧 兰阳细雨陪伴任务',
        missionRainLoc: '📍 壮围沙丘生态园区',
        missionDawn: '🌅 情人湾日出勇气任务',
        missionDawnLoc: '📍 情人湾',
        btnStartMission1: '🚢 开始第一关',
        btnViewRoute: '🗺️ 查看路线',
        btnHeroMusic: '🎵 英雄音乐',
        btnMindNotes: '📖 心灵笔记',
        btnTravelInfo: '📋 旅行资讯',
        btnPointsRedeem: '💚 点数兑换',
        btnScanQR: '📷 扫描 QR 码进入任务',
        dashboardTitle: '旅人仪表板（测试版）',
        dashboardDesc: '这是为了设计与展示而准备的统计区块，会根据你在三关中的行为，慢慢长出属于你的海岸旅程数据。',
        statMissionCount: '任务完成次数',
        statMissionCountNote: '你已完成的所有关卡总数',
        statNotesCount: '心灵笔记数',
        statNotesCountNote: '写下的所有内在感受与洞见',
        statDistance: '累积步行里程',
        statDistanceNote: '实地走过的海岸路程（估算）',
        statPoints: '环保点数',
        statPointsNote: '未来可兑换或折抵的潜在积分',
        feature1Title: '启程・蜜月湾',
        feature1Desc: '在金色沙丘与海面交界，写下启航宣言，预备好第一步。',
        feature2Title: '跨越・兰阳风雨',
        feature2Desc: '感受东北季风与细雨，练习面对不确定，找到自己的步调。',
        feature3Title: '回归・情人湾日出港',
        feature3Desc: '迎接晨曦，整理旅程洞见，为自己颁发勇气徽章并分享故事。',
        featureLink: '进入任务 →',
        progress: '进度',
        statusCompleted: '✅ 已完成',
        statusUnlocked: '🔓 可进行',
        statusLocked: '🔒 尚未解锁'
    },
    'en': {
        title: '🌊 Lanyang Hero Journey',
        subtitle: 'Lanyang Coast・Three-Stage Inner Growth Hero Journey',
        heroTitle: 'Three-Stage Inner Growth Hero Journey (Lanyang Coast)',
        heroDescription: 'Along the coastline from Honeymoon Bay to Lover\'s Bay, let your heartbeat sync with the sea breeze, growing into a new self step by step.',
        mission1Title: 'Stage 1｜Departure: Honeymoon Bay Beach',
        mission1Desc: 'Find your "reason to set sail" and write down your declaration of courage at this moment.',
        mission2Title: 'Stage 2｜Crossing: Lanyang Rain and Sea Breeze',
        mission2Desc: 'Face your inner doubts and practice steady breathing and steps in the wind and rain.',
        mission3Title: 'Stage 3｜Return: Lover\'s Bay Sunrise Harbor',
        mission3Desc: 'Gather the insights from your journey, award yourself a badge of courage, and share it with companions.',
        chooseMission: 'Choose Today\'s Hero Mission',
        chooseMissionSub: 'Pick a mission based on your current state and begin your inner growth journey.',
        missionWave: '🌊 Whispers in the Sea Breeze',
        missionWaveLoc: '📍 Honeymoon Bay',
        missionRain: '🌧 Lanyang Rain Companion',
        missionRainLoc: '📍 Zhuangwei Sand Dune Ecological Park',
        missionDawn: '🌅 Lover\'s Bay Sunrise Courage',
        missionDawnLoc: '📍 Lover\'s Bay',
        btnStartMission1: '🚢 Start Stage 1',
        btnViewRoute: '🗺️ View Route',
        btnHeroMusic: '🎵 Hero Music',
        btnMindNotes: '📖 Mind Notes',
        btnTravelInfo: '📋 Travel Info',
        btnPointsRedeem: '💚 Redeem Points',
        btnScanQR: '📷 Scan QR Code to Enter Mission',
        dashboardTitle: 'Traveler Dashboard (Beta)',
        dashboardDesc: 'This is a statistics section prepared for design and demonstration. It will gradually grow your coastal journey data based on your behavior in the three stages.',
        statMissionCount: 'Mission Completions',
        statMissionCountNote: 'Total number of stages you have completed',
        statNotesCount: 'Mind Notes',
        statNotesCountNote: 'All inner feelings and insights you have written',
        statDistance: 'Total Distance Walked',
        statDistanceNote: 'Actual coastal distance walked (estimated)',
        statPoints: 'Environmental Points',
        statPointsNote: 'Potential credits that can be redeemed or used for discounts in the future',
        feature1Title: 'Departure・Honeymoon Bay',
        feature1Desc: 'At the junction of golden dunes and sea, write your declaration of departure and prepare for the first step.',
        feature2Title: 'Crossing・Lanyang Wind and Rain',
        feature2Desc: 'Feel the northeast monsoon and drizzle, practice facing uncertainty, and find your own pace.',
        feature3Title: 'Return・Lover\'s Bay Sunrise Harbor',
        feature3Desc: 'Welcome the dawn, organize journey insights, award yourself a badge of courage and share your story.',
        featureLink: 'Enter Mission →',
        progress: 'Progress',
        statusCompleted: '✅ Completed',
        statusUnlocked: '🔓 Available',
        statusLocked: '🔒 Locked'
    },
    'ja': {
        title: '🌊 蘭陽ヒーロー旅',
        subtitle: '蘭陽海岸・内面成長型三関ヒーロー旅',
        heroTitle: '内面成長型三関ヒーロー旅（蘭陽海岸）',
        heroDescription: 'ハネムーンベイから恋人湾までの海岸線に沿って、心拍と海風を同期させ、一歩一歩新しい自分を育てます。',
        mission1Title: '第一関｜出発：ハネムーンベイビーチ',
        mission1Desc: 'あなたの「出航理由」を見つけ、この瞬間の勇気の宣言を書きましょう。',
        mission2Title: '第二関｜越境：蘭陽の雨と海風',
        mission2Desc: '内なる疑念に直面し、風雨の中で呼吸と足取りを安定させる練習をします。',
        mission3Title: '第三関｜帰還：恋人湾の日の出港',
        mission3Desc: '旅の洞察をまとめ、自分に勇気のバッジを授与し、仲間と共有します。',
        chooseMission: '今日のヒーローミッションを選択',
        chooseMissionSub: '現在の状態に応じてミッションを選び、内面成長の旅を始めましょう。',
        missionWave: '🌊 海風の中のささやき',
        missionWaveLoc: '📍 ハネムーンベイ',
        missionRain: '🌧 蘭陽の雨の同伴',
        missionRainLoc: '📍 壮圍沙丘生態園區',
        missionDawn: '🌅 恋人湾の日の出の勇気',
        missionDawnLoc: '📍 恋人湾',
        btnStartMission1: '🚢 第一関を開始',
        btnViewRoute: '🗺️ ルートを表示',
        btnHeroMusic: '🎵 ヒーロー音楽',
        btnMindNotes: '📖 心のノート',
        btnTravelInfo: '📋 旅行情報',
        btnPointsRedeem: '💚 ポイント交換',
        btnScanQR: '📷 QRコードをスキャンしてミッションに入る',
        dashboardTitle: '旅行者ダッシュボード（ベータ版）',
        dashboardDesc: 'これは設計と展示のために準備された統計セクションです。三つのステージでの行動に基づいて、あなたの海岸の旅のデータが徐々に成長します。',
        statMissionCount: 'ミッション完了回数',
        statMissionCountNote: '完了したすべてのステージの総数',
        statNotesCount: '心のノート数',
        statNotesCountNote: '書いたすべての内面の感情と洞察',
        statDistance: '累積歩行距離',
        statDistanceNote: '実際に歩いた海岸の距離（推定）',
        statPoints: '環境ポイント',
        statPointsNote: '将来交換または割引に使用できる潜在的なクレジット',
        feature1Title: '出発・ハネムーンベイ',
        feature1Desc: '金色の砂丘と海面の接点で、出航宣言を書き、最初の一歩の準備をします。',
        feature2Title: '越境・蘭陽の風と雨',
        feature2Desc: '北東モンスーンと小雨を感じ、不確実性に直面する練習をし、自分のペースを見つけます。',
        feature3Title: '帰還・恋人湾の日の出港',
        feature3Desc: '夜明けを迎え、旅の洞察を整理し、自分に勇気のバッジを授与し、物語を共有します。',
        featureLink: 'ミッションに入る →',
        progress: '進捗',
        statusCompleted: '✅ 完了',
        statusUnlocked: '🔓 利用可能',
        statusLocked: '🔒 ロック'
    },
    'ko': {
        title: '🌊 란양 히어로 여정',
        subtitle: '란양 해안・내적 성장형 3단계 히어로 여정',
        heroTitle: '내적 성장형 3단계 히어로 여정（란양 해안）',
        heroDescription: '허니문 베이에서 연인만까지의 해안선을 따라 심장박동과 바닷바람을 동기화하고, 단계별로 새로운 자신을 키워갑니다.',
        mission1Title: '1단계｜출발: 허니문 베이 해변',
        mission1Desc: '당신의 "출항 이유"를 찾고, 이 순간의 용기 선언을 적어보세요.',
        mission2Title: '2단계｜횡단: 란양 비와 바닷바람',
        mission2Desc: '내면의 의심에 직면하고, 바람과 비 속에서 호흡과 발걸음을 안정시키는 연습을 합니다.',
        mission3Title: '3단계｜귀환: 연인만 일출 항구',
        mission3Desc: '여정의 통찰을 모아, 자신에게 용기 배지를 수여하고, 동료들과 공유합니다.',
        chooseMission: '오늘의 히어로 미션 선택',
        chooseMissionSub: '현재 상태에 따라 미션을 선택하고 내적 성장 여정을 시작하세요.',
        missionWave: '🌊 바닷바람 속 속삭임',
        missionWaveLoc: '📍 허니문 베이',
        missionRain: '🌧 란양 비 동반',
        missionRainLoc: '📍 좡웨이 사구 생태공원',
        missionDawn: '🌅 연인만 일출 용기',
        missionDawnLoc: '📍 연인만',
        btnStartMission1: '🚢 1단계 시작',
        btnViewRoute: '🗺️ 경로 보기',
        btnHeroMusic: '🎵 히어로 음악',
        btnMindNotes: '📖 마음 노트',
        btnTravelInfo: '📋 여행 정보',
        btnPointsRedeem: '💚 포인트 교환',
        btnScanQR: '📷 QR 코드 스캔하여 미션 입장',
        dashboardTitle: '여행자 대시보드（베타）',
        dashboardDesc: '이것은 디자인과 시연을 위해 준비된 통계 섹션입니다. 세 단계에서의 행동에 따라 해안 여정 데이터가 점진적으로 성장합니다.',
        statMissionCount: '미션 완료 횟수',
        statMissionCountNote: '완료한 모든 단계의 총 수',
        statNotesCount: '마음 노트 수',
        statNotesCountNote: '작성한 모든 내면의 감정과 통찰',
        statDistance: '누적 보행 거리',
        statDistanceNote: '실제로 걸은 해안 거리（추정）',
        statPoints: '환경 포인트',
        statPointsNote: '향후 교환하거나 할인에 사용할 수 있는 잠재적 크레딧',
        feature1Title: '출발・허니문 베이',
        feature1Desc: '금빛 사구와 해면의 접점에서 출항 선언을 적고 첫 걸음을 준비합니다.',
        feature2Title: '횡단・란양 바람과 비',
        feature2Desc: '동북 몬순과 이슬비를 느끼고, 불확실성에 직면하는 연습을 하며 자신의 속도를 찾습니다.',
        feature3Title: '귀환・연인만 일출 항구',
        feature3Desc: '새벽을 맞이하고, 여정의 통찰을 정리하고, 자신에게 용기 배지를 수여하고 이야기를 공유합니다.',
        featureLink: '미션 입장 →',
        progress: '진행률',
        statusCompleted: '✅ 완료',
        statusUnlocked: '🔓 이용 가능',
        statusLocked: '🔒 잠금'
    }
};

// 取得當前語言（從 localStorage 或瀏覽器設定）
function getCurrentLanguage() {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved && TRANSLATIONS[saved]) {
        return saved;
    }
    
    // 從瀏覽器語言設定判斷
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('zh')) {
        return browserLang.includes('TW') || browserLang.includes('HK') ? 'zh-TW' : 'zh-CN';
    }
    if (browserLang.startsWith('ja')) return 'ja';
    if (browserLang.startsWith('ko')) return 'ko';
    if (browserLang.startsWith('en')) return 'en';
    
    return 'zh-TW'; // 預設繁體中文
}

// 設定語言
function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) {
        console.warn(`不支援的語言: ${lang}`);
        return;
    }
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
    applyTranslations(lang);
}

// 套用翻譯
function applyTranslations(lang) {
    const t = TRANSLATIONS[lang];
    if (!t) return;
    
    // 更新所有帶有 data-i18n 屬性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    });
    
    // 更新標題
    const titleEl = document.querySelector('title');
    if (titleEl) {
        titleEl.textContent = t.title;
    }
    
    // 觸發自訂事件，讓其他模組知道語言已變更
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// 取得翻譯文字
function t(key, lang = null) {
    const currentLang = lang || getCurrentLanguage();
    const translation = TRANSLATIONS[currentLang];
    return translation && translation[key] ? translation[key] : key;
}

// 初始化
function initI18n() {
    const lang = getCurrentLanguage();
    setLanguage(lang);
}

// 導出
if (typeof window !== 'undefined') {
    window.I18n = {
        getCurrentLanguage,
        setLanguage,
        applyTranslations,
        t,
        initI18n,
        SUPPORTED_LANGUAGES,
        TRANSLATIONS
    };
    
    // 頁面載入時初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initI18n);
    } else {
        initI18n();
    }
}

