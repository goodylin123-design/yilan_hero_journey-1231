// 首頁多語言切換邏輯

document.addEventListener('DOMContentLoaded', () => {
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const langCurrent = document.getElementById('lang-current');
    const langOptions = document.querySelectorAll('.lang-option');
    
    // 更新當前語言顯示
    function updateLanguageDisplay() {
        const currentLang = window.I18n?.getCurrentLanguage() || 'zh-TW';
        const langName = window.I18n?.SUPPORTED_LANGUAGES[currentLang] || '繁體中文';
        if (langCurrent) {
            langCurrent.textContent = langName;
        }
    }
    
    // 切換下拉選單顯示
    langToggleBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = langDropdown.style.display === 'none';
        langDropdown.style.display = isHidden ? 'block' : 'none';
    });
    
    // 點擊語言選項
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = option.dataset.lang;
            if (lang && window.I18n) {
                window.I18n.setLanguage(lang);
                updateLanguageDisplay();
                langDropdown.style.display = 'none';
            }
        });
    });
    
    // 點擊頁面其他地方關閉下拉選單
    document.addEventListener('click', () => {
        if (langDropdown) {
            langDropdown.style.display = 'none';
        }
    });
    
    // 監聽語言變更事件
    window.addEventListener('languageChanged', () => {
        updateLanguageDisplay();
        // 更新任務狀態文字（需要重新計算）
        if (window.TaskProgress) {
            const updateTaskStatus = () => {
                ['wave', 'rain', 'dawn'].forEach(taskKey => {
                    const status = window.TaskProgress.showTaskLockStatus(taskKey);
                    const statusEl = document.getElementById(`status-${taskKey}`);
                    if (statusEl && window.I18n) {
                        if (status.status === 'completed') {
                            statusEl.textContent = window.I18n.t('statusCompleted');
                        } else if (status.status === 'unlocked') {
                            statusEl.textContent = window.I18n.t('statusUnlocked');
                        } else {
                            statusEl.textContent = window.I18n.t('statusLocked');
                        }
                    }
                });
            };
            updateTaskStatus();
        }
    });
    
    // 初始化顯示
    updateLanguageDisplay();
});

