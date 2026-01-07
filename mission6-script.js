// 第六關：風中的聲音任務頁面專用腳本
document.addEventListener('DOMContentLoaded', () => {
    const btnSubmitReflection = document.getElementById('btn-submit-reflection');
    const mission6Reflection = document.getElementById('mission6-reflection');

    btnSubmitReflection?.addEventListener('click', () => {
        const reflection = mission6Reflection.value.trim();
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
            mission: 'mission6',
            timestamp: Date.now()
        };
        notes.unshift(note);
        localStorage.setItem('whisperNotes', JSON.stringify(notes));

        if (window.TravelerStore) {
            window.TravelerStore.recordMindNote(note);
        }
        
        if (window.TaskProgress) {
            const completed = window.TaskProgress.completeTask('mission6');
            if (completed) {
                window.TaskProgress.showTaskCompleteNotification('mission6');
                if (window.EsgStats) {
                    window.EsgStats.recordMissionCompletion('mission6', {
                        notesAdded: 1,
                        askRating: true
                    });
                }
                if (window.TravelerStore) {
                    window.TravelerStore.recordMissionCompleted('mission6', {
                        notesAdded: 1
                    });
                }
            }
        }

        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 15px 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); z-index: 10000; animation: slideInRight 0.3s ease;';
        successMsg.textContent = t.reflectionSaved || '✨ 反思已保存！';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => successMsg.remove(), 300);
        }, 2000);
    });
});

