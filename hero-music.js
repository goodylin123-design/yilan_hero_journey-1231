// 英雄主題音樂生成器
// 宜蘭民謠風格、海岸感、慢步調、療癒系、適合冥想與行走

class HeroMusicGenerator {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentOscillators = [];
        this.currentGainNodes = [];
    }

    // 初始化 Audio Context
    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            return true;
        } catch (error) {
            console.error('無法初始化 Audio Context:', error);
            return false;
        }
    }

    // 生成海浪聲（白噪音 + 低頻濾波）
    createWaveSound(duration = 10) {
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // 生成海浪般的白噪音
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1;
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;

        // 低通濾波器模擬海浪聲
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 1;

        // 音量包絡（緩慢起伏）
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        return { source, gainNode };
    }

    // 生成主旋律（五聲音階，宜蘭民謠風格）
    createMelody() {
        // 五聲音階：C, D, E, G, A (對應 261.63, 293.66, 329.63, 392.00, 440.00 Hz)
        const pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00];
        const melody = [];

        // 生成緩慢、療癒的旋律
        const melodyPattern = [
            { note: 0, duration: 2 }, // C
            { note: 2, duration: 2 }, // E
            { note: 1, duration: 2 }, // D
            { note: 3, duration: 3 }, // G
            { note: 2, duration: 2 }, // E
            { note: 4, duration: 2 }, // A
            { note: 3, duration: 3 }, // G
            { note: 0, duration: 4 }, // C (長音)
        ];

        melodyPattern.forEach(({ note, duration }) => {
            melody.push({
                frequency: pentatonicScale[note],
                duration: duration,
                startTime: melody.length > 0 
                    ? melody[melody.length - 1].startTime + melody[melody.length - 1].duration 
                    : 0
            });
        });

        return melody;
    }

    // 生成低音伴奏（海浪般的低頻）
    createBassLine() {
        // 使用 C 和 G 的低八度作為基礎
        const bassNotes = [130.81, 196.00]; // C2, G2
        const bassLine = [];

        for (let i = 0; i < 16; i++) {
            bassLine.push({
                frequency: bassNotes[i % 2],
                duration: 2,
                startTime: i * 2
            });
        }

        return bassLine;
    }

    // 播放單個音符
    playNote(frequency, startTime, duration, volume = 0.3, type = 'sine') {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        // 柔和的音量包絡（淡入淡出）
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.5);
        gainNode.gain.setValueAtTime(volume, startTime + duration - 0.5);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);

        this.currentOscillators.push(oscillator);
        this.currentGainNodes.push(gainNode);
    }

    // 播放完整音樂
    async play() {
        if (this.isPlaying) {
            this.stop();
            return;
        }

        if (!this.audioContext) {
            const initialized = await this.init();
            if (!initialized) {
                alert('無法初始化音訊系統，請確認瀏覽器支援 Web Audio API');
                return;
            }
        }

        // 如果 Audio Context 被暫停，恢復它
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        this.isPlaying = true;
        const startTime = this.audioContext.currentTime;

        // 播放海浪背景音（循環）
        const waveSound = this.createWaveSound(10);
        waveSound.source.loop = true;
        waveSound.source.start(startTime);

        // 播放主旋律
        const melody = this.createMelody();
        melody.forEach(({ frequency, duration, startTime: noteStart }) => {
            this.playNote(frequency, startTime + noteStart, duration, 0.25, 'sine');
        });

        // 播放低音伴奏（延遲開始，營造層次感）
        const bassLine = this.createBassLine();
        bassLine.forEach(({ frequency, duration, startTime: noteStart }) => {
            this.playNote(frequency, startTime + noteStart + 1, duration, 0.15, 'triangle');
        });

        // 添加和聲（高八度，輕柔）
        melody.forEach(({ frequency, duration, startTime: noteStart }, index) => {
            if (index % 2 === 0) { // 每隔一個音符添加和聲
                this.playNote(frequency * 2, startTime + noteStart + 0.5, duration - 0.5, 0.1, 'sine');
            }
        });

        // 音樂結束後自動停止
        const totalDuration = Math.max(
            melody[melody.length - 1].startTime + melody[melody.length - 1].duration,
            bassLine[bassLine.length - 1].startTime + bassLine[bassLine.length - 1].duration
        ) + 2;

        setTimeout(() => {
            if (this.isPlaying) {
                this.stop();
            }
        }, totalDuration * 1000);
    }

    // 停止播放
    stop() {
        this.isPlaying = false;
        
        this.currentOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {}
        });
        
        this.currentGainNodes.forEach(gain => {
            try {
                gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
            } catch (e) {}
        });

        this.currentOscillators = [];
        this.currentGainNodes = [];
    }

    // 生成音樂描述
    getMusicDescription() {
        return {
            title: '擺渡蘭陽英雄之歌',
            style: '宜蘭民謠風格',
            mood: '療癒、冥想、行走',
            tempo: '慢步調（約 60 BPM）',
            scale: '五聲音階（C, D, E, G, A）',
            elements: [
                '海浪背景音（白噪音 + 低通濾波）',
                '主旋律（五聲音階，緩慢流暢）',
                '低音伴奏（C-G 交替，海浪節奏）',
                '和聲（高八度，輕柔點綴）'
            ],
            duration: '約 16 秒（可循環）',
            usage: '適合在任務進行時播放，營造海岸氛圍'
        };
    }
}

// 導出供其他腳本使用
if (typeof window !== 'undefined') {
    window.HeroMusicGenerator = HeroMusicGenerator;
}

