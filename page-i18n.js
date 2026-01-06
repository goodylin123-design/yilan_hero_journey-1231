// 通用頁面多語言切換邏輯（適用於所有子頁面）

document.addEventListener('DOMContentLoaded', () => {
    // 如果 i18n.js 已載入，初始化翻譯
    if (window.I18n) {
        const currentLang = window.I18n.getCurrentLanguage();
        window.I18n.applyTranslations(currentLang);
    }
    
    // 語言選擇器邏輯
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const langCurrent = document.getElementById('lang-current');
    const langOptions = document.querySelectorAll('.lang-option');
    
    // 更新當前語言顯示
    function updateLanguageDisplay() {
        if (window.I18n && langCurrent) {
            const currentLang = window.I18n.getCurrentLanguage();
            const langName = window.I18n.SUPPORTED_LANGUAGES[currentLang] || '繁體中文';
            langCurrent.textContent = langName;
        }
    }
    
    // 切換下拉選單顯示
    langToggleBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = langDropdown.style.display === 'none' || !langDropdown.style.display;
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
    
    // 初始化顯示
    updateLanguageDisplay();
});

