// GPS 定位觸發系統
// 定義三個任務的 GPS 座標（宜蘭海岸實際座標）

// GPS 定位觸發系統
// 定義三個任務的 GPS 座標（宜蘭海岸實際座標）
// 注意：請根據實際活動地點調整以下座標

// 從 missions-data.js 獲取任務位置資訊，如果不存在則使用預設值
const TASK_LOCATIONS = {
    wave: {
        name: '蜜月灣',
        lat: 24.9336,
        lng: 121.8858,
        radius: 100, // 100公尺範圍
        description: '📍 蜜月灣・眺望龜山島'
    },
    rain: {
        name: '礁溪櫻花陵園',
        lat: 24.8230,
        lng: 121.7025,
        radius: 100, // 100公尺範圍
        description: '📍 礁溪櫻花陵園・山風掃帚'
    },
    dawn: {
        name: '三敆水',
        lat: 24.7020,
        lng: 121.8363,
        radius: 100, // 100公尺範圍
        description: '📍 三敆水・沙丘上的腳印'
    },
    mission4: {
        name: '壯圍沙丘生態園區',
        lat: 24.7372,
        lng: 121.8201,
        radius: 100, // 100公尺範圍
        description: '📍 壯圍沙丘生態園區・大地的擁抱'
    },
    mission5: {
        name: '東港榕樹公園',
        lat: 24.7172,
        lng: 121.8270,
        radius: 100, // 100公尺範圍
        description: '📍 東港榕樹公園・星空下的祈願'
    },
    mission6: {
        name: '五十二甲溼地',
        lat: 24.6632,
        lng: 121.8178,
        radius: 100, // 100公尺範圍
        description: '📍 五十二甲溼地・風中的聲音'
    },
    mission7: {
        name: '傳藝中心',
        lat: 24.6866,
        lng: 121.8241,
        radius: 100, // 100公尺範圍
        description: '📍 傳藝中心・拾起一片落葉'
    },
    mission8: {
        name: '利澤沙丘海岸',
        lat: 24.6678,
        lng: 121.8385,
        radius: 100, // 100公尺範圍
        description: '📍 利澤沙丘海岸・河流中的倒影'
    },
    mission9: {
        name: '無尾港水鳥保護區',
        lat: 24.6141,
        lng: 121.8539,
        radius: 100, // 100公尺範圍
        description: '📍 無尾港水鳥保護區・拍打海浪的節奏'
    },
    mission10: {
        name: '內埤情人灣',
        lat: 24.5774,
        lng: 121.8708,
        radius: 100, // 100公尺範圍
        description: '📍 內埤情人灣・自然中的告別儀式'
    }
};

// 使用 Haversine 公式計算兩點間距離（公尺）
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // 地球半徑（公尺）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// 獲取用戶位置
function getUserLocation() {
    return new Promise((resolve, reject) => {
        // 取得當前語言和翻譯
        const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
        const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};
        
        if (!navigator.geolocation) {
            reject(new Error(t.geoLocationNotSupported || 'Geolocation not supported'));
            return;
        }

        const options = {
            enableHighAccuracy: true,  // 使用高精度定位
            timeout: 10000,           // 10 秒超時
            maximumAge: 0             // 不使用快取位置
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                let errorMessage = t.locationError || 'Unable to get location';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = t.locationPermissionDenied || 'Location permission denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = t.locationUnavailable || 'Location unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = t.locationTimeout || 'Location timeout';
                        break;
                }
                reject(new Error(errorMessage));
            },
            options
        );
    });
}

// 檢查是否在任務範圍內
function checkLocationAccess(taskKey) {
    return new Promise(async (resolve, reject) => {
        try {
            // 取得當前語言和翻譯
            const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
            const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};
            
            const taskLocation = TASK_LOCATIONS[taskKey];
            if (!taskLocation) {
                reject(new Error(t.unknownTaskLocation || 'Unknown task location'));
                return;
            }

            const userLocation = await getUserLocation();
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                taskLocation.lat,
                taskLocation.lng
            );

            const isInRange = distance <= taskLocation.radius;
            
            resolve({
                isInRange,
                distance: Math.round(distance),
                userLocation,
                taskLocation,
                taskKey
            });
        } catch (error) {
            reject(error);
        }
    });
}

// 獲取翻譯後的地點名稱
function getTranslatedLocationName(taskKey, lang) {
    const locationKeyMap = {
        'wave': 'missionWaveLoc',
        'rain': 'missionRainLoc',
        'dawn': 'missionDawnLoc',
        'mission4': 'mission4Loc',
        'mission5': 'mission5Loc',
        'mission6': 'mission6Loc',
        'mission7': 'mission7Loc',
        'mission8': 'mission8Loc',
        'mission9': 'mission9Loc',
        'mission10': 'mission10Loc'
    };
    
    const t = window.I18n ? window.I18n.getTranslation(lang) : {};
    const locationKey = locationKeyMap[taskKey];
    if (locationKey && t[locationKey]) {
        // 移除 📍 前綴（如果有的話）
        return t[locationKey].replace(/^📍\s*/, '');
    }
    
    // 如果沒有翻譯，返回原始名稱
    return TASK_LOCATIONS[taskKey] ? TASK_LOCATIONS[taskKey].name : '';
}

// 獲取翻譯後的地點描述
function getTranslatedLocationDescription(taskKey, lang) {
    const descriptionKeyMap = {
        'wave': 'waveSubtitle',
        'rain': 'rainSubtitle',
        'dawn': 'dawnSubtitle',
        'mission4': 'mission4Subtitle',
        'mission5': 'mission5Subtitle',
        'mission6': 'mission6Subtitle',
        'mission7': 'mission7Subtitle',
        'mission8': 'mission8Subtitle',
        'mission9': 'mission9Subtitle',
        'mission10': 'mission10Subtitle'
    };
    
    const t = window.I18n ? window.I18n.getTranslation(lang) : {};
    const descriptionKey = descriptionKeyMap[taskKey];
    if (descriptionKey && t[descriptionKey]) {
        return t[descriptionKey];
    }
    
    // 如果沒有翻譯，返回原始描述
    return TASK_LOCATIONS[taskKey] ? TASK_LOCATIONS[taskKey].description : '';
}

// 顯示位置驗證 UI
function showLocationCheckUI(taskKey) {
    const taskLocation = TASK_LOCATIONS[taskKey];
    if (!taskLocation) return;

    // 創建遮罩層
    const overlay = document.createElement('div');
    overlay.id = 'location-check-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
    `;

    // 創建檢查中提示
    const checkingCard = document.createElement('div');
    checkingCard.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 30px;
        max-width: 400px;
        width: 100%;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    `;
    // 取得當前語言和翻譯
    const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
    const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};
    const locationName = getTranslatedLocationName(taskKey, currentLang);
    
    checkingCard.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 20px;">📍</div>
        <h2 style="color: #0F172A; margin-bottom: 15px;">${t.locationChecking || 'Checking location...'}</h2>
        <p style="color: #475569; margin-bottom: 20px;">${(t.locationCheckingDesc || 'Confirming if you are near {location}').replace(/{location}/g, locationName)}</p>
        <div class="loading-spinner" style="
            width: 40px;
            height: 40px;
            border: 4px solid #E0F2FE;
            border-top: 4px solid #3B82F6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        "></div>
    `;

    overlay.appendChild(checkingCard);
    document.body.appendChild(overlay);

    // 添加旋轉動畫
    if (!document.getElementById('location-check-style')) {
        const style = document.createElement('style');
        style.id = 'location-check-style';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    return overlay;
}

// 顯示位置驗證結果
function showLocationResult(overlay, result, taskKey) {
    const taskLocation = TASK_LOCATIONS[taskKey];
    
    // 取得當前語言和翻譯
    const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
    const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};
    const locationName = getTranslatedLocationName(taskKey, currentLang);
    const locationDescription = getTranslatedLocationDescription(taskKey, currentLang);
    
    overlay.innerHTML = '';

    const resultCard = document.createElement('div');
    resultCard.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 30px;
        max-width: 400px;
        width: 100%;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    `;
    
    if (result.isInRange) {
        // 在範圍內 - 允許進入
        resultCard.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 20px;">✅</div>
            <h2 style="color: #10B981; margin-bottom: 15px;">${t.locationVerifySuccess || 'Location verification successful!'}</h2>
            <p style="color: #475569; margin-bottom: 10px;">${(t.locationDistance || 'You are about {distance} meters from {location}').replace('{location}', locationName).replace('{distance}', Math.round(result.distance))}</p>
            <p style="color: #64748B; font-size: 0.9rem; margin-bottom: 25px;">${t.locationWelcome || 'Welcome to start your mission'}</p>
            <button id="location-check-close" style="
                padding: 12px 30px;
                background: linear-gradient(135deg, #10B981, #059669);
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.3s ease;
            ">${t.btnStartTask || 'Start Mission'}</button>
        `;

        // 保存驗證狀態（5 分鐘內有效）
        const verificationData = {
            taskKey,
            timestamp: Date.now(),
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 分鐘
        };
        sessionStorage.setItem(`location_verified_${taskKey}`, JSON.stringify(verificationData));
    } else {
        // 不在範圍內 - 顯示提示
        resultCard.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 20px;">📍</div>
            <h2 style="color: #EF4444; margin-bottom: 15px;">${t.locationVerifyFailed || 'Location verification failed'}</h2>
            <p style="color: #475569; margin-bottom: 10px;">${(t.locationDistance || 'You are about {distance} meters from {location}').replace('{location}', locationName).replace('{distance}', Math.round(result.distance))}</p>
            <p style="color: #64748B; font-size: 0.9rem; margin-bottom: 15px;">${(t.locationNeedWithin || 'Need to be within 100 meters of {location} to start the mission').replace(/{location}/g, locationName).replace('50', '100')}</p>
            <div style="
                background: #FEF3C7;
                border-left: 4px solid #F59E0B;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 20px;
                text-align: left;
            ">
                <p style="color: #92400E; margin: 0; font-size: 0.9rem;">
                    <strong>${t.locationTip || 'Tip:'}</strong>${(t.locationTipDesc || 'Please go near {description} and reload the page.').replace(/{description}/g, locationDescription)}
                </p>
            </div>
            <div style="margin-bottom: 15px;">
                <button id="location-check-test-mode" style="
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #10B981, #059669);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    width: 100%;
                    margin-bottom: 10px;
                    transition: transform 0.3s ease;
                ">${t.btnTestMode || '🧪 Experience Test Mode'}</button>
                <p style="color: #64748B; font-size: 0.85rem; margin: 0;">${t.testModeDesc || '(Skip location verification for testing)'}</p>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="location-check-retry" style="
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #3B82F6, #2563EB);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    flex: 1;
                ">${t.btnRetryCheck || 'Retry Check'}</button>
                <button id="location-check-back" style="
                    padding: 12px 30px;
                    background: #E5E7EB;
                    color: #374151;
                    border: none;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    flex: 1;
                ">${t.btnBackHome || 'Back to Home'}</button>
            </div>
        `;
    }

    overlay.appendChild(resultCard);

    // 使用 setTimeout 確保 DOM 已更新後再綁定事件
    setTimeout(() => {
        // 綁定按鈕事件
        const closeBtn = document.getElementById('location-check-close');
        const retryBtn = document.getElementById('location-check-retry');
        const backBtn = document.getElementById('location-check-back');
        const testModeBtn = document.getElementById('location-check-test-mode');

        closeBtn?.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[位置驗證] 點擊關閉按鈕');
            overlay.remove();
        });

        retryBtn?.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[位置驗證] 點擊重新檢查按鈕');
            overlay.remove();
            initLocationCheck(taskKey);
        });

        backBtn?.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[位置驗證] 點擊返回首頁按鈕');
            window.location.href = 'index.html';
        });

        // 體驗測試模式：跳過位置驗證
        testModeBtn?.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[位置驗證] 點擊測試模式按鈕');
            try {
                // 使用統一的測試模式啟用函數
                const enableTest = window.enableTestMode || enableTestMode;
                if (typeof enableTest === 'function') {
                    enableTest(taskKey);
                } else {
                    console.error('[位置驗證] enableTestMode 函數不存在，手動設置');
                    // 手動設置測試模式
                    sessionStorage.setItem(`test_mode_${taskKey}`, 'true');
                    const verificationData = {
                        taskKey,
                        timestamp: Date.now(),
                        expiresAt: Date.now() + 5 * 60 * 1000,
                        isTestMode: true
                    };
                    sessionStorage.setItem(`location_verified_${taskKey}`, JSON.stringify(verificationData));
                }
                
                // 顯示測試模式確認
                overlay.innerHTML = '';
                const testCard = document.createElement('div');
                testCard.style.cssText = `
                    background: white;
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 400px;
                    width: 100%;
                    text-align: center;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                `;
                // 取得當前語言和翻譯
                const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
                const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};
                
                testCard.innerHTML = `
                    <div style="font-size: 4rem; margin-bottom: 20px;">🧪</div>
                    <h2 style="color: #10B981; margin-bottom: 15px;">${t.testModeEnabled || 'Experience Test Mode Enabled'}</h2>
                    <p style="color: #475569; margin-bottom: 10px;">${t.testModeSkipped || 'Location verification skipped'}</p>
                    <p style="color: #64748B; font-size: 0.9rem; margin-bottom: 25px;">${t.testModeCanStart || 'You can now start experiencing the mission content'}</p>
                    <div style="
                        background: #ECFDF5;
                        border-left: 4px solid #10B981;
                        padding: 15px;
                        border-radius: 10px;
                        margin-bottom: 20px;
                        text-align: left;
                    ">
                        <p style="color: #065F46; margin: 0; font-size: 0.9rem;">
                            <strong>${t.testModeNote || 'Note:'}</strong>${t.testModeNoteDesc || 'This is test mode. Please go to the specified location for actual use.'}
                        </p>
                    </div>
                    <button id="location-check-close-test" style="
                        padding: 12px 30px;
                        background: linear-gradient(135deg, #10B981, #059669);
                        color: white;
                        border: none;
                        border-radius: 25px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.3s ease;
                    ">${t.btnStartTask || 'Start Mission'}</button>
                `;
                overlay.appendChild(testCard);
                
                // 使用 setTimeout 確保新按鈕已添加到 DOM
                setTimeout(() => {
                    const closeTestBtn = document.getElementById('location-check-close-test');
                    if (closeTestBtn) {
                        closeTestBtn.addEventListener('click', function(e2) {
                            e2.preventDefault();
                            e2.stopPropagation();
                            console.log('[位置驗證] 點擊開始任務按鈕（測試模式）');
                            // 確保測試模式已啟用（以防萬一）
                            const enableTest2 = window.enableTestMode || enableTestMode;
                            if (typeof enableTest2 === 'function') {
                                enableTest2(taskKey);
                            }
                            overlay.remove();
                            // 觸發頁面重新載入以顯示任務內容
                            window.location.reload();
                        });
                    }
                }, 100);
            } catch (err) {
                console.error('[位置驗證] 啟用測試模式失敗:', err);
                const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
                const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};
                alert(t.testModeFailed || 'Failed to enable test mode. Please try again');
            }
        });
    }, 100);
}

// 初始化位置檢查
async function initLocationCheck(taskKey) {
    const overlay = showLocationCheckUI(taskKey);
    // 在函數開頭宣告變數，避免重複宣告
    const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
    const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};

    try {
        const result = await checkLocationAccess(taskKey);
        showLocationResult(overlay, result, taskKey);
    } catch (error) {
        // 顯示錯誤訊息
        overlay.innerHTML = '';
        const errorCard = document.createElement('div');
        errorCard.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        `;
        // 使用已在函數開頭宣告的變數
        
        errorCard.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 20px;">⚠️</div>
            <h2 style="color: #EF4444; margin-bottom: 15px;">${t.locationVerifyFailed || 'Location verification failed'}</h2>
            <p style="color: #475569; margin-bottom: 20px;">${error.message}</p>
            <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 15px;">
                <button id="location-check-retry-error" type="button" style="
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #3B82F6, #2563EB);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    flex: 1;
                ">${t.btnRetryCheck || 'Retry Check'}</button>
                <button id="location-check-back-error" type="button" style="
                    padding: 12px 30px;
                    background: #E5E7EB;
                    color: #374151;
                    border: none;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    flex: 1;
                ">${t.btnBackHome || 'Back to Home'}</button>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="location-check-test-mode-error" type="button" style="
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #10B981, #059669);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    width: 100%;
                    transition: transform 0.3s ease;
                    position: relative;
                    z-index: 1;
                ">${t.btnTestMode || '🧪 Experience Test Mode'}</button>
                <p style="color: #64748B; font-size: 0.85rem; margin: 10px 0 0 0; text-align: center;">${t.testModeDesc || '(Skip location verification for testing)'}</p>
            </div>
        `;
        overlay.appendChild(errorCard);

        // 使用 setTimeout 確保 DOM 已更新後再綁定事件
        setTimeout(() => {
            // 重新檢查按鈕
            const retryBtn = document.getElementById('location-check-retry-error');
            if (retryBtn) {
                // 移除舊的事件監聽器（如果有的話）
                const newRetryBtn = retryBtn.cloneNode(true);
                retryBtn.parentNode.replaceChild(newRetryBtn, retryBtn);
                
                newRetryBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[位置驗證] 點擊重試按鈕，taskKey:', taskKey);
                    try {
                        overlay.remove();
                        initLocationCheck(taskKey);
                    } catch (err) {
                        console.error('[位置驗證] 重試失敗:', err);
                        const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
                        const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};
                        alert(t.retryFailed || 'Retry failed. Please try again');
                    }
                });
            } else {
                console.warn('[位置驗證] 找不到重試按鈕');
            }

            // 返回首頁按鈕
            const backBtn = document.getElementById('location-check-back-error');
            if (backBtn) {
                // 移除舊的事件監聽器（如果有的話）
                const newBackBtn = backBtn.cloneNode(true);
                backBtn.parentNode.replaceChild(newBackBtn, backBtn);
                
                newBackBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[位置驗證] 點擊返回首頁按鈕');
                    try {
                        window.location.href = 'index.html';
                    } catch (err) {
                        console.error('[位置驗證] 返回首頁失敗:', err);
                        const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
                        const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};
                        alert(t.backHomeFailed || 'Failed to return home. Please return manually');
                    }
                });
            } else {
                console.warn('[位置驗證] 找不到返回首頁按鈕');
            }

            // 測試模式按鈕
            const testBtn = document.getElementById('location-check-test-mode-error');
            if (testBtn) {
                // 移除舊的事件監聽器（如果有的話）
                const newTestBtn = testBtn.cloneNode(true);
                testBtn.parentNode.replaceChild(newTestBtn, testBtn);
                
                newTestBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[位置驗證] 錯誤頁面點擊測試模式按鈕，taskKey:', taskKey);
                    try {
                        // 使用統一的測試模式啟用函數
                        const enableTest = window.enableTestMode || enableTestMode;
                        if (typeof enableTest === 'function') {
                            console.log('[位置驗證] 使用 enableTestMode 函數');
                            enableTest(taskKey);
                        } else {
                            console.warn('[位置驗證] enableTestMode 函數不存在，手動設置');
                            // 手動設置測試模式
                            sessionStorage.setItem(`test_mode_${taskKey}`, 'true');
                            const verificationData = {
                                taskKey,
                                timestamp: Date.now(),
                                expiresAt: Date.now() + 5 * 60 * 1000,
                                isTestMode: true
                            };
                            sessionStorage.setItem(`location_verified_${taskKey}`, JSON.stringify(verificationData));
                        }
                        
                        // 驗證設置是否成功
                        const testModeSet = sessionStorage.getItem(`test_mode_${taskKey}`) === 'true';
                        console.log('[位置驗證] 測試模式設置結果:', testModeSet);
                        
                        if (testModeSet) {
                            overlay.remove();
                            console.log('[位置驗證] 重新載入頁面');
                            window.location.reload();
                        } else {
                            throw new Error('測試模式設置失敗');
                        }
                    } catch (err) {
                        console.error('[位置驗證] 啟用測試模式失敗:', err);
                        const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
                        const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};
                        alert((t.testModeFailed || 'Failed to enable test mode. Error: ') + err.message);
                    }
                });
            } else {
                console.warn('[位置驗證] 找不到測試模式按鈕');
            }
        }, 100);
    }
}

// 檢查是否已驗證（5 分鐘內有效）
function isLocationVerified(taskKey) {
    // 檢查是否使用測試模式
    const testMode = sessionStorage.getItem(`test_mode_${taskKey}`) === 'true';
    if (testMode) {
        return true; // 測試模式：直接通過
    }
    
    // 檢查 location_verified 中是否標記為測試模式
    const verificationData = sessionStorage.getItem(`location_verified_${taskKey}`);
    if (verificationData) {
        try {
            const data = JSON.parse(verificationData);
            if (data.isTestMode === true) {
                // 如果標記為測試模式，同時設置 test_mode 標記以便統一檢查
                sessionStorage.setItem(`test_mode_${taskKey}`, 'true');
                return true;
            }
            // 正常驗證模式：檢查過期時間
            if (data.taskKey !== taskKey) return false;
            if (Date.now() > data.expiresAt) {
                sessionStorage.removeItem(`location_verified_${taskKey}`);
                return false;
            }
            return true;
        } catch {
            return false;
        }
    }
    
    return false;
}

// 標記位置為已驗證
function markLocationVerified(taskKey) {
    const verificationData = {
        taskKey,
        timestamp: Date.now(),
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 分鐘
        isTestMode: false
    };
    sessionStorage.setItem(`location_verified_${taskKey}`, JSON.stringify(verificationData));
}

// 啟用測試模式（模擬在當地位置）
function enableTestMode(taskKey) {
    // 設置測試模式標記（兩種方式都設置，確保兼容性）
    sessionStorage.setItem(`test_mode_${taskKey}`, 'true');
    // 同時標記為已驗證，並標記為測試模式
    const verificationData = {
        taskKey,
        timestamp: Date.now(),
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 分鐘
        isTestMode: true // 標記為測試模式
    };
    sessionStorage.setItem(`location_verified_${taskKey}`, JSON.stringify(verificationData));
}

// 阻止任務內容顯示（如果未驗證）
function blockTaskContent(taskKey) {
    console.log('[位置驗證] blockTaskContent 函數被調用，taskKey:', taskKey);
    
    // 檢查 taskKey 是否有效
    if (!taskKey) {
        console.error('[位置驗證] taskKey 為空');
        return;
    }
    
    // 檢查 TASK_LOCATIONS 中是否有該任務
    if (!TASK_LOCATIONS[taskKey]) {
        console.error('[位置驗證] 找不到任務位置配置，taskKey:', taskKey);
        console.log('[位置驗證] 可用的任務鍵:', Object.keys(TASK_LOCATIONS));
        return;
    }
    
    // 確保 body 元素存在
    if (!document.body) {
        console.warn('[位置驗證] document.body not found, retrying after delay...');
        setTimeout(() => blockTaskContent(taskKey), 100);
        return;
    }
    
    // 先清除可能存在的舊遮罩
    const existingOverlay = document.getElementById('task-block-overlay');
    if (existingOverlay) {
        console.log('[位置驗證] 移除舊的遮罩');
        existingOverlay.remove();
    }

    // 創建阻止遮罩
    const blockOverlay = document.createElement('div');
    blockOverlay.id = 'task-block-overlay';
    blockOverlay.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(255, 255, 255, 0.98) !important;
        backdrop-filter: blur(10px) !important;
        z-index: 999999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 20px !important;
        box-sizing: border-box !important;
        margin: 0 !important;
    `;

    const taskLocation = TASK_LOCATIONS[taskKey];
    // 取得當前語言和翻譯
    const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
    const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};
    const locationName = taskLocation ? getTranslatedLocationName(taskKey, currentLang) : 'specified location';
    const titleText = t.locationNeedVerify || 'Location Verification Required';
    const descText = (t.locationTaskNeedNear || 'This mission needs to be near {location} to start').replace(/{location}/g, locationName);
    const btnCheckText = t.btnStartLocationCheck || 'Start Location Check';
    const btnTestText = t.btnTestMode || '🧪 Experience Test Mode';
    const testDescText = t.testModeDesc || '(Skip location verification for testing)';
    
    blockOverlay.innerHTML = `
        <div style="text-align: center; max-width: 400px; width: 100%; padding: 20px;">
            <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
            <h2 style="color: #0F172A; margin-bottom: 15px; font-size: 1.5rem; font-weight: 700;">${titleText}</h2>
            <p style="color: #475569; margin-bottom: 25px; font-size: 1rem; line-height: 1.6;">${descText}</p>
            <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
                <button id="start-location-check" type="button" style="
                    padding: 15px 30px;
                    background: linear-gradient(135deg, #3B82F6, #2563EB);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                    width: 100%;
                ">${btnCheckText}</button>
                <button id="start-test-mode" type="button" style="
                    padding: 15px 30px;
                    background: linear-gradient(135deg, #10B981, #059669);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                    width: 100%;
                ">${btnTestText}</button>
                <p style="color: #64748B; font-size: 0.85rem; margin: 0; text-align: center;">${testDescText}</p>
            </div>
        </div>
    `;

    // 直接添加到 body，確保遮罩在最上層
    document.body.appendChild(blockOverlay);
    console.log('[位置驗證] 遮罩已添加到頁面，taskKey:', taskKey);

    // 使用事件委派確保按鈕點擊事件正確綁定
    blockOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'start-location-check' || e.target.closest('#start-location-check')) {
            console.log('[位置驗證] 點擊開始位置檢查按鈕');
            blockOverlay.remove();
            initLocationCheck(taskKey);
        } else if (e.target.id === 'start-test-mode' || e.target.closest('#start-test-mode')) {
            console.log('[位置驗證] 點擊測試模式按鈕');
            // 啟用測試模式（模擬在當地位置）
            enableTestMode(taskKey);
            blockOverlay.remove();
            // 觸發頁面重新載入以顯示任務內容
            window.location.reload();
        }
    });
    
    // 備用：直接綁定事件監聽器
    setTimeout(() => {
        const checkBtn = document.getElementById('start-location-check');
        const testBtn = document.getElementById('start-test-mode');
        
        if (checkBtn) {
            checkBtn.addEventListener('click', () => {
                console.log('[位置驗證] 點擊開始位置檢查按鈕（備用）');
                blockOverlay.remove();
                initLocationCheck(taskKey);
            });
        }
        
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                console.log('[位置驗證] 點擊測試模式按鈕（備用）');
                enableTestMode(taskKey);
                blockOverlay.remove();
                window.location.reload();
            });
        }
    }, 50);
}

// 確保函數在全局作用域可用
window.blockTaskContent = blockTaskContent;
window.isLocationVerified = isLocationVerified;
window.enableTestMode = enableTestMode;
window.initLocationCheck = initLocationCheck;

// 導出函數供其他腳本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TASK_LOCATIONS,
        initLocationCheck,
        isLocationVerified,
        blockTaskContent,
        checkLocationAccess,
        enableTestMode
    };
}

