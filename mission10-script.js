// 第十關：自然中的告別儀式任務頁面專用腳本
document.addEventListener('DOMContentLoaded', () => {
    // 初始化 AI 對話系統
    if (window.AIDialogue) {
        window.AIDialogue.init('mission10', {
            voiceGuideKey: 'voiceGuideMission10',
            defaultGuideText: '請在葉子上寫下你的擔憂，讓海浪帶走它們。這個告別如何準備你迎接什麼樣的未來？'
        });
    }
    
    const btnClaimBadge = document.getElementById('btn-claim-badge');
    const badgeDisplay = document.getElementById('badge-display');
    const btnShareStory = document.getElementById('btn-share-story');
    
    // 領取勇氣徽章
    btnClaimBadge?.addEventListener('click', () => {
        const t = window.I18n ? window.I18n.getTranslation(window.I18n.getCurrentLanguage()) : {};
        // 檢查是否完成所有任務（10關）
        const notes = JSON.parse(localStorage.getItem('whisperNotes') || '[]');
        const completedMissions = new Set(notes.map(n => n.mission).filter(Boolean));
        
        // 檢查所有10個任務是否完成
        const allMissions = ['wave', 'rain', 'dawn', 'mission4', 'mission5', 'mission6', 'mission7', 'mission8', 'mission9', 'mission10'];
        const allCompleted = allMissions.every(mission => completedMissions.has(mission));
        
        if (allCompleted) {
            // 已完成所有任務，可以領取徽章
            badgeDisplay.innerHTML = `
                <div class="badge-icon" style="font-size: 4rem; animation: float 2s ease-in-out infinite;">🏅</div>
                <h3 style="color: #F59E0B; margin: 15px 0;">${t.courageBadgeTitle || '勇氣徽章'}</h3>
                <p style="color: #0F172A; font-size: 1.1rem;">${t.courageBadgeCongrats || '恭喜你完成英雄之旅！'}</p>
                <p style="color: #475569; margin-top: 10px;">${t.courageBadgeDesc || '你已經走過了這趟內在成長的旅程，這枚徽章見證了你的勇氣與堅持。'}</p>
            `;
            btnClaimBadge.style.display = 'none';
            
            // 保存徽章狀態
            localStorage.setItem('courageBadge', 'claimed');
            
            // 顯示成功訊息
            const successMsg = document.createElement('div');
            successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #F59E0B, #D97706); color: white; padding: 15px 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); z-index: 10000; animation: slideInRight 0.3s ease;';
            successMsg.textContent = t.courageBadgeClaimed || '🎖️ 勇氣徽章已領取！';
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                successMsg.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => successMsg.remove(), 300);
            }, 2000);
        } else {
            alert(t.courageBadgeNeedMore || '請先完成所有十關任務才能領取勇氣徽章');
        }
    });

    // 檢查是否已領取徽章
    if (localStorage.getItem('courageBadge') === 'claimed') {
        const t = window.I18n ? window.I18n.getTranslation(window.I18n.getCurrentLanguage()) : {};
        badgeDisplay.innerHTML = `
            <div class="badge-icon" style="font-size: 4rem; animation: float 2s ease-in-out infinite;">🏅</div>
            <h3 style="color: #F59E0B; margin: 15px 0;">${t.courageBadgeTitle || '勇氣徽章'}</h3>
            <p style="color: #0F172A; font-size: 1.1rem;">${t.courageBadgeCongrats || '恭喜你完成英雄之旅！'}</p>
        `;
        btnClaimBadge.style.display = 'none';
    }

    // 分享故事
    btnShareStory?.addEventListener('click', () => {
        const t = window.I18n ? window.I18n.getTranslation(window.I18n.getCurrentLanguage()) : {};
        
        // 收集所有任務的心靈筆記作為分享內容
        const notes = JSON.parse(localStorage.getItem('whisperNotes') || '[]');
        const allNotes = notes.filter(n => n.mission).map(n => `【${n.mission}】${n.content}`).join('\n\n');
        
        // 創建分享文字
        const shareTextTemplate = t.shareText || '我完成了「擺渡蘭陽英雄之旅」！\n\n這趟旅程讓我收穫滿滿：\n\n{insights}\n\n一起來體驗這趟內在成長的旅程吧！';
        const shareText = allNotes 
            ? shareTextTemplate.replace('{insights}', allNotes)
            : shareTextTemplate.replace('{insights}', t.shareDefaultText || '這是一趟充滿勇氣與成長的英雄之旅！');
        
        // 嘗試使用 Web Share API
        if (navigator.share) {
            navigator.share({
                title: t.shareTitle || '擺渡蘭陽英雄之旅',
                text: shareText,
                url: window.location.origin
            }).catch(err => {
                console.log('分享失敗:', err);
                // 降級到複製到剪貼簿
                copyToClipboard(shareText);
            });
        } else {
            // 降級到複製到剪貼簿
            copyToClipboard(shareText);
        }
    });

    function copyToClipboard(text) {
        const t = window.I18n ? window.I18n.getTranslation(window.I18n.getCurrentLanguage()) : {};
        navigator.clipboard.writeText(text).then(() => {
            alert(t.copiedToClipboard || '已複製到剪貼簿！可以貼上分享給朋友了');
        }).catch(err => {
            console.error('複製失敗:', err);
            alert(t.copyFailed || '無法複製，請手動複製文字');
        });
    }
});

