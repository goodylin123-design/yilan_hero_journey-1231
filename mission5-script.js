// 第五關：星空下的祈願任務頁面專用腳本
document.addEventListener('DOMContentLoaded', () => {
    const btnSubmitReflection = document.getElementById('btn-submit-reflection');
    const mission5Reflection = document.getElementById('mission5-reflection');

    btnSubmitReflection?.addEventListener('click', () => {
        const reflection = mission5Reflection.value.trim();
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
            mission: 'mission5',
            timestamp: Date.now()
        };
        notes.unshift(note);
        localStorage.setItem('whisperNotes', JSON.stringify(notes));

        if (window.TravelerStore) {
            window.TravelerStore.recordMindNote(note);
        }
        
        if (window.TaskProgress) {
            const completed = window.TaskProgress.completeTask('mission5');
            if (completed) {
                window.TaskProgress.showTaskCompleteNotification('mission5');
                if (window.EsgStats) {
                    window.EsgStats.recordMissionCompletion('mission5', {
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

        mission5Reflection.value = '';
    });
});

