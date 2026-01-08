// 第十關：自然中的告別儀式任務頁面專用腳本
document.addEventListener('DOMContentLoaded', () => {
    // 初始化 AI 對話系統
    if (window.AIDialogue) {
        window.AIDialogue.init('mission10', {
            voiceGuideKey: 'voiceGuideMission10',
            defaultGuideText: '請在葉子上寫下你的擔憂，讓海浪帶走它們。這個告別如何準備你迎接什麼樣的未來？'
        });
    }
});

