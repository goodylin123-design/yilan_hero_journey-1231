// 第九關：拍打海浪的節奏任務頁面專用腳本
document.addEventListener('DOMContentLoaded', () => {
    const btnSubmitReflection = document.getElementById('btn-submit-reflection');
    const mission9Reflection = document.getElementById('mission9-reflection');

    btnSubmitReflection?.addEventListener('click', () => {
        const reflection = mission9Reflection.value.trim();
        const t = window.I18n ? window.I18n.getTranslation(window.I18n.getCurrentLanguage()) : {};
        if (!reflection) {
            alert(t.pleaseWriteReflection || '請先寫下你的反思');
            return;
        }

        const notes = JSON.parse(localStorage.getItem('whisperNotes') || '[]');
        const note = {
            id: Date.now(),
            date: new Date().toLocaleString(window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW'),
            content: reflection,
            emotion: t.mindNotesDefaultEmotion || '思考',
            mission: 'mission9',
            timestamp: Date.now()
        };
        notes.unshift(note);
        localStorage.setItem('whisperNotes', JSON.stringify(notes));

        if (window.TravelerStore) {
            window.TravelerStore.recordMindNote(note);
        }
        
        if (window.TaskProgress) {
            const completed = window.TaskProgress.completeTask('mission9');
            if (completed) {
                window.TaskProgress.showTaskCompleteNotification('mission9');
                if (window.EsgStats) {
                    window.EsgStats.recordMissionCompletion('mission9', {
                        notesAdded: 1,
                        askRating: true
                    });
                }
            }
        }

        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = t.reflectionSaved || '✨ 反思已保存！';
        successMsg.style.cssText = 'padding: 15px; background: rgba(76, 175, 80, 0.2); border-radius: 8px; margin-top: 15px; text-align: center;';
        btnSubmitReflection.parentElement.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);

        mission9Reflection.value = '';
    });
});

