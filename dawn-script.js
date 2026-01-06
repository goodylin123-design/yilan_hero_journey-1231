// 情人灣日出任務頁面專用腳本
document.addEventListener('DOMContentLoaded', () => {
    const btnSaveInsights = document.getElementById('btn-save-insights');
    const dawnInsights = document.getElementById('dawn-insights');
    const btnClaimBadge = document.getElementById('btn-claim-badge');
    const badgeDisplay = document.getElementById('badge-display');
    const btnShareStory = document.getElementById('btn-share-story');

    // 保存洞見
    btnSaveInsights?.addEventListener('click', () => {
        const insights = dawnInsights.value.trim();
        if (!insights) {
            alert('請先寫下你的旅程洞見');
            return;
        }

        // 保存到 localStorage
        const notes = JSON.parse(localStorage.getItem('whisperNotes') || '[]');
        const note = {
            id: Date.now(),
            date: new Date().toLocaleString('zh-TW'),
            content: insights,
            emotion: '平靜',
            mission: 'dawn',
            timestamp: Date.now()
        };
        notes.unshift(note);
        localStorage.setItem('whisperNotes', JSON.stringify(notes));
        
        // 標記第三關任務為完成
        if (window.TaskProgress) {
            const completed = window.TaskProgress.completeTask('dawn');
            if (completed) {
                window.TaskProgress.showTaskCompleteNotification('dawn');
                // 更新 ESG 統計：完成次數 + 筆記數 + 自評分數 + 實地路程與環保點數
                if (window.EsgStats) {
                    window.EsgStats.recordMissionCompletion('dawn', {
                        notesAdded: 1,
                        askRating: true
                    });
                }
            }
        }

        // 顯示成功訊息
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 15px 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); z-index: 10000; animation: slideInRight 0.3s ease;';
        successMsg.textContent = '✨ 洞見已保存！';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => successMsg.remove(), 300);
        }, 2000);
    });

    // 領取勇氣徽章
    btnClaimBadge?.addEventListener('click', () => {
        // 檢查是否完成所有任務
        const notes = JSON.parse(localStorage.getItem('whisperNotes') || '[]');
        const completedMissions = new Set(notes.map(n => n.mission).filter(Boolean));
        
        if (completedMissions.size >= 2) {
            // 已完成多個任務，可以領取徽章
            badgeDisplay.innerHTML = `
                <div class="badge-icon" style="font-size: 4rem; animation: float 2s ease-in-out infinite;">🏅</div>
                <h3 style="color: #F59E0B; margin: 15px 0;">勇氣徽章</h3>
                <p style="color: #0F172A; font-size: 1.1rem;">恭喜你完成英雄之旅！</p>
                <p style="color: #475569; margin-top: 10px;">你已經走過了這趟內在成長的旅程，這枚徽章見證了你的勇氣與堅持。</p>
            `;
            btnClaimBadge.style.display = 'none';
            
            // 保存徽章狀態
            localStorage.setItem('courageBadge', 'claimed');
            
            // 顯示成功訊息
            const successMsg = document.createElement('div');
            successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #F59E0B, #D97706); color: white; padding: 15px 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); z-index: 10000; animation: slideInRight 0.3s ease;';
            successMsg.textContent = '🎖️ 勇氣徽章已領取！';
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                successMsg.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => successMsg.remove(), 300);
            }, 2000);
        } else {
            alert('請先完成更多任務才能領取勇氣徽章');
        }
    });

    // 檢查是否已領取徽章
    if (localStorage.getItem('courageBadge') === 'claimed') {
        badgeDisplay.innerHTML = `
            <div class="badge-icon" style="font-size: 4rem; animation: float 2s ease-in-out infinite;">🏅</div>
            <h3 style="color: #F59E0B; margin: 15px 0;">勇氣徽章</h3>
            <p style="color: #0F172A; font-size: 1.1rem;">恭喜你完成英雄之旅！</p>
        `;
        btnClaimBadge.style.display = 'none';
    }

    // 分享故事
    btnShareStory?.addEventListener('click', () => {
        const insights = dawnInsights.value.trim();
        if (!insights) {
            alert('請先寫下你的旅程洞見');
            return;
        }

        // 創建分享文字
        const shareText = `我完成了「擺渡蘭陽英雄之旅」！\n\n${insights}\n\n一起來體驗這趟內在成長的旅程吧！`;
        
        // 嘗試使用 Web Share API
        if (navigator.share) {
            navigator.share({
                title: '擺渡蘭陽英雄之旅',
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
        navigator.clipboard.writeText(text).then(() => {
            alert('已複製到剪貼簿！可以貼上分享給朋友了');
        }).catch(err => {
            console.error('複製失敗:', err);
            alert('無法複製，請手動複製文字');
        });
    }
});

