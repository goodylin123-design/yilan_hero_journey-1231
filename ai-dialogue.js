// 通用 AI 對話模組
// 可重複使用於所有任務關卡

const AIDialogue = {
    // 初始化
    init: function(missionKey, config) {
        this.missionKey = missionKey;
        this.config = config || {};
        this.state = {
            isGuiding: false,
            isRecording: false,
            isListening: false,
            currentMethod: 'voice',
            recognition: null,
            timerInterval: null,
            timerSeconds: 600,
            audioRecorder: null,
            audioChunks: [],
            currentResponse: '',
            currentEmotion: '思考'
        };
        
        this.elements = {
            btnStartGuide: document.getElementById('btn-start-guide'),
            btnStopGuide: document.getElementById('btn-stop-guide'),
            aiMessage: document.getElementById('ai-message'),
            userResponseArea: document.getElementById('user-response-area'),
            btnVoiceInput: document.getElementById('btn-voice-input'),
            btnTextInput: document.getElementById('btn-text-input'),
            voiceInputPanel: document.getElementById('voice-input-panel'),
            textInputPanel: document.getElementById('text-input-panel'),
            btnRecord: document.getElementById('btn-record'),
            recordingIndicator: document.getElementById('recording-indicator'),
            transcriptDisplay: document.getElementById('transcript-display'),
            textResponse: document.getElementById('text-response'),
            btnSubmitResponse: document.getElementById('btn-submit-response'),
            aiFeedbackArea: document.getElementById('ai-feedback-area'),
            feedbackContent: document.getElementById('feedback-content'),
            recordingSaveArea: document.getElementById('recording-save-area'),
            btnRecordFeeling: document.getElementById('btn-record-feeling'),
            recordingStatus: document.getElementById('recording-status'),
            btnSaveNote: document.getElementById('btn-save-note'),
            btnViewNotes: document.getElementById('btn-view-notes')
        };
        
        this.setupEventListeners();
        this.initSpeechRecognition();
    },
    
    // 初始化語音識別
    initSpeechRecognition: function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('瀏覽器不支援語音識別');
            return;
        }
        
        const recognition = new SpeechRecognition();
        const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
        
        // 根據語言設置識別語言
        const langMap = {
            'zh-TW': 'zh-TW',
            'zh-CN': 'zh-CN',
            'en': 'en-US',
            'ja': 'ja-JP',
            'ko': 'ko-KR'
        };
        recognition.lang = langMap[currentLang] || 'zh-TW';
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            if (this.elements.transcriptDisplay) {
                this.elements.transcriptDisplay.textContent = transcript;
            }
        };
        
        recognition.onerror = (event) => {
            console.error('語音識別錯誤:', event.error);
            if (this.elements.recordingIndicator) {
                this.elements.recordingIndicator.style.display = 'none';
            }
        };
        
        recognition.onend = () => {
            this.state.isListening = false;
            if (this.elements.recordingIndicator) {
                this.elements.recordingIndicator.style.display = 'none';
            }
            if (this.elements.btnRecord) {
                const t = window.I18n ? window.I18n.getTranslation(window.I18n.getCurrentLanguage()) : {};
                this.elements.btnRecord.innerHTML = `<span>${t.btnStartSpeaking || '🎙️ 開始說話'}</span>`;
                this.elements.btnRecord.classList.remove('recording');
            }
        };
        
        this.state.recognition = recognition;
    },
    
    // 設置事件監聽器
    setupEventListeners: function() {
        // 開始引導
        this.elements.btnStartGuide?.addEventListener('click', () => {
            this.startGuide();
        });
        
        // 停止引導
        this.elements.btnStopGuide?.addEventListener('click', () => {
            this.stopGuide();
        });
        
        // 切換輸入方式
        this.elements.btnVoiceInput?.addEventListener('click', () => {
            this.switchInputMethod('voice');
        });
        
        this.elements.btnTextInput?.addEventListener('click', () => {
            this.switchInputMethod('text');
        });
        
        // 語音錄製
        this.elements.btnRecord?.addEventListener('click', () => {
            this.toggleRecording();
        });
        
        // 送出回應
        this.elements.btnSubmitResponse?.addEventListener('click', () => {
            this.submitResponse();
        });
        
        // 保存筆記
        this.elements.btnSaveNote?.addEventListener('click', () => {
            this.saveNote();
        });
        
        // 查看筆記
        this.elements.btnViewNotes?.addEventListener('click', () => {
            this.viewNotes();
        });
    },
    
    // 開始引導
    startGuide: function() {
        console.log('[AI對話] 開始引導，missionKey:', this.missionKey);
        this.state.isGuiding = true;
        if (this.elements.btnStartGuide) this.elements.btnStartGuide.style.display = 'none';
        if (this.elements.btnStopGuide) this.elements.btnStopGuide.style.display = 'inline-block';
        
        const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
        const guideKey = this.config.voiceGuideKey || `voiceGuide${this.missionKey.charAt(0).toUpperCase() + this.missionKey.slice(1)}`;
        let guideText = '';
        
        if (window.I18n) {
            guideText = window.I18n.t(guideKey, currentLang);
            console.log('[AI對話] 從 i18n 獲取引導文字，key:', guideKey, 'text:', guideText.substring(0, 50));
        }
        
        if (!guideText || guideText === guideKey) {
            guideText = this.config.defaultGuideText || '準備好了嗎？';
            console.log('[AI對話] 使用預設引導文字:', guideText);
        }
        
        // 立即顯示文字（即使語音可能延遲）
        if (this.elements.aiMessage) {
            this.elements.aiMessage.innerHTML = `<p>${guideText}</p>`;
        }
        
        // 播放語音（在用戶點擊後，應該可以播放）
        this.speakAI(guideText, currentLang);
        
        const displayDelay = currentLang === 'en' || currentLang === 'ja' ? 12000 : 8000;
        setTimeout(() => {
            if (this.elements.userResponseArea) {
                this.elements.userResponseArea.style.display = 'block';
            }
        }, displayDelay);
    },
    
    // 停止引導
    stopGuide: function() {
        this.state.isGuiding = false;
        if (this.elements.btnStartGuide) this.elements.btnStartGuide.style.display = 'inline-block';
        if (this.elements.btnStopGuide) this.elements.btnStopGuide.style.display = 'none';
        
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        
        if (this.state.recognition) {
            this.state.recognition.stop();
        }
        
        if (this.elements.userResponseArea) this.elements.userResponseArea.style.display = 'none';
        if (this.elements.aiFeedbackArea) this.elements.aiFeedbackArea.style.display = 'none';
        if (this.elements.recordingSaveArea) this.elements.recordingSaveArea.style.display = 'none';
    },
    
    // AI 語音播放
    speakAI: function(text, lang) {
        if (!window.speechSynthesis) {
            console.warn('[AI對話] 瀏覽器不支援語音合成');
            // 如果沒有語音合成，至少顯示文字
            if (this.elements.aiMessage) {
                this.elements.aiMessage.innerHTML = `<p>${text}</p>`;
            }
            return;
        }
        
        // 停止任何正在播放的語音
        window.speechSynthesis.cancel();
        
        // 等待一小段時間確保停止完成
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // 語言代碼對應（Speech Synthesis API 使用的格式）
            const langMap = {
                'zh-TW': 'zh-TW',
                'zh-CN': 'zh-CN',
                'en': 'en-US',
                'ja': 'ja-JP',
                'ko': 'ko-KR'
            };
            
            utterance.lang = langMap[lang] || 'zh-TW';
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            if (lang === 'en') {
                utterance.rate = 0.85;
                utterance.pitch = 0.95;
            } else if (lang === 'ja') {
                utterance.rate = 0.85;
                utterance.pitch = 1.05;
            } else if (lang === 'ko') {
                utterance.rate = 0.9;
                utterance.pitch = 1.0;
            }
            
            console.log('[AI對話] 語音合成設置，語言:', lang, '語言代碼:', utterance.lang, '文字:', text.substring(0, 50));
            
            utterance.onstart = () => {
                console.log('[AI對話] 開始播放語音:', text.substring(0, 50));
                if (this.elements.aiMessage) {
                    this.elements.aiMessage.innerHTML = `<p>${text}</p>`;
                }
            };
            
            utterance.onerror = (event) => {
                console.error('[AI對話] 語音播放錯誤:', event.error);
                // 即使語音播放失敗，也顯示文字
                if (this.elements.aiMessage) {
                    this.elements.aiMessage.innerHTML = `<p>${text}</p>`;
                }
            };
            
            utterance.onend = () => {
                console.log('[AI對話] 語音播放完成');
            };
            
            try {
                window.speechSynthesis.speak(utterance);
                console.log('[AI對話] 已調用 speechSynthesis.speak');
            } catch (error) {
                console.error('[AI對話] 調用 speechSynthesis.speak 失敗:', error);
                // 如果語音播放失敗，至少顯示文字
                if (this.elements.aiMessage) {
                    this.elements.aiMessage.innerHTML = `<p>${text}</p>`;
                }
            }
        }, 100);
    },
    
    // 切換輸入方式
    switchInputMethod: function(method) {
        this.state.currentMethod = method;
        
        if (method === 'voice') {
            if (this.elements.btnVoiceInput) this.elements.btnVoiceInput.classList.add('active');
            if (this.elements.btnTextInput) this.elements.btnTextInput.classList.remove('active');
            if (this.elements.voiceInputPanel) this.elements.voiceInputPanel.style.display = 'block';
            if (this.elements.textInputPanel) this.elements.textInputPanel.style.display = 'none';
            if (this.elements.btnSubmitResponse) this.elements.btnSubmitResponse.style.display = 'none';
        } else {
            if (this.elements.btnTextInput) this.elements.btnTextInput.classList.add('active');
            if (this.elements.btnVoiceInput) this.elements.btnVoiceInput.classList.remove('active');
            if (this.elements.voiceInputPanel) this.elements.voiceInputPanel.style.display = 'none';
            if (this.elements.textInputPanel) this.elements.textInputPanel.style.display = 'block';
            if (this.elements.btnSubmitResponse) this.elements.btnSubmitResponse.style.display = 'block';
        }
    },
    
    // 切換錄製
    toggleRecording: function() {
        if (!this.state.isListening) {
            if (!this.state.recognition) {
                this.initSpeechRecognition();
                if (!this.state.recognition) {
                    const t = window.I18n ? window.I18n.getTranslation(window.I18n.getCurrentLanguage()) : {};
                    alert(t.microphonePermissionDenied || '您的瀏覽器不支援語音識別功能');
                    return;
                }
            }
            
            this.state.isListening = true;
            this.state.recognition.start();
            if (this.elements.recordingIndicator) this.elements.recordingIndicator.style.display = 'flex';
            if (this.elements.btnRecord) {
                const t = window.I18n ? window.I18n.getTranslation(window.I18n.getCurrentLanguage()) : {};
                this.elements.btnRecord.innerHTML = `<span>${t.btnStopSpeaking || '⏹️ 停止錄音'}</span>`;
                this.elements.btnRecord.classList.add('recording');
            }
            if (this.elements.btnSubmitResponse) this.elements.btnSubmitResponse.style.display = 'block';
        } else {
            this.state.recognition.stop();
        }
    },
    
    // 送出回應
    submitResponse: function() {
        let userResponse = '';
        
        if (this.state.currentMethod === 'voice') {
            userResponse = this.elements.transcriptDisplay ? this.elements.transcriptDisplay.textContent.trim() : '';
            if (!userResponse) {
                const t = window.I18n ? window.I18n.getTranslation(window.I18n.getCurrentLanguage()) : {};
                alert(t.pleaseRecordFirst || '請先錄製您的感受');
                return;
            }
        } else {
            userResponse = this.elements.textResponse ? this.elements.textResponse.value.trim() : '';
            if (!userResponse) {
                const t = window.I18n ? window.I18n.getTranslation(window.I18n.getCurrentLanguage()) : {};
                alert(t.pleaseInputFirst || '請輸入您的感受');
                return;
            }
        }
        
        // 分析情緒並提供反饋
        const feedback = this.analyzeEmotionAndFeedback(userResponse);
        
        // 顯示 AI 反饋
        if (this.elements.aiFeedbackArea) {
            this.elements.aiFeedbackArea.style.display = 'block';
            if (this.elements.feedbackContent) {
                this.elements.feedbackContent.innerHTML = `<p>${feedback}</p>`;
            }
        }
        
        // 顯示保存區域
        if (this.elements.recordingSaveArea) {
            this.elements.recordingSaveArea.style.display = 'block';
        }
        
        // 儲存回應到狀態
        this.state.currentResponse = userResponse;
        this.state.currentEmotion = this.extractEmotion(userResponse);
    },
    
    // 提取情緒
    extractEmotion: function(text) {
        const emotions = {
            '平靜': ['平靜', '安靜', '寧靜', '祥和', '安詳'],
            '憂慮': ['擔心', '憂慮', '不安', '焦慮', '緊張'],
            '興奮': ['興奮', '激動', '開心', '快樂', '愉悅'],
            '思考': ['思考', '反思', '沉思', '探索', '疑問'],
            '悲傷': ['悲傷', '難過', '失落', '孤獨', '寂寞']
        };
        
        for (const [emotion, keywords] of Object.entries(emotions)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return emotion;
            }
        }
        
        return '思考';
    },
    
    // 分析情緒並提供反饋
    analyzeEmotionAndFeedback: function(text) {
        const emotion = this.extractEmotion(text);
        const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
        const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};
        
        // 根據任務和情緒提供反饋
        const feedbackKey = `${this.missionKey}AIFeedback${emotion}`;
        const feedback = window.I18n ? window.I18n.t(feedbackKey, currentLang) : null;
        
        if (feedback) {
            return feedback;
        }
        
        // 預設反饋（根據任務）
        const defaultFeedbacks = {
            rain: {
                '平靜': t.rainFeedbackCalm || '親愛的旅人，你找到了內心的平靜。山風告訴我們，力量來自於內心的穩定。',
                '憂慮': t.rainFeedbackWorried || '親愛的旅人，我聽見了你的憂慮。就像山風會來也會去，你的憂慮也會過去。',
                '思考': t.rainFeedbackThinking || '親愛的旅人，思考是很好的開始。讓山風陪伴你，答案會自然浮現。'
            }
        };
        
        const missionFeedbacks = defaultFeedbacks[this.missionKey] || defaultFeedbacks.rain;
        return missionFeedbacks[emotion] || missionFeedbacks['思考'];
    },
    
    // 保存筆記
    saveNote: function() {
        const notes = JSON.parse(localStorage.getItem('whisperNotes') || '[]');
        const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
        const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};
        
        const note = {
            id: Date.now(),
            date: new Date().toLocaleString(currentLang),
            content: this.state.currentResponse || t.mindNotesNoText || '（無文字內容）',
            emotion: this.state.currentEmotion,
            mission: this.missionKey,
            timestamp: Date.now()
        };
        
        notes.unshift(note);
        localStorage.setItem('whisperNotes', JSON.stringify(notes));
        
        if (window.TravelerStore) {
            window.TravelerStore.recordMindNote(note);
        }
        
        if (window.TaskProgress) {
            const completed = window.TaskProgress.completeTask(this.missionKey);
            if (completed) {
                window.TaskProgress.showTaskCompleteNotification(this.missionKey);
                if (window.EsgStats) {
                    window.EsgStats.recordMissionCompletion(this.missionKey, {
                        notesAdded: 1,
                        askRating: true
                    });
                }
            }
        }
        
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = t.noteSaved || '✨ 筆記已保存！';
        successMsg.style.cssText = 'padding: 15px; background: rgba(76, 175, 80, 0.2); border-radius: 8px; margin-top: 15px; text-align: center;';
        if (this.elements.btnSaveNote && this.elements.btnSaveNote.parentElement) {
            this.elements.btnSaveNote.parentElement.appendChild(successMsg);
            setTimeout(() => successMsg.remove(), 3000);
        }
    },
    
    // 查看筆記
    viewNotes: function() {
        const modal = document.getElementById('notes-modal');
        const notesList = document.getElementById('notes-list');
        const modalClose = document.getElementById('modal-close');
        
        if (modal && notesList) {
            const notes = JSON.parse(localStorage.getItem('whisperNotes') || '[]');
            const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
            const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};
            
            if (notes.length === 0) {
                notesList.innerHTML = `<p style="text-align: center; color: #64748B; padding: 20px;">${t.mindNotesEmpty || '親愛的旅人，你的心靈筆記本還是空的。'}</p>`;
            } else {
                notesList.innerHTML = notes.map(note => `
                    <div class="note-item">
                        <div class="note-date">${note.date}</div>
                        <div class="note-content">${note.content}</div>
                        <div class="note-emotion">${t.mindNotesEmotion || '情緒：'}${note.emotion} ${note.audio ? '🎙️' : ''}</div>
                    </div>
                `).join('');
            }
            
            modal.style.display = 'block';
            
            // 關閉按鈕
            if (modalClose) {
                modalClose.onclick = () => {
                    modal.style.display = 'none';
                };
            }
            
            // 點擊外部關閉
            window.onclick = (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            };
        } else {
            // 如果沒有模態框，導航到首頁查看
            window.location.href = 'index.html#notes';
        }
    }
};

// 全局函數：載入筆記列表（供其他腳本使用）
window.loadNotesList = function() {
    const notesList = document.getElementById('notes-list');
    if (!notesList) return;
    
    const notes = JSON.parse(localStorage.getItem('whisperNotes') || '[]');
    const currentLang = window.I18n ? window.I18n.getCurrentLanguage() : 'zh-TW';
    const t = window.I18n ? window.I18n.getTranslation(currentLang) : {};
    
    if (notes.length === 0) {
        notesList.innerHTML = `<p style="text-align: center; color: #64748B; padding: 20px;">${t.mindNotesEmpty || '親愛的旅人，你的心靈筆記本還是空的。'}</p>`;
    } else {
        notesList.innerHTML = notes.map(note => `
            <div class="note-item">
                <div class="note-date">${note.date}</div>
                <div class="note-content">${note.content}</div>
                <div class="note-emotion">${t.mindNotesEmotion || '情緒：'}${note.emotion} ${note.audio ? '🎙️' : ''}</div>
            </div>
        `).join('');
    }
};

// 導出到全局
window.AIDialogue = AIDialogue;

