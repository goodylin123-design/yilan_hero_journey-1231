// GPS 定位觸發系統
// 定義三個任務的 GPS 座標（宜蘭海岸實際座標）

// GPS 定位觸發系統
// 定義三個任務的 GPS 座標（宜蘭海岸實際座標）
// 注意：請根據實際活動地點調整以下座標

const TASK_LOCATIONS = {
    wave: {
        name: '蜜月灣',
        lat: 24.8750,  // 蜜月灣緯度（約 24.875°N）
        lng: 121.8500, // 蜜月灣經度（約 121.85°E）
        radius: 50,     // 觸發半徑（公尺）
        description: '📍 蜜月灣・眺望龜山島'
    },
    rain: {
        name: '壯圍沙丘生態園區',
        lat: 24.8318,  // 壯圍沙丘生態園區緯度（24.8318°N）
        lng: 121.7740, // 壯圍沙丘生態園區經度（121.774°E）
        radius: 50,
        description: '📍 壯圍沙丘生態園區・細雨陪伴'
    },
    dawn: {
        name: '情人灣',
        lat: 24.6000,  // 情人灣緯度（約 24.6°N，蘇澳附近）
        lng: 121.8500, // 情人灣經度（約 121.85°E）
        radius: 50,
        description: '📍 情人灣・日出港'
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
        if (!navigator.geolocation) {
            reject(new Error('您的瀏覽器不支援地理定位功能'));
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
                let errorMessage = '無法獲取位置資訊';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = '位置權限被拒絕，請允許瀏覽器存取您的位置';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = '位置資訊不可用';
                        break;
                    case error.TIMEOUT:
                        errorMessage = '獲取位置超時，請重試';
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
            const taskLocation = TASK_LOCATIONS[taskKey];
            if (!taskLocation) {
                reject(new Error('未知的任務位置'));
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
    checkingCard.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 20px;">📍</div>
        <h2 style="color: #0F172A; margin-bottom: 15px;">正在檢查位置...</h2>
        <p style="color: #475569; margin-bottom: 20px;">正在確認您是否在 ${taskLocation.name} 附近</p>
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
            <h2 style="color: #10B981; margin-bottom: 15px;">位置驗證成功！</h2>
            <p style="color: #475569; margin-bottom: 10px;">您距離 ${taskLocation.name} 約 ${result.distance} 公尺</p>
            <p style="color: #64748B; font-size: 0.9rem; margin-bottom: 25px;">歡迎開始您的任務</p>
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
            ">開始任務</button>
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
            <h2 style="color: #EF4444; margin-bottom: 15px;">位置驗證失敗</h2>
            <p style="color: #475569; margin-bottom: 10px;">您距離 ${taskLocation.name} 約 ${result.distance} 公尺</p>
            <p style="color: #64748B; font-size: 0.9rem; margin-bottom: 15px;">需要距離 ${taskLocation.name} 50 公尺內才能開啟任務</p>
            <div style="
                background: #FEF3C7;
                border-left: 4px solid #F59E0B;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 20px;
                text-align: left;
            ">
                <p style="color: #92400E; margin: 0; font-size: 0.9rem;">
                    <strong>提示：</strong>請前往 ${taskLocation.description} 附近，然後重新載入頁面。
                </p>
            </div>
            <button id="location-check-retry" style="
                padding: 12px 30px;
                background: linear-gradient(135deg, #3B82F6, #2563EB);
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                margin-right: 10px;
                transition: transform 0.3s ease;
            ">重新檢查</button>
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
            ">返回首頁</button>
        `;
    }

    overlay.appendChild(resultCard);

    // 綁定按鈕事件
    const closeBtn = document.getElementById('location-check-close');
    const retryBtn = document.getElementById('location-check-retry');
    const backBtn = document.getElementById('location-check-back');

    closeBtn?.addEventListener('click', () => {
        overlay.remove();
    });

    retryBtn?.addEventListener('click', () => {
        overlay.remove();
        initLocationCheck(taskKey);
    });

    backBtn?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// 初始化位置檢查
async function initLocationCheck(taskKey) {
    const overlay = showLocationCheckUI(taskKey);

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
        errorCard.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 20px;">⚠️</div>
            <h2 style="color: #EF4444; margin-bottom: 15px;">位置檢查失敗</h2>
            <p style="color: #475569; margin-bottom: 20px;">${error.message}</p>
            <button id="location-check-retry-error" style="
                padding: 12px 30px;
                background: linear-gradient(135deg, #3B82F6, #2563EB);
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                margin-right: 10px;
            ">重試</button>
            <button id="location-check-back-error" style="
                padding: 12px 30px;
                background: #E5E7EB;
                color: #374151;
                border: none;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
            ">返回首頁</button>
        `;
        overlay.appendChild(errorCard);

        document.getElementById('location-check-retry-error')?.addEventListener('click', () => {
            overlay.remove();
            initLocationCheck(taskKey);
        });

        document.getElementById('location-check-back-error')?.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

// 檢查是否已驗證（5 分鐘內有效）
function isLocationVerified(taskKey) {
    const verificationData = sessionStorage.getItem(`location_verified_${taskKey}`);
    if (!verificationData) return false;

    try {
        const data = JSON.parse(verificationData);
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

// 阻止任務內容顯示（如果未驗證）
function blockTaskContent(taskKey) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // 創建阻止遮罩
    const blockOverlay = document.createElement('div');
    blockOverlay.id = 'task-block-overlay';
    blockOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
    `;

    const taskLocation = TASK_LOCATIONS[taskKey];
    blockOverlay.innerHTML = `
        <div style="text-align: center; max-width: 400px;">
            <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
            <h2 style="color: #0F172A; margin-bottom: 15px;">需要位置驗證</h2>
            <p style="color: #475569; margin-bottom: 20px;">此任務需要在 ${taskLocation.name} 附近才能開啟</p>
            <button id="start-location-check" style="
                padding: 12px 30px;
                background: linear-gradient(135deg, #3B82F6, #2563EB);
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
            ">開始位置檢查</button>
        </div>
    `;

    mainContent.style.position = 'relative';
    mainContent.appendChild(blockOverlay);

    document.getElementById('start-location-check')?.addEventListener('click', () => {
        blockOverlay.remove();
        initLocationCheck(taskKey);
    });
}

// 導出函數供其他腳本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TASK_LOCATIONS,
        initLocationCheck,
        isLocationVerified,
        blockTaskContent,
        checkLocationAccess
    };
}

