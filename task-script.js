// 任務頁面專用腳本 - QR 碼掃描功能
document.addEventListener('DOMContentLoaded', () => {
    const btnScanQR = document.getElementById('btn-scan-qr');
    const qrReader = document.getElementById('qr-reader');
    let html5QrcodeScanner = null;

    if (!btnScanQR || !qrReader) return;

    // 獲取當前頁面類型
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const nextPages = {
        'wave': 'rain.html',
        'rain': 'dawn.html',
        'dawn': 'index.html' // 完成所有任務後返回首頁
    };

    btnScanQR.addEventListener('click', () => {
        if (html5QrcodeScanner) {
            // 如果已經開啟，則關閉
            html5QrcodeScanner.clear();
            html5QrcodeScanner = null;
            qrReader.style.display = 'none';
            btnScanQR.innerHTML = '<span>📷 掃描 QR 碼</span>';
            return;
        }

        // 開啟 QR 碼掃描器
        qrReader.style.display = 'block';
        btnScanQR.innerHTML = '<span>⏹️ 停止掃描</span>';

        html5QrcodeScanner = new Html5Qrcode("qr-reader");
        
        html5QrcodeScanner.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText, decodedResult) => {
                handleQRCodeScanned(decodedText);
            },
            (errorMessage) => {
                // 掃描錯誤（忽略，繼續掃描）
            }
        ).catch((err) => {
            console.error("無法啟動相機:", err);
            alert('無法啟動相機，請確認已授予相機權限');
            qrReader.style.display = 'none';
            btnScanQR.innerHTML = '<span>📷 掃描 QR 碼</span>';
        });
    });

    function handleQRCodeScanned(decodedText) {
        // 停止掃描
        if (html5QrcodeScanner) {
            html5QrcodeScanner.stop().then(() => {
                html5QrcodeScanner.clear();
                html5QrcodeScanner = null;
                qrReader.style.display = 'none';
                btnScanQR.innerHTML = '<span>📷 掃描 QR 碼</span>';
            });
        }

        // 解析 QR 碼內容並導航
        try {
            // 檢查是否為下一個任務的 QR 碼
            const nextPage = nextPages[currentPage];
            
            if (decodedText.includes('rain.html') || decodedText === 'rain' || decodedText === 'RAIN') {
                if (currentPage === 'wave') {
                    window.location.href = 'rain.html';
                } else {
                    alert('這不是下一個任務的 QR 碼');
                }
            } else if (decodedText.includes('dawn.html') || decodedText === 'dawn' || decodedText === 'DAWN') {
                if (currentPage === 'rain') {
                    window.location.href = 'dawn.html';
                } else {
                    alert('這不是下一個任務的 QR 碼');
                }
            } else if (decodedText.includes('index.html') || decodedText === 'index' || decodedText === 'INDEX') {
                if (currentPage === 'dawn') {
                    window.location.href = 'index.html';
                } else {
                    alert('這不是完成任務的 QR 碼');
                }
            } else if (decodedText.startsWith('http')) {
                // 如果是完整 URL，直接跳轉
                window.location.href = decodedText;
            } else {
                alert('無法識別的 QR 碼，請確認這是正確的任務 QR 碼');
            }
        } catch (error) {
            console.error('QR 碼處理錯誤:', error);
            alert('QR 碼處理失敗，請重試');
        }
    }
});

