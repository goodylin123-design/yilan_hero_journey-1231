// 第四關：大地的擁抱任務頁面專用腳本
document.addEventListener('DOMContentLoaded', () => {
    const btnSubmitReflection = document.getElementById('btn-submit-reflection');
    const mission4Reflection = document.getElementById('mission4-reflection');

    // 保存反思
    btnSubmitReflection?.addEventListener('click', () => {
        const reflection = mission4Reflection.value.trim();
        const t = window.I18n ? window.I18n.getTranslation(window.I18n.getCurrentLanguage()) : {};
        if (!reflection) {
            alert(t.pleaseWriteReflection || '請先寫下你的反思');
            return;
        }

        // 保存到 localStorage
        const notes = JSON.parse(localStorage.getItem('whisperNotes') || '[]');
        const note = {
            id: Date.now(),
            date: new Date().toLocaleString(window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW'),
            content: reflection,
            emotion: t.mindNotesDefaultEmotion || '思考',
            mission: 'mission4',
            timestamp: Date.now()
        };
        notes.unshift(note);
        localStorage.setItem('whisperNotes', JSON.stringify(notes));

        // 同步寫入 TravelerStore 的心靈筆記資料結構
        if (window.TravelerStore) {
            window.TravelerStore.recordMindNote(note);
        }
        
        // 標記第四關任務為完成
        if (window.TaskProgress) {
            const completed = window.TaskProgress.completeTask('mission4');
            if (completed) {
                window.TaskProgress.showTaskCompleteNotification('mission4');
                // 更新 ESG 統計
                if (window.EsgStats) {
                    window.EsgStats.recordMissionCompletion('mission4', {
                        notesAdded: 1,
                        askRating: true
                    });
                }
            }
        }

        // 顯示成功訊息
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = t.reflectionSaved || '✨ 反思已保存！';
        successMsg.style.cssText = 'padding: 15px; background: rgba(76, 175, 80, 0.2); border-radius: 8px; margin-top: 15px; text-align: center;';
        btnSubmitReflection.parentElement.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);

        // 清空輸入框
        mission4Reflection.value = '';
    });
});

