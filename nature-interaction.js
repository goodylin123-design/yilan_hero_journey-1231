// 與自然互動功能模組
// 處理 QR code 掃描和不同互動類型的觸發

(function() {
    'use strict';

    let html5QrcodeScanner = null;
    let isScanning = false;

    // 初始化與自然互動功能
    function initNatureInteraction(missionData) {
        const btnNatureInteraction = document.getElementById('btn-nature-interaction');
        const natureInteractionArea = document.getElementById('nature-interaction-area');
        const qrReaderNature = document.getElementById('qr-reader-nature');
        const natureResultArea = document.getElementById('nature-result-area');

        if (!btnNatureInteraction || !natureInteractionArea) {
            console.warn('[nature-interaction] 元素未找到');
            return;
        }

        // 點擊按鈕直接開啟鏡頭掃描
        btnNatureInteraction.addEventListener('click', () => {
            if (isScanning) {
                stopScanning();
            } else {
                // 直接開始掃描，不改變按鈕文字
                startScanning(qrReaderNature, missionData);
            }
        });

        // 關閉結果區域
        const btnCloseResult = document.getElementById('btn-close-nature-result');
        if (btnCloseResult) {
            btnCloseResult.addEventListener('click', () => {
                natureResultArea.style.display = 'none';
            });
        }
    }

    // 開始掃描 QR code
    function startScanning(qrReaderElement, missionData) {
        if (!qrReaderElement) {
            console.error('[nature-interaction] QR reader 元素未找到');
            return;
        }

        const btnNatureInteraction = document.getElementById('btn-nature-interaction');
        
        // 檢查 Html5Qrcode 是否可用
        if (typeof Html5Qrcode === 'undefined') {
            alert('QR code 掃描功能未載入，請重新整理頁面');
            return;
        }

        isScanning = true;
        qrReaderElement.style.display = 'block';
        // 不改變按鈕文字，保持原樣，但可以改變樣式提示正在掃描
        if (btnNatureInteraction) {
            btnNatureInteraction.innerHTML = '<span>📷 掃描中... 點擊停止</span>';
            btnNatureInteraction.style.opacity = '0.8';
        }

        html5QrcodeScanner = new Html5Qrcode("qr-reader-nature");
        
        html5QrcodeScanner.start(
            { facingMode: "environment" }, // 使用後置鏡頭
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText, decodedResult) => {
                // QR 碼掃描成功
                handleQRCodeScanned(decodedText, missionData);
            },
            (errorMessage) => {
                // 掃描錯誤（忽略，繼續掃描）
            }
        ).catch((err) => {
            console.error("[nature-interaction] 無法啟動相機:", err);
            alert('無法啟動相機，請確認已授予相機權限');
            stopScanning();
        });
    }

    // 停止掃描
    function stopScanning() {
        if (html5QrcodeScanner) {
            html5QrcodeScanner.stop().then(() => {
                html5QrcodeScanner.clear();
                html5QrcodeScanner = null;
            }).catch((err) => {
                console.error("[nature-interaction] 停止掃描失敗:", err);
            });
        }

        const qrReaderNature = document.getElementById('qr-reader-nature');
        const btnNatureInteraction = document.getElementById('btn-nature-interaction');
        
        if (qrReaderNature) {
            qrReaderNature.style.display = 'none';
        }
        if (btnNatureInteraction) {
            btnNatureInteraction.innerHTML = '<span>📷 與自然互動</span>';
            btnNatureInteraction.style.opacity = '1';
        }
        
        isScanning = false;
    }

    // 處理掃描到的 QR code
    function handleQRCodeScanned(decodedText, missionData) {
        console.log('[nature-interaction] 掃描到 QR code:', decodedText);
        
        // 停止掃描
        stopScanning();

        // 解析 QR code 內容
        // 格式可能是：「與自然互動(鼓勵話)」、「與自然互動(音樂)」等
        const interactionType = parseInteractionType(decodedText);
        
        // 根據類型觸發不同動作
        switch(interactionType) {
            case '鼓勵話':
            case 'encouragement':
                handleEncouragement(missionData);
                break;
            case '音樂':
            case 'music':
                // 之後實現
                alert('音樂功能開發中...');
                break;
            case '圖畫':
            case 'art':
                // 之後實現
                alert('圖畫功能開發中...');
                break;
            default:
                // 預設為鼓勵話
                handleEncouragement(missionData);
                break;
        }
    }

    // 解析互動類型
    function parseInteractionType(qrText) {
        console.log('[nature-interaction] 解析 QR code 內容:', qrText);
        
        // 匹配格式：「擺渡蘭陽英雄之旅啟動QRcode(鼓勵話)」
        const match = qrText.match(/\(([^)]+)\)/);
        if (match && match[1]) {
            const type = match[1].trim();
            console.log('[nature-interaction] 解析到的類型:', type);
            return type;
        }
        
        // 如果沒有括號，檢查是否包含關鍵字
        if (qrText.includes('鼓勵') || qrText.includes('encouragement') || qrText.includes('鼓勵話')) {
            return '鼓勵話';
        }
        if (qrText.includes('音樂') || qrText.includes('music')) {
            return '音樂';
        }
        if (qrText.includes('圖畫') || qrText.includes('art')) {
            return '圖畫';
        }
        
        // 預設返回鼓勵話
        console.log('[nature-interaction] 使用預設類型: 鼓勵話');
        return '鼓勵話';
    }

    // 處理鼓勵話功能
    async function handleEncouragement(missionData) {
        const natureResultArea = document.getElementById('nature-result-area');
        const natureResultContent = document.getElementById('nature-result-content');
        const natureResultTitle = document.getElementById('nature-result-title');
        
        if (!natureResultArea || !natureResultContent) {
            console.error('[nature-interaction] 結果區域元素未找到');
            return;
        }

        // 不顯示載入狀態，直接生成並播放
        // 生成鼓勵話
        try {
            const encouragementText = await generateEncouragement(missionData);
            
            // 顯示結果（可選，如果需要顯示文字）
            natureResultArea.style.display = 'block';
            if (natureResultTitle) {
                natureResultTitle.textContent = '🌿 與自然互動 - 鼓勵話';
            }
            natureResultContent.innerHTML = `
                <div class="encouragement-content">
                    <p class="encouragement-text">${encouragementText}</p>
                </div>
            `;

            // 直接使用語音合成播放（不等待用戶操作）
            speakEncouragement(encouragementText);
        } catch (error) {
            console.error('[nature-interaction] 生成鼓勵話失敗:', error);
            if (natureResultArea) {
                natureResultArea.style.display = 'block';
            }
            if (natureResultContent) {
                natureResultContent.innerHTML = '<p>生成鼓勵話時發生錯誤，請稍後再試。</p>';
            }
        }
    }

    // 生成鼓勵話（AI 自動生成）
    async function generateEncouragement(missionData) {
        // 基礎鼓勵話模板
        const baseMessage = `辛苦了！你現在站在「${missionData.locationName}」進行「第一關${missionData.title}」。`;
        
        // 擴展的鼓勵話庫（確保每次都有不同內容，約100字）
        const encouragementTemplates = [
            `在這片美麗的海岸，每一陣海風都在為你加油。你已經勇敢地踏出了第一步，這份勇氣值得被讚美。讓海浪的聲音洗滌你的心靈，讓海風帶走你的疲憊。記住，每一個當下都是新的開始，你正在創造屬於自己的美好回憶。`,
            `站在這裡，感受大自然的擁抱，你已經做得很好了。這片海灘見證了無數人的故事，而今天，它見證了你的勇氣與堅持。讓自己放鬆下來，深呼吸，感受這一刻的寧靜與美好。你值得擁有這份平靜與喜悅。`,
            `海風輕撫著你的臉龐，彷彿在告訴你：你做得很好。在這個快節奏的世界裡，你選擇了停下腳步，與自己對話，這本身就是一種智慧。讓海浪的聲音成為你的背景音樂，讓這份寧靜成為你內心的力量。`,
            `每一朵浪花都在為你鼓掌，每一陣海風都在為你加油。你已經勇敢地踏上了這段旅程，這份勇氣值得被珍惜。在這個特別的時刻，讓自己完全沉浸在當下，感受大自然給予你的禮物。`,
            `站在這片美麗的海岸，你已經展現了無比的勇氣。讓海風帶走你的煩惱，讓海浪的聲音撫慰你的心靈。記住，每一步都是成長，每一刻都是珍貴的。你正在創造屬於自己的美好故事。`,
            `此刻的你，正與大自然進行最真誠的對話。海浪拍打著岸邊，就像在為你的勇氣鼓掌。你選擇了這條路，選擇了與自己相遇，這份決心值得被讚揚。讓這片海成為你內心的鏡子，看見自己的美好。`,
            `海風中帶著祝福，海浪中藏著力量。你站在這裡，已經完成了最困難的第一步。不要急著前進，先感受當下的美好。讓大自然告訴你，你比想像中更堅強，更有智慧。`,
            `這片海灘見證了無數的日出日落，今天它見證了你的勇氣。你選擇了這條英雄之旅，選擇了面對自己，這份勇氣值得被記住。讓海浪的聲音成為你的導師，讓海風成為你的朋友。`,
            `站在這裡，你已經超越了許多人。不是每個人都敢於面對自己，不是每個人都願意停下腳步。你做到了，這份勇氣值得被讚美。讓這片海成為你的見證者，記住這一刻的美好。`,
            `海風輕柔地擁抱著你，海浪溫柔地呼喚著你。你已經踏上了這段旅程，這份勇氣值得被珍惜。不要忘記，每一步都是成長，每一刻都是學習。讓大自然成為你的老師，讓這片海成為你的朋友。`,
            `此刻的你，正與自己進行最深刻的對話。海浪的聲音在告訴你：你做得很好。你選擇了這條路，選擇了面對自己，這份決心值得被讚揚。讓這片海成為你內心的鏡子，看見自己的美好與力量。`,
            `站在這片美麗的海岸，感受大自然的擁抱。你已經勇敢地踏出了第一步，這份勇氣值得被讚美。讓海浪的聲音洗滌你的心靈，讓海風帶走你的疲憊。記住，每一個當下都是新的開始，你正在創造屬於自己的美好回憶。`
        ];

        // 使用時間戳和隨機數確保每次都有不同內容
        const seed = Date.now() + Math.random();
        const randomIndex = Math.floor(seed % encouragementTemplates.length);
        const encouragement = encouragementTemplates[randomIndex];

        // 組合完整訊息
        const fullMessage = baseMessage + encouragement;
        console.log('[nature-interaction] 生成的鼓勵話長度:', fullMessage.length, '字');
        return fullMessage;
    }

    // 語音合成播放鼓勵話
    function speakEncouragement(text) {
        if (!('speechSynthesis' in window)) {
            console.warn('[nature-interaction] 瀏覽器不支援語音合成');
            return;
        }

        // 停止任何正在播放的語音
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-TW'; // 繁體中文
        utterance.rate = 0.9; // 稍慢一點，更自然
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onerror = (event) => {
            console.error('[nature-interaction] 語音合成錯誤:', event);
        };

        utterance.onend = () => {
            console.log('[nature-interaction] 語音播放完成');
        };

        window.speechSynthesis.speak(utterance);
    }

    // 公開 API
    window.NatureInteraction = {
        init: initNatureInteraction,
        stopScanning: stopScanning
    };
})();
