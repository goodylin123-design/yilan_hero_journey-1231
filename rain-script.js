// 蘭陽細雨任務頁面專用腳本
document.addEventListener('DOMContentLoaded', () => {
    const btnSubmitReflection = document.getElementById('btn-submit-reflection');
    const rainReflection = document.getElementById('rain-reflection');
    const btnStartBreathing = document.getElementById('btn-start-breathing');
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingText = document.getElementById('breathing-text');

    let breathingInterval = null;
    let breathingPhase = 'inhale'; // inhale, hold, exhale, pause
    let breathingCount = 0;

    // 保存反思
    btnSubmitReflection?.addEventListener('click', () => {
        const reflection = rainReflection.value.trim();
        if (!reflection) {
            alert('請先寫下你的反思');
            return;
        }

        // 保存到 localStorage
        const notes = JSON.parse(localStorage.getItem('whisperNotes') || '[]');
        const note = {
            id: Date.now(),
            date: new Date().toLocaleString('zh-TW'),
            content: reflection,
            emotion: '思考',
            mission: 'rain',
            timestamp: Date.now()
        };
        notes.unshift(note);
        localStorage.setItem('whisperNotes', JSON.stringify(notes));

        // 同步寫入 TravelerStore 的心靈筆記資料結構
        if (window.TravelerStore) {
            window.TravelerStore.recordMindNote(note);
        }
        
        // 標記第二關任務為完成
        if (window.TaskProgress) {
            const completed = window.TaskProgress.completeTask('rain');
            if (completed) {
                window.TaskProgress.showTaskCompleteNotification('rain');
                // 更新 ESG 統計：完成次數 + 筆記數 + 自評分數 + 實地路程與環保點數
                if (window.EsgStats) {
                    window.EsgStats.recordMissionCompletion('rain', {
                        notesAdded: 1,
                        askRating: true
                    });
                }
                // 更新 TravelerStore 的任務完成資料
                if (window.TravelerStore) {
                    window.TravelerStore.recordMissionCompleted('rain', {
                        notesAdded: 1
                    });
                }
            }
        }

        // 顯示成功訊息
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 15px 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); z-index: 10000; animation: slideInRight 0.3s ease;';
        successMsg.textContent = '✨ 反思已保存！';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => successMsg.remove(), 300);
        }, 2000);
    });

    // 呼吸練習
    btnStartBreathing?.addEventListener('click', () => {
        if (breathingInterval) {
            // 停止
            clearInterval(breathingInterval);
            breathingInterval = null;
            breathingCircle.style.animation = 'none';
            breathingText.textContent = '準備開始';
            btnStartBreathing.textContent = '開始呼吸練習';
            breathingCount = 0;
            return;
        }

        // 開始
        breathingCount = 0;
        btnStartBreathing.textContent = '停止練習';
        breathingCircle.style.animation = 'breathingCycle 12s ease-in-out infinite';
        
        breathingInterval = setInterval(() => {
            const cycle = breathingCount % 4;
            if (cycle === 0) {
                breathingText.textContent = '吸氣...';
                breathingPhase = 'inhale';
            } else if (cycle === 1) {
                breathingText.textContent = '屏息...';
                breathingPhase = 'hold';
            } else if (cycle === 2) {
                breathingText.textContent = '呼氣...';
                breathingPhase = 'exhale';
            } else {
                breathingText.textContent = '暫停...';
                breathingPhase = 'pause';
            }
            breathingCount++;
        }, 3000);
    });
});

